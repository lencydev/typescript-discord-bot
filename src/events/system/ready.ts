import Client from '../../base/client';

import Event from '../../base/structures/event';
import Context from '../../base/interfaces/context';

export default class extends Event {

  constructor() {
    super({
      name: 'ready',
      enabled: true,
    });
  };

  async execute (client: Client) {

    let ctx: Context = new Context(client);

    if (!await ctx.schema.restart.findOne()) await new ctx.schema.restart({ status: true }).save();
    else if (await ctx.schema.restart.findOne()) await ctx.schema.restart.updateOne({ status: true });

    setTimeout(() => {

      ctx.terminal.title({
        content: [
          `${ctx.terminal.color({ text: `LOGGED IN`, hex: `#FFFFFF`, bold: true })}`,
          ``,
          `  ${ctx.terminal.color({ text: `Guilds:`, hex: `#FFFFFF` })}       ${ctx.terminal.color({ text: `${ctx.case.number(client.guilds.cache.size)}`, hex: ctx.config.terminal.color.yellow })}`,
          `  ${ctx.terminal.color({ text: `Users:`, hex: `#FFFFFF` })}        ${ctx.terminal.color({ text: `${ctx.case.number(client.guilds.cache.reduce((value, guild) => value + guild.memberCount, 0))}`, hex: ctx.config.terminal.color.yellow })}`,
          `  ${ctx.terminal.color({ text: `Channels:`, hex: `#FFFFFF` })}     ${ctx.terminal.color({ text: `${ctx.case.number(client.channels.cache.filter((channel) => channel.type == 'GUILD_TEXT' || channel.type == 'GUILD_VOICE' || channel.type == 'GUILD_NEWS' || channel.type == 'GUILD_STAGE_VOICE' || channel.type == 'GUILD_STORE').size)}`, hex: ctx.config.terminal.color.yellow })}`,
          ``,
          `  ${ctx.terminal.color({ text: `Apps:`, hex: `#FFFFFF` })}         ${ctx.terminal.color({ text: `${client.apps.size}`, hex: ctx.config.terminal.color.yellow })}`,
          `  ${ctx.terminal.color({ text: `Commands:`, hex: `#FFFFFF` })}     ${ctx.terminal.color({ text: `${client.commands.size}`, hex: ctx.config.terminal.color.yellow })}`,
          ``,
          `  ${ctx.terminal.color({ text: `Node.js:`, hex: `#FFFFFF` })}      ${ctx.terminal.color({ text: `${process.version.replace(`v`, ``)}`, hex: ctx.config.terminal.color.yellow })}`,
          `  ${ctx.terminal.color({ text: `Discord.js:`, hex: `#FFFFFF` })}   ${ctx.terminal.color({ text: `${require('discord.js').version}`, hex: ctx.config.terminal.color.yellow })}`,
          ``,
        ].join(`\n`),
      });
    }, 1000);

    setTimeout(async () => {
  
      ctx.terminal.log({
        content: [
          `The reboot is complete.`
        ].join(`\n`),
      });

      await ctx.schema.restart.updateOne({ status: false });
    }, 60 * 1000);

    let row = 0;

    setTimeout(() => {

      setInterval(() => {

        let status = [
          `/help | ${ctx.case.number(client.guilds.cache.size)} guilds.`,
          `/help | ${ctx.case.number(client.guilds.cache.reduce((value, guild) => value + guild.memberCount, 0))} users.`,
        ];

        if (status.length == row) row = 0;
  
        setTimeout(() => {
  
          client.user.setActivity(status[row], { type: 'PLAYING' }); row++;
        }, 1000);
      }, 10 * 1000);
    }, 50 * 1000);
  };
};