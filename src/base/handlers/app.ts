import { Handler } from '@handler';
import { Context } from '@context';

import { App } from '@app';

import { Color, Data } from '@config';
import { Blacklist, Restart } from '@schemas';

import {
  Interaction,
  Embed,
  PermissionsString,
} from '@discord';

export default class extends Handler {

  constructor() {
    super({
      type: 'interactionCreate',
      enabled: true,
    });
  };

  async execute (ctx: Context, interaction: Interaction): Promise<void> {

    if (interaction.isContextMenuCommand()) {

      let app: App = ctx.client.apps.get(interaction.commandName);

      if (!interaction.guild.roles.everyone.permissionsIn(interaction.channel.id).has(`UseExternalEmojis`)) return await interaction.error_reply({ content: `The channel where the command is used must have the \`Use External Emojis\` permission turned on in the ${interaction.guild.roles.everyone} role.` });

      if (app.developerOnly === true && !Data.Developers.some((developer: { id: string }) => developer.id === interaction.user.id)) return await interaction.error_reply({ content: `The command can only be used by the developer.` });
      if (app.ownerOnly === true && interaction.user.id !== interaction.guild.ownerId) return await interaction.error_reply({ content: `The command can only be used by the server owner.` })

      if (app.permissions !== false && app.permissions.executor !== false && !interaction.guild.members.cache.get(interaction.user.id).permissions.has(app.permissions.executor)) return await interaction.error_reply({ content: `You must have ${ctx.case.formattedMap(app.permissions.executor, { format: (value: PermissionsString) => `\`${ctx.case.permission(value)}\`` })} permission${(app.permissions.executor).length === 1 ? `` : `s`} to use the app.` });
      if (app.permissions !== false && app.permissions.client !== false && !interaction.guild.members.cache.get(ctx.client.user.id).permissions.has(app.permissions.client)) return await interaction.error_reply({ content: `I need ${ctx.case.formattedMap(app.permissions.client, { format: (value: PermissionsString) => `\`${ctx.case.permission(value)}\`` })} permission${(app.permissions.client).length === 1 ? `` : `s`}.` });

      if (await Restart.findOne({ status: true }) && !Data.Developers.some((developer: { id: string }) => developer.id === interaction.user.id)) return await interaction.error_reply({ content: `The system is rebooting. This may take several minutes.` });
      if (await Blacklist.findOne({ userId: interaction.user.id })) return await interaction.error_reply({ content: `You can't use apps because you found it on the blacklist.` });

      if (ctx.client.cooldowns.app.has(`${interaction.user.id}_${interaction.command.id}`)) return await interaction.error_reply({ content: `The app can be used again after ${ctx.client.cooldowns.app.get(`${interaction.user.id}_${interaction.command.id}`).toUnix('R')}.` });
      if (ctx.client.cooldowns.app.has(`${interaction.guild.id}_${interaction.user.id}_${interaction.command.id}`)) return await interaction.error_reply({ content: `The app can be used again after ${ctx.client.cooldowns.app.get(`${interaction.guild.id}_${interaction.user.id}_${interaction.command.id}`).toUnix('R')}.` });

      ctx.terminal.log({ content: `${ctx.terminal.color({ text: 'APP', hex: Color.Terminal.Yellow, bold: true })} ${ctx.terminal.color({ text: app.name, hex: Color.Terminal.Green })} by ${ctx.terminal.color({ text: `${interaction.user.tag} (${interaction.user.id})`, hex: Color.Terminal.Blue })}` });

      try {

        await app.execute({ ctx, interaction });

      } catch (error: any) {

        await interaction.reply({
          ephemeral: true,
          embeds: [
            new Embed({
              color: Color.Default,
              title: `Something went wrong...`,
              description: `The error has been reported to the developers.`,
            }),
          ],
        });

        await ctx.client.users.cache.get(Data.Developers[0].id).send({
          embeds: [
            new Embed({
              color: Color.Default,
              fields: [
                { name: `Exucator`, value: `${interaction.user} (\`${interaction.user.id}\`)`, inline: true },
                { name: `App`, value: `\`${app.name}\``, inline: true },
                { name: `Error`, value: `\`\`\`ts\n${error.length > 1000 ? `${error.slice(0, 1000)}...` : `${error}`}\n\`\`\``, inline: false },
              ],
            }),
          ],
        });
      };

      if (app.cooldown !== false && !Data.Developers.some((developer: { id: string }) => developer.id === interaction.user.id)) {

        if (app.cooldown.global) {

          ctx.client.cooldowns.app.set(`${interaction.user.id}_${interaction.command.id}`, Date.now() + ctx.case.time(app.cooldown.time));

          setTimeout(() => ctx.client.cooldowns.app.delete(`${interaction.user.id}_${interaction.command.id}`), ctx.case.time(app.cooldown.time))
        };
        
        if (!app.cooldown.global) {

          ctx.client.cooldowns.app.set(`${interaction.guild.id}_${interaction.user.id}_${interaction.command.id}`, Date.now() + ctx.case.time(app.cooldown.time));

          setTimeout(() => ctx.client.cooldowns.app.delete(`${interaction.guild.id}_${interaction.user.id}_${interaction.command.id}`), ctx.case.time(app.cooldown.time))
        };
      };
    };
  };
};