import config from '../../config';

import Client from '../client';

import { CommandInteraction, MessageEmbed, MessageActionRow, MessageButton } from 'discord.js';

import { extractColors } from 'extract-colors';

import chalk from 'chalk';

import ms from 'ms';
import pms from 'pretty-ms';

import util from 'util';
import moment from 'moment-timezone';

import restart from '../schemas/restart';
import blacklist from '../schemas/blacklist';

export default class Context {

  public config;

  public client;
  public interaction;

  public module;
  public schema;

  public reply;
  public embed;
  public case;
  public terminal;
  public menu;

  constructor(client?: Client, interaction?: CommandInteraction) {

    let ctx = this;

    this.config = config;

    this.client = client;
    this.interaction = interaction;

    this.module = {

      ms,
      pms,
      util,
      moment,
    };

    this.schema = {

      restart,
      blacklist,
    };

    this.reply = {

      success ({ ephemeral, content, timeout }: { ephemeral?: boolean, content: string | string[], timeout?: number }) {

        if (timeout) {
  
          interaction.reply({ ephemeral: false, content: `${ctx.case.emoji(config.emoji.success)} ${content}` }).then(async () => setTimeout(async () => await interaction.deleteReply(), timeout));

        } else if (!timeout) {

          interaction.reply({ ephemeral: ephemeral ? true : false, content: `${ctx.case.emoji(config.emoji.success)} ${content}` });
        };
      },
    
      error ({ content }: { content: string | string[] }) {
    
        interaction.reply({ ephemeral: true, content: `${ctx.case.emoji(config.emoji.error)} ${content}` });
      },

      info ({ content }: { content: string | string[] }) {
    
        interaction.reply({ ephemeral: true, content: `${ctx.case.emoji(config.emoji.info)} ${content}` });
      },

      warning ({ content }: { content: string | string[] }) {
    
        interaction.reply({ ephemeral: true, content: `${ctx.case.emoji(config.emoji.warning)} ${content}` });
      },
    };

    this.embed = {

      title (value: any) {

        return ctx.case.title(value.replaceAll(`-`, ` `));
      },

      clientAvatar () {

        return ctx.client.user.displayAvatarURL();
      },
    };

    this.case = {

      emoji (value: any) {
  
        return client.emojis.cache.get(value);
      },

      time (value: any) {

        try {
  
          if (value.startsWith(`-`) || value.endsWith(`ms`) || value.endsWith(`msec`) || value.endsWith(`msecs`) || value.endsWith(`milisecond`) || value.endsWith(`miliseconds`)) return;
  
          let values = value.split(` `);
        
          let result: any = 0;
          let input;
    
          values.map((value: any) => {
    
            input = ms(value);
            result = input + result;
          });
  
          return result;
  
        } catch (error) {
  
          return;
        };
      },

      timeformat (value: any, { long }: { long?: boolean }) {

        let result;

        if (!long) result = `${pms(value)}`;
        else if (long) result = `\`${pms(value, { verbose: true }).replaceAll(` y`, `\` y`).replaceAll(` d`, `\` d`).replaceAll(` h`, `\` h`).replaceAll(` m`, `\` m`).replaceAll(` s`, `\` s`).replaceAll(`y `, `y \``).replaceAll(`r `, `r \``).replaceAll(`e `, `e \``).replaceAll(`d `, `d \``).replaceAll(`s `, `s \``)}`;

        return result;
      },

      timestamp (value: any) {
    
        return Math.floor(new Date(value).getTime() / 1000);
      },

      async imageColor (value: any) {

        let result;
  
        await extractColors(value).then((image) => result = image[0].hex);
  
        return result;
      },

      random () {

        return Math.random().toString(36).substring(2) + Date.now() + Math.random().toString(36).substring(2);
      },

      title (value: any) {
    
        return value.split(` `).map((word: any) => `${word[0].toUpperCase()}${word.slice(1).toLowerCase()}`).join(` `);
      },
    
      filter (value: any) {
    
        return value.replaceAll(`*`, ``).replaceAll(`_`, ``).replaceAll(`~~`, ``).replaceAll(`\``, ``);
      },
    
      number (value: number) {
    
        return Intl.NumberFormat().format(value);
      },

      badge ({ badge, icon }: { badge: string, icon?: boolean }) {

        let badges: any;

        if (!icon) {

          badges = {

            'DISCORD_EMPLOYEE': 'Discord Employee',
            'PARTNERED_SERVER_OWNER': 'Partnered Server Owner',
            'DISCORD_CERTIFIED_MODERATOR': 'Certified Moderator',
            'HYPESQUAD_EVENTS': 'HypeSquad Events',
  
            'HOUSE_BRAVERY': 'House Bravery',
            'HOUSE_BRILLIANCE': 'House Brilliance',
            'HOUSE_BALANCE': 'House Balance',
    
            'BUGHUNTER_LEVEL_1': 'Bug Hunter',
            'BUGHUNTER_LEVEL_2': 'Bug Hunter Gold',
    
            'EARLY_VERIFIED_BOT_DEVELOPER': 'Early Verified Bot Developer',
            'EARLY_SUPPORTER': 'Early Supporter',
          };

        } else if (icon) {

          badges = {

            'DISCORD_EMPLOYEE': client.emojis.cache.get(config.emoji.badge.discord_employee),
            'PARTNERED_SERVER_OWNER': client.emojis.cache.get(config.emoji.badge.partnered_server_owner),
            'DISCORD_CERTIFIED_MODERATOR': client.emojis.cache.get(config.emoji.badge.certified_moderator),
            'HYPESQUAD_EVENTS': client.emojis.cache.get(config.emoji.badge.hypesquad_events),
  
            'HOUSE_BRAVERY': client.emojis.cache.get(config.emoji.badge.house_bravery),
            'HOUSE_BRILLIANCE': client.emojis.cache.get(config.emoji.badge.house_brilliance),
            'HOUSE_BALANCE': client.emojis.cache.get(config.emoji.badge.house_balance),
    
            'BUGHUNTER_LEVEL_1': client.emojis.cache.get(config.emoji.badge.bug_hunter),
            'BUGHUNTER_LEVEL_2': client.emojis.cache.get(config.emoji.badge.bug_hunter_gold),
    
            'EARLY_VERIFIED_BOT_DEVELOPER': client.emojis.cache.get(config.emoji.badge.early_verified_bot_developer),
            'EARLY_SUPPORTER': client.emojis.cache.get(config.emoji.badge.early_supporter),
          };
        };

        return badges[badge];
      },
    };

    this.terminal = {

      color ({ text, hex, bold }: { text: string, hex: any, bold?: boolean }) {
  
        return bold ? chalk.bold.hex(hex)(text) : chalk.hex(hex)(text);
      },

      log ({ content }: { content: string | string[] }) {

        return console.log(`${ctx.terminal.color({ text: `${moment().tz('Europe/Istanbul').format('hh:mm:ss')} |`, hex: `#FFFFFF`, bold: true })} ${content}`);
      },

      title ({ content }: { content: string | string[] }) {

        return console.log(`${content}`);
      },
    };

    this.menu = {

      classic ({ embeds }: { embeds: MessageEmbed[] }) {

        interaction.reply({ 
          ephemeral: false,
          embeds: embeds,
          components: [
            new MessageActionRow({
              components: [
                new MessageButton({ style: 'DANGER', emoji: config.emoji.button.delete, customId: 'delete', disabled: false }),
              ],
            }),
          ],
        }).then(async () => {
    
          let fetch: any = await interaction.fetchReply();
          let collector = fetch.createMessageComponentCollector({ componentType: 'BUTTON', time: 3 * 60 * 1000 });

          collector.on('end', async () => {

            interaction.editReply({
              components: [
                new MessageActionRow({
                  components: [
                    new MessageButton({ style: 'DANGER', emoji: config.emoji.button.delete, customId: 'delete', disabled: true }),
                  ],
                }),
              ],
            }).catch(() => null);
          });

          collector.on('collect', async (button: any) => {

            if (button.user.id !== interaction.user.id) {
                
              await button.deferUpdate();

              return button.followUp({ ephemeral: true, content: `${ctx.case.emoji(config.emoji.error)} You cannot use this button.` });
            };
  
            if (button.customId == 'delete') {

              await interaction.deleteReply();
    
              await button.deferUpdate();
            };
          });
        });
      },

      list ({ ephemeral = true, perPageData = 1, value, array, embed }: { ephemeral?: boolean, perPageData?: number, value: number, array: any[], embed: MessageEmbed }) {

        let page = 1;
        let checkPages;
  
        let first = 0;
        let last = perPageData;
  
        let pages = Math.ceil(value / perPageData);

        if (value < 1) return ctx.reply.error({ content: `Not enough data was found.` });
  
        if (!ephemeral) {

          if (page == pages) {
  
            checkPages = interaction.reply({ 
              ephemeral: false,
              embeds: [
                embed.setDescription(array.slice(first, last).join(`\n`)).setFooter({ text: `Page ${page} of ${pages}` }),
              ],
              components: [
                new MessageActionRow({
                  components: [
                    new MessageButton({ style: 'SECONDARY', emoji: config.emoji.button.previous, customId: 'previous', disabled: true }),
                    new MessageButton({ style: 'SECONDARY', emoji: config.emoji.button.next, customId: 'next', disabled: true }),
                    new MessageButton({ style: 'DANGER', emoji: config.emoji.button.delete, customId: 'delete', disabled: false }),
                  ],
                }),
              ],
            });
    
          } else if (page !== pages) {
        
            checkPages = interaction.reply({
              ephemeral: false,
              embeds: [
                embed.setDescription(array.slice(first, last).join(`\n`)).setFooter({ text: `Page ${page} of ${pages}` }),
              ],
              components: [
                new MessageActionRow({
                  components: [
                    new MessageButton({ style: 'SECONDARY', emoji: config.emoji.button.previous, customId: 'previous', disabled: true }),
                    new MessageButton({ style: 'SECONDARY', emoji: config.emoji.button.next, customId: 'next', disabled: false }),
                    new MessageButton({ style: 'DANGER', emoji: config.emoji.button.delete, customId: 'delete', disabled: false }),
                  ],
                }),
              ],
            })
          };
          
          checkPages.then(async () => {
    
            let fetch: any = await interaction.fetchReply();
            let collector = fetch.createMessageComponentCollector({ componentType: 'BUTTON', time: 3 * 60 * 1000 });
      
            collector.on('end', async () => {
    
              interaction.editReply({
                components: [
                  new MessageActionRow({
                    components: [
                      new MessageButton({ style: 'SECONDARY', emoji: config.emoji.button.previous, customId: 'previous', disabled: true }),
                      new MessageButton({ style: 'SECONDARY', emoji: config.emoji.button.next, customId: 'next', disabled: true }),
                      new MessageButton({ style: 'DANGER', emoji: config.emoji.button.delete, customId: 'delete', disabled: true }),
                    ],
                  }),
                ],
              }).catch(() => null);
            });
    
            collector.on('collect', async (button: any) => {

              if (button.user.id !== interaction.user.id) {
                
                await button.deferUpdate();
  
                return button.followUp({ ephemeral: true, content: `${ctx.case.emoji(config.emoji.error)} You cannot use this button.` });
              };
      
              if (button.customId == 'delete') {
            
                await interaction.deleteReply();
        
                await button.deferUpdate();
    
              } else if (button.customId == 'previous') {
      
                page = page -1;
    
                first = first -perPageData;
                last = last -perPageData;
    
                if (page == 1) {
            
                  interaction.editReply({
                    embeds: [
                      embed.setDescription(array.slice(first, last).join(`\n`)).setFooter({ text: `Page ${page} of ${pages}` }),
                    ],
                    components: [
                      new MessageActionRow({
                        components: [
                          new MessageButton({ style: 'SECONDARY', emoji: config.emoji.button.previous, customId: 'previous', disabled: true }),
                          new MessageButton({ style: 'SECONDARY', emoji: config.emoji.button.next, customId: 'next', disabled: false }),
                          new MessageButton({ style: 'DANGER', emoji: config.emoji.button.delete, customId: 'delete', disabled: false }),
                        ],
                      }),
                    ],
                  });
        
                } else if (page !== 1) {
        
                  interaction.editReply({
                    embeds: [
                      embed.setDescription(array.slice(first, last).join(`\n`)).setFooter({ text: `Page ${page} of ${pages}` }),
                    ],
                    components: [
                      new MessageActionRow({
                        components: [
                          new MessageButton({ style: 'SECONDARY', emoji: config.emoji.button.previous, customId: 'previous', disabled: false }),
                          new MessageButton({ style: 'SECONDARY', emoji: config.emoji.button.next, customId: 'next', disabled: false }),
                          new MessageButton({ style: 'DANGER', emoji: config.emoji.button.delete, customId: 'delete', disabled: false }),
                        ],
                      }),
                    ],
                  });
                };
    
                  await button.deferUpdate();
              
              } else if (button.customId == 'next') {
      
                page = page +1;
    
                first = first +perPageData;
                last = last +perPageData;
    
                if (page == pages) {
            
                  interaction.editReply({
                    embeds: [
                      embed.setDescription(array.slice(first, last).join(`\n`)).setFooter({ text: `Page ${page} of ${pages}` }),
                    ],
                    components: [
                      new MessageActionRow({
                        components: [
                          new MessageButton({ style: 'SECONDARY', emoji: config.emoji.button.previous, customId: 'previous', disabled: false }),
                          new MessageButton({ style: 'SECONDARY', emoji: config.emoji.button.next, customId: 'next', disabled: true }),
                          new MessageButton({ style: 'DANGER', emoji: config.emoji.button.delete, customId: 'delete', disabled: false }),
                        ],
                      }),
                    ],
                  });
        
                } else if (page !== pages) {
        
                  interaction.editReply({
                    embeds: [
                      embed.setDescription(array.slice(first, last).join(`\n`)).setFooter({ text: `Page ${page} of ${pages}` }),
                    ],
                    components: [
                      new MessageActionRow({
                        components: [
                          new MessageButton({ style: 'SECONDARY', emoji: config.emoji.button.previous, customId: 'previous', disabled: false }),
                          new MessageButton({ style: 'SECONDARY', emoji: config.emoji.button.next, customId: 'next', disabled: false }),
                          new MessageButton({ style: 'DANGER', emoji: config.emoji.button.delete, customId: 'delete', disabled: false }),
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
  
            checkPages = interaction.reply({ 
              ephemeral: true,
              embeds: [
                embed.setDescription(array.slice(first, last).join(`\n`)).setFooter({ text: `Page ${page} of ${pages}` }),
              ],
              components: [
                new MessageActionRow({
                  components: [
                    new MessageButton({ style: 'SECONDARY', emoji: config.emoji.button.previous, customId: previous, disabled: true }),
                    new MessageButton({ style: 'SECONDARY', emoji: config.emoji.button.next, customId: next, disabled: true }),
                  ],
                }),
              ],
            });
    
          } else if (page !== pages) {
        
            checkPages = interaction.reply({
              ephemeral: true,
              embeds: [
                embed.setDescription(array.slice(first, last).join(`\n`)).setFooter({ text: `Page ${page} of ${pages}` }),
              ],
              components: [
                new MessageActionRow({
                  components: [
                    new MessageButton({ style: 'SECONDARY', emoji: config.emoji.button.previous, customId: previous, disabled: true }),
                    new MessageButton({ style: 'SECONDARY', emoji: config.emoji.button.next, customId: next, disabled: false }),
                  ],
                }),
              ],
            })
          };
          
          checkPages.then(async () => {
    
            let collector = interaction.channel.createMessageComponentCollector({ componentType: 'BUTTON', time: 3 * 60 * 1000, filter: (clicker: any) => clicker.user.id == interaction.user.id });
      
            collector.on('end', async () => {
    
              interaction.editReply({
                components: [
                  new MessageActionRow({
                    components: [
                      new MessageButton({ style: 'SECONDARY', emoji: config.emoji.button.previous, customId: previous, disabled: true }),
                      new MessageButton({ style: 'SECONDARY', emoji: config.emoji.button.next, customId: next, disabled: true }),
                    ],
                  }),
                ],
              }).catch(() => null);
            });
    
            collector.on('collect', async (button: any) => {
      
              if (button.customId == previous) {
      
                page = page -1;
    
                first = first -perPageData;
                last = last -perPageData;
    
                if (page == 1) {
            
                  interaction.editReply({
                    embeds: [
                      embed.setDescription(array.slice(first, last).join(`\n`)).setFooter({ text: `Page ${page} of ${pages}` }),
                    ],
                    components: [
                      new MessageActionRow({
                        components: [
                          new MessageButton({ style: 'SECONDARY', emoji: config.emoji.button.previous, customId: previous, disabled: true }),
                          new MessageButton({ style: 'SECONDARY', emoji: config.emoji.button.next, customId: next, disabled: false }),
                        ],
                      }),
                    ],
                  });
        
                } else if (page !== 1) {
        
                  interaction.editReply({
                    embeds: [
                      embed.setDescription(array.slice(first, last).join(`\n`)).setFooter({ text: `Page ${page} of ${pages}` }),
                    ],
                    components: [
                      new MessageActionRow({
                        components: [
                          new MessageButton({ style: 'SECONDARY', emoji: config.emoji.button.previous, customId: previous, disabled: false }),
                          new MessageButton({ style: 'SECONDARY', emoji: config.emoji.button.next, customId: next, disabled: false }),
                        ],
                      }),
                    ],
                  });
                };
    
                  await button.deferUpdate();
              
              } else if (button.customId == next) {
      
                page = page +1;
    
                first = first +perPageData;
                last = last +perPageData;
    
                if (page == pages) {
            
                  interaction.editReply({
                    embeds: [
                      embed.setDescription(array.slice(first, last).join(`\n`)).setFooter({ text: `Page ${page} of ${pages}` }),
                    ],
                    components: [
                      new MessageActionRow({
                        components: [
                          new MessageButton({ style: 'SECONDARY', emoji: config.emoji.button.previous, customId: previous, disabled: false }),
                          new MessageButton({ style: 'SECONDARY', emoji: config.emoji.button.next, customId: next, disabled: true }),
                        ],
                      }),
                    ],
                  });
        
                } else if (page !== pages) {
        
                  interaction.editReply({
                    embeds: [
                      embed.setDescription(array.slice(first, last).join(`\n`)).setFooter({ text: `Page ${page} of ${pages}` }),
                    ],
                    components: [
                      new MessageActionRow({
                        components: [
                          new MessageButton({ style: 'SECONDARY', emoji: config.emoji.button.previous, customId: previous, disabled: false }),
                          new MessageButton({ style: 'SECONDARY', emoji: config.emoji.button.next, customId: next, disabled: false }),
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
      },

      pagination ({ pages, fastSkip }: { pages: MessageEmbed[], fastSkip: boolean }) {

        let page = 0;
        let checkPages;

        if (!fastSkip) {

          if (page == pages.length -1) {

            checkPages = interaction.reply({ 
              embeds: [
                pages[page].setFooter({ text: `Page ${page +1} of ${pages.length}` }),
              ],
              components: [
                new MessageActionRow({
                  components: [
                    new MessageButton({ style: 'SECONDARY', emoji: config.emoji.button.previous, customId: 'previous', disabled: true }),
                    new MessageButton({ style: 'SECONDARY', emoji: config.emoji.button.next, customId: 'next', disabled: true }),
                    new MessageButton({ style: 'DANGER', emoji: config.emoji.button.delete, customId: 'delete', disabled: false }),
                  ],
                }),
              ],
            });

          } else if (page !== pages.length -1) {
        
            checkPages = interaction.reply({
              embeds: [
                pages[page].setFooter({ text: `Page ${page +1} of ${pages.length}` }),
              ],
              components: [
                new MessageActionRow({
                  components: [
                    new MessageButton({ style: 'SECONDARY', emoji: config.emoji.button.previous, customId: 'previous', disabled: true }),
                    new MessageButton({ style: 'SECONDARY', emoji: config.emoji.button.next, customId: 'next', disabled: false }),
                    new MessageButton({ style: 'DANGER', emoji: config.emoji.button.delete, customId: 'delete', disabled: false }),
                  ],
                }),
              ],
            })
          };
          
          checkPages.then(async () => {
        
            let fetch: any = await interaction.fetchReply();
            let collector = fetch.createMessageComponentCollector({ componentType: 'BUTTON', time: 3 * 60 * 1000, filter: (clicker: any) => clicker.user.id == interaction.user.id });

            collector.on('end', async () => {

              interaction.editReply({
                components: [
                  new MessageActionRow({
                    components: [
                      new MessageButton({ style: 'SECONDARY', emoji: config.emoji.button.previous, customId: 'previous', disabled: true }),
                      new MessageButton({ style: 'SECONDARY', emoji: config.emoji.button.next, customId: 'next', disabled: true }),
                      new MessageButton({ style: 'DANGER', emoji: config.emoji.button.delete, customId: 'delete', disabled: true }),
                    ],
                  }),
                ],
              }).catch(() => null);
            });

            collector.on('collect', async (button: any) => {

              if (button.user.id !== interaction.user.id) {
                
                await button.deferUpdate();
  
                return button.followUp({ ephemeral: true, content: `${ctx.case.emoji(config.emoji.error)} You cannot use this button.` });
              };
        
              if (button.customId == 'delete') {
        
                await interaction.deleteReply();
        
                await button.deferUpdate();
        
              } else if (button.customId == 'previous') {
        
                page--
        
                if (page == 0) {
        
                  interaction.editReply({
                    embeds: [
                      pages[page].setFooter({ text: `Page ${page +1} of ${pages.length}` }),
                    ],
                    components: [
                      new MessageActionRow({
                        components: [
                          new MessageButton({ style: 'SECONDARY', emoji: config.emoji.button.previous, customId: 'previous', disabled: true }),
                          new MessageButton({ style: 'SECONDARY', emoji: config.emoji.button.next, customId: 'next', disabled: false }),
                          new MessageButton({ style: 'DANGER', emoji: config.emoji.button.delete, customId: 'delete', disabled: false }),
                        ],
                      }),
                    ],
                  });
        
                } else if (page !== 0) {
        
                  interaction.editReply({
                    embeds: [
                      pages[page].setFooter({ text: `Page ${page +1} of ${pages.length}` }),
                    ],
                    components: [
                      new MessageActionRow({
                        components: [
                          new MessageButton({ style: 'SECONDARY', emoji: config.emoji.button.previous, customId: 'previous', disabled: false }),
                          new MessageButton({ style: 'SECONDARY', emoji: config.emoji.button.next, customId: 'next', disabled: false }),
                          new MessageButton({ style: 'DANGER', emoji: config.emoji.button.delete, customId: 'delete', disabled: false }),
                        ],
                      }),
                    ],
                  });
                };
  
                await button.deferUpdate();
        
              } else if (button.customId == 'next') {
        
                page++
        
                if (page == pages.length -1) {
        
                  interaction.editReply({
                    embeds: [
                      pages[page].setFooter({ text: `Page ${page +1} of ${pages.length}` }),
                    ],
                    components: [
                      new MessageActionRow({
                        components: [
                          new MessageButton({ style: 'SECONDARY', emoji: config.emoji.button.previous, customId: 'previous', disabled: false }),
                          new MessageButton({ style: 'SECONDARY', emoji: config.emoji.button.next, customId: 'next', disabled: true }),
                          new MessageButton({ style: 'DANGER', emoji: config.emoji.button.delete, customId: 'delete', disabled: false }),
                        ],
                      }),
                    ],
                  });
        
                } else if (page !== pages.length -1) {
        
                  interaction.editReply({
                    embeds: [
                      pages[page].setFooter({ text: `Page ${page +1} of ${pages.length}` }),
                    ],
                    components: [
                      new MessageActionRow({
                        components: [
                          new MessageButton({ style: 'SECONDARY', emoji: config.emoji.button.previous, customId: 'previous', disabled: false }),
                          new MessageButton({ style: 'SECONDARY', emoji: config.emoji.button.next, customId: 'next', disabled: false }),
                          new MessageButton({ style: 'DANGER', emoji: config.emoji.button.delete, customId: 'delete', disabled: false }),
                        ],
                      }),
                    ],
                  });
                };
        
                await button.deferUpdate();
              };
            });
          });

        } else if (fastSkip) {

          if (page == pages.length -1) {

            checkPages = interaction.reply({
              embeds: [
                pages[page].setFooter({ text: `Page ${page +1} of ${pages.length}` }),
              ],
              components: [
                new MessageActionRow({
                  components: [
                    new MessageButton({ style: 'SECONDARY', emoji: config.emoji.button.first, customId: 'first', disabled: true }),
                    new MessageButton({ style: 'SECONDARY', emoji: config.emoji.button.previous, customId: 'previous', disabled: true }),
                    new MessageButton({ style: 'SECONDARY', emoji: config.emoji.button.next, customId: 'next', disabled: true }),
                    new MessageButton({ style: 'SECONDARY', emoji: config.emoji.button.last, customId: 'last', disabled: true }),
                    new MessageButton({ style: 'DANGER', emoji: config.emoji.button.delete, customId: 'delete', disabled: false }),
                  ],
                }),
              ],
            });

          } else if (page !== pages.length -1) {
        
            checkPages = interaction.reply({
              embeds: [
                pages[page].setFooter({ text: `Page ${page +1} of ${pages.length}` }),
              ],
              components: [
                new MessageActionRow({
                  components: [
                    new MessageButton({ style: 'SECONDARY', emoji: config.emoji.button.first, customId: 'first', disabled: true }),
                    new MessageButton({ style: 'SECONDARY', emoji: config.emoji.button.previous, customId: 'previous', disabled: true }),
                    new MessageButton({ style: 'SECONDARY', emoji: config.emoji.button.next, customId: 'next', disabled: false }),
                    new MessageButton({ style: 'SECONDARY', emoji: config.emoji.button.last, customId: 'last', disabled: false }),
                    new MessageButton({ style: 'DANGER', emoji: config.emoji.button.delete, customId: 'delete', disabled: false }),
                  ],
                }),
              ],
            })
          };
        
          checkPages.then(async () => {
        
            let fetch: any = await interaction.fetchReply();
            let collector = fetch.createMessageComponentCollector({ componentType: 'BUTTON', time: 3 * 60 * 1000, filter: (clicker: any) => clicker.user.id == interaction.user.id });

            collector.on('end', async () => {

              interaction.editReply({
                components: [
                  new MessageActionRow({
                    components: [
                      new MessageButton({ style: 'SECONDARY', emoji: config.emoji.button.first, customId: 'first', disabled: true }),
                      new MessageButton({ style: 'SECONDARY', emoji: config.emoji.button.previous, customId: 'previous', disabled: true }),
                      new MessageButton({ style: 'SECONDARY', emoji: config.emoji.button.next, customId: 'next', disabled: true }),
                      new MessageButton({ style: 'SECONDARY', emoji: config.emoji.button.last, customId: 'last', disabled: true }),
                      new MessageButton({ style: 'DANGER', emoji: config.emoji.button.delete, customId: 'delete', disabled: true }),
                    ],
                  }),
                ],
              }).catch(() => null);
            });
        
            collector.on('collect', async (button: any) => {

              if (button.user.id !== interaction.user.id) {
                
                await button.deferUpdate();
  
                return button.followUp({ ephemeral: true, content: `${ctx.case.emoji(config.emoji.error)} You cannot use this button.` });
              };
        
              if (button.customId == 'first') {
        
                page = 0;
        
                interaction.editReply({
                  embeds: [
                    pages[page].setFooter({ text: `Page ${page +1} of ${pages.length}` }),
                  ],
                  components: [
                    new MessageActionRow({
                      components: [
                        new MessageButton({ style: 'SECONDARY', emoji: config.emoji.button.first, customId: 'first', disabled: true }),
                        new MessageButton({ style: 'SECONDARY', emoji: config.emoji.button.previous, customId: 'previous', disabled: true }),
                        new MessageButton({ style: 'SECONDARY', emoji: config.emoji.button.next, customId: 'next', disabled: false }),
                        new MessageButton({ style: 'SECONDARY', emoji: config.emoji.button.last, customId: 'last', disabled: false }),
                        new MessageButton({ style: 'DANGER', emoji: config.emoji.button.delete, customId: 'delete', disabled: false }),
                      ],
                    }),
                  ],
                });
        
                await button.deferUpdate();
        
              } else if (button.customId == 'previous') {
        
                page--
        
                if (page == 0) {
        
                  interaction.editReply({
                    embeds: [
                      pages[page].setFooter({ text: `Page ${page +1} of ${pages.length}` }),
                    ],
                    components: [
                      new MessageActionRow({
                        components: [
                          new MessageButton({ style: 'SECONDARY', emoji: config.emoji.button.first, customId: 'first', disabled: true }),
                          new MessageButton({ style: 'SECONDARY', emoji: config.emoji.button.previous, customId: 'previous', disabled: true }),
                          new MessageButton({ style: 'SECONDARY', emoji: config.emoji.button.next, customId: 'next', disabled: false }),
                          new MessageButton({ style: 'SECONDARY', emoji: config.emoji.button.last, customId: 'last', disabled: false }),
                          new MessageButton({ style: 'DANGER', emoji: config.emoji.button.delete, customId: 'delete', disabled: false }),
                        ],
                      }),
                    ],
                  });
        
                } else if (page !== 0) {
        
                  interaction.editReply({
                    embeds: [
                      pages[page].setFooter({ text: `Page ${page +1} of ${pages.length}` }),
                    ],
                    components: [
                      new MessageActionRow({
                        components: [
                          new MessageButton({ style: 'SECONDARY', emoji: config.emoji.button.first, customId: 'first', disabled: false }),
                          new MessageButton({ style: 'SECONDARY', emoji: config.emoji.button.previous, customId: 'previous', disabled: false }),
                          new MessageButton({ style: 'SECONDARY', emoji: config.emoji.button.next, customId: 'next', disabled: false }),
                          new MessageButton({ style: 'SECONDARY', emoji: config.emoji.button.last, customId: 'last', disabled: false }),
                          new MessageButton({ style: 'DANGER', emoji: config.emoji.button.delete, customId: 'delete', disabled: false }),
                        ],
                      }),
                    ],
                  });
                };
  
                await button.deferUpdate();
        
              } else if (button.customId == 'next') {
        
                page++
        
                if (page == pages.length -1) {
        
                  interaction.editReply({
                    embeds: [
                      pages[page].setFooter({ text: `Page ${page +1} of ${pages.length}` }),
                    ],
                    components: [
                      new MessageActionRow({
                        components: [
                          new MessageButton({ style: 'SECONDARY', emoji: config.emoji.button.first, customId: 'first', disabled: false }),
                          new MessageButton({ style: 'SECONDARY', emoji: config.emoji.button.previous, customId: 'previous', disabled: false }),
                          new MessageButton({ style: 'SECONDARY', emoji: config.emoji.button.next, customId: 'next', disabled: true }),
                          new MessageButton({ style: 'SECONDARY', emoji: config.emoji.button.last, customId: 'last', disabled: true }),
                          new MessageButton({ style: 'DANGER', emoji: config.emoji.button.delete, customId: 'delete', disabled: false }),
                        ],
                      }),
                    ],
                  });
        
                } else if (page !== pages.length -1) {
        
                  interaction.editReply({
                    embeds: [
                      pages[page].setFooter({ text: `Page ${page +1} of ${pages.length}` }),
                    ],
                    components: [
                      new MessageActionRow({
                        components: [
                          new MessageButton({ style: 'SECONDARY', emoji: config.emoji.button.first, customId: 'first', disabled: false }),
                          new MessageButton({ style: 'SECONDARY', emoji: config.emoji.button.previous, customId: 'previous', disabled: false }),
                          new MessageButton({ style: 'SECONDARY', emoji: config.emoji.button.next, customId: 'next', disabled: false }),
                          new MessageButton({ style: 'SECONDARY', emoji: config.emoji.button.last, customId: 'last', disabled: false }),
                          new MessageButton({ style: 'DANGER', emoji: config.emoji.button.delete, customId: 'delete', disabled: false }),
                        ],
                      }),
                    ],
                  });
                };
        
                await button.deferUpdate();
  
              } else if (button.customId == 'last') {
        
                page = pages.length -1
        
                interaction.editReply({
                  embeds: [
                    pages[page].setFooter({ text: `Page ${page +1} of ${pages.length}` }),
                  ],
                  components: [
                    new MessageActionRow({
                      components: [
                        new MessageButton({ style: 'SECONDARY', emoji: config.emoji.button.first, customId: 'first', disabled: false }),
                        new MessageButton({ style: 'SECONDARY', emoji: config.emoji.button.previous, customId: 'previous', disabled: false }),
                        new MessageButton({ style: 'SECONDARY', emoji: config.emoji.button.next, customId: 'next', disabled: true }),
                        new MessageButton({ style: 'SECONDARY', emoji: config.emoji.button.last, customId: 'last', disabled: true }),
                        new MessageButton({ style: 'DANGER', emoji: config.emoji.button.delete, customId: 'delete', disabled: false }),
                      ],
                    }),
                  ],
                });
        
                await button.deferUpdate();
              };
            });
          });
        };
      },
    };
  };
};
