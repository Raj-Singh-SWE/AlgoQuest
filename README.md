# ⚔️ AlgoQuest: The Code Mastery Odyssey
> Level up your coding skills in **Python, JavaScript, Java & C++** by playing an interactive RPG coding game. Battle bosses, master data structures & algorithms, and climb the realm leaderboards.

![AlgoQuest Banner](https://img.shields.io/badge/Status-Active-success)
![Languages](https://img.shields.io/badge/Languages-Python%20%7C%20JavaScript%20%7C%20Java%20%7C%20C%2B%2B-blue)
![Backend](https://img.shields.io/badge/Cloud-Supabase%20%26%20Firebase-orange)
![License](https://img.shields.io/badge/License-MIT-purple)

---

## 🌟 Features

- 🗡️ **RPG Battle Combat System**: Solve algorithm test suites to deal damage to realm bosses and defend against counter-attacks.
- 🌐 **Multi-Language Execution Engine**: Write, run, and submit code in **Python 3**, **JavaScript (ES6+)**, **Java**, and **C++**.
- 📚 **Learn Coding Academy**: 15+ interactive beginner-to-advanced lessons across 3 fundamental programming realms.
- 🗺️ **Algorithmic Realms & Quest Chain**: Traverse Linear Lands, Hierarchical Highlands, Graph Galaxies, and Dynamic Dunes.
- 📊 **Interactive DSA Visualizer**: Real-time visual simulations for Arrays, Hash Maps, Stacks, Queues, Linked Lists, Binary Trees, 2D Island Grids, and DP Tables.
- ⚡ **Supabase PostgreSQL & Cloud Sync**: Live cloud database persistence with 1-click SQL setup, Google OAuth, and Gmail login with progress retention.
- 🎨 **Dark Cyberpunk Glassmorphism UI**: High-contrast, responsive interface with sound FX, health bars, and relic reward unlocks.

---

## 🚀 Quick Start (Running Locally)

AlgoQuest is built with pure web technologies and requires zero complex build setups.

### Option 1: Using Python Built-in Server
```bash
# Clone the repository
git clone https://github.com/Raj-Singh-SWE/AlgoQuest.git

# Navigate to project directory
cd AlgoQuest

# Run local HTTP server
python -m http.server 8080
```
Open your browser and navigate to:
```
http://localhost:8080
```

### Option 2: Using Node `npx serve` or Live Server
```bash
npx serve .
```

---

## 📂 Project Architecture

```
AlgoQuest/
├── index.html               # Main application markup & modals
├── .gitignore               # Ignored files & editor configs
├── README.md                # Project documentation
├── css/
│   ├── variables.css        # Design tokens, color palette, fonts & glow variables
│   ├── base.css             # Resets, layout grid & performance-optimized panels
│   ├── header.css           # Header HUD, brand logo, mode toggle & language pills
│   ├── arena.css            # Battle stage, boss/hero avatars, health bars & log
│   ├── quest.css            # Quest chain bar, story dialog & teaching blocks
│   ├── visualizer.css       # Algorithm visualizer mounts, array cells & controls
│   ├── editor.css           # Code editor tabs, line numbers, buttons & console
│   ├── tests.css            # Test runner tabs, pass/fail status & diff boxes
│   ├── modals.css           # Realm map, victory celebration, login & profile modals
│   ├── animations.css       # Keyframe animations (combat lunges, shakes, pulses)
│   └── style.css            # Master stylesheet entrypoint
└── js/
    ├── supabaseConfig.js    # Supabase v2 client manager & SQL schema generator
    ├── auth.js              # Authentication, Gmail/Google sign-in & cloud save sync
    ├── multiLangEngine.js   # Multi-language execution engine (Python, JS, Java, C++)
    ├── pyEngine.js          # Pyodide WASM Python 3 in-browser runtime
    ├── levels.js            # DSA Challenge Quests & Realm definitions
    ├── lessons.js           # Learn Coding Academy interactive curriculum
    ├── visualizer.js        # Data structure visualizer animator & step engine
    ├── audio.js             # Web Audio API procedural sound synthesizer
    └── app.js               # Main application controller & state machine
```

---

## ⚡ Supabase Database Setup

To sync your game progress to your own **Supabase** cloud database:

1. Create a free project at [supabase.com](https://supabase.com).
2. Click **⚡ Supabase** in the top navigation bar of AlgoQuest.
3. Paste your **Project URL** and **Anon Public Key**.
4. Click **📋 Copy SQL** and run it in your **Supabase Dashboard → SQL Editor**.
5. Click **💾 Save & Connect Supabase**.

---

## 📜 License
MIT License. Built with ❤️ for developers and students learning Data Structures & Algorithms.
