import Client from '../../base/client';

import Event from '../../base/structures/event';
import Context from '../../base/interfaces/context';

import { Message, MessageActionRow, MessageButton } from 'discord.js';

export default class extends Event {

  constructor() {
    super({
      name: 'messageCreate',
      enabled: true,
    });
  };

  async execute (client: Client, message: Message) {

    let ctx: Context = new Context(client);

    if (message.channel.type == 'DM') return;
    if (message.content == `<@${client.user.id}>` || message.content == `<@!${client.user.id}>`) {

      message.reply({
        content: `${ctx.case.emoji(ctx.config.emoji.info)} If the slash commands are not visible, re-add the bot from the button below.`,
        components: [
          new MessageActionRow({
            components: [
              new MessageButton({ style: `LINK`, label: `Click to Add`, url: client.generateInvite({ scopes: ['bot', 'applications.commands'], permissions: ['ADMINISTRATOR'] }), disabled: false }),
            ],
          }),
        ],
      });
    };
  };
};