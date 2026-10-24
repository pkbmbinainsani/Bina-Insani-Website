
export default function App() {
  return (
    <main style={{
      minHeight: "100vh",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      padding: "24px",
      boxSizing: "border-box",
      background: "#f0fdf4",
      fontFamily: "Arial, sans-serif",
      textAlign: "center",
      color: "#14532d"
    }}>
      <section style={{
        maxWidth: "520px",
        background: "#ffffff",
        padding: "36px 28px",
        borderRadius: "18px",
        boxShadow: "0 8px 32px #14532d18"
      }}>
        <div style={{ fontSize: "56px" }}>🛠️</div>

        <h1>Website Sedang Pemeliharaan</h1>

        <p style={{
          color: "#4b5563",
          lineHeight: 1.8
        }}>
          Mohon maaf, website kami sedang menjalani
          pemeliharaan sementara.
        </p>

        <p style={{
          color: "#4b5563",
          lineHeight: 1.8
        }}>
          Silakan kunjungi kembali beberapa saat lagi.
          Terima kasih atas pengertian Anda.
        </p>
      </section>
    </main>
  );
}
