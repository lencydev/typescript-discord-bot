import Command from '../../../base/structures/command';
import Context from '../../../base/interfaces/context';

export default class extends Command {

  constructor() {
    super({
      name: 'unban',
      description: 'Unbans user from the server.',
      options: [
        {
          name: 'user',
          description: 'User tag or identity.',
          type: 'USER',
          required: true,
        },
      ],

      cooldown: { time: '5s', perGuild: true },
    
      category: 'moderation',
      usage: ['<user-id>'],
    
      ownerOnly: false,
      userPermissions: ['BAN_MEMBERS'],
      clientPermissions: ['ADMINISTRATOR'],
    
      enabled: true,
      developerOnly: false,
    });
  };

  async execute (ctx: Context) {

    let user = ctx.interaction.options.getUser('user');
  
    if (user.id == ctx.interaction.user.id) return ctx.reply.error({ content: `This process cannot be performed on you.` });
    if (user.id == ctx.client.user.id) return ctx.reply.error({ content: `This process cannot be performed on the bot.` });
    if (!await ctx.interaction.guild.bans.fetch().then((banneds) => banneds.find((banned) => banned.user.id == user.id))) return ctx.reply.error({ content: `The user is not already banned.` });
  
    await ctx.interaction.guild.members.unban(user);
  
    ctx.reply.success({
      content: [
        `\`${ctx.case.filter(user.tag)}\` has been unbanned from the server.`,
      ].join(`\n`),
    });
  };
};