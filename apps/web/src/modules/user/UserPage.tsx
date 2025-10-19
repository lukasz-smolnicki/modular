import { useAuthStatus } from "@/hooks/useAuthStatus";
import LoginPage from "@/modules/auth/LoginPage";

export default function UserPage() {
  const { user, loading } = useAuthStatus();

  if (loading) {
    return (
      <div style={{ padding: 24 }}>
        <div>Ładowanie…</div>
      </div>
    );
  }

  if (!user) {
    return <LoginPage />;
  }

  return (
    <div style={{ padding: 24 }}>
      <h1 style={{ margin: 0, fontSize: 20 }}>Panel użytkownika</h1>
      <p style={{ marginTop: 8, opacity: 0.8 }}>
        Zalogowano jako: <strong>{user.email || user.uid}</strong>
      </p>
    </div>
  );
}
