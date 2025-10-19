import { Firestore } from "@google-cloud/firestore";

export async function runSeed(db: Firestore) {
  await db
    .doc("health/firestore")
    .set({ message: "Witamy z FIRESTORE" }, { merge: true });

  await db.doc("modules/user").set(
    {
      key: "user",
      name: "Użytkownicy",
      route: "/user",
      public: true,
      icon: "👤",
      description: "Profil i ustawienia użytkownika",
      order: 0,
    },
    { merge: true },
  );

  await db.doc("modules/about").set(
    {
      key: "about",
      name: "O aplikacji",
      route: "/about",
      public: true,
      icon: "ℹ️",
      description: "Informacje o aplikacji",
      order: 1,
    },
    { merge: true },
  );

  await db.doc("modules/clients").set(
    {
      key: "clients",
      name: "Klienci",
      route: "/clients",
      public: true,
      icon: "👥",
      description: "Lista i profil klientów",
      order: 2,
    },
    { merge: true },
  );

  await db.doc("modules/offers").set(
    {
      key: "offers",
      name: "Oferty",
      route: "/offers",
      public: true,
      icon: "💼",
      description: "Oferty handlowe",
      order: 3,
    },
    { merge: true },
  );

  await db.doc("modules/tasks").set(
    {
      key: "tasks",
      name: "Zadania",
      route: "/tasks",
      public: true,
      icon: "✅",
      description: "Zadania i aktywności",
      order: 4,
    },
    { merge: true },
  );

  await db.doc("modules/notes").set(
    {
      key: "notes",
      name: "Notatki",
      route: "/notes",
      public: true,
      icon: "📝",
      description: "Notatki i komentarze",
      order: 5,
    },
    { merge: true },
  );

  await db.doc("users/admin-1").set(
    {
      id: "admin-1",
      roles: ["admin"],
      enabledModules: ["user", "clients", "offers", "tasks", "notes", "about"],
      enabled: {
        user: "admin",
        clients: "admin",
        offers: "admin",
        tasks: "admin",
        notes: "admin",
        about: "read",
      },
    },
    { merge: true },
  );

  await db.doc("users/user-1").set(
    {
      id: "user-1",
      roles: ["user"],
      enabledModules: ["user", "clients", "offers", "about"],
      enabled: {
        user: "read",
        clients: "write",
        offers: "read",
        about: "read",
      },
    },
    { merge: true },
  );
}
