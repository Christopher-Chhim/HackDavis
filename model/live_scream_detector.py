# live_scream_detector.py

import sounddevice as sd
import numpy as np
import time
import tensorflow as tf
import tensorflow_hub as hub
import os

# --- Constants ---
SAMPLE_RATE = 16000  # Sample rate expected by YAMNet
CHUNK_DURATION = 10  # Duration of each audio chunk in seconds
CHANNELS = 1  # Mono audio
MODEL_DIR = "human_scream_detector"  # Path to your saved model directory


# --- Model Loading ---
def load_models(saved_model_path=MODEL_DIR):
    """Loads YAMNet and the custom scream detector model."""
    yamnet_model_inf = None
    scream_detector_model = None
    yamnet_handle = "https://tfhub.dev/google/yamnet/1"

    print("Loading YAMNet model from TensorFlow Hub...")
    try:
        yamnet_model_inf = hub.load(yamnet_handle)
        print("YAMNet model loaded successfully.")
    except Exception as e:
        print(f"Error loading YAMNet model: {e}")
        return None, None  # Return None if loading fails

    print(
        f"\nLoading custom scream detector model from: {saved_model_path} (using TFSMLayer for Keras 3)"
    )
    if os.path.exists(saved_model_path):
        try:
            scream_detector_layer = tf.keras.layers.TFSMLayer(
                saved_model_path, call_endpoint="serving_default"
            )
            scream_detector_model = tf.keras.Sequential(
                [
                    tf.keras.layers.Input(
                        shape=(1024,), dtype=tf.float32, name="yamnet_embedding_input"
                    ),
                    scream_detector_layer,
                ]
            )
            print("Custom scream detector model loaded successfully.")
        except Exception as e:
            print(f"Error loading custom model from {saved_model_path}: {e}")
            return yamnet_model_inf, None  # Return YAMNet but None for custom model
    else:
        print(f"ERROR: Saved model directory not found at '{saved_model_path}'.")
        return yamnet_model_inf, None  # Return YAMNet but None for custom model

    return yamnet_model_inf, scream_detector_model


# --- Inference Function (Modified for Direct Audio Input) ---
def predict_scream(yamnet_model, classifier_model, threshold=0.5, waveform_data=None):
    """
    Analyzes a waveform NumPy array to predict if it contains a human scream.

    Args:
        yamnet_model: The loaded YAMNet model instance.
        classifier_model: Your loaded custom Keras classifier model.
        threshold (float): The probability threshold for 'Scream'.
        waveform_data (np.ndarray): 1D NumPy array of float32 audio data at 16kHz.

    Returns:
        tuple: (str: prediction_label, float: probability)
    """
    # Basic checks on models and data
    if yamnet_model is None or classifier_model is None:
        # This case should be handled before calling, but as a safeguard:
        return "Error: Model not loaded", 0.0
    if waveform_data is None:
        return "Error: No Waveform Data Provided", 0.0
    if not isinstance(waveform_data, np.ndarray) or waveform_data.ndim != 1:
        print(
            f"Debug: Invalid waveform_data type/dims: {type(waveform_data)}, ndim={getattr(waveform_data, 'ndim', 'N/A')}"
        )
        return "Error: Invalid Waveform Data", 0.0
    if waveform_data.size == 0:
        return "Error: Empty Waveform Data", 0.0

    # Ensure data is float32 (sounddevice should provide this, but good practice)
    if waveform_data.dtype != np.float32:
        waveform_data = waveform_data.astype(np.float32)

    # Convert NumPy array to TensorFlow tensor
    waveform = tf.constant(waveform_data, dtype=tf.float32)

    # 2. Extract YAMNet embeddings
    try:
        _, embeddings, _ = yamnet_model(waveform)
    except Exception as e:
        print(f"Error during YAMNet embedding extraction: {e}")
        # Check if waveform is too short which can cause errors
        if waveform.shape[0] < 1024:  # Arbitrary small number, YAMNet needs some length
            print("Waveform may be too short for YAMNet.")
            return "Error: Short Audio for YAMNet", 0.0
        return "Error: YAMNet Failed", 0.0

    if tf.size(embeddings) == 0:
        # This might happen for very short or silent audio clips
        return "Non-Scream", 0.0  # Assume non-scream if no embeddings

    # 3. Aggregate embeddings
    clip_embedding = tf.reduce_mean(embeddings, axis=0)
    if tf.reduce_any(tf.math.is_nan(clip_embedding)):
        print("Warning: NaNs detected in clip embedding. Treating as Non-Scream.")
        return "Non-Scream", 0.0  # Or return an error

    # 4. Prepare for classifier
    model_input = tf.expand_dims(clip_embedding, axis=0)

    # 5. Make prediction
    try:
        # Use the dictionary key found during debugging
        raw_output = classifier_model.predict(model_input, verbose=0)
        probability = raw_output["dense_2"][0, 0]
    except KeyError:
        # Fallback in case the key is different (shouldn't happen if model is consistent)
        print(
            "Warning: Output key 'dense_2' not found. Attempting to access first output."
        )
        try:
            # Assuming the output dict has only one key or getting the first value
            first_key = list(raw_output.keys())[0]
            probability = raw_output[first_key][0, 0]
            print(f"Used alternative key: '{first_key}'")
        except Exception as e_fallback:
            print(f"Error during classifier prediction fallback: {e_fallback}")
            return "Error: Classifier Failed", 0.0
    except Exception as e:
        print(f"Error during classifier prediction: {e}")
        return "Error: Classifier Failed", 0.0

    # 6. Determine label
    prediction_label = "Scream" if probability >= threshold else "Non-Scream"
    return prediction_label, float(probability)


