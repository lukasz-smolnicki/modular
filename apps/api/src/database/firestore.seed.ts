import { Firestore } from "@google-cloud/firestore";
import { getApps, initializeApp } from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";

function getErrorMessage(e: unknown): string {
  if (e instanceof Error) return e.message;
  try {
    return JSON.stringify(e);
  } catch {
    return String(e);
  }
}

async function ensureAuthUser(
  uid: string,
  email: string,
  password: string,
): Promise<void> {
  const auth = getAuth();
  try {
    await auth.getUser(uid);
    return;
  } catch {
    try {
      await auth.createUser({ uid, email, password, emailVerified: true });
    } catch (e: unknown) {
      const msg = getErrorMessage(e);
      if (msg.includes("already exists")) return;
      throw e;
    }
  }
}

export async function runSeed(db: Firestore) {
  await db
    .doc("health/firestore")
    .set({ message: "Witamy z FIRESTORE" }, { merge: true });

  await db
    .doc("modules/users")
    .set(
      { key: "users", name: "Użytkownicy", route: "/users", public: true },
      { merge: true },
    );
  await db
    .doc("modules/admin")
    .set(
      { key: "admin", name: "Administracja", route: "/admin", public: true },
      { merge: true },
    );
  await db
    .doc("modules/offers")
    .set(
      { key: "offers", name: "Oferty", route: "/offers", public: true },
      { merge: true },
    );
  await db
    .doc("modules/clients")
    .set(
      { key: "clients", name: "Klienci", route: "/clients", public: true },
      { merge: true },
    );
  await db
    .doc("modules/tasks")
    .set(
      { key: "tasks", name: "Zadania", route: "/tasks", public: true },
      { merge: true },
    );
  await db
    .doc("modules/notes")
    .set(
      { key: "notes", name: "Notatki", route: "/notes", public: true },
      { merge: true },
    );
  await db
    .doc("modules/auth")
    .set(
      { key: "auth", name: "Logowanie", route: "/auth", public: true },
      { merge: true },
    );
  await db
    .doc("modules/dashboard")
    .set(
      { key: "dashboard", name: "Pulpit", route: "/", public: true },
      { merge: true },
    );

  await db.doc("users/demo-user-1").set(
    {
      id: "demo-user-1",
      enabled: {
        admin: "admin",
        offers: "write",
        clients: "read",
        tasks: "read",
        notes: "write",
        dashboard: "read",
      },
    },
    { merge: true },
  );

  await db.doc("users/demo-user-2").set(
    {
      id: "demo-user-2",
      enabled: {
        offers: "read",
        clients: "write",
        dashboard: "read",
      },
    },
    { merge: true },
  );

  const usingAuthEmu =
    !!process.env.FIREBASE_AUTH_EMULATOR_HOST ||
    !!process.env.VITE_FIREBASE_AUTH_EMULATOR_HOST ||
    !!process.env.EXPO_PUBLIC_FIREBASE_AUTH_EMULATOR_HOST;

  if (usingAuthEmu) {
    if (!getApps().length) {
      initializeApp({
        projectId: process.env.FIREBASE_PROJECT_ID || "local-project",
      });
    }
    await ensureAuthUser("demo-user-1", "demo1@example.com", "password123");
    await ensureAuthUser("demo-user-2", "demo2@example.com", "password123");
  }
}
