# 🎹 Piano Battle

A locally-hosted app that turns your MIDI keyboard into a character-spawning party machine. Press a key → a random cropped character flies onto a vibrant animated background with particle effects.

![Themes: Beach 🏖️ Jungle 🌴 Space 🚀 Underwater 🌊]

---

## How It Works

1. **Drop images** of people or cartoon characters into `backend/raw_images/`
2. **Process them** — the app removes backgrounds and auto-crops using AI (rembg / U2Net)
3. **Press keys** on your MIDI keyboard — a random character appears with an entrance animation
4. **Switch themes** — Beach, Jungle, Space, Underwater backgrounds built in pure CSS

---

## Requirements

| Requirement | Notes |
|-------------|-------|
| Python 3.10+ | For the image processing backend |
| Node.js 18+ | For the React frontend |
| Chrome or Edge | Web MIDI API only works in Chromium browsers |
| MIDI keyboard | Any standard USB MIDI controller |

> **No MIDI keyboard?** You can still test by pressing regular keyboard keys — the app maps them to fake MIDI notes.

---

## Setup — Windows

### 1. Install Python and Node.js

Open **PowerShell** or **Command Prompt** and run:

```powershell
winget install Python.Python.3.12 --accept-source-agreements --accept-package-agreements
winget install OpenJS.NodeJS.LTS --accept-source-agreements --accept-package-agreements
```

Close and reopen your terminal after installing so the PATH updates take effect.

### 2. Clone the repo

```powershell
git clone https://github.com/kerky/piano-battle-app.git
cd piano-battle-app
```

### 3. Set up the Python backend

```powershell
cd backend
python -m venv venv
venv\Scripts\activate
pip install -r requirements.txt
```

> **Note:** The first time you process an image, rembg will download the U2Net AI model (~170 MB). This is a one-time download and will take a minute or two depending on your connection.

### 4. Set up the frontend

```powershell
cd ..\frontend
npm install
```

### 5. Run it

Double-click **`start.bat`** in the project root, or run manually in two separate terminals:

**Terminal 1 — Backend:**
```powershell
cd backend
venv\Scripts\activate
python -m uvicorn main:app --reload --port 8000
```

**Terminal 2 — Frontend:**
```powershell
cd frontend
npm run dev
```

