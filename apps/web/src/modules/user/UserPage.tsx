import LoginPage from "@/modules/auth/LoginPage";
import { useAuthStatus } from "@/hooks/useAuthStatus";

export default function UserPage() {
  const { user, loading } = useAuthStatus();

  if (loading) {
    return (
      <div style={{ padding: 24, fontFamily: "ui-sans-serif, system-ui" }}>
        Ładowanie…
      </div>
    );
  }

  if (!user) {
    return <LoginPage />;
  }

  return (
    <div style={{ padding: 24, fontFamily: "ui-sans-serif, system-ui" }}>
      <h1 style={{ margin: 0, fontSize: 20 }}>Panel użytkownika</h1>
      <p style={{ marginTop: 8 }}>
        Zalogowano jako <strong>{user.email || user.uid}</strong>.
      </p>
    </div>
  );
}
