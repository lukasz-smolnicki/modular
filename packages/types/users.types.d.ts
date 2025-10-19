import type { ModuleKey, UserId } from './core.types';

export type ModuleRole = 'read' | 'write' | 'admin';
export type EnabledModulesMap = Record<ModuleKey, ModuleRole>;

export type UserDoc = {
    enabledModules?: ModuleKey[];
    enabled?: EnabledModulesMap;
    id?: UserId;
    roles?: string[];
};
