import { ApplicationCommandOptionData, PermissionsString } from '@discord';

export declare global {

  interface CommandOptions {

    name: string;
    description?: string;
    options?: ApplicationCommandOptionData[];
  
    cooldown?: { time: string; global: boolean } | false;

    developerOnly?: boolean;
    ownerOnly?: boolean;
    permissions?: { executor: PermissionsString[] | false; client: PermissionsString[] | false; } | false;
  
    enabled?: boolean;
  };
};