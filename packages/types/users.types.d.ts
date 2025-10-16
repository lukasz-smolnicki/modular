import type { ModuleKey, UserId } from './core.types';

export type UserDoc = {
    enabledModules: ModuleKey[];
    id?: UserId;
};
