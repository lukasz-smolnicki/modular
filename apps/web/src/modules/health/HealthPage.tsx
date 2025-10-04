import { useEffect, useState } from 'react';

const API_BASE =
    (import.meta as any).env?.VITE_API_BASE_URL ||
    (import.meta as any).env?.NEXT_PUBLIC_API_BASE_URL ||
    'http://localhost:3000';

export default function HealthPage() {
    const [apiMsg, setApiMsg] = useState('');
    const [fsMsg, setFsMsg] = useState('');
    const [err, setErr] = useState('');

    useEffect(() => {
        let on = true;
        (async () => {
            try {
                const [a, f] = await Promise.all([
                    fetch(`${API_BASE}/health/api`).then((r) => r.json()),
                    fetch(`${API_BASE}/health/firestore`).then((r) => r.json())
                ]);
                if (!on) return;
                setApiMsg(String(a?.message ?? ''));
                setFsMsg(String(f?.message ?? ''));
            } catch (e: any) {
                if (!on) return;
                setErr(e?.message ?? 'Błąd');
            }
        })();
        return () => {
            on = false;
        };
    }, []);

    return (
        <div style={{ fontFamily: 'system-ui, sans-serif', margin: 24 }}>
            <h1 style={{ fontSize: 24, marginBottom: 16 }}>Health</h1>
            <section
                style={{
                    padding: 12,
                    border: '1px solid #e5e7eb',
                    borderRadius: 8,
                    marginBottom: 12
                }}>
                <h2 style={{ margin: 0, fontSize: 16 }}>API</h2>
                <p style={{ margin: '8px 0' }}>
                    <strong>{apiMsg}</strong>
                </p>
            </section>
            <section
                style={{
                    padding: 12,
                    border: '1px solid #e5e7eb',
                    borderRadius: 8
                }}>
                <h2 style={{ margin: 0, fontSize: 16 }}>Firestore</h2>
                <p style={{ margin: '8px 0' }}>
                    <strong>{fsMsg}</strong>
                </p>
            </section>
            {err && (
                <pre style={{ marginTop: 16, color: '#b91c1c' }}>{err}</pre>
            )}
        </div>
    );
}