Open **[http://localhost:5173](http://localhost:5173)** in Chrome or Edge.

---

## Setup — macOS

### 1. Install Python and Node.js

If you don't have [Homebrew](https://brew.sh/), install it first:
```bash
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
```

Then install Python and Node:
```bash
brew install python@3.12 node
```

### 2. Clone the repo

```bash
git clone https://github.com/kerky/piano-battle-app.git
cd piano-battle-app
```

### 3. Set up the Python backend

```bash
cd backend
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
```

> **Note:** The first time you process an image, rembg will download the U2Net AI model (~170 MB). This is a one-time download.

### 4. Set up the frontend

```bash
cd ../frontend
npm install
```

### 5. Run it

```bash
chmod +x start.sh
./start.sh
```

Or manually in two separate terminals:

**Terminal 1 — Backend:**
```bash
cd backend
source venv/bin/activate
python -m uvicorn main:app --reload --port 8000
```

**Terminal 2 — Frontend:**
```bash
cd frontend
npm run dev
```

Open **[http://localhost:5173](http://localhost:5173)** in Chrome or Edge.

---

## Adding Your Own Images

This is the fun part. You can add any images of people, cartoon characters, game sprites — anything with a clear subject.

### Supported formats

| Format | Extension |
|--------|-----------|
| JPEG | `.jpg`, `.jpeg` |
| PNG | `.png` |
| WebP | `.webp` |

### Method 1 — Drag and drop in the app (easiest)

1. Open the app in your browser
2. Click the **`+`** button in the top-right corner
3. Drag image files onto the upload zone, or click to browse
4. Each image is processed automatically — background removed, cropped, resized

### Method 2 — Drop files manually, batch process

1. Copy your image files into `backend/raw_images/`
2. In the app, click **`+`** → **"Process all raw_images/"**
3. Or hit the endpoint directly:
   ```bash
   curl -X POST http://localhost:8000/api/process-all
   ```

### What makes a good image?

| ✅ Works well | ❌ Avoid |
|--------------|---------|
| Clear subject against any background | Subject blending into a same-coloured background |
| Photos from phones or cameras | Extremely blurry or low-res images |
| Cartoon characters with defined outlines | Busy scenes with multiple equally prominent subjects |
| Screenshots from games or anime | Images where the subject is very small (< 10% of frame) |

### How it's processed

Each image goes through a three-step pipeline:

1. **Background removal** — [rembg](https://github.com/danielgatis/rembg) runs the U2Net neural network to detect the subject and make the background transparent
2. **Auto-crop** — Pillow finds the tightest bounding box around the non-transparent pixels and crops to it (with 10px padding)
3. **Resize** — Downscaled so the largest dimension is 200px using LANCZOS resampling

Output is saved as a transparent `.png` in `backend/processed_images/` and immediately available in the app.

---

## Controls

| Action | How |
|--------|-----|
| Spawn character | Press any key on your MIDI keyboard |
| Switch theme | Click the emoji buttons at the bottom of the screen |
| Upload images | Click **`+`** button (top-right) |
| Test without MIDI | Press any key on your regular keyboard |

### MIDI details
- Connects automatically when a MIDI device is plugged in (USB)
- The green dot in the top-left shows the connected device name
- **Velocity sensitive** — harder keystrokes spawn larger characters with more particles
- Works with any USB MIDI controller (keyboards, pads, etc.)

---

## Stopping the Servers

```bash
# Kill by port (works on both platforms)
npx kill-port 8000 5173
```

On Windows you can also just close the two terminal windows opened by `start.bat`.

---

## Project Structure

```
piano-battle-app/
├── backend/
│   ├── main.py              # FastAPI server + REST endpoints
│   ├── processor.py         # rembg pipeline (remove bg → crop → resize)
│   ├── requirements.txt
│   ├── raw_images/          # Drop your source images here
│   └── processed_images/    # Auto-generated transparent PNGs
├── frontend/
│   └── src/
│       ├── App.tsx
│       ├── components/
│       │   ├── Stage.tsx          # Orchestrates spawning
│       │   ├── Character.tsx      # Individual animated character
│       │   ├── Background.tsx     # Themed CSS backgrounds
│       │   ├── PianoKeyboard.tsx  # Mini keyboard display
│       │   ├── ParticleCanvas.tsx # Canvas particle effects
│       │   └── ThemePicker.tsx
│       ├── hooks/
│       │   ├── useMidi.ts         # Web MIDI API integration
│       │   └── useImagePool.ts    # Image loading + shuffle-bag
│       ├── animations/
│       │   ├── entrance.css       # 6 CSS keyframe animations
│       │   └── particles.ts       # Theme-aware particle system
│       └── themes/
│           ├── beach.ts, jungle.ts, space.ts, underwater.ts
├── start.bat                # Windows launcher
└── start.sh                 # macOS/Linux launcher
```

---

## Tech Stack

| Layer | Technology |
|-------|------------|
| Frontend | React 18 + TypeScript + Vite |
| Backend | Python + FastAPI + uvicorn |
| Background removal | [rembg](https://github.com/danielgatis/rembg) (U2Net model) |
| Image processing | Pillow |
| MIDI input | Web MIDI API (browser-native) |
| Animations | CSS keyframes + HTML Canvas |

---

## Troubleshooting

**MIDI keyboard not detected**
- Make sure you're using Chrome or Edge (Firefox doesn't support Web MIDI)
- Plug in your keyboard before opening the app, or refresh after plugging in
- Accept the MIDI permission prompt when the browser asks

**`rembg` install fails on Windows**
- Try: `pip install rembg[cpu] --prefer-binary`
- You may need [Visual C++ Build Tools](https://visualstudio.microsoft.com/visual-cpp-build-tools/)

**Images not appearing after processing**
- Check the backend terminal for errors
- Make sure the backend is running on port 8000
- Try refreshing the image pool with the `+` button

**First image processing is very slow**
- This is normal — rembg downloads the U2Net model (~170 MB) on first use
- Subsequent images process in 1–5 seconds on CPU
