## **SentinelAI**
SentinelAI is a real-time autonomous threat detection and response system designed for high-traffic public spaces like schools, malls, and stadiums. In crisis scenarios such as active shootings, fires, or other threats, SentinelAI minimizes response time by detecting incidents, initiating lockdowns, and coordinating emergency actions autonomously—when every second counts.

## 🧠 **Inspiration**
Mass casualty events in public spaces often escalate in seconds, but responses can take minutes. After learning that over **70%** of casualties in mass public incidents occur within the first **5** minutes—and that most public venues still rely on slow, manual emergency protocols—we wanted to build a system that could respond faster than human reflexes. SentinelAI was born from the belief that real-time AI and automation can save lives when every second matters.

## 🚨 **What it does**
SentinelAI is an autonomous threat detection and crisis response platform. It uses machine learning to identify dangerous incidents (like active shootings or fires) in real time, then instantly coordinates responses such as triggering lockdowns, alerting emergency services, and displaying evacuation routes in a dynamic 3D map. It also logs incident data to a secure cloud database for analysis and reporting.

## 🛠️ **How we built it**
<ul>
<li>Three.js to create a live 3D visualization of the environment, showing room layouts, cameras, and evacuation routes.</li>

<li>TensorFlow to power real-time object and threat detection from camera feeds.</li>

<li>LLaMA LLM to classify and interpret incident types, user intent, and natural language prompts.</li>

<li>Supabase to handle authentication, real-time data storage, and threat logs.</li>
</ul>

## 🧱 **Challenges we ran into**
<ul>
<li>Integrating real-time models with 3D rendering posed performance challenges.</li>

<li>Synchronizing detection logic with LLM interpretations without lag.</li>

<li>Handling dynamic state updates in Three.js while keeping the scene interactive and accessible.</li>

<li>Deploying TensorFlow models efficiently with minimal latency.</li>

<li>Designing logic that respected our zone safety rules (e.g. avoiding dangerous areas, only using cautious ones when safe paths are blocked).</li>
</ul>

## 🏆 **Accomplishments that we're proud of**
<ul>
<li>Built a fully functional prototype that integrates ML, LLM, and 3D rendering within 24 hours.</li>

<li>Created a responsive and immersive 3D emergency map using Three.js.</li>

<li>Designed a threat classification pipeline that combines LLaMA and TensorFlow with real-time results.</li>

<li>Delivered a vision for autonomous emergency systems that could genuinely scale to real-world applications.</li>
</ul>

## 📚**What we learned**
<ul>
<li>How to combine multiple advanced technologies (LLMs, ML models, real-time databases, and 3D graphics) into a cohesive, performant application.</li>

<li>The importance of latency-aware design in critical systems.</li>

<li>How human-centric design and AI can complement each other in high-stakes scenarios.</li>

<li>How to simulate real-world emergencies in a programmable and controlled way for testing.</li>
</ul>

## 🚀**What's next for SentinelAI**
<ul>
<li>Edge deployment: Run threat detection locally on cameras to reduce latency.</li>

<li>Voice-based interaction: Use real-time voice prompts for emergency escalation and status updates.</li>

<li>Expanded threat detection: Add anomaly detection, fire recognition, and sound-based detection (e.g. gunshots).</li>

<li>Integration with emergency services: Auto-notify first responders based on threat type and location.</li>

<li>Public testing in simulated environments: Pilot SentinelAI in demo spaces to improve reliability and UX under pressure.</li>
</ul>