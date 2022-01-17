import Client from '../client';

import App from '../structures/app';
import Command from '../structures/command';

import Context from '../interfaces/context'; let ctx: Context = new Context();

import { sync } from 'glob';
import { resolve } from 'path';

export default async (client: Client) => {

  let interactionsArray: any[] = [];

  let appsData: any[] = [];
  let commandsData: any[] = [];
  
  let apps = await sync(resolve(`./src/interactions/apps/*/*.ts`));
  let commands = await sync(resolve(`./src/interactions/commands/*/*.ts`));

  await Promise.all(apps.map((value) => {

    let file = require(value).default;

    if (file && file.prototype instanceof App) {

      let app: App = new file;

      if (app.enabled == false) return appsData.push(`${ctx.terminal.color({ text: app.name, hex: ctx.config.terminal.color.red })} ${ctx.terminal.color({ text: `(${value.split(`apps/`)[1]})`, hex: ctx.config.terminal.color.blue })}`);
      if (app.developerOnly == true) app.defaultPermission = false;

      interactionsArray.push(app);
      appsData.push(`${ctx.terminal.color({ text: app.name, hex: ctx.config.terminal.color.green })} ${ctx.terminal.color({ text: `(${value.split(`apps/`)[1]})`, hex: ctx.config.terminal.color.blue })}`);

      client.apps.set(app.name, app);
    };
  }));

  ctx.terminal.title({
    content: [
      `${ctx.terminal.color({ text: `APPS`, hex: `#FFFFFF`, bold: true })}`,
      ``,
      `${appsData.map((value, row) => `  ${ctx.terminal.color({ text: `${row +1}.`, hex: `#FFFFFF`, bold: true })} ${value}`).join('\n')}`,
      ``,
    ].join(`\n`),
  });

  await Promise.all(commands.map((value) => {

    let file = require(value).default;

    if (file && file.prototype instanceof Command) {

      let command: Command = new file;

      if (command.enabled == false) return commandsData.push(`${ctx.terminal.color({ text: command.name, hex: ctx.config.terminal.color.red })} ${ctx.terminal.color({ text: `(${value.split(`commands/`)[1]})`, hex: ctx.config.terminal.color.blue })}`);
      if (command.developerOnly == true) command.defaultPermission = false;

      interactionsArray.push(command);
      commandsData.push(`${ctx.terminal.color({ text: command.name, hex: ctx.config.terminal.color.green })} ${ctx.terminal.color({ text: `(${value.split(`commands/`)[1]})`, hex: ctx.config.terminal.color.blue })}`);

      client.commands.set(command.name, command);
    };
  }));

  ctx.terminal.title({
    content: [
      `${ctx.terminal.color({ text: `COMMANDS`, hex: `#FFFFFF`, bold: true })}`,
      ``,
      `${commandsData.map((value, row) => `  ${ctx.terminal.color({ text: `${row +1}.`, hex: `#FFFFFF`, bold: true })} ${value}`).join('\n')}`,
      ``,
    ].join(`\n`),
  });

  let developers = ctx.config.data.developers.reduce((a, value) => {

    return [
      ...a,
      {
        id: value,
        type: 'USER',
        permission: true
      },
    ];
  }, []);

  client.on('ready', async () => {

    client.guilds.cache.forEach(async (guild) => {

      await guild.commands.set(interactionsArray).then(async () => {

        let interactions = await guild.commands.fetch();

        interactions.forEach(async (interaction) => {

          let option = client.commands.find((value) => value.name == interaction.name) || client.apps.find((value) => value.name == interaction.name);

          if (option.developerOnly == true) {
 
            await guild.commands.permissions.set({ command: interaction.id, permissions: developers });

          } else if (option.developerOnly == false) {

            await guild.commands.permissions.set({ command: interaction.id, permissions: [] });
          };
        });
      }).catch(() => null);
    });
  });

  client.on('guildCreate', async (guild) => {

    await guild.commands.set(interactionsArray).then(async () => {

      let interactions = await guild.commands.fetch();

      interactions.forEach(async (interaction) => {

        let option = client.commands.find((cmd) => cmd.name == interaction.name) || client.apps.find((cmd) => cmd.name == interaction.name);

        if (option.developerOnly == true) {

          await guild.commands.permissions.set({ command: interaction.id, permissions: developers });

        } else if (option.developerOnly == false) {

          await guild.commands.permissions.set({ command: interaction.id, permissions: [] });
        };
      });
    }).catch(() => null);
  });
};