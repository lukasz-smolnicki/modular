import { useAuthUser } from "@/hooks/useAuthUser";

export default function TopBar() {
  const user = useAuthUser();
  return (
    <header
      style={{
        height: 48,
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "0 16px",
        borderBottom: "1px solid #e5e7eb",
        fontFamily: "ui-sans-serif, system-ui",
        position: "sticky",
        top: 0,
        background: "#fff",
        zIndex: 10,
      }}
    >
      <strong>Modular</strong>
      <div style={{ opacity: 0.8, fontSize: 14 }}>
        {user ? user.email || "Zalogowany" : "Gość"}
      </div>
    </header>
  );
}
