"use client";
import React, { useState } from "react";

type Channel =
  | "instagram"
  | "facebook"
  | "google"
  | "linkedin"
  | "pinterest"
  | "tiktok";

const CHANNELS: { key: Channel; label: string }[] = [
  { key: "instagram", label: "Instagram" },
  { key: "facebook", label: "Facebook" },
  { key: "google", label: "Google Business" },
  { key: "linkedin", label: "LinkedIn" },
  { key: "pinterest", label: "Pinterest" },
  { key: "tiktok", label: "TikTok" },
];

export default function PostComposer() {
  const [text, setText] = useState("");
  const [selectedChannels, setSelectedChannels] = useState<
    Record<Channel, boolean>
  >({
    instagram: true,
    facebook: false,
    google: false,
    linkedin: false,
    pinterest: false,
    tiktok: false,
  });
  const [presetName, setPresetName] = useState("Default");
  const [presets, setPresets] = useState([
    {
      name: "Instagram + FB",
      channels: {
        instagram: true,
        facebook: true,
        google: false,
        linkedin: false,
        pinterest: false,
        tiktok: false,
      },
    },
    {
      name: "LinkedIn Only",
      channels: {
        instagram: false,
        facebook: false,
        google: false,
        linkedin: true,
        pinterest: false,
        tiktok: false,
      },
    },
  ]);

  function toggleChannel(k: Channel) {
    setSelectedChannels((prev) => ({ ...prev, [k]: !prev[k] }));
  }

  function applyPreset(idx: number) {
    const p = presets[idx];
    setSelectedChannels(p.channels as any);
    setPresetName(p.name);
  }

  function savePreset(name: string) {
    setPresets((prev) => [...prev, { name, channels: selectedChannels }]);
    setPresetName(name);
  }

  return (
    <div className="max-w-3xl mx-auto p-4 bg-white rounded-2xl shadow">
      <textarea
        placeholder="Write your post..."
        value={text}
        onChange={(e) => setText(e.target.value)}
        className="w-full h-36 p-3 border rounded-md resize-none focus:outline-none"
      />

      <div className="mt-3 flex gap-4 items-center flex-wrap">
        <div className="flex items-center gap-2">
          <label className="text-sm">Presets</label>
          <select
            value={presetName}
            onChange={(e) => {
              const idx = presets.findIndex((p) => p.name === e.target.value);
              if (idx >= 0) applyPreset(idx);
              else setPresetName(e.target.value);
            }}
            className="border px-2 py-1 rounded"
          >
            {presets.map((p) => (
              <option key={p.name} value={p.name}>
                {p.name}
              </option>
            ))}
            <option value="__new">-- new preset --</option>
          </select>
          <button
            onClick={() => {
              const name = prompt("Preset name?", `Preset ${presets.length + 1}`);
              if (name) savePreset(name);
            }}
            className="px-3 py-1 bg-gray-100 rounded text-sm"
          >
            Save Preset
          </button>
        </div>

        <div className="ml-auto flex gap-2">
          <input type="file" accept="image/*,video/*" />
          <button className="px-4 py-2 bg-blue-600 text-white rounded">
            Post Now
          </button>
          <button className="px-4 py-2 border rounded">Schedule</button>
        </div>
      </div>

      <div className="mt-4 grid grid-cols-2 sm:grid-cols-3 gap-2">
        {CHANNELS.map((c) => (
          <label
            key={c.key}
            className={`flex items-center gap-2 p-2 border rounded ${
              selectedChannels[c.key] ? "bg-gray-50" : ""
            }`}
          >
            <input
              type="checkbox"
              checked={selectedChannels[c.key]}
              onChange={() => toggleChannel(c.key)}
            />
            <span className="text-sm">{c.label}</span>
          </label>
        ))}
      </div>
    </div>
  );
}
