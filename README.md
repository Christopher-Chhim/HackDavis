# SentinelAI

> ### **Real-Time Public Safety AI. Always Listening. Always Ready.**

<img src="public/thumbnail.png" alt="SentinelAI Thumbnail"/>

<p align="center">
  Built with: <br/>
  <img src="https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white" />
  <img src="https://img.shields.io/badge/Next.js-000000?style=for-the-badge&logo=nextdotjs&logoColor=white" />
  <img src="https://img.shields.io/badge/Three.js-000000?style=for-the-badge&logo=three.js&logoColor=white" />
  <img src="https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white" />
  <img src="https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white" />
  <img src="https://img.shields.io/badge/Supabase-3ECF8E?style=for-the-badge&logo=supabase&logoColor=white" />
  <img src="https://img.shields.io/badge/Twilio-F22F46?style=for-the-badge&logo=twilio&logoColor=white" />
</p>

---

### Inspiration

In crowded public areas—schools, malls, stadiums—panic spreads fast, but response is slow. In crisis scenarios like shootings, fires, or terrorist threats, **over 70% of casualties occur within the first 5 minutes**, yet the average coordinated emergency response time is over **9 minutes**. Fewer than 5% of commercial spaces have real-time incident detection or autonomous orchestration tools.  
**SentinelAI** was born to bridge this gap and turn every building into an always-on, hyper-responsive safety partner.

---

### What It Does

SentinelAI is your real-time public safety orchestration system. It continuously monitors live audio streams across a building, detects signs of panic or chaos, and instantly triggers a multi-agent AI response to guide and protect occupants.

**Key Features:**

- **Panic Detection Engine**  
  Edge-deployed audio models (fine‑tuned Whisper + YAMNet) detect screams, glass shattering, stampedes, and fire alarms in real time.

- **Sentinel Superintendent LLM**  
  A streaming vLLM + Llama 3.3 agent that speaks via intercom or phone, giving calm, context‑aware evacuation and lockdown instructions in <1 second.

- **Building Integration**  
  Direct control over smart doors, alarms, digital signage, and lights through simulated IoT APIs.

- **Multi‑Zone Awareness**  
  Coordinate different actions in separate zones (e.g., lockdown in Zone A, evacuation in Zone B).

- **Human‑in‑the‑Loop Panel**  
  Security staff can override actions and monitor system state via a central 3D dashboard built with Next.js & Three.js.

---

### Challenges We Ran Into

- **Ultra‑Low Latency**  
  Achieving sub‑second end‑to‑end detection and LLM response without sacrificing accuracy.

- **Data Scarcity**  
  Sourcing and fine‑tuning on real-world panic audio datasets to minimize false positives.

- **IoT Simulation**  
  Building and testing smart‑door and alarm integrations before full hardware deployment.

- **Real‑Time State Sync**  
  Maintaining up‑to‑date building schematics and evacuation protocols via Supabase under heavy load.

---

### Accomplishments We’re Proud Of

- **<500 ms Panic Detection**  
  Tuned Whisper + YAMNet to reliably flag danger events in under half a second.

- **Streaming LLM Superintendent**  
  First‑of‑its‑kind real‑time evacuation guidance powered by vLLM + Cerebras API.

- **Voice Interaction**  
  Seamless phone‑call integration with Twilio & Retell, handling interruptions and priority overrides.

- **Interactive 3D Dashboard**  
  A clear, real‑time Command & Control UI visualizing zone statuses, door locks, and alerts.

---

### What We Learned

- **Optimizing Multi‑Modal Pipelines**  
  Tight coordination between audio models and LLMs is crucial for reliability.

- **Trust Through Transparency**  
  Human‑in‑the‑loop controls build confidence in automated systems.

- **Edge‑First Design**  
  Running everything locally or on the network edge reduces latency and privacy concerns.

- **Simulation Accelerates Integration**  
  Early mock‑IoT APIs helped us iterate faster without waiting for hardware.

---

### What’s Next for SentinelAI

- **Heatmap & Camera Fusion** – Combine audio alerts with visual analytics.
- **On‑Device Fail‑Safes** – Ensure uninterrupted operation during power or network outages.
- **Multi‑Lingual Support** – Real‑time instructions in multiple languages.
- **Mobile Companion App** – Push alerts and allow remote overrides from smartphones.

---

### 🧍 User‑Centric Focus

This is not just technology—it’s reassurance. In emergencies, people need **clarity**, not chaos. SentinelAI becomes their trusted voice, guiding them through danger when human responders can’t reach every corner in time.

---

🔥 **The Hook**

> “What if every building had its own Jarvis during a crisis?”  
> With SentinelAI, your building doesn’t wait. It acts. It guides. It protects.
