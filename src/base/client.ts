import Context from './interfaces/context'; let ctx: Context = new Context();

import { Client, Collection } from 'discord.js';

import Event from './structures/event';

import App from './structures/app'
import Command from './structures/command';

import loadUtils from './loaders/util';

import loadHandlers from './loaders/handler'
import loadEvents from './loaders/event';
import loadInteractions from './loaders/interaction';
import loadDatabase from './loaders/database';

export default class extends Client {

  public events = new Collection<string, Event>();
  
  public apps = new Collection<string, App>();
  public commands = new Collection<string, Command>();

  public cooldowns = new Collection<string, number>();

  constructor() {
    super({
      intents: [
        'GUILDS',
        'GUILD_MEMBERS',
        'GUILD_BANS',
        'GUILD_PRESENCES',
        'GUILD_MESSAGES',
      ],
      allowedMentions: {
        parse: [],
        repliedUser: false,
      },
      presence: {
        status: 'online',
        activities: [
          {
            name: 'Rebooting...',
            type: 'PLAYING',
          },
        ],
      },
      restTimeOffset: 0,
      partials: ['MESSAGE', 'CHANNEL', 'REACTION',],
    });
  };

  async start() {

    await loadUtils(this);

    await loadHandlers(this);
    await loadEvents(this);
    await loadInteractions(this);
    await loadDatabase();

    await this.login(ctx.config.data.token);
  };
};