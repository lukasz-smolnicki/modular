import type { RouteObject } from 'react-router-dom';

const modules = import.meta.glob('../modules/**/routes.tsx', {
    eager: true
}) as Record<string, { default: RouteObject[] }>;

export const routes: RouteObject[] = Object.values(modules).flatMap(
    (m) => m.default
);
