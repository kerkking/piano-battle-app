import { useState, useRef, useCallback, useEffect } from "react";
import type { ThemeName } from "./types";
import { useMidi } from "./hooks/useMidi";
import { useImagePool } from "./hooks/useImagePool";
import { Stage, type StageHandle } from "./components/Stage";
import { ThemePicker } from "./components/ThemePicker";
import "./animations/entrance.css";

export default function App() {
  const [theme, setTheme] = useState<ThemeName>("beach");
  const [showUpload, setShowUpload] = useState(false);
  const [uploadStatus, setUploadStatus] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const stageRef = useRef<StageHandle>(null);
  const { images, isLoading, pickRandom, refresh } = useImagePool();

  const handleNoteOn = useCallback(
    (note: number, velocity: number) => {
      stageRef.current?.spawnCharacter(note, velocity);
    },
    []
  );

  const { isConnected, deviceName, error: midiError } = useMidi(handleNoteOn);

  // Keyboard fallback for testing without a MIDI device
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.repeat) return;
      // Map keyboard to fake MIDI note + velocity
      const note = 60 + (e.key.charCodeAt(0) % 24);
      const velocity = 64 + Math.floor(Math.random() * 63);
      stageRef.current?.spawnCharacter(note, velocity);
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  // File upload handling
  const uploadFiles = useCallback(
    async (files: FileList | File[]) => {
      setUploadStatus("Processing...");
      let count = 0;
      for (const file of files) {
        const formData = new FormData();
        formData.append("file", file);
        try {
          const res = await fetch("/api/upload", { method: "POST", body: formData });
          if (res.ok) count++;
        } catch {
          // Backend may be down
        }
      }
      setUploadStatus(`Processed ${count} image${count !== 1 ? "s" : ""}`);
      refresh();
      setTimeout(() => setUploadStatus(null), 3000);
    },
    [refresh]
  );

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragging(false);
      if (e.dataTransfer.files.length > 0) {
        uploadFiles(e.dataTransfer.files);
      }
    },
    [uploadFiles]
  );

  const handleFileInput = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      if (e.target.files && e.target.files.length > 0) {
        uploadFiles(e.target.files);
      }
    },
    [uploadFiles]
  );

  return (
    <div
      onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
      onDragLeave={() => setIsDragging(false)}
      onDrop={handleDrop}
      style={{ width: "100%", height: "100%" }}
    >
      <Stage ref={stageRef} theme={theme} pickRandomImage={pickRandom} />
      <ThemePicker current={theme} onChange={setTheme} />

      {/* MIDI Status */}
      <div style={{
        position: "fixed", top: 12, left: 12, zIndex: 20,
        background: "rgba(0,0,0,0.5)", backdropFilter: "blur(10px)",
        padding: "6px 14px", borderRadius: 20, color: "#fff",
        fontSize: 13, display: "flex", alignItems: "center", gap: 8,
      }}>
        <div style={{
          width: 8, height: 8, borderRadius: "50%",
          background: isConnected ? "#4ade80" : "#f87171",
        }} />
        {isConnected
          ? deviceName
          : midiError || "No MIDI device (use keyboard to test)"}
      </div>

      {/* Image count */}
      <div style={{
        position: "fixed", top: 12, right: 12, zIndex: 20,
        background: "rgba(0,0,0,0.5)", backdropFilter: "blur(10px)",
        padding: "6px 14px", borderRadius: 20, color: "#fff",
        fontSize: 13, display: "flex", alignItems: "center", gap: 8,
      }}>
        {isLoading ? "Loading images..." : `${images.length} images`}
        <button
          onClick={() => setShowUpload(!showUpload)}
          style={{
            background: "rgba(255,255,255,0.2)", border: "none",
            color: "#fff", padding: "2px 8px", borderRadius: 10,
            cursor: "pointer", fontSize: 13,
          }}
        >
          +
        </button>
      </div>

      {/* Upload panel */}
      {showUpload && (
        <div style={{
          position: "fixed", top: 50, right: 12, zIndex: 20,
          background: "rgba(0,0,0,0.7)", backdropFilter: "blur(10px)",
          padding: 20, borderRadius: 12, color: "#fff", width: 280,
        }}>
          <p style={{ margin: "0 0 12px", fontSize: 14 }}>
            Upload images of people or characters:
          </p>
          <label style={{
            display: "block", padding: "20px 10px",
            border: "2px dashed rgba(255,255,255,0.3)", borderRadius: 8,
            textAlign: "center", cursor: "pointer", fontSize: 13,
          }}>
            Drop files here or click to browse
            <input
              type="file"
              multiple
              accept="image/*"
              onChange={handleFileInput}
              style={{ display: "none" }}
            />
          </label>
          <button
            onClick={async () => {
              setUploadStatus("Batch processing...");
              try {
                const res = await fetch("/api/process-all", { method: "POST" });
                const data = await res.json();
                setUploadStatus(`Processed ${data.count} images`);
                refresh();
              } catch {
                setUploadStatus("Backend not available");
              }
              setTimeout(() => setUploadStatus(null), 3000);
            }}
            style={{
              marginTop: 10, width: "100%", padding: "8px 0",
              background: "rgba(255,255,255,0.15)", border: "1px solid rgba(255,255,255,0.3)",
              color: "#fff", borderRadius: 8, cursor: "pointer", fontSize: 13,
            }}
          >
            Process all raw_images/
          </button>
          {uploadStatus && (
            <p style={{ margin: "8px 0 0", fontSize: 12, color: "#4ade80" }}>
              {uploadStatus}
            </p>
          )}
        </div>
      )}

      {/* Drag overlay */}
      {isDragging && (
        <div style={{
          position: "fixed", inset: 0, zIndex: 100,
          background: "rgba(0,0,0,0.6)", display: "flex",
          alignItems: "center", justifyContent: "center",
          color: "#fff", fontSize: 24, fontWeight: "bold",
        }}>
          Drop images to upload
        </div>
      )}

      {/* Empty state */}
      {!isLoading && images.length === 0 && (
        <div style={{
          position: "fixed", top: "50%", left: "50%",
          transform: "translate(-50%, -50%)", zIndex: 15,
          background: "rgba(0,0,0,0.6)", backdropFilter: "blur(10px)",
          padding: "30px 40px", borderRadius: 16, color: "#fff",
          textAlign: "center", maxWidth: 400,
        }}>
          <h2 style={{ margin: "0 0 10px", fontSize: 20 }}>No images yet!</h2>
          <p style={{ margin: 0, fontSize: 14, opacity: 0.8, lineHeight: 1.5 }}>
            Click the <strong>+</strong> button to upload images, or drop images
            into <code>backend/raw_images/</code> and hit "Process all".
          </p>
        </div>
      )}
    </div>
  );
}
