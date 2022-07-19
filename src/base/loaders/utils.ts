import { Context } from '@context';

import { Color } from '@config';

export default async function (ctx: Context): Promise<void> {

  process.removeAllListeners('warning');

  process.on('uncaughtException', async (error: Error) => {
  
    ctx.terminal.log({
      content: [
        `${ctx.terminal.color({ text: `${error.name}`, hex: Color.Terminal.Red, bold: true })} ${error.stack.replace(`${error.name}: `, ``)}`,
      ],
    });
  });

  process.on('unhandledRejection', async (error: Error) => {
  
    ctx.terminal.log({
      content: [
        `${ctx.terminal.color({ text: `${error.name}`, hex: Color.Terminal.Red, bold: true })} ${error.stack.replace(`${error.name}: `, ``)}`,
      ],
    });
  });

  ctx.client.on('error', async (error: Error) => {

    ctx.terminal.log({
      content: [
        `${ctx.terminal.color({ text: `${error.name}`, hex: Color.Terminal.Red, bold: true })} ${error.stack.replace(`${error.name}: `, ``)}`,
      ],
    });
  });

  ctx.client.on('warn', async (warn: string) => {

    ctx.terminal.log({
      content: [
        `${ctx.terminal.color({ text: `Warn`, hex: Color.Terminal.Red, bold: true })} ${warn}`,
      ],
    });
  });
};