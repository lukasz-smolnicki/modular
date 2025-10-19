import type { ModuleKey, UserId } from './core.types';

export type ModuleRole = 'read' | 'write' | 'admin';
export type EnabledModulesMap = Record<ModuleKey, ModuleRole>;

export type UserSettings = {
    uid: string;
    enabled: ModuleKey[];
    isAdmin: boolean;
};

export type UserDoc = {
    id?: UserId;
    roles?: string[];
    enabledModules?: ModuleKey[];
    enabled?: EnabledModulesMap;
};
