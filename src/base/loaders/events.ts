import { Context } from '@context';

import { Event } from '@event';

import { Color } from '@config';

import { ClientEvents } from '@discord';

import { sync } from 'glob';
import { resolve } from 'path';

export default async function (ctx: Context): Promise<void> {

  let eventsData: string[] = [];
  
  let events: string[] = sync(resolve(`./src/events/*/*.ts`));
  
  if (events.length > 0) {

    await Promise.all(events.map((file: string) => {

      let event: Event = new (require(file).default)();
      
      if (!event.enabled) return eventsData.push(`${ctx.terminal.color({ text: event.type, hex: Color.Terminal.Grey })} ${ctx.terminal.color({ text: `(${file.split(`events/`)[1]})`, hex: Color.Terminal.Blue })}`);

      eventsData.push(`${ctx.terminal.color({ text: event.type, hex: Color.Terminal.Green })} ${ctx.terminal.color({ text: `(${file.split(`events/`)[1]})`, hex: Color.Terminal.Blue })}`);

      ctx.client.on(event.type, async (...items: ClientEvents[keyof ClientEvents]) => await event.execute(ctx, ...items));

      ctx.client.events.set(event.type, event);
    }));
  
    ctx.terminal.title({
      content: [
        `${ctx.terminal.color({ text: `EVENTS (${eventsData.length})`, hex: `#FFFFFF`, bold: true })}`,
        ``,
        `${eventsData.map((value: string, row: number) => `  ${ctx.terminal.color({ text: `${row +1}.`, hex: `#FFFFFF`, bold: true })} ${value}`).join('\n')}`,
        ``,
      ],
    });
  };
};
