import Command from '../../../base/structures/command';
import Context from '../../../base/interfaces/context';

import { GuildMemberRoleManager } from 'discord.js';

export default class extends Command {

  constructor() {
    super({
      name: 'ban',
      description: 'Bans user from the server.',
      options: [
        {
          name: 'user',
          description: 'User tag or identity.',
          type: 'USER',
          required: true,
        },
        {
          name: 'purge-messages',
          description: 'Delete message history.',
          type: 'NUMBER',
          required: false,
          choices: [
            { name: 'Don\'t Delete Anything', value: 0 },
            { name: 'Previous 24 Hours', value: 1 },
            { name: 'Previous 2 Days', value: 2 },
            { name: 'Previous 3 Days', value: 3 },
            { name: 'Previous 4 Days', value: 4 },
            { name: 'Previous 5 Days', value: 5 },
            { name: 'Previous 6 Days', value: 6 },
            { name: 'Previous 7 Days', value: 7 },
          ],
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
      usage: ['<user> [purge-messages] [reason]'],
    
      ownerOnly: false,
      userPermissions: ['BAN_MEMBERS'],
      clientPermissions: ['ADMINISTRATOR'],
    
      enabled: true,
      developerOnly: false,
    });
  };

  async execute (ctx: Context) {

    let user = ctx.interaction.options.getUser('user');
    let member = ctx.interaction.guild.members.cache.get(user.id);
    let purgeMessages = ctx.interaction.options.getNumber('purge-messages');
    let reason = ctx.interaction.options.getString('reason');
  
    if (user.id == ctx.interaction.user.id) return ctx.reply.error({ content: `This process cannot be performed on you.` });
    if (user.id == ctx.client.user.id) return ctx.reply.error({ content: `This process cannot be performed on the bot.` });
    if (reason && reason.length > 100) return ctx.reply.error({ content: `Reason length cannot exceed \`100\` characters.` });
    if (await ctx.interaction.guild.bans.fetch().then((banneds) => banneds.find((banned) => banned.user.id == user.id))) return ctx.reply.error({ content: `The user is already banned.` });
    if (member && member.roles.highest.position >= (ctx.interaction.member.roles as GuildMemberRoleManager).highest.position) return ctx.reply.error({ content: `You cannot access the user to be processed.` });
    if (member && member.roles.highest.position >= ctx.interaction.guild.me.roles.highest.position) return ctx.reply.error({ content: `The user to be process cannot be accessed.` });
  
    await ctx.interaction.guild.members.ban(user, { days: purgeMessages ? purgeMessages : 0, reason: ctx.case.filter(reason || 'None') });
  
    ctx.reply.success({
      content: [
        `${reason ? `\`${ctx.case.filter(user.tag)}\` has been banned from the server due to \`${ctx.case.filter(reason)}\`.` : `\`${ctx.case.filter(user.tag)}\` has been banned from the server.`}`,
      ].join(`\n`),
    });
  };
};