# --- Main Execution ---
if __name__ == "__main__":
    print("--- Live Scream Detector ---")

    # List available audio devices (optional, for debugging)
    # print("\nAvailable audio input devices:")
    # print(sd.query_devices())
    # TODO: Add mechanism to select input device if needed, default is usually fine

    # Load models first
    yamnet_model, classifier_model = load_models()

    if yamnet_model is None or classifier_model is None:
        print(
            "\nFailed to load one or both models. Please check paths and errors above."
        )
        print("Exiting.")
        exit()

    print(f"\nModels loaded. Starting continuous recording...")
    print(f"Processing audio in {CHUNK_DURATION}-second chunks.")
    print("Press Ctrl+C to stop.")
    index = 0
    try:
        while True:
            print(
                f"\n[{time.strftime('%Y-%m-%d %H:%M:%S')}] Recording {CHUNK_DURATION} seconds..."
            )
            try:
                # Record audio chunk directly as float32 NumPy array
                recording_data = sd.rec(
                    int(CHUNK_DURATION * SAMPLE_RATE),
                    samplerate=SAMPLE_RATE,
                    channels=CHANNELS,
                    dtype="float32",
                    blocking=True,
                )  # Use blocking=True for simplicity

                # sd.wait() # Not needed if blocking=True
                # Save the recording as a WAV file
                timestamp = time.strftime("%Y%m%d_%H%M%S")
                filename = f"recording_{timestamp}_{index}.wav"

                # Convert float32 to int16 for WAV file (standard format)
                recording_int16 = (recording_data * 32767).astype(np.int16)

                # Write the WAV file
                import wave

                with wave.open(filename, "wb") as wf:
                    wf.setnchannels(CHANNELS)
                    wf.setsampwidth(2)  # 2 bytes for int16
                    wf.setframerate(SAMPLE_RATE)
                    wf.writeframes(recording_int16.tobytes())

                print(f"Saved recording to {filename}")
                index += 1

                print("Recording finished. Processing...")

                # Ensure recording is a flat array (sd.rec might return (N, 1))
                recording_flat = recording_data.flatten()

                # Perform inference
                label, probability = predict_scream(
                    yamnet_model=yamnet_model,
                    classifier_model=classifier_model,
                    waveform_data=recording_flat,
                )

                # Display result
                print(
                    f"[{time.strftime('%Y-%m-%d %H:%M:%S')}] Prediction: {label} (Probability: {probability:.4f})"
                )

            except sd.PortAudioError as e:
                print(f"Audio Recording Error: {e}")
                print("Is the microphone connected and working?")
                print("Check available devices using sd.query_devices() if needed.")
                print("Waiting 10 seconds before retrying...")
                time.sleep(10)
            except Exception as e:
                print(f"An unexpected error occurred in the main loop: {e}")
                # Add more specific error handling if needed
                print("Waiting 5 seconds before continuing...")
                time.sleep(5)

    except KeyboardInterrupt:
        print("\nInterrupted by user. Stopping.")
    finally:
        print("--- Script finished ---")
