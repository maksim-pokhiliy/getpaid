import { ImageResponse } from "next/og";

import { SEO } from "@app/shared/config/seo";

export const alt = SEO.TITLE;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpenGraphImage() {
  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        background: "linear-gradient(145deg, #0a1628 0%, #0f2035 40%, #0d3330 100%)",
        fontFamily: "system-ui, -apple-system, sans-serif",
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "20px",
          marginBottom: "32px",
        }}
      >
        <div
          style={{
            width: "72px",
            height: "72px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            background: "linear-gradient(135deg, #0d9488 0%, #0f766e 100%)",
            borderRadius: "16px",
            boxShadow: "0 8px 32px rgba(13, 148, 136, 0.4)",
          }}
        >
          <span style={{ color: "white", fontSize: "42px", fontWeight: 900, lineHeight: 1 }}>
            $
          </span>
        </div>

        <span
          style={{ color: "#f3f4f6", fontSize: "56px", fontWeight: 800, letterSpacing: "-1px" }}
        >
          Get
          <span style={{ color: "#2dd4bf" }}>Paid</span>
        </span>
      </div>

      <p
        style={{
          color: "#9ca3af",
          fontSize: "26px",
          fontWeight: 400,
          maxWidth: "600px",
          textAlign: "center",
          lineHeight: 1.5,
          margin: 0,
        }}
      >
        {SEO.DESCRIPTION}
      </p>

      <div
        style={{
          display: "flex",
          gap: "12px",
          marginTop: "48px",
        }}
      >
        {["Invoices", "Recurring", "Reminders", "PDF Export", "Dashboard"].map((feature) => (
          <div
            key={feature}
            style={{
              padding: "8px 20px",
              borderRadius: "100px",
              border: "1px solid rgba(45, 212, 191, 0.25)",
              background: "rgba(13, 148, 136, 0.1)",
              color: "#2dd4bf",
              fontSize: "16px",
              fontWeight: 500,
            }}
          >
            {feature}
          </div>
        ))}
      </div>
    </div>,
    { ...size }
  );
}
