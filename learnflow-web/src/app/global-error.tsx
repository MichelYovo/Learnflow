"use client";

export default function GlobalError({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <html lang="fr">
      <body
        style={{
          margin: 0,
          minHeight: "100dvh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontFamily: "system-ui, sans-serif",
          background: "#fafaf9",
          color: "#1c1917",
        }}
      >
        <div style={{ textAlign: "center", padding: 24, maxWidth: 420 }}>
          <h1 style={{ fontSize: 20, fontWeight: 800, margin: 0 }}>LearnFlow n’a pas pu s’ouvrir</h1>
          <p style={{ margin: "12px 0 0", color: "#78716c", fontSize: 14, lineHeight: 1.5 }}>
            Un souci a bloqué l’application. Réessaie, ou ouvre le lien dans Chrome.
          </p>
          <button
            type="button"
            onClick={() => reset()}
            style={{
              marginTop: 20,
              background: "#1677FF",
              color: "#fff",
              border: 0,
              borderRadius: 999,
              padding: "10px 20px",
              fontWeight: 800,
              cursor: "pointer",
            }}
          >
            Réessayer
          </button>
        </div>
      </body>
    </html>
  );
}
