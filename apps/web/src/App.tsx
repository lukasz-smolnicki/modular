import { useEffect, useState } from 'react';

export default function App() {
  const [apiText, setApiText] = useState<string>('Ładowanie…');
  const [firestoreText, setFirestoreText] = useState<string>('Ładowanie…');

  useEffect(() => {
    fetch('http://localhost:3000/api')
      .then(r => r.text())
      .then(setApiText)
      .catch(() => setApiText('Błąd /api'));

    fetch('http://localhost:3000/firestore')
      .then(async r => {
        if (r.ok) return r.text();
        const body = await r.text();
        return body || 'Not Implemented';
      })
      .then(setFirestoreText)
      .catch(() => setFirestoreText('Błąd /firestore'));
  }, []);

  return (
    <pre style={{ margin: 0 }}>
      {apiText + '\n' + firestoreText}
    </pre>
  );
}
