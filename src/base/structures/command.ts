import { Context } from '@context';

import { ChatInputCommandInteraction } from '@discord';

export abstract class Command {

  readonly name;
  readonly description;
  readonly options;

  readonly cooldown;

  readonly developerOnly;
  readonly ownerOnly;
  readonly permissions;

  readonly enabled;

  constructor (command: CommandOptions) {

    this.name = command.name;
    this.description = command.description ?? `undefined`;
    this.options = command.options ?? [];

    this.cooldown = command.cooldown ?? false;

    this.developerOnly = command.developerOnly ?? false;
    this.ownerOnly = command.ownerOnly ?? false;
    this.permissions = command.permissions ?? false;

    this.enabled = command.enabled ?? false;
  };

  abstract execute ({ ctx, interaction }: { ctx: Context; interaction: ChatInputCommandInteraction; }): Promise<void>;
};