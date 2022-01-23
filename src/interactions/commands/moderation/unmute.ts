import Command from '../../../base/structures/command';
import Context from '../../../base/interfaces/context';

import { GuildMemberRoleManager } from 'discord.js';

export default class extends Command {

  constructor() {
    super({
      name: 'unmute',
      description: 'Unmutes the muted member.',
      options: [
        {
          name: 'member',
          description: 'Member tag or identity.',
          type: 'USER',
          required: true,
        },
      ],

      cooldown: { time: '5s', perGuild: true },
    
      category: 'moderation',
      usage: ['<member>'],
    
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
  
    if (!member) return ctx.reply.error({ content: `This command can only be used on members.` });
    if (user.id == ctx.interaction.user.id) return ctx.reply.error({ content: `This process cannot be performed on you.` });
    if (user.id == ctx.client.user.id) return ctx.reply.error({ content: `This process cannot be performed on the bot.` });
    if (!member.isCommunicationDisabled()) return ctx.reply.error({ content: `The user is not already muted.` });
    if (member.roles.highest.position >= (ctx.interaction.member.roles as GuildMemberRoleManager).highest.position) return ctx.reply.error({ content: `You cannot access the user to be processed.` });
    if (member.roles.highest.position >= ctx.interaction.guild.me.roles.highest.position) return ctx.reply.error({ content: `The user to be process cannot be accessed.` });
  
    await member.timeout(null);
  
    ctx.reply.success({
      content: [
        `${user} has been unmuted on the server.`,
      ].join(`\n`),
    });
  };
};
