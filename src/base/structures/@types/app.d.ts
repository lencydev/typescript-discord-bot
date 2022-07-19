import { ApplicationCommandOptionData, PermissionsString } from '@discord';

export declare global {

  interface AppOptions {

    name: string;
    type: 2 | 3;
  
    cooldown?: { time: string; global: boolean } | false;

    developerOnly?: boolean;
    ownerOnly?: boolean;
    permissions?: { executor: PermissionsString[] | false; client: PermissionsString[] | false; } | false;
  
    enabled?: boolean;
  };
};