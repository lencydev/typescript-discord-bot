import { Command } from '@command';
import { Context } from '@context';

import { Color, Emoji } from '@config';

import {
  ChatInputCommandInteraction,
  Embed,
  UserFlagsBitField,
  UserFlagsString,
  GuildMember,
  parseEmoji,
} from '@discord';

type BadgeData = { id: UserFlagsString; length: number; };

export default class extends Command {

  constructor() {
    super({
      name: 'badges',
      description: 'Lists the total badge information of the members on the server.',
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

    let Staff: GuildMember[] = [];
    let Partner: GuildMember[] = [];
    let CertifiedModerator: GuildMember[] = [];
    let Hypesquad: GuildMember[] = [];
  
    let HypeSquadOnlineHouse1: GuildMember[] = [];
    let HypeSquadOnlineHouse2: GuildMember[] = [];
    let HypeSquadOnlineHouse3: GuildMember[] = [];
  
    let BugHunterLevel1: GuildMember[] = [];
    let BugHunterLevel2: GuildMember[] = [];
  
    let VerifiedDeveloper: GuildMember[] = [];
    let PremiumEarlySupporter: GuildMember[] = [];

    await Promise.all(interaction.guild.members.cache.map(async (member: GuildMember) => {

      let flags: UserFlagsBitField = member.user.flags;

      if (flags?.has(`Staff`)) Staff.push(member);
      if (flags?.has(`Partner`)) Partner.push(member);
      if (flags?.has(`CertifiedModerator`)) CertifiedModerator.push(member);
      if (flags?.has(`Hypesquad`)) Hypesquad.push(member);

      if (flags?.has(`HypeSquadOnlineHouse1`)) HypeSquadOnlineHouse1.push(member);
      if (flags?.has(`HypeSquadOnlineHouse2`)) HypeSquadOnlineHouse2.push(member);
      if (flags?.has(`HypeSquadOnlineHouse3`)) HypeSquadOnlineHouse3.push(member);

      if (flags?.has(`BugHunterLevel1`)) BugHunterLevel1.push(member);
      if (flags?.has(`BugHunterLevel2`)) BugHunterLevel2.push(member);

      if (flags?.has(`VerifiedDeveloper`)) VerifiedDeveloper.push(member);
      if (flags?.has(`PremiumEarlySupporter`)) PremiumEarlySupporter.push(member);
    }));

    let badges: Array<BadgeData> = [
      { id: 'Staff', length: Staff.length },
      { id: 'Partner', length: Partner.length },
      { id: 'CertifiedModerator', length: CertifiedModerator.length },
      { id: 'Hypesquad', length: Hypesquad.length },
      { id: 'HypeSquadOnlineHouse1', length: HypeSquadOnlineHouse1.length },
      { id: 'HypeSquadOnlineHouse2', length: HypeSquadOnlineHouse2.length },
      { id: 'HypeSquadOnlineHouse3', length: HypeSquadOnlineHouse3.length },
      { id: 'BugHunterLevel1', length: BugHunterLevel1.length },
      { id: 'BugHunterLevel2', length: BugHunterLevel2.length },
      { id: 'VerifiedDeveloper', length: VerifiedDeveloper.length },
      { id: 'PremiumEarlySupporter', length: PremiumEarlySupporter.length },
    ];

    await ctx.menu.paginate(interaction, {
      ephemeral,
      pageSize: 10,
      sorts: [
        {
          emoji: Emoji.SelectMenu.Date.NewToOld,
          label: `Date of Join: New to Old`,
          sort: (first: GuildMember, last: GuildMember) => last.joinedTimestamp - first.joinedTimestamp,
        },
        {
          emoji: Emoji.SelectMenu.Date.OldToNew,
          label: `Date of Join: Old to New`,
          sort: (first: GuildMember, last: GuildMember) => first.joinedTimestamp - last.joinedTimestamp,
        },
      ],
      menus: async (sort: (first: GuildMember, last: GuildMember) => number) => [
        {
          label: `Badges`,
          value: [
            new Embed({
              color: Color.Default,
              thumbnail: {
                url: interaction.guild.icon ? interaction.guild.iconURL({ forceStatic: false, size: 512, extension: `png` }) : `https://singlecolorimage.com/get/36393f/512x512`,
              },
              author: {
                name: `Badges`,
                icon_url: ctx.client.user.displayAvatarURL(),
              },
              description: (await Promise.all(badges.map((badge: BadgeData) => `${ctx.case.badge(badge.id, { icon: true })} ${ctx.case.badge(badge.id)}: \`${ctx.case.number(badge.length)}\``))).join(`\n`),
            }),
          ],
        },
        ...await Promise.all(badges.map((badge: BadgeData) => {
          return {
            emoji: parseEmoji(ctx.case.badge(badge.id, { icon: true })).id,
            label: `${ctx.case.badge(badge.id)} (${ctx.case.number(badge.length)})`,
            value: interaction.guild.members.cache.filter((member: GuildMember) => member.user.flags.has(badge.id)).sort(sort).map((member: GuildMember) => member).map((member: GuildMember, index: number) => `**${index +1}.** ${member} ${member.user.badges()} (${(member.joinedTimestamp).toUnix('R')})\n`),
          };
        })),
      ],
      embeds: (value: string[], first: number, last: number) => {
        return [
          new Embed({
            color: Color.Default,
            thumbnail: {
              url: interaction.guild.icon ? interaction.guild.iconURL({ forceStatic: false, size: 512, extension: `png` }) : `https://singlecolorimage.com/get/36393f/512x512`,
            },
            author: {
              name: `Badges`,
              icon_url: ctx.client.user.displayAvatarURL(),
            },
            description: value.slice(first, last).join(``),
          }),
        ];
      },
    });
  };
};