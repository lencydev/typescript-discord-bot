import { Command } from '@command';
import { Context } from '@context';

import { Color, Data, Emoji } from '@config';
import { Blacklist } from '@schemas';

import {
  ChatInputCommandInteraction,
  User,
  Embed,
} from '@discord';

type BlacklistData = { userId: string; addedTimestamp: Date; reason: string; value: string; };

export default class extends Command {

  constructor() {
    super({
      name: 'blacklist',
      options: [
        {
          name: 'list',
          description: 'Lists the users in the blacklist.',
          type: 1,
          options: [
            {
              name: 'ephemeral',
              description: 'Ephemeral response.',
              type: 5,
              required: false,
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
              description: 'Reason for process.',
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
  
      developerOnly: true,
      ownerOnly: false,
      permissions: false,

      enabled: true,
    });
  };

  async execute ({ ctx, interaction }: { ctx: Context; interaction: ChatInputCommandInteraction; }): Promise<void> {

    if (interaction.options.getSubcommand(false) === 'list') {

      let ephemeral: boolean = interaction.options.getBoolean('ephemeral');

      let blacklist: BlacklistSchema[] = await Blacklist.find();
      let blacklistArray: Array<BlacklistData> = [];

      await Promise.all(blacklist.map(async (data: BlacklistSchema) => {

        let user: User;

        await ctx.client.users.fetch(data.userId).then((fetch: User) => user = fetch).catch(() => undefined);

        if (!user) return await Blacklist.deleteOne({ userId: data.userId });
          
        blacklistArray.push({ userId: user.id, addedTimestamp: data.addedTimestamp, reason: data.reason, value: `${user.link(true)} (${(data.addedTimestamp).toUnix('R')}) ${data.reason ? `[**?**](https://discord.com '${ctx.case.filter(data.reason)}')` : ``}` });
      }));

      await ctx.menu.paginate(interaction, {
        ephemeral,
        pageSize: 10,
        sorts: [
          {
            emoji: Emoji.SelectMenu.Ban.NewToOld,
            label: `Date of Blacklisted: New to Old`,
            sort: (first: BlacklistData, last: BlacklistData) => last.addedTimestamp.getTime() - first.addedTimestamp.getTime(),
          },
          {
            emoji: Emoji.SelectMenu.Ban.OldToNew,
            label: `Date of Blacklisted: Old to New`,
            sort: (first: BlacklistData, last: BlacklistData) => first.addedTimestamp.getTime() - last.addedTimestamp.getTime(),
          },
        ],
        menus: async (sort: (first: BlacklistData, last: BlacklistData) => number) => [
          {
            value: blacklistArray.sort(sort).map((data: BlacklistData, index: number) => `**${index +1}.** ${data.value}`),
          }
        ],
        embeds: (value: string[], first: number, last: number) => {
          return [
            new Embed({
              color: Color.Default,
              author: {
                name: `Blacklist`,
                icon_url: ctx.client.user.displayAvatarURL(),
              },
              description: value.slice(first, last).join(`\n`),
            }),
          ];
        },
      });
    };

    if (interaction.options.getSubcommand(false) === 'add') {

      let user: User = interaction.options.getUser('user');
      let reason: string = interaction.options.getString('reason');

      let data: BlacklistSchema = await Blacklist.findOne({ userId: user.id });

      if (user.id === interaction.user.id) return await interaction.error_reply({ content: `This process cannot be performed on you.` });
      if (user.id === ctx.client.user.id) return await interaction.error_reply({ content: `This process cannot be performed on the bot.` });
      if (Data.Developers.some((developer: { id: string }) => developer.id === user.id)) return await interaction.error_reply({ content: `This process cannot be performed on the developer.` });
      if (reason && reason.length > 100) return await interaction.error_reply({ content: `Reason length cannot exceed \`100\` characters.` });
      if (data) return await interaction.error_reply({ content: `The user is already blacklisted.` });

      await new Blacklist({ userId: user.id, reason: reason ? ctx.case.filter(reason) : ``, addedTimestamp: new Date() }).save();

      await interaction.success_reply({
        ephemeral: true,
        content: `${reason ? `${user.link(true)} has been added to the blacklist due to \`${ctx.case.filter(reason)}\`.` : `${user.link(true)} has been added to the blacklist.`}`,
      });
    };
    
    if (interaction.options.getSubcommand(false) === 'remove') {

      let user: User = interaction.options.getUser('user');

      let data: BlacklistSchema = await Blacklist.findOne({ userId: user.id });

      if (!data) return await interaction.error_reply({ content: `The user is not already blacklisted.` });

      await Blacklist.deleteOne({ userId: user.id });

      await interaction.success_reply({
        ephemeral: true,
        content: `${user.link(true)} has been removed from the blacklist.`,
      });
    };
  };
};