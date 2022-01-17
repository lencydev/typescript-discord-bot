import Context from '../interfaces/context';

import { ApplicationCommandOptionData, PermissionString, ApplicationCommandType } from 'discord.js';

export interface CommandOptions {

  name: string;
  description?: string;
  options?: ApplicationCommandOptionData[];

  cooldown?: any | boolean;

  category?: string;
  usage?: string[] | boolean;

  ownerOnly?: boolean;
  userPermissions?: PermissionString[] | boolean;
  clientPermissions?: PermissionString[] | boolean;

  enabled?: boolean;
  developerOnly?: boolean;

  defaultPermission?: boolean;
  type?: ApplicationCommandType;
};

export default abstract class Command {

  public name;
  public description;
  public options;

  public cooldown;

  public category;
  public usage;
  
  public ownerOnly;
  public userPermissions;
  public clientPermissions;

  public enabled;
  public developerOnly;

  public defaultPermission;
  public type;

  constructor(command: CommandOptions) {

    this.name = command.name;
    this.description = command.description ?? 'Not found.';
    this.options = command.options ?? [];

    this.cooldown = command.cooldown ?? false;

    this.category = command.category ?? 'None';
    this.usage = command.usage ?? false;

    this.ownerOnly = command.ownerOnly ?? false;
    this.userPermissions = command.userPermissions ?? false;
    this.clientPermissions = command.clientPermissions ?? false;

    this.enabled = command.enabled ?? false;
    this.developerOnly = command.developerOnly ?? false;

    this.defaultPermission = command.defaultPermission ?? true;
    this.type = command.type ?? 'CHAT_INPUT';
  };

  abstract execute (ctx: Context): Promise<void>;
};