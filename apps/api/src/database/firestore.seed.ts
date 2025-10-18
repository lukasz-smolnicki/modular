import { Firestore } from "@google-cloud/firestore";

export async function runSeed(db: Firestore) {
  await db
    .doc("health/firestore")
    .set({ message: "Witamy z FIRESTORE" }, { merge: true });

  await db.doc("modules/users").set(
    {
      key: "users",
      name: "Użytkownicy",
      route: "/users",
      public: true,
    },
    { merge: true },
  );

  await db.doc("modules/admin").set(
    {
      key: "admin",
      name: "Administracja",
      route: "/admin",
      public: true,
    },
    { merge: true },
  );
  await db
    .doc("modules/offers")
    .set(
      { key: "offers", name: "Oferty", route: "/offers", public: true },
      { merge: true },
    );
  await db.doc("modules/clients").set(
    {
      key: "clients",
      name: "Klienci",
      route: "/clients",
      public: true,
    },
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

  await db.doc("users/demo-user-1").set(
    {
      id: "demo-user-1",
      enabled: {
        admin: "admin",
        offers: "write",
        clients: "read",
        tasks: "read",
        notes: "write",
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
      },
    },
    { merge: true },
  );
}
