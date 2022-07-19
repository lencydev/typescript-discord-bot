import { Context } from '@context';

import { Color, Emoji } from '@config';

import {
  CommandInteraction,
  SelectMenuInteraction,
  ButtonInteraction,
  ModalSubmitInteraction,
  Embed,
  User,
  UserFlagsString,
  Guild,
  GuildEmoji,
  Collection,
  Invite,
} from '@discord';

export default async function (ctx: Context): Promise<void> {

  Date.prototype.toUnix = function (type?: 't' | 'T' | 'd' | 'D' | 'f' | 'F' | 'R'): string {

    return `<t:${Math.floor(new Date(this).getTime() / 1000)}:${type || 'F'}>`;
  };

  Number.prototype.toUnix = function (type?: 't' | 'T' | 'd' | 'D' | 'f' | 'F' | 'R'): string {

    return `<t:${Math.floor(new Date(this as number).getTime() / 1000)}:${type || 'F'}>`;
  };

  let interactions = [
    CommandInteraction,
    SelectMenuInteraction,
    ButtonInteraction,
    ModalSubmitInteraction,
  ];

  await Promise.all(interactions.map((interaction) => {

    interaction.prototype.success_reply = async function ({ ephemeral, content, timeout }: { ephemeral?: boolean, content: string | string[], timeout?: number }): Promise<void> {

      let options: { ephemeral: boolean; embeds: Embed[]; } = {
        ephemeral: timeout ? false : ephemeral,
        embeds: [
          new Embed({
            color: Color.Success,
            author: {
              icon_url: ctx.client.emojis.cache.get(Emoji.Success).url,
              name: `Success`,
            },
            description: content instanceof Array ? content.join(`\n`) : content,
          }),
        ],
      };

      if (this.deferred) {

        await this.followUp(options).then(() => timeout ? setTimeout(async () => await this.deleteReply().catch(() => undefined), timeout) : undefined);
      
      } else {

        await this.reply(options).then(() => timeout ? setTimeout(async () => await this.deleteReply().catch(() => undefined), timeout) : undefined);
      };
    };

    interaction.prototype.error_reply = async function ({ content }: { content: string | string[] }): Promise<void> {

      let options: { ephemeral: boolean; embeds: Embed[]; } = {
        ephemeral: true,
        embeds: [
          new Embed({
            color: Color.Error,
            author: {
              icon_url: ctx.client.emojis.cache.get(Emoji.Error).url,
              name: `Error`,
            },
            description: content instanceof Array ? content.join(`\n`) : content,
          }),
        ],
      };

      if (this.deferred) {

        await this.followUp(options);

      } else {

        await this.reply(options);
      };
    };
  }));

  User.prototype.badges = function (): string {

    let badges: UserFlagsString[] = [];
    
    if (this.flags?.toArray().length > 0) {

      if (this.flags.has(`Staff`)) badges.push(ctx.case.badge('Staff', { icon: true }));
      if (this.flags.has(`Partner`)) badges.push(ctx.case.badge('Partner', { icon: true }));
      if (this.flags.has(`CertifiedModerator`)) badges.push(ctx.case.badge('CertifiedModerator', { icon: true }));
      if (this.flags.has(`Hypesquad`)) badges.push(ctx.case.badge('Hypesquad', { icon: true }));

      if (this.flags.has(`HypeSquadOnlineHouse1`)) badges.push(ctx.case.badge('HypeSquadOnlineHouse1', { icon: true }));
      if (this.flags.has(`HypeSquadOnlineHouse2`)) badges.push(ctx.case.badge('HypeSquadOnlineHouse2', { icon: true }));
      if (this.flags.has(`HypeSquadOnlineHouse3`)) badges.push(ctx.case.badge('HypeSquadOnlineHouse3', { icon: true }));

      if (this.flags.has(`BugHunterLevel1`)) badges.push(ctx.case.badge('BugHunterLevel1', { icon: true }));
      if (this.flags.has(`BugHunterLevel2`)) badges.push(ctx.case.badge('BugHunterLevel2', { icon: true }));

      if (this.flags.has(`VerifiedDeveloper`)) badges.push(ctx.case.badge('VerifiedDeveloper', { icon: true }));
      if (this.flags.has(`PremiumEarlySupporter`)) badges.push(ctx.case.badge('PremiumEarlySupporter', { icon: true }));
    };

    return badges.length > 0 ? badges.join(``) : `None`;
  };

  User.prototype.link = function (block?: boolean): string {

    return `[${block ? `\`${ctx.case.filter(this.tag)}\`` : ctx.case.filter(this.tag)}](<https://discord.com/users/${this.id}> '${ctx.case.filter(this.tag)} (${this.id})')`;
  };

  Guild.prototype.link = function (bold?: boolean): string {

    let guildName: string = bold ? `**${ctx.case.filter(this.name.length > 20 ? `${this.name.slice(0, 20)}...` : this.name)}**` : ctx.case.filter(this.name);
    
    return this.vanityURLCode ? `[${guildName}](https://discord.gg/${this.vanityURLCode} 'discord.gg/${this.vanityURLCode}')` : guildName;
  };

  GuildEmoji.prototype.link = function (block?: boolean): string {

    return `[${block ? `\`${this.name}\`` : this.name}](${this.url} 'Click it and view the "${this.name}" emoji in the browser.')`;
  };
};
