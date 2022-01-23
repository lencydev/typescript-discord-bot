import Command from '../../../base/structures/command';
import Context from '../../../base/interfaces/context';

import { GuildMember, GuildMemberRoleManager } from 'discord.js';

export default class extends Command {

  constructor() {
    super({
      name: 'mute',
      description: 'Mutes member from the server.',
      options: [
        {
          name: 'member',
          description: 'Member tag or identity.',
          type: 'USER',
          required: true,
        },
        {
          name: 'time',
          description: 'Mute time length.',
          type: 'STRING',
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
      usage: ['<member> <time> [reason]'],
    
      ownerOnly: false,
      userPermissions: ['MANAGE_MESSAGES'],
      clientPermissions: ['ADMINISTRATOR'],
    
      enabled: true,
      developerOnly: false,
    });
  };

  async execute (ctx: Context) {

    let user = ctx.interaction.options.getUser('member');
    let member = ctx.interaction.guild.members.cache.get(user.id);
    let time = ctx.interaction.options.getString('time');
    let reason = ctx.interaction.options.getString('reason');

    if (!member) return ctx.reply.error({ content: `The command can only be used on members.` });
    if (user.id == ctx.interaction.user.id) return ctx.reply.error({ content: `This process cannot be performed on you.` });
    if (user.id == ctx.client.user.id) return ctx.reply.error({ content: `This process cannot be performed on the bot.` });
    if (reason && reason.length > 100) return ctx.reply.error({ content: `Reason length cannot exceed \`100\` characters.` });
    if (member.isCommunicationDisabled()) return ctx.reply.error({ content: `The user is already muted.` });
    if ((member as GuildMember).roles.highest.position >= (ctx.interaction.member.roles as GuildMemberRoleManager).highest.position) return ctx.reply.error({ content: `You cannot access the user to be processed.` });
    if ((member as GuildMember).roles.highest.position >= ctx.interaction.guild.me.roles.highest.position) return ctx.reply.error({ content: `The user to be process cannot be accessed.` });

    if (time) {

      if (!ctx.case.time(time)) return ctx.reply.error({ content: `Time value does not conform to the format.` });
      if (ctx.case.time(time) < ctx.case.time('10s')) return ctx.reply.error({ content: `Time cannot be less than \`10\` seconds.` });
      if (ctx.case.time(time) > ctx.case.time('28d')) return ctx.reply.error({ content: `Time cannot exceed \`28\` days.` });

      await (member as GuildMember).timeout(ctx.case.time(time), reason);
    
      ctx.reply.success({
        content: [
          `${reason ? `${user} has been muted on the server for ${ctx.case.timeformat(ctx.case.time(time), { long: true })} due to \`${ctx.case.filter(reason)}\`.` : `${user} has been muted on the server for ${ctx.case.timeformat(ctx.case.time(time), { long: true })}.` }`,
        ].join(`\n`),
      });

    } else if (!time) {

      ctx.reply.success({
        content: [
          `${reason ? `${user} has been muted on the server due to \`${ctx.case.filter(reason)}\`.` : `${user} has been muted on the server.` }`,
        ].join(`\n`),
      });
    };
  };
};