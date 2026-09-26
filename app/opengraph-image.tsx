import { ImageResponse } from "next/og";

export const alt = "FarmInfo — Gujarat Na Pak Na Bhav, Ekaj Jagyae.";
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
          background: "linear-gradient(135deg, #0d3423 0%, #072016 60%, #12432e 100%)",
          color: "#fbf8f0",
          fontFamily: "Georgia, serif",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 18 }}>
          <div
            style={{
              width: 64,
              height: 64,
              borderRadius: 18,
              background: "#1f6b47",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <svg width="40" height="40" viewBox="0 0 32 32">
              <path d="M16 25.5V13.2" stroke="#efcd55" strokeWidth="2" strokeLinecap="round" />
              <path d="M16 15.4c0-4.3 2.7-7.2 7.2-7.6.2 4.4-2.6 7.6-7.2 7.6Z" fill="#efcd55" />
              <path d="M16 19.6c0-3.6-2.3-6-6-6.3-.2 3.7 2.2 6.3 6 6.3Z" fill="#fbf8f0" />
            </svg>
          </div>
          <div style={{ fontSize: 44, fontWeight: 600, display: "flex" }}>
            Farm<span style={{ color: "#efcd55" }}>Info</span>
          </div>
        </div>
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ fontSize: 22, letterSpacing: 6, color: "#efcd55", fontFamily: "sans-serif" }}>
            GUJARAT MARKET YARD BHAV
          </div>
          <div style={{ fontSize: 84, lineHeight: 1.04, marginTop: 20, display: "flex", flexDirection: "column" }}>
            <span>Gujarat Na Pak Na Bhav,</span>
            <span style={{ color: "#f5e08c", fontStyle: "italic" }}>Have Ekaj Jagyae.</span>
          </div>
        </div>
        <div style={{ fontSize: 26, color: "#d9cba8", fontFamily: "sans-serif" }}>
          Check agricultural crop prices across Gujarat market yards.
        </div>
      </div>
    ),
    size,
  );
}
