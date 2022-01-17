# lencydev/typescript-discord-bot
* It is forbidden to share the project or the codes in the project on any platform without permission.

# Setup
<ol dir="auto">
  <li>
    Edit the config file.
    <ul dir="auto">
      <li>
        Go to file <code>src/config.ts</code>
      </li>
      <li>
        Fill in the required fields.
        <ul dir="auto">
          <li>
            You can download the used emojis from the discord server in my profile.
          </li>
        </ul>
      </li>
    </ul>
  </li>
  <li>
    Install the required packages.
    <ul dir="auto">
      <li>
        Type <code>npm install</code> in the terminal to install the packages.
        <ul dir="auto">
          <li>
            Wait for the installation to complete.
          </li>
        </ul>    
      </li>    
    </ul>
  </li>
</ol>

# Starting The Project
<ol dir="auto">
  <li>
    Type <code>npm run start</code> into the terminal to start the project.
    <ul dir="auto">
      <li>
        Wait for the <code>LOGGED IN</code> message.
        <ul dir="auto">
          <li>
            Only developers can use commands for the first 1 minute.
          </li>
        </ul>
      </li>
    </ul>
  </li>
</ol>

# Example Command File
```ts
import Command from '../../../base/structures/command';
import Context from '../../../base/interfaces/context';

export default class extends Command {

  constructor() {
    super({
      name: 'example',
      description: 'Example description.',
      options: [
        {
          name: 'string-option',
          description: 'Example description.',
          type: 3, // or 'STRING'
          required: true,
        },
      ],

      cooldown: { time: '5s', perGuild: true }, // or false

      category: 'example',
      usage: ['<string-option>'], // or false

      ownerOnly: false,
      userPermissions: false, // or ['ADMINISTRATOR']
      clientPermissions: false, // or ['ADMINISTRATOR']

      enabled: true,
      developerOnly: false,
    });
  };

  async execute (ctx: Context) {

    let stringOption = ctx.interaction.options.getString('string-option');

    ctx.interaction.reply({ content: `${ctx.interaction.user}: ${stringOption}` });
  };
};
```

# Example Event File
```ts
import Client from '../../base/client';

import Event from '../../base/structures/event';
import Context from '../../base/interfaces/context';

import { Message, MessageActionRow, MessageButton } from 'discord.js';

export default class extends Event {

  constructor() {
    super({
      name: 'messageCreate',
      enabled: true,
    });
  };

  async execute (client: Client, message: Message) {

    let ctx: Context = new Context(client);

    if (message.channel.type == 'DM') return;
    if (message.content == `<@${client.user.id}>` || message.content == `<@!${client.user.id}>`) {

      message.reply({ content: `?` });
    };
  };
};
```
