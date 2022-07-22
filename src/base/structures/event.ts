import { Context } from '@context';

import { ClientEvents } from '@discord';

export abstract class Event {

  readonly type;
  readonly enabled;

  constructor(event: EventOptions) {

    this.type = event.type;
    this.enabled = event.enabled ?? false;
  };

  abstract execute (ctx: Context, ...items: ClientEvents[keyof ClientEvents]): Promise<void>;
};
