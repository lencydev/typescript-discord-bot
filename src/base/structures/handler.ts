import Client from '../client';

import { Awaitable } from 'discord.js';

export interface HandlerOptions {

  name: string;
  enabled?: boolean;
};

export default abstract class Handler {

  public name;
  public enabled;

  constructor(handler: HandlerOptions) {

    this.name = handler.name;
    this.enabled = handler.enabled ?? false;
  };

  abstract execute (client: Client, ...args: any[]): Awaitable<void>;
};