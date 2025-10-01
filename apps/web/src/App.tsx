import { useEffect, useState } from "react";

export default function App() {
  const [apiText, setApiText] = useState("Ładowanie…");
  const [firestoreText, setFirestoreText] = useState("Ładowanie…");

  useEffect(() => {
    fetch("http://localhost:3000/api")
      .then((r) => r.text())
      .then(setApiText)
      .catch(() => setApiText("Błąd /api"));

    fetch("http://localhost:3000/firestore")
      .then((r) => r.text())
      .then(setFirestoreText)
      .catch(() => setFirestoreText("Błąd /firestore"));
  }, []);

  return <pre style={{ margin: 0 }}>{apiText + "\n" + firestoreText}</pre>;
}
