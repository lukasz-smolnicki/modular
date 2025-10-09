import type { RouteObject } from "react-router-dom";
import HealthPage from "./HealthPage";

const routes: RouteObject[] = [{ path: "/health", element: <HealthPage /> }];

export default routes;
