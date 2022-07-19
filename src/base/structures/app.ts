import { Context } from '@context';

import { ContextMenuCommandInteraction } from '@discord';

export abstract class App {

  readonly name;
  readonly type;

  readonly cooldown;

  readonly developerOnly;
  readonly ownerOnly;
  readonly permissions;

  readonly enabled;

  constructor(app: AppOptions) {

    this.name = app.name;
    this.type = app.type;

    this.cooldown = app.cooldown ?? false;

    this.developerOnly = app.developerOnly ?? false;
    this.ownerOnly = app.ownerOnly ?? false;
    this.permissions = app.permissions ?? false;

    this.enabled = app.enabled ?? false;
  };

  abstract execute ({ ctx, interaction }: { ctx: Context; interaction: ContextMenuCommandInteraction; }): Promise<void>;
};