"use client";

import dynamic from "next/dynamic";
import { useMemo, useState } from "react";
import type { DoctorAppearance } from "../components/DoctorScene";

const DoctorScene = dynamic(
  () => import("../components/DoctorScene").then((mod) => mod.DoctorSceneSuspense),
  {
    ssr: false,
    loading: () => <div className="canvas-fallback">Preparing doctor model…</div>
  }
);

const PRESETS: Record<string, DoctorAppearance> = {
  Surgeon: {
    primaryColor: "#eff6ff",
    accentColor: "#0ea5e9",
    skinTone: "#f2c8a0",
    accessory: "stethoscope"
  },
  Pediatrician: {
    primaryColor: "#f3f4ff",
    accentColor: "#a855f7",
    skinTone: "#deb18c",
    accessory: "clipboard"
  },
  Radiologist: {
    primaryColor: "#e2e8f0",
    accentColor: "#64748b",
    skinTone: "#c8a27a",
    accessory: "none"
  }
};

const INITIAL_PRESET = "Surgeon";

export default function Page() {
  const [appearance, setAppearance] = useState<DoctorAppearance>(PRESETS[INITIAL_PRESET]);
  const [preset, setPreset] = useState<string>(INITIAL_PRESET);

  const gradientPreview = useMemo(
    () => `linear-gradient(90deg, ${appearance.primaryColor}, ${appearance.accentColor})`,
    [appearance]
  );

  return (
    <main>
      <section className="hero">
        <div className="hero-copy">
          <span className="badge">Doctor Model Kit</span>
          <h1>Create a cinematic doctor for your next video</h1>
          <p>
            Design a stylized 3D doctor and export ready-to-use prompts, props, and palettes for motion graphics or
            virtual production workflows. Iterate visually and capture the mood that fits your story.
          </p>
          <div className="preset-grid">
            {Object.entries(PRESETS).map(([name, config]) => (
              <button
                key={name}
                type="button"
                onClick={() => {
                  setAppearance(config);
                  setPreset(name);
                }}
                className={`preset-card ${preset === name ? "active" : ""}`}
              >
                <span className="preset-label">{name}</span>
                <span
                  className="preset-swatch"
                  style={{ background: `radial-gradient(circle at 30% 30%, ${config.accentColor}, ${config.primaryColor})` }}
                />
              </button>
            ))}
          </div>
        </div>
        <div className="canvas-wrapper">
          <DoctorScene appearance={appearance} />
        </div>
      </section>

      <section className="designer-grid">
        <div className="designer-card">
          <h2>Fine-tune the look</h2>
          <p>Customize palette, lighting mood, and storytelling props to match the tone of your shoot.</p>
          <form className="controls">
            <label className="control">
              <span>Primary Coat</span>
              <input
                type="color"
                value={appearance.primaryColor}
                onChange={(event) => setAppearance((prev) => ({ ...prev, primaryColor: event.target.value }))}
              />
            </label>
            <label className="control">
              <span>Accent Scrubs</span>
              <input
                type="color"
                value={appearance.accentColor}
                onChange={(event) => setAppearance((prev) => ({ ...prev, accentColor: event.target.value }))}
              />
            </label>
            <label className="control">
              <span>Skin Tone</span>
              <input
                type="color"
                value={appearance.skinTone}
                onChange={(event) => setAppearance((prev) => ({ ...prev, skinTone: event.target.value }))}
              />
            </label>
            <label className="control">
              <span>Accessory</span>
              <select
                value={appearance.accessory}
                onChange={(event) =>
                  setAppearance((prev) => ({
                    ...prev,
                    accessory: event.target.value as DoctorAppearance["accessory"]
                  }))
                }
              >
                <option value="stethoscope">Stethoscope</option>
                <option value="clipboard">Clipboard</option>
                <option value="none">Minimal</option>
              </select>
            </label>
          </form>
        </div>
        <div className="designer-card">
          <h2>Lookbook prompt</h2>
          <p>Drop this creative brief into your motion design or virtual production notes.</p>
          <div className="prompt-card">
            <header>
              <span>Lighting Mood</span>
              <div className="chip">Studio Softbox</div>
            </header>
            <div className="gradient" style={{ background: gradientPreview }} />
            <pre className="prompt">
{`Close-up of a confident modern doctor wearing a ${preset.toLowerCase()} inspired coat with chroma-balanced lighting.
Primary coat ${appearance.primaryColor}, scrubs ${appearance.accentColor}, natural skin tone ${appearance.skinTone}.
Add ${appearance.accessory === "none" ? "minimal jewelry and clean pockets" : appearance.accessory}.`}
            </pre>
          </div>
        </div>
      </section>
    </main>
  );
}
