import Command from '../../../base/structures/command';
import Context from '../../../base/interfaces/context';

import { MessageEmbed } from 'discord.js';

export default class extends Command {

  constructor() {
    super({
      name: 'black-list',
      options: [
        {
          name: 'data',
          description: 'Lists the users in the blacklist.',
          type: 1,
          options: [
            {
              name: 'ephemeral',
              description: 'Ephemeral response.',
              type: 3,
              required: false,
              choices: [
                { name: 'true', value: 'true' },
                { name: 'false', value: 'false' },
              ],
            },
          ],
        },
        {
          name: 'add',
          description: 'Adds the user to the blacklist.',
          type: 1,
          options: [
            {
              name: 'user',
              description: 'User tag or identity.',
              type: 6,
              required: true,
            },
            {
              name: 'reason',
              description: 'Reason for action.',
              type: 3,
              required: false,
            },
          ],
        },
        {
          name: 'remove',
          description: 'Removes the user from the blacklist.',
          type: 1,
          options: [
            {
              name: 'user',
              description: 'User tag or identity.',
              type: 6,
              required: true,
            },
          ],
        },
      ],

      cooldown: false,

      category: 'developer',
      usage: ['data [ephemeral]', 'add <user> [reason]', 'remove <user>'],

      ownerOnly: false,
      userPermissions: false,
      clientPermissions: false,

      enabled: true,
      developerOnly: true,
    });
  };

  async execute (ctx: Context) {

    if (ctx.interaction.options.getSubcommand() == 'data') {

      let ephemeral = ctx.interaction.options.getString('ephemeral');

      let data = await ctx.schema.blacklist.find();
      let dataArray: any[] = [];

      await Promise.all(data.sort((first, last) => last.date - first.date).map(async (value) => {
  
        await ctx.client.users.fetch(value.user).then((user) => {
          
          dataArray.push(`**${ctx.case.filter(user.tag)}** (\`${value.user}\`)\n\`•\` Reason \`${value.reason}\`\n\`•\` Added: <t:${ctx.case.timestamp(value.date)}:R>`);
        });
      }));

      ctx.menu.list({
        ephemeral: !ephemeral || ephemeral == 'true' ? true : false,
        value: data.length,
        array: dataArray.map((value, row) => `\`${row +1}.\` ${value}\n`),
        embed: new MessageEmbed({
          color: ctx.config.color.default,
          author: {
            name: `${ctx.embed.title(this.name)}`,
            iconURL: ctx.embed.clientAvatar(),
          },
        }),
      });

    } else if (ctx.interaction.options.getSubcommand() == 'add') {

      let user = ctx.interaction.options.getUser('user');
      let reason = ctx.interaction.options.getString('reason');

      if (user.id == ctx.interaction.user.id) return ctx.reply.error({ content: `This process cannot be performed on you.` });
      if (user.id == ctx.client.user.id) return ctx.reply.error({ content: `This process cannot be performed on the bot.` });
      if (reason && reason.length > 100) return ctx.reply.error({ content: `Reason length cannot exceed \`100\` characters.` });
      if (await ctx.schema.blacklist.findOne({ user: user.id })) return ctx.reply.error({ content: `The user is already blacklisted.` });

      await new ctx.schema.blacklist({ user: user.id, reason: reason ? ctx.case.filter(reason) : `None`, date: new Date() }).save();

      ctx.reply.success({
        ephemeral: true,
        content: [
          `${reason ? `\`${ctx.case.filter(user.tag)}\` has been added to the blacklist due to \`${ctx.case.filter(reason)}\`.` : `\`${ctx.case.filter(user.tag)}\` has been added to the blacklist.`}`,
        ].join(`\n`),
      });

    } else if (ctx.interaction.options.getSubcommand() == 'remove') {

      let user = ctx.interaction.options.getUser('user');

      if (!await ctx.schema.blacklist.findOne({ user: user.id })) return ctx.reply.error({ content: `The user is not already blacklisted.` });

      await ctx.schema.blacklist.deleteOne({ user: user.id });

      ctx.reply.success({
        ephemeral: true,
        content: [
          `\`${ctx.case.filter(user.tag)}\` has been removed from the blacklist.`,
        ].join(`\n`),
      });
    };
  };
};