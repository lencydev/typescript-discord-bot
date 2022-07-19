import { Context } from '@context';

export abstract class Event {

  readonly type;
  readonly enabled;

  constructor(event: EventOptions) {

    this.type = event.type;
    this.enabled = event.enabled ?? false;
  };

  abstract execute (ctx: Context, ...items: any[]): Promise<void>;
};