import Client from '../client';

import Handler from '../structures/handler';

import { sync } from 'glob';
import { resolve } from 'path';

export default async (client: Client) => {

  let handlers = await sync(resolve(`./src/base/handlers/*.ts`));
  
  await Promise.all(handlers.map((value) => {
  
    let file = require(value).default;

    if (file && file.prototype instanceof Handler) {

      let handler: Handler = new file;

      if (handler.enabled == false) return;

      client.on(handler.name, (...args: any[]) => handler.execute(client, ...args));
    };
  }));
};