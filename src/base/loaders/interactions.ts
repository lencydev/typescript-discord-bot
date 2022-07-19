import { Context } from '@context';

import { App } from '@app';
import { Command } from '@command';

import { Color } from '@config';

import {
  ApplicationCommandData,
} from '@discord';

import { sync } from 'glob';
import { resolve } from 'path';

export default async function (ctx: Context): Promise<void> {

  let interactionsArray: ApplicationCommandData[] = [];

  let appsData: string[] = [];
  let commandsData: string[] = [];
  
  let apps: string[] = sync(resolve(`./src/interactions/apps/*/*.ts`));
  let commands: string[] = sync(resolve(`./src/interactions/commands/*/*.ts`));

  if (apps.length > 0) {

    await Promise.all(apps.map((file: string) => {

      let app: App = new (require(file).default)();

      if (!app.enabled) return appsData.push(`${ctx.terminal.color({ text: app.name, hex: Color.Terminal.Grey })} ${ctx.terminal.color({ text: `(${file.split(`apps/`)[1]})`, hex: Color.Terminal.Blue })}`);

      appsData.push(`${ctx.terminal.color({ text: app.name, hex: Color.Terminal.Green })} ${ctx.terminal.color({ text: `(${file.split(`apps/`)[1]})`, hex: Color.Terminal.Blue })}`);

      interactionsArray.push({
        name: app.name,
        dmPermission: false,
        type: app.type,
      });

      ctx.client.apps.set(app.name, app);
    }));
  
    ctx.terminal.title({
      content: [
        `${ctx.terminal.color({ text: `APPS (${appsData.length})`, hex: `#FFFFFF`, bold: true })}`,
        ``,
        `${appsData.map((value: string, row: number) => `  ${ctx.terminal.color({ text: `${row +1}.`, hex: `#FFFFFF`, bold: true })} ${value}`).join('\n')}`,
        ``,
      ],
    });
  };

  if (commands.length > 0) {

    await Promise.all(commands.map((file: string) => {
  
      let command: Command = new (require(file).default)();

      if (!command.enabled) return commandsData.push(`${ctx.terminal.color({ text: command.name, hex: Color.Terminal.Grey })} ${ctx.terminal.color({ text: `(${file.split(`commands/`)[1]})`, hex: Color.Terminal.Blue })}`);

      commandsData.push(`${ctx.terminal.color({ text: command.name, hex: Color.Terminal.Green })} ${ctx.terminal.color({ text: `(${file.split(`commands/`)[1]})`, hex: Color.Terminal.Blue })}`);

      interactionsArray.push({
        name: command.name,
        description: command.description,
        options: command.options,
        dmPermission: false,
        type: 1,
      });

      ctx.client.commands.set(command.name, command);
    }));
  
    ctx.terminal.title({
      content: [
        `${ctx.terminal.color({ text: `COMMANDS (${commandsData.length})`, hex: `#FFFFFF`, bold: true })}`,
        ``,
        `${commandsData.map((value: string, row: number) => `  ${ctx.terminal.color({ text: `${row +1}.`, hex: `#FFFFFF`, bold: true })} ${value}`).join('\n')}`,
        ``,
      ],
    });
  
    ctx.client.on('ready', async () => {

      await ctx.client.application.commands.set(interactionsArray);
    });
  };
};