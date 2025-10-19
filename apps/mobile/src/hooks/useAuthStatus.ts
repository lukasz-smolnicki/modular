import { useEffect, useState } from "react";
import { auth } from "@/firebase";
import { onAuthStateChanged, type User } from "firebase/auth";

export function useAuthStatus() {
  const [user, setUser] = useState<User | null | undefined>(undefined);

  useEffect(() => {
    const sub = onAuthStateChanged(auth, (u) => setUser(u ?? null));
    return () => sub();
  }, []);

  return { user, loading: user === undefined };
}
