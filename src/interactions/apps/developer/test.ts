import App from '../../../base/structures/app';
import Context from '../../../base/interfaces/context';

export default class extends App {

  constructor() {
    super({
      name: 'Test',

      enabled: true,
      developerOnly: true,
    });
  };

  async execute (ctx: Context) {

    ctx.interaction.reply({
      ephemeral: true,
      content: [
        `Test`,
      ].join(`\n`),
    });
  };
};