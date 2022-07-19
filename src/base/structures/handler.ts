import { Context } from '@context';

export abstract class Handler {

  readonly type;
  readonly enabled;

  constructor(handler: HandlerOptions) {

    this.type = handler.type;
    this.enabled = handler.enabled ?? false;
  };

  abstract execute (ctx: Context, ...items: any[]): Promise<void>;
};