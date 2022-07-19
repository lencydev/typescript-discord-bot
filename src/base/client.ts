import { Context } from '@context';

import { Data } from '@config';

import { Discord, Collection, GatewayIntentBits, Partials } from '@discord';

import { Event } from '@event';

import { App } from '@app'
import { Command } from '@command';

export class Client extends Discord {

  readonly events: Collection<string, Event>;

  readonly apps: Collection<string, App>;
  readonly commands: Collection<string, Command>;

  readonly cooldowns: { app: Collection<string, number>; command: Collection<string, number>; };

  constructor() {
    super({
      intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMembers,
        GatewayIntentBits.GuildBans,
        GatewayIntentBits.GuildPresences,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.GuildInvites,
        GatewayIntentBits.MessageContent,
      ],
      partials: [
        Partials.User,
        Partials.GuildMember,
        Partials.Message,
        Partials.Channel,
        Partials.Reaction,
      ],
      presence: {
        status: 'online',
        activities: [
          {
            name: '/help',
            type: 5,
          },
        ],
      },
      allowedMentions: {
        parse: [],
        users: [],
        roles: [],
        repliedUser: false,
      },
    });

    this.events = new Collection<string, Event>();

    this.apps = new Collection<string, App>();
    this.commands = new Collection<string, Command>();

    this.cooldowns = {
      app: new Collection<string, number>(),
      command: new Collection<string, number>(),
    };
  };

  async start (): Promise<void> {

    let ctx: Context = new Context({ client: this });

    await (await import('@loaders/database')).default();

    await (await import('@loaders/utils')).default(ctx);

    await (await import('@loaders/prototypes')).default(ctx);

    await (await import('@loaders/handlers')).default(ctx);
    await (await import('@loaders/events')).default(ctx);
    await (await import('@loaders/interactions')).default(ctx);

    await this.login(Data.Token);
  };
};