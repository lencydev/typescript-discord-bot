import Context from '../interfaces/context';

import { ApplicationCommandType } from 'discord.js';

export interface AppOptions {

  name: string;

  enabled?: boolean;
  developerOnly?: boolean;

  defaultPermission?: boolean;
  type?: ApplicationCommandType;
};

export default abstract class App {

  public name;

  public enabled;
  public developerOnly;

  public defaultPermission;
  public type;

  constructor(app: AppOptions) {

    this.name = app.name;

    this.enabled = app.enabled ?? false;
    this.developerOnly = app.developerOnly ?? false;

    this.defaultPermission = app.defaultPermission ?? true;
    this.type = app.type ?? 'USER';
  };

  abstract execute (ctx: Context): Promise<void>;
};