import type { ModuleKey } from './core.types';

export type ModuleInfo = {
    key: ModuleKey;
    name: string;
    route?: string;
    public?: boolean;
};
