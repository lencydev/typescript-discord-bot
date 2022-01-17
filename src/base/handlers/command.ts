import Client from '../client';

import Handler from '../structures/handler';
import Context from '../interfaces/context';

import { GuildMember, PermissionString, CommandInteraction, MessageEmbed } from 'discord.js';

export default class extends Handler {

  constructor() {
    super({
      name: 'interactionCreate',
      enabled: true,
    });
  };

  async execute (client: Client, interaction: CommandInteraction) {

    let ctx: Context = new Context(client, interaction);

    if (interaction.isCommand()) {

      let command = client.commands.get(interaction.commandName);

      if (command.developerOnly == true && !ctx.config.data.developers.includes(interaction.user.id)) {
        
        ctx.reply.error({ content: `The command can only be used by the developer.` });
        ctx.terminal.log({ content: `${ctx.terminal.color({ text: 'COMMAND', hex: ctx.config.terminal.color.yellow, bold: true })} ${ctx.terminal.color({ text: interaction.commandName, hex: ctx.config.terminal.color.red })} by ${ctx.terminal.color({ text: `${interaction.user.tag} (${interaction.user.id})`, hex: ctx.config.terminal.color.blue })}` });
        return;
      };

      if (command.ownerOnly == true && interaction.user.id !== interaction.guild.ownerId) {
        
        ctx.reply.error({ content: `The command can only be used by the server owner.` });
        ctx.terminal.log({ content: `${ctx.terminal.color({ text: 'COMMAND', hex: ctx.config.terminal.color.yellow, bold: true })} ${ctx.terminal.color({ text: interaction.commandName, hex: ctx.config.terminal.color.red })} by ${ctx.terminal.color({ text: `${interaction.user.tag} (${interaction.user.id})`, hex: ctx.config.terminal.color.blue })}` });
        return;
      };

      if (command.userPermissions !== false && !(interaction.member as GuildMember).permissions.has(command.userPermissions as PermissionString[])) {
        
        ctx.reply.error({ content: `You must have ${(command.userPermissions as PermissionString[]).map((value) => `\`${ctx.case.title(value.replaceAll(`_`, ` `))}\``)} permission to use the command.` });
        ctx.terminal.log({ content: `${ctx.terminal.color({ text: 'COMMAND', hex: ctx.config.terminal.color.yellow, bold: true })} ${ctx.terminal.color({ text: interaction.commandName, hex: ctx.config.terminal.color.red })} by ${ctx.terminal.color({ text: `${interaction.user.tag} (${interaction.user.id})`, hex: ctx.config.terminal.color.blue })}` });
        return;
      };
      
      if (command.clientPermissions !== false && !interaction.guild.me.permissions.has(command.clientPermissions as PermissionString[])) {
        
        ctx.reply.error({ content: `I need ${(command.clientPermissions as PermissionString[]).map((value) => `\`${ctx.case.title(value.replaceAll(`_`, ` `))}\``).join(' & ')} ${(command.clientPermissions as PermissionString[]).length == 1 ? `permission` : `permissions`}.` });
        ctx.terminal.log({ content: `${ctx.terminal.color({ text: 'COMMAND', hex: ctx.config.terminal.color.yellow, bold: true })} ${ctx.terminal.color({ text: interaction.commandName, hex: ctx.config.terminal.color.red })} by ${ctx.terminal.color({ text: `${interaction.user.tag} (${interaction.user.id})`, hex: ctx.config.terminal.color.blue })}` });
        return;
      };

      if (await ctx.schema.restart.findOne({ status: true }) && !ctx.config.data.developers.includes(interaction.user.id)) {
        
        ctx.reply.error({ content: `The system is rebooting. This may take several minutes.` });
        ctx.terminal.log({ content: `${ctx.terminal.color({ text: 'COMMAND', hex: ctx.config.terminal.color.yellow, bold: true })} ${ctx.terminal.color({ text: interaction.commandName, hex: ctx.config.terminal.color.red })} by ${ctx.terminal.color({ text: `${interaction.user.tag} (${interaction.user.id})`, hex: ctx.config.terminal.color.blue })}` });
        return;
      };

      if (await ctx.schema.blacklist.findOne({ user: interaction.user.id })) {
        
        ctx.reply.error({ content: `You can't use commands because you found it on the blacklist.` });
        ctx.terminal.log({ content: `${ctx.terminal.color({ text: 'COMMAND', hex: ctx.config.terminal.color.yellow, bold: true })} ${ctx.terminal.color({ text: interaction.commandName, hex: ctx.config.terminal.color.red })} by ${ctx.terminal.color({ text: `${interaction.user.tag} (${interaction.user.id})`, hex: ctx.config.terminal.color.blue })}` });
        return;
      };

      if (client.cooldowns.has(`${interaction.user.id}_${interaction.commandName}`)) {
        
        ctx.reply.error({ content: `The command can be used again after ${ctx.case.timeformat((client.cooldowns.get(`${interaction.user.id}_${interaction.commandName}`) as number) - Date.now(), { long: true })}.` });
        ctx.terminal.log({ content: `${ctx.terminal.color({ text: 'COMMAND', hex: ctx.config.terminal.color.yellow, bold: true })} ${ctx.terminal.color({ text: interaction.commandName, hex: ctx.config.terminal.color.red })} by ${ctx.terminal.color({ text: `${interaction.user.tag} (${interaction.user.id})`, hex: ctx.config.terminal.color.blue })}` });
        return;
      };

      if (client.cooldowns.has(`${interaction.guild.id}_${interaction.user.id}_${interaction.commandName}`)) {
        
        ctx.reply.error({ content: `The command can be used again after ${ctx.case.timeformat((client.cooldowns.get(`${interaction.guild.id}_${interaction.user.id}_${interaction.commandName}`) as number) - Date.now(), { long: true })}.` });
        ctx.terminal.log({ content: `${ctx.terminal.color({ text: 'COMMAND', hex: ctx.config.terminal.color.yellow, bold: true })} ${ctx.terminal.color({ text: interaction.commandName, hex: ctx.config.terminal.color.red })} by ${ctx.terminal.color({ text: `${interaction.user.tag} (${interaction.user.id})`, hex: ctx.config.terminal.color.blue })}` });
        return;
      };

      ctx.terminal.log({ content: `${ctx.terminal.color({ text: 'COMMAND', hex: ctx.config.terminal.color.yellow, bold: true })} ${ctx.terminal.color({ text: interaction.commandName, hex: ctx.config.terminal.color.green })} by ${ctx.terminal.color({ text: `${interaction.user.tag} (${interaction.user.id})`, hex: ctx.config.terminal.color.blue })}` });

      try {

        command.execute(ctx);

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

      if (command.cooldown !== false && !ctx.config.data.developers.includes(interaction.user.id)) {

        if (command.cooldown.perGuild == false) {

          client.cooldowns.set(`${interaction.user.id}_${interaction.commandName}`, Date.now() + ctx.case.time(command.cooldown.time));

          setTimeout(async () => {

            client.cooldowns.delete(`${interaction.user.id}_${interaction.commandName}`);
  
          }, ctx.case.time(command.cooldown.time));

        } else if (command.cooldown.perGuild == true) {

          client.cooldowns.set(`${interaction.guild.id}_${interaction.user.id}_${interaction.commandName}`, Date.now() + ctx.case.time(command.cooldown.time));

          setTimeout(async () => {

            client.cooldowns.delete(`${interaction.guild.id}_${interaction.user.id}_${interaction.commandName}`);
  
          }, ctx.case.time(command.cooldown.time));
        };
      };
    };
  };
};