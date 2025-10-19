export default function AboutPage() {
  return (
    <div style={{ maxWidth: 640 }}>
      <h1 style={{ margin: 0, fontSize: 22 }}>PowerApp — O aplikacji</h1>
      <p style={{ marginTop: 12 }}>
        Modularny CRM z elastycznymi modułami. Każdy moduł można włączać i
        wyłączać per użytkownik, a administrator widzi wszystkie.
      </p>
      <ul>
        <li>Wersja: 0.0.10</li>
        <li>
          Moduły: użytkownik, o aplikacji, klienci, oferty, zadania, notatki
        </li>
      </ul>
    </div>
  );
}
