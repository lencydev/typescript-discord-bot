import Client from '../client';

import Event from '../structures/event';

import Context from '../interfaces/context'; let ctx: Context = new Context();

import { sync } from 'glob';
import { resolve } from 'path';

export default async (client: Client) => {

  let eventsData: any[] = [];
  
  let events = await sync(resolve(`./src/events/*/*.ts`));
  
  await Promise.all(events.map((value) => {
  
    let file = require(value).default;

    if (file && file.prototype instanceof Event) {

      let event: Event = new file;

      if (event.enabled == false) return eventsData.push(`${ctx.terminal.color({ text: event.name, hex: ctx.config.terminal.color.red })} ${ctx.terminal.color({ text: `(${value.split(`events/`)[1]})`, hex: ctx.config.terminal.color.blue })}`);

      eventsData.push(`${ctx.terminal.color({ text: event.name, hex: ctx.config.terminal.color.green })} ${ctx.terminal.color({ text: `(${value.split(`events/`)[1]})`, hex: ctx.config.terminal.color.blue })}`);

      client.events.set(event.name, event);
      client.on(event.name, (...args: any[]) => event.execute(client, ...args));
    };
  }));

  ctx.terminal.title({
    content: [
      `${ctx.terminal.color({ text: `EVENTS`, hex: `#FFFFFF`, bold: true })}\n\n${eventsData.map((value, row) => `  ${ctx.terminal.color({ text: `${row +1}.`, hex: `#FFFFFF`, bold: true })} ${value}`).join('\n')}`,
      ``,
    ].join(`\n`),
  });
};