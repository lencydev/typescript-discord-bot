import { Command } from '@command';
import { Context } from '@context';

import { Color, Emoji } from '@config';

import {
  ChatInputCommandInteraction,
  Embed,
  GuildEmoji,
} from '@discord';

export default class extends Command {

  constructor() {
    super({
      name: 'emojis',
      description: 'Lists all the emojis on the server.',
      options: [
        {
          name: 'ephemeral',
          description: 'Ephemeral response.',
          type: 5,
          required: false,
        },
      ],

      cooldown: { time: '10s', global: false },
  
      developerOnly: false,
      ownerOnly: false,
      permissions: false,

      enabled: true,
    });
  };

  async execute ({ ctx, interaction }: { ctx: Context; interaction: ChatInputCommandInteraction; }): Promise<void> {

    let ephemeral: boolean = interaction.options.getBoolean('ephemeral');

    await ctx.menu.paginate(interaction, {
      ephemeral,
      pageSize: 10,
      sorts: [
        {
          emoji: Emoji.SelectMenu.Date.NewToOld,
          label: `Date of Added: New to Old`,
          sort: (first: GuildEmoji, last: GuildEmoji) => last.createdTimestamp - first.createdTimestamp,
        },
        {
          emoji: Emoji.SelectMenu.Date.OldToNew,
          label: `Date of Added: Old to New`,
          sort: (first: GuildEmoji, last: GuildEmoji) => first.createdTimestamp - last.createdTimestamp,
        },
      ],
      menus: async (sort: (first: GuildEmoji, last: GuildEmoji) => number) => [
        {
          emoji: `989909762844028989`,
          label: `Emojis (${ctx.case.number(interaction.guild.emojis.cache.filter((emoji: GuildEmoji) => emoji.available && !emoji.animated).size)})`,
          description: `Emojis available on the server.`,
          value: await Promise.all(interaction.guild.emojis.cache.filter((emoji: GuildEmoji) => emoji.available && !emoji.animated).sort(sort).map((emoji: GuildEmoji) => emoji).map((emoji: GuildEmoji, index: number) => `**${index +1}.** ${emoji} ${emoji.link(true)} (${(emoji.createdTimestamp).toUnix('R')})\n`)),
        },
        {
          emoji: `989909761510219816`,
          label: `Animated Emojis (${ctx.case.number(interaction.guild.emojis.cache.filter((emoji: GuildEmoji) => emoji.available && emoji.animated).size)})`,
          description: `Animated emojis available on the server.`,
          value: await Promise.all(interaction.guild.emojis.cache.filter((emoji: GuildEmoji) => emoji.available && emoji.animated).sort(sort).map((emoji: GuildEmoji) => emoji).map((emoji: GuildEmoji, index: number) => `**${index +1}.** ${emoji} ${emoji.link(true)} (${(emoji.createdTimestamp).toUnix('R')})\n`)),
        },
      ],
      embeds: (value: string[], first: number, last: number) => {
        return [
          new Embed({
            color: Color.Default,
            thumbnail: {
              url: interaction.guild.icon ? interaction.guild.iconURL({ forceStatic: false, size: 512, extension: `png` }) : `https://singlecolorimage.com/get/36393f/512x512`,
            },
            author: {
              name: 'undefined',
              icon_url: ctx.client.user.displayAvatarURL(),
            },
            description: value.slice(first, last).join(``),
          }),
        ];
      },
    });
  };
};