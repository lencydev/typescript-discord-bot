import Command from '../../../base/structures/command';
import Context from '../../../base/interfaces/context';

import { MessageEmbed, MessageActionRow, MessageButton } from 'discord.js';

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

      function result ({ ephemeral, value, result, embed }: { ephemeral?: boolean, value: number, result: any, embed: MessageEmbed }) {

        let page = 1;
        let checkPages;
  
        let first = 0;
        let last = 1000;
  
        let pages = Math.ceil(value / 1000);

        if (!ephemeral) {

          if (page == pages) {

            checkPages = ctx.interaction.reply({
              ephemeral: false,
              embeds: [
                embed.setFields([
                  { name: `Type`, value: `${ctx.case.title(typeof(evaled))}`, inline: false },
                  { name: `Length`, value: `${ctx.case.number(value)}`, inline: false },
                  { name: `Result`, value: `\`\`\`ts\n${result.slice(first, last)}\`\`\``, inline: false },
                ]),
              ],
              components: [
                new MessageActionRow({
                  components: [
                    new MessageButton({ style: 'SECONDARY', emoji: ctx.config.emoji.button.previous, customId: 'previous', disabled: true }),
                    new MessageButton({ style: 'SECONDARY', emoji: ctx.config.emoji.button.next, customId: 'next', disabled: true }),
                    new MessageButton({ style: 'DANGER', emoji: ctx.config.emoji.button.delete, customId: 'delete', disabled: false }),
                  ],
                }),
              ],
            });

          } else if (page !== pages) {

            checkPages = ctx.interaction.reply({
              ephemeral: false,
              embeds: [
                embed.setFields([
                  { name: `Type`, value: `${ctx.case.title(typeof(evaled))}`, inline: false },
                  { name: `Length`, value: `${ctx.case.number(value)}`, inline: false },
                  { name: `Result ${pages > 1 ? `(${page}/${pages})` : ``}`, value: `\`\`\`ts\n${result.slice(first, last)}\`\`\``, inline: false },
                ]),
              ],
              components: [
                new MessageActionRow({
                  components: [
                    new MessageButton({ style: 'SECONDARY', emoji: ctx.config.emoji.button.previous, customId: 'previous', disabled: true }),
                    new MessageButton({ style: 'SECONDARY', emoji: ctx.config.emoji.button.next, customId: 'next', disabled: false }),
                    new MessageButton({ style: 'DANGER', emoji: ctx.config.emoji.button.delete, customId: 'delete', disabled: false }),
                  ],
                }),
              ],
            })
          };

          checkPages.then(async () => {
    
            let fetch: any = await ctx.interaction.fetchReply();
            let collector = fetch.createMessageComponentCollector({ componentType: 'BUTTON', time: 3 * 60 * 1000 });
      
            collector.on('end', async () => {
    
              ctx.interaction.editReply({
                components: [
                  new MessageActionRow({
                    components: [
                      new MessageButton({ style: 'SECONDARY', emoji: ctx.config.emoji.button.previous, customId: 'previous', disabled: true }),
                      new MessageButton({ style: 'SECONDARY', emoji: ctx.config.emoji.button.next, customId: 'next', disabled: true }),
                      new MessageButton({ style: 'DANGER', emoji: ctx.config.emoji.button.delete, customId: 'delete', disabled: true }),
                    ],
                  }),
                ],
              }).catch(() => null);
            });

            collector.on('collect', async (button: any) => {
              
              if (button.user.id !== ctx.interaction.user.id) {
                
                await button.deferUpdate();

                return button.followUp({ ephemeral: true, content: `${ctx.case.emoji(ctx.config.emoji.error)} You cannot use this button.` });
              };

              if (button.customId == 'delete') {
            
                await ctx.interaction.deleteReply();
        
                await button.deferUpdate();
    
              } else if (button.customId == 'previous') {
      
                page = page -1;
    
                first = first -1000;
                last = last -1000;
    
                if (page == 1) {
            
                  ctx.interaction.editReply({
                    embeds: [
                      embed.setFields([
                        { name: `Type`, value: `${ctx.case.title(typeof(evaled))}`, inline: false },
                        { name: `Length`, value: `${ctx.case.number(value)}`, inline: false },
                        { name: `Result ${pages > 1 ? `(${page}/${pages})` : ``}`, value: `\`\`\`ts\n${result.slice(first, last)}\`\`\``, inline: false },
                      ]),
                    ],
                    components: [
                      new MessageActionRow({
                        components: [
                          new MessageButton({ style: 'SECONDARY', emoji: ctx.config.emoji.button.previous, customId: 'previous', disabled: true }),
                          new MessageButton({ style: 'SECONDARY', emoji: ctx.config.emoji.button.next, customId: 'next', disabled: false }),
                          new MessageButton({ style: 'DANGER', emoji: ctx.config.emoji.button.delete, customId: 'delete', disabled: false }),
                        ],
                      }),
                    ],
                  });
        
                } else if (page !== 1) {
        
                  ctx.interaction.editReply({
                    embeds: [
                      embed.setFields([
                        { name: `Type`, value: `${ctx.case.title(typeof(evaled))}`, inline: false },
                        { name: `Length`, value: `${ctx.case.number(value)}`, inline: false },
                        { name: `Result ${pages > 1 ? `(${page}/${pages})` : ``}`, value: `\`\`\`ts\n${result.slice(first, last)}\`\`\``, inline: false },
                      ]),
                    ],
                    components: [
                      new MessageActionRow({
                        components: [
                          new MessageButton({ style: 'SECONDARY', emoji: ctx.config.emoji.button.previous, customId: 'previous', disabled: false }),
                          new MessageButton({ style: 'SECONDARY', emoji: ctx.config.emoji.button.next, customId: 'next', disabled: false }),
                          new MessageButton({ style: 'DANGER', emoji: ctx.config.emoji.button.delete, customId: 'delete', disabled: false }),
                        ],
                      }),
                    ],
                  });
                };
    
                  await button.deferUpdate();
              
              } else if (button.customId == 'next') {
      
                page = page +1;
    
                first = first +1000;
                last = last +1000;
    
                if (page == pages) {
            
                  ctx.interaction.editReply({
                    embeds: [
                      embed.setFields([
                        { name: `Type`, value: `${ctx.case.title(typeof(evaled))}`, inline: false },
                        { name: `Length`, value: `${ctx.case.number(value)}`, inline: false },
                        { name: `Result ${pages > 1 ? `(${page}/${pages})` : ``}`, value: `\`\`\`ts\n${result.slice(first, last)}\`\`\``, inline: false },
                      ]),
                    ],
                    components: [
                      new MessageActionRow({
                        components: [
                          new MessageButton({ style: 'SECONDARY', emoji: ctx.config.emoji.button.previous, customId: 'previous', disabled: false }),
                          new MessageButton({ style: 'SECONDARY', emoji: ctx.config.emoji.button.next, customId: 'next', disabled: true }),
                          new MessageButton({ style: 'DANGER', emoji: ctx.config.emoji.button.delete, customId: 'delete', disabled: false }),
                        ],
                      }),
                    ],
                  });
        
                } else if (page !== pages) {
        
                  ctx.interaction.editReply({
                    embeds: [
                      embed.setFields([
                        { name: `Type`, value: `${ctx.case.title(typeof(evaled))}`, inline: false },
                        { name: `Length`, value: `${ctx.case.number(value)}`, inline: false },
                        { name: `Result ${pages > 1 ? `(${page}/${pages})` : ``}`, value: `\`\`\`ts\n${result.slice(first, last)}\`\`\``, inline: false },
                      ]),
                    ],
                    components: [
                      new MessageActionRow({
                        components: [
                          new MessageButton({ style: 'SECONDARY', emoji: ctx.config.emoji.button.previous, customId: 'previous', disabled: false }),
                          new MessageButton({ style: 'SECONDARY', emoji: ctx.config.emoji.button.next, customId: 'next', disabled: false }),
                          new MessageButton({ style: 'DANGER', emoji: ctx.config.emoji.button.delete, customId: 'delete', disabled: false }),
                        ],
                      }),
                    ],
                  });
                };
        
                await button.deferUpdate();
              };
            });
          });

        } else if (ephemeral) {

          let previous = ctx.case.random();
          let next = ctx.case.random();

          if (page == pages) {

            checkPages = ctx.interaction.reply({
              ephemeral: true,
              embeds: [
                embed.setFields([
                  { name: `Type`, value: `${ctx.case.title(typeof(evaled))}`, inline: false },
                  { name: `Length`, value: `${ctx.case.number(value)}`, inline: false },
                  { name: `Result`, value: `\`\`\`ts\n${result.slice(first, last)}\`\`\``, inline: false },
                ]),
              ],
              components: [
                new MessageActionRow({
                  components: [
                    new MessageButton({ style: 'SECONDARY', emoji: ctx.config.emoji.button.previous, customId: previous, disabled: true }),
                    new MessageButton({ style: 'SECONDARY', emoji: ctx.config.emoji.button.next, customId: next, disabled: true }),
                  ],
                }),
              ],
            });
    
          } else if (page !== pages) {
        
            checkPages = ctx.interaction.reply({
              ephemeral: true,
              embeds: [
                embed.setFields([
                  { name: `Type`, value: `${ctx.case.title(typeof(evaled))}`, inline: false },
                  { name: `Length`, value: `${ctx.case.number(value)}`, inline: false },
                  { name: `Result ${pages > 1 ? `(${page}/${pages})` : ``}`, value: `\`\`\`ts\n${result.slice(first, last)}\`\`\``, inline: false },
                ]),
              ],
              components: [
                new MessageActionRow({
                  components: [
                    new MessageButton({ style: 'SECONDARY', emoji: ctx.config.emoji.button.previous, customId: previous, disabled: true }),
                    new MessageButton({ style: 'SECONDARY', emoji: ctx.config.emoji.button.next, customId: next, disabled: false }),
                  ],
                }),
              ],
            })
          };
          
          checkPages.then(async () => {
    
            let collector = ctx.interaction.channel.createMessageComponentCollector({ componentType: 'BUTTON', time: 3 * 60 * 1000, filter: (clicker: any) => clicker.user.id == ctx.interaction.user.id });
      
            collector.on('end', async () => {
    
              ctx.interaction.editReply({
                components: [
                  new MessageActionRow({
                    components: [
                      new MessageButton({ style: 'SECONDARY', emoji: ctx.config.emoji.button.previous, customId: previous, disabled: true }),
                      new MessageButton({ style: 'SECONDARY', emoji: ctx.config.emoji.button.next, customId: next, disabled: true }),
                    ],
                  }),
                ],
              }).catch(() => null);
            });
    
            collector.on('collect', async (button: any) => {
    
              if (button.customId == previous) {
      
                page = page -1;
    
                first = first -1000;
                last = last -1000;
    
                if (page == 1) {
            
                  ctx.interaction.editReply({
                    embeds: [
                      embed.setFields([
                        { name: `Type`, value: `${ctx.case.title(typeof(evaled))}`, inline: false },
                        { name: `Length`, value: `${ctx.case.number(value)}`, inline: false },
                        { name: `Result ${pages > 1 ? `(${page}/${pages})` : ``}`, value: `\`\`\`ts\n${result.slice(first, last)}\`\`\``, inline: false },
                      ]),
                    ],
                    components: [
                      new MessageActionRow({
                        components: [
                          new MessageButton({ style: 'SECONDARY', emoji: ctx.config.emoji.button.previous, customId: previous, disabled: true }),
                          new MessageButton({ style: 'SECONDARY', emoji: ctx.config.emoji.button.next, customId: next, disabled: false }),
                        ],
                      }),
                    ],
                  });
        
                } else if (page !== 1) {
        
                  ctx.interaction.editReply({
                    embeds: [
                      embed.setFields([
                        { name: `Type`, value: `${ctx.case.title(typeof(evaled))}`, inline: false },
                        { name: `Length`, value: `${ctx.case.number(value)}`, inline: false },
                        { name: `Result ${pages > 1 ? `(${page}/${pages})` : ``}`, value: `\`\`\`ts\n${result.slice(first, last)}\`\`\``, inline: false },
                      ]),
                    ],
                    components: [
                      new MessageActionRow({
                        components: [
                          new MessageButton({ style: 'SECONDARY', emoji: ctx.config.emoji.button.previous, customId: previous, disabled: false }),
                          new MessageButton({ style: 'SECONDARY', emoji: ctx.config.emoji.button.next, customId: next, disabled: false }),
                        ],
                      }),
                    ],
                  });
                };
    
                  await button.deferUpdate();
              
              } else if (button.customId == next) {
      
                page = page +1;
    
                first = first +1000;
                last = last +1000;
    
                if (page == pages) {
            
                  ctx.interaction.editReply({
                    embeds: [
                      embed.setFields([
                        { name: `Type`, value: `${ctx.case.title(typeof(evaled))}`, inline: false },
                        { name: `Length`, value: `${ctx.case.number(value)}`, inline: false },
                        { name: `Result ${pages > 1 ? `(${page}/${pages})` : ``}`, value: `\`\`\`ts\n${result.slice(first, last)}\`\`\``, inline: false },
                      ]),
                    ],
                    components: [
                      new MessageActionRow({
                        components: [
                          new MessageButton({ style: 'SECONDARY', emoji: ctx.config.emoji.button.previous, customId: previous, disabled: false }),
                          new MessageButton({ style: 'SECONDARY', emoji: ctx.config.emoji.button.next, customId: next, disabled: true }),
                        ],
                      }),
                    ],
                  });
        
                } else if (page !== pages) {
        
                  ctx.interaction.editReply({
                    embeds: [
                      embed.setFields([
                        { name: `Type`, value: `${ctx.case.title(typeof(evaled))}`, inline: false },
                        { name: `Length`, value: `${ctx.case.number(value)}`, inline: false },
                        { name: `Result ${pages > 1 ? `(${page}/${pages})` : ``}`, value: `\`\`\`ts\n${result.slice(first, last)}\`\`\``, inline: false },
                      ]),
                    ],
                    components: [
                      new MessageActionRow({
                        components: [
                          new MessageButton({ style: 'SECONDARY', emoji: ctx.config.emoji.button.previous, customId: previous, disabled: false }),
                          new MessageButton({ style: 'SECONDARY', emoji: ctx.config.emoji.button.next, customId: next, disabled: false }),
                        ],
                      }),
                    ],
                  });
                };
        
                await button.deferUpdate();
              };
            });
          });
        };
      };

      result({
        ephemeral: !ephemeral || ephemeral == 'true' ? true : false,
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
