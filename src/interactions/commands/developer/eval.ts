import Command from '../../../base/structures/command';
import Context from '../../../base/interfaces/context';

import { MessageEmbed } from 'discord.js';

export default class extends Command {

  constructor() {
    super({
      name: 'eval',
      description: 'Evaluates TypeScript expression.',
      options: [
        {
          name: 'code',
          description: 'Code in TypeScript language.',
          type: 3,
          required: true,
        },
        {
          name: 'ephemeral',
          description: 'Ephemeral response.',
          type: 3,
          required: false,
          choices: [
            { name: 'true', value: 'true' },
            { name: 'false', value: 'false' },
          ],
        },
      ],

      cooldown: false,

      category: 'developer',
      usage: ['<code> [ephemeral]'],

      ownerOnly: false,
      userPermissions: false,
      clientPermissions: false,

      enabled: true,
      developerOnly: true,
    });
  };

  async execute (ctx: Context) {

    try {
  
      let code = ctx.interaction.options.getString('code');
      let ephemeral = ctx.interaction.options.getString('ephemeral');

      let evaled = ctx.module.util.inspect(eval(code)).replaceAll(ctx.config.data.token, `❌`).replaceAll(ctx.config.data.database, `❌`);

      ctx.menu.eval({
        ephemeral: !ephemeral || ephemeral == 'true' ? true : false,
        fastSkip: true,
        value: clean(evaled).length,
        result: clean(evaled),
        embed: new MessageEmbed({
          color: ctx.config.color.default,
          author: {
            name: `${ctx.embed.title(this.name)}`,
            iconURL: ctx.embed.clientAvatar(),
          },
        }),
      });

    } catch (error) {
  
      ctx.interaction.reply({ ephemeral: true, content: `\`\`\`js\n${clean(error).length > 2000 ? `${clean(error).slice(0, 2000)}...` : `${clean(error)}`}\n\`\`\`` });
    };

    function clean (text: any) {
  
      if (typeof (text) == 'string') return text.replace(/`/g, '`' + String.fromCharCode(8203)).replace(/@/g, '@' + String.fromCharCode(8203));
      else return text;
    };
  };
};
