import { BrowserRouter } from 'react-router-dom';
import { Suspense } from 'react';
import { routes } from './routes';
import { useRoutes } from 'react-router-dom';

function AppRoutes() {
    return useRoutes(routes);
}

export default function App() {
    return (
        <BrowserRouter>
            <Suspense fallback={<div>Ładowanie…</div>}>
                <AppRoutes />
            </Suspense>
        </BrowserRouter>
    );
}
