import { Command } from '@command';
import { Context } from '@context';

import { Color, Data, Emoji } from '@config';

import { inspect } from 'util';

import {
  ChatInputCommandInteraction,
  Embed,
  ActionRow,
  Modal,
  TextInput,
  ModalSubmitInteraction,
} from '@discord';

export default class extends Command {

  constructor() {
    super({
      name: 'eval',
      description: 'Evaluates code and execute.',

      cooldown: false,
  
      developerOnly: true,
      ownerOnly: false,
      permissions: false,

      enabled: true,
    });
  };

  async execute ({ ctx, interaction }: { ctx: Context; interaction: ChatInputCommandInteraction; }): Promise<void> {

    function clean (value: any): any {
  
      if (typeof (value) === 'string') return value.replace(/`/g, '`' + String.fromCharCode(8203)).replace(/@/g, '@' + String.fromCharCode(8203));
      return value;
    };

    function parseType (input: any): any {

      let isPromise: boolean = input instanceof Promise && typeof input.then === 'function' && typeof input.catch === 'function';
      let isArray: boolean = input instanceof Array;

      return isPromise ? `${input.constructor.name === `Promise` ? `Promise` : `Promise<${isArray ? `Array<${input[0].constructor.name}>` : input.constructor.name}>` }` : input ? `${isArray ? `Array<${input[0].constructor.name}>` : input.constructor.name}` : `Void`;
    };

    await interaction.showModal(
      new Modal({ custom_id: 'evaluate', title: `Evaluate` }).addComponents(
        new ActionRow<TextInput>().addComponents(
          new TextInput({
            type: 4,
            style: 2,
            custom_id: `code`,
            label: `Code`,
            required: true,
          }),
        ),
        new ActionRow<TextInput>().addComponents(
          new TextInput({
            type: 4,
            style: 1,
            custom_id: `ephemeral`,
            label: `Ephemeral Response (true/false)`,
            placeholder: `true/false`,
            value: 'true',
            min_length: 4,
            max_length: 5,
            required: false,
          }),
        ),
      ),
    );

    await interaction.awaitModalSubmit({ filter: (modal: ModalSubmitInteraction) => modal.customId === `evaluate`, time: 5 * 60 * 1000 }).then(async (modal: ModalSubmitInteraction) => {

      try {

        let code: string = modal.fields.getTextInputValue('code');
        let ephemeral: boolean = modal.fields.getTextInputValue('ephemeral').toLowerCase() === `true` ? true : false;
    
        if (code.includes('await')) code = eval(`(async () => { ${code} })()`);
        else if (!code.includes('await')) code = eval(code);
        
        let evaled: string = inspect(code, { depth: 1, showHidden: false });
  
        let secretValues: string[] = [
          Data.Token,
          Data.Database,
        ];
  
        await Promise.all(secretValues.map((value: string) => evaled = evaled.replaceAll(value, `❌`)));

        await ctx.menu.eval(modal, {
          ephemeral,
          pageSize: 1015,
          value: clean(evaled),
          embeds: (value: string, firstIndex: number, lastIndex: number, page: number, pages: number) => {
            return [
              new Embed({
                color: Color.Success,
                author: {
                  icon_url: ctx.client.emojis.cache.get(Emoji.Success).url,
                  name: `Success`,
                },
                fields: [
                  { name: `Type`, value: `\`${parseType(code)}\``, inline: true },
                  { name: `Length`, value: `\`${ctx.case.number(value.length)}\``, inline: true },
                  { name: `Input`, value: `\`\`\`ts\n${modal.fields.getTextInputValue('code')}\`\`\``, inline: false },
                  { name: `Result ${pages > 1 ? `(${page}/${pages})` : ``}`, value: `\`\`\`ts\n${value.slice(firstIndex, lastIndex)}\`\`\``, inline: false },
                ],
              }),
            ];
          },
        });
  
      } catch (error: any) {

        await modal.error_reply({ content: `\`\`\`ts\n${clean(error).length > 2000 ? `${clean(error).slice(0, 2000)}...` : `${clean(error)}`}\n\`\`\`` });
      };
    }).catch(() => undefined);
  };
};