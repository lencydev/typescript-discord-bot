import Command from '../../../base/structures/command';
import Context from '../../../base/interfaces/context';

import { GuildMemberRoleManager } from 'discord.js';

export default class extends Command {

  constructor() {
    super({
      name: 'kick',
      description: 'Kicks member from the server.',
      options: [
        {
          name: 'member',
          description: 'Member tag or identity.',
          type: 'USER',
          required: true,
        },
        {
          name: 'reason',
          description: 'Reason for process.',
          type: 'STRING',
          required: false,
        },
      ],

      cooldown: { time: '5s', perGuild: true },
    
      category: 'moderation',
      usage: ['<user> [reason]'],
    
      ownerOnly: false,
      userPermissions: ['KICK_MEMBERS'],
      clientPermissions: ['ADMINISTRATOR'],
    
      enabled: true,
      developerOnly: false,
    });
  };

  async execute (ctx: Context) {

    let user = ctx.interaction.options.getUser('member');
    let member = ctx.interaction.guild.members.cache.get(user.id);
    let reason = ctx.interaction.options.getString('reason');
  
    if (!member) return ctx.reply.error({ content: `The command can only be used on members.` });
    if (user.id == ctx.interaction.user.id) return ctx.reply.error({ content: `This process cannot be performed on you.` });
    if (user.id == ctx.client.user.id) return ctx.reply.error({ content: `This process cannot be performed on the bot.` });
    if (reason && reason.length > 100) return ctx.reply.error({ content: `Reason length cannot exceed \`100\` characters.` });
    if (member && member.roles.highest.position >= (ctx.interaction.member.roles as GuildMemberRoleManager).highest.position) return ctx.reply.error({ content: `You cannot access the user to be processed.` });
    if (member && member.roles.highest.position >= ctx.interaction.guild.me.roles.highest.position) return ctx.reply.error({ content: `The user to be process cannot be accessed.` });
  
    await ctx.interaction.guild.members.kick(member);
  
    ctx.reply.success({
      content: [
        `${reason ? `\`${ctx.case.filter(user.tag)}\` has been kicked from the server due to \`${ctx.case.filter(reason)}\`.` : `\`${ctx.case.filter(user.tag)}\` has been kicked from the server.`}`,
      ].join(`\n`),
    });
  };
};