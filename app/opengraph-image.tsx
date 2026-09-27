import { ImageResponse } from "next/og";

export const alt = "MachInfo — CNC & VMC Machine Parts Marketplace";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "72px 80px",
          color: "#ffffff",
          fontFamily: "sans-serif",
          backgroundColor: "#0b0d10",
          backgroundImage:
            "linear-gradient(rgba(255,255,255,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.05) 1px, transparent 1px)",
          backgroundSize: "48px 48px",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 18 }}>
          <svg width="64" height="64" viewBox="0 0 32 32">
            <rect width="32" height="32" rx="8" fill="#1d2127" />
            <path d="M9 23V10.5l7 7 7-7V23" fill="none" stroke="#fff" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
            <circle cx="16" cy="17.5" r="2.1" fill="#f2711c" />
          </svg>
          <div style={{ display: "flex", fontSize: 46, fontWeight: 800, letterSpacing: -1.5 }}>
            Mach<span style={{ color: "#f2711c" }}>Info</span>
          </div>
        </div>
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ fontSize: 22, letterSpacing: 5, color: "#fb8636" }}>CNC &amp; VMC MACHINE PARTS MARKETPLACE</div>
          <div style={{ fontSize: 80, fontWeight: 800, lineHeight: 1.05, marginTop: 18, letterSpacing: -2 }}>
            Find the Right Part for Your Machine.
          </div>
        </div>
        <div style={{ fontSize: 26, color: "#b9c0ca" }}>
          Spindles · Servo motors · Ball screws · CNC controls · Tool holders — sellers across India
        </div>
      </div>
    ),
    size,
  );
}
