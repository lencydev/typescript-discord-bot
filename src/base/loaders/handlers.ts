import { Context } from '@context';

import { Handler } from '@handler';

import { ClientEvents } from '@discord';

import { sync } from 'glob';
import { resolve } from 'path';

export default async function (ctx: Context): Promise<void> {

  let handlers: string[] = sync(resolve(`./src/base/handlers/*.ts`));
  
  if (handlers.length > 0) {

    await Promise.all(handlers.map((file: string) => {

      let handler: Handler = new (require(file).default)();
  
      if (!handler.enabled) return;

      ctx.client.on(handler.type, async (...items: ClientEvents[keyof ClientEvents]) => await handler.execute(ctx, ...items));
    }));
  };
};
