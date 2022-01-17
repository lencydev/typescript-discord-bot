import Client from '../client';

import { Awaitable } from 'discord.js';

export interface EventOptions {

  name: string;
  enabled?: boolean;
};

export default abstract class Event {

  public name;
  public enabled;

  constructor(event: EventOptions) {

    this.name = event.name;
    this.enabled = event.enabled ?? false;
  };

  abstract execute (client: Client, ...args: any[]): Awaitable<void>;
};