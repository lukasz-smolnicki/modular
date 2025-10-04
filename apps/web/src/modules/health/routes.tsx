import type { RouteObject } from 'react-router-dom';
import { lazy } from 'react';

const HealthPage = lazy(() => import('./HealthPage'));

export default [
    { path: '/health', element: <HealthPage /> }
] satisfies RouteObject[];
