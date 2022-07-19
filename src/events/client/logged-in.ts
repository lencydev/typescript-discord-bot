import { Event } from '@event';
import { Context } from '@context';

import { Color } from '@config';
import { Restart } from '@schemas';

export default class extends Event {

  constructor() {
    super({
      type: 'ready',
      enabled: true,
    });
  };

  async execute (ctx: Context): Promise<void> {

    if (!await Restart.findOne()) await new Restart({ status: true }).save();
    else if (await Restart.findOne()) await Restart.updateOne({ status: true });

    ctx.terminal.title({
      content: [
        `${ctx.terminal.color({ text: `LOGGED IN (v${require(`@package`).version})`, hex: `#FFFFFF`, bold: true })}`,
        ``,
        `  ${ctx.terminal.color({ text: `Guilds:`, hex: `#FFFFFF` })}       ${ctx.terminal.color({ text: `${ctx.case.number(ctx.client.guilds.cache.size)}`, hex: Color.Terminal.Yellow })}`,
        `  ${ctx.terminal.color({ text: `Users:`, hex: `#FFFFFF` })}        ${ctx.terminal.color({ text: `${ctx.case.number(ctx.client.guilds.cache.reduce((value, guild) => value + guild.memberCount, 0))}`, hex: Color.Terminal.Yellow })}`,
        ``,
        `  ${ctx.terminal.color({ text: `Apps:`, hex: `#FFFFFF` })}         ${ctx.terminal.color({ text: `${ctx.client.apps.size}`, hex: Color.Terminal.Yellow })}`,
        `  ${ctx.terminal.color({ text: `Commands:`, hex: `#FFFFFF` })}     ${ctx.terminal.color({ text: `${ctx.client.commands.size}`, hex: Color.Terminal.Yellow })}`,
        ``,
        `  ${ctx.terminal.color({ text: `Node.js:`, hex: `#FFFFFF` })}      ${ctx.terminal.color({ text: `${process.version}`, hex: Color.Terminal.Yellow })}`,
        `  ${ctx.terminal.color({ text: `Discord.js:`, hex: `#FFFFFF` })}   ${ctx.terminal.color({ text: `v${require('discord.js').version}`, hex: Color.Terminal.Yellow })}`,
        ``,
      ],
    });

    setTimeout(async () => {
  
      ctx.terminal.log({
        content: [
          `The reboot is complete.`,
        ],
      });

      await Restart.updateOne({ status: false });
    }, 60000);
  };
};
