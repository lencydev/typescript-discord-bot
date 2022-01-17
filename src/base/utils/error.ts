import Client from '../client';

import Context from '../interfaces/context'; let ctx: Context = new Context();

export default async (client: Client) => {

  process.on('uncaughtException', async (error) => {
  
    ctx.terminal.log({
      content: [
        `${ctx.terminal.color({ text: `ERROR`, hex: ctx.config.color.error, bold: true })} ${error}`,
      ].join(`\n`),
    });
  });

  process.on('unhandledRejection', async (error) => {
  
    ctx.terminal.log({
      content: [
        `${ctx.terminal.color({ text: `ERROR`, hex: ctx.config.color.error, bold: true })} ${error}`,
      ].join(`\n`),
    });
  });

  client.on('error', async (error) => {

    ctx.terminal.log({
      content: [
        `${ctx.terminal.color({ text: `ERROR`, hex: ctx.config.color.error, bold: true })} ${error}`,
      ].join(`\n`),
    });
  });

  client.on('warn', async (message) => {

    ctx.terminal.log({
      content: [
        `${ctx.terminal.color({ text: `ERROR`, hex: ctx.config.color.error, bold: true })} ${message}`,
      ].join(`\n`),
    });
  });
};