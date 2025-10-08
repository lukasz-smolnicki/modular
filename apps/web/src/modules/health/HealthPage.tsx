import { useEffect, useState } from 'react';
import { apiGet } from '@/api/client';

export default function HealthPage() {
    const [apiMsg, setApiMsg] = useState('');
    const [fsMsg, setFsMsg] = useState('');
    const [err, setErr] = useState('');

    useEffect(() => {
        let on = true;
        (async () => {
            try {
                const h = await apiGet<{ message?: string }>('/health/api');
                if (on) setApiMsg(h?.message ?? 'OK');
            } catch (e: any) {
                if (on) setErr(String(e?.message || e));
            }
            try {
                const f = await apiGet<{ message?: string }>(
                    '/health/firestore'
                );
                if (on) setFsMsg(f?.message ?? 'OK');
            } catch (e: any) {
                if (on) setErr((p) => p || String(e?.message || e));
            }
        })();
        return () => {
            on = false;
        };
    }, []);

    return (
        <div
            style={{
                padding: 24,
                maxWidth: 640,
                margin: '0 auto',
                fontFamily: 'ui-sans-serif, system-ui'
            }}>
            <h1 style={{ margin: 0, fontSize: 20 }}>Health</h1>
            <section
                style={{
                    marginTop: 16,
                    padding: 12,
                    border: '1px solid #e5e7eb',
                    borderRadius: 8
                }}>
                <h2 style={{ margin: 0, fontSize: 16 }}>API</h2>
                <p style={{ margin: '8px 0' }}>
                    <strong>{apiMsg}</strong>
                </p>
            </section>
            <section
                style={{
                    marginTop: 16,
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
