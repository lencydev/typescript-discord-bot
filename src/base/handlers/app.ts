import Client from '../client';

import Handler from '../structures/handler';
import Context from '../interfaces/context';

import { CommandInteraction, MessageEmbed } from 'discord.js';

export default class extends Handler {

  constructor() {
    super({
      name: 'interactionCreate',
      enabled: true,
    });
  };

  async execute (client: Client, interaction: CommandInteraction) {

    let ctx: Context = new Context(client, interaction);

    if (interaction.isContextMenu()) {

      let app = client.apps.get(interaction.commandName);

      if (app?.developerOnly == true && !ctx.config.data.developers.includes(interaction.user.id)) {
        
        ctx.reply.error({ content: `The app can only be used by the developer.` });
        ctx.terminal.log({ content: `${ctx.terminal.color({ text: 'APP', hex: ctx.config.terminal.color.yellow, bold: true })} ${ctx.terminal.color({ text: interaction.commandName, hex: ctx.config.terminal.color.red })} by ${ctx.terminal.color({ text: `${interaction.user.tag} (${interaction.user.id})`, hex: ctx.config.terminal.color.blue })}` });
        return;
      };

      if (await ctx.schema.restart.findOne({ status: true }) && !ctx.config.data.developers.includes(interaction.user.id)) {
        
        ctx.reply.error({ content: `The system is rebooting. This may take several minutes.` });
        ctx.terminal.log({ content: `${ctx.terminal.color({ text: 'APP', hex: ctx.config.terminal.color.yellow, bold: true })} ${ctx.terminal.color({ text: interaction.commandName, hex: ctx.config.terminal.color.red })} by ${ctx.terminal.color({ text: `${interaction.user.tag} (${interaction.user.id})`, hex: ctx.config.terminal.color.blue })}` });
        return;
      };

      if (await ctx.schema.blacklist.findOne({ user: interaction.user.id })) {
        
        ctx.reply.error({ content: `You can't use apps because you found it on the blacklist.` });
        ctx.terminal.log({ content: `${ctx.terminal.color({ text: 'APP', hex: ctx.config.terminal.color.yellow, bold: true })} ${ctx.terminal.color({ text: interaction.commandName, hex: ctx.config.terminal.color.red })} by ${ctx.terminal.color({ text: `${interaction.user.tag} (${interaction.user.id})`, hex: ctx.config.terminal.color.blue })}` });
        return;
      };

      ctx.terminal.log({ content: `${ctx.terminal.color({ text: 'APP', hex: ctx.config.terminal.color.yellow, bold: true })} ${ctx.terminal.color({ text: interaction.commandName, hex: ctx.config.terminal.color.green })} by ${ctx.terminal.color({ text: `${interaction.user.tag} (${interaction.user.id})`, hex: ctx.config.terminal.color.blue })}` });

      try {

        app.execute(ctx);

      } catch (error: any) {

        interaction.reply({
          ephemeral: true,
          embeds: [
            new MessageEmbed({
              color: ctx.config.color.default,
              title: `Something went wrong...`,
              description: `\`\`\`ts\n${error.length > 1000 ? `${error.slice(0, 1000)}...` : `${error}`}\n\`\`\``,
            }),
          ],
        });
      };
    };
  };
};