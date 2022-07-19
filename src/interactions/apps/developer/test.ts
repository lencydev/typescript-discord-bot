import { App } from '@app';
import { Context } from '@context';

import {
  ContextMenuCommandInteraction,
  User,
} from '@discord';

export default class extends App {

  constructor() {
    super({
      name: 'Test',
      type: 2,

      cooldown: false,
  
      developerOnly: true,
      ownerOnly: false,
      permissions: false,

      enabled: true,
    });
  };

  async execute ({ ctx, interaction }: { ctx: Context; interaction: ContextMenuCommandInteraction; }): Promise<void> {

    let user: User = await ctx.client.users.fetch(interaction.targetId, { force: true });

    await interaction.success_reply({ ephemeral: true, content: `${user}` });
  };
};