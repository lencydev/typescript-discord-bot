import { Context } from '@context';

import { ClientEvents } from '@discord';

export abstract class Handler {

  readonly type;
  readonly enabled;

  constructor (handler: HandlerOptions) {

    this.type = handler.type;
    this.enabled = handler.enabled ?? false;
  };

  abstract execute (ctx: Context, ...items: ClientEvents[keyof ClientEvents]): Promise<void>;
};
