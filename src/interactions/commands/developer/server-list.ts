import Command from '../../../base/structures/command';
import Context from '../../../base/interfaces/context';

import { MessageEmbed } from 'discord.js';

export default class extends Command {

  constructor() {
    super({
      name: 'server-list',
      description: 'Lists all servers where the bot is located.',
      options: [
        {
          name: 'type',
          description: 'Priority type.',
          type: 3,
          required: false,
          choices: [
            { name: 'Added', value: 'added' },
            { name: 'Members', value: 'members' },
          ],
        },
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

      cooldown: false,

      category: 'developer',
      usage: ['[type] [ephemeral]'],

      ownerOnly: false,
      userPermissions: false,
      clientPermissions: false,

      enabled: true,
      developerOnly: true,
    });
  };

  async execute (ctx: Context) {

    let type = ctx.interaction.options.getString('type');
    let ephemeral = ctx.interaction.options.getString('ephemeral');

    ctx.menu.list({
      ephemeral: !ephemeral || ephemeral == 'true' ? true : false,
      perPageData: 5,
      fastSkip: true,
      value: ctx.client.guilds.cache.size,
      array: ctx.client.guilds.cache.sort(!type || type == 'added' ? (first: any, last: any) => last.joinedAt - first.joinedAt : (first, last) => last.memberCount - first.memberCount).map((value) => value).map((value) => value).map((guild, row) => `\`${row +1}.\` ${guild.vanityURLCode ? `[**${ctx.case.filter(guild.name)}**](https://discord.gg/${guild.vanityURLCode} 'https://discord.gg/${guild.vanityURLCode}')` : `**${ctx.case.filter(guild.name)}**`} (\`${guild.id}\`)\n\`•\` Owner: \`${ctx.case.filter(ctx.client.users.cache.get(guild.ownerId).tag)}\` (\`${guild.ownerId}\`)\n\`•\` Members: \`${ctx.case.number(guild.memberCount)}\`\n\`•\` Added: <t:${ctx.case.timestamp(guild.joinedAt)}:R>\n`),
      embed: new MessageEmbed({
        color: ctx.config.color.default,
        author: {
          name: `${ctx.embed.title(this.name)} - Priority Type: ${!type || type == 'added' ? `Added` : `Members`}`,
          iconURL: ctx.embed.clientAvatar(),
        },
      }),
    });
  };
};
