import { Client } from '@client';

import { Data, Emoji } from '@config';

import chalk from 'chalk';
import ms from 'ms';
import moment from 'moment-timezone';

import { extractColors } from 'extract-colors';

import {
  Embed,
  ActionRow,
  SelectMenu,
  Button,
  User,
  UserFlagsString,
  PermissionsString,
  CommandInteraction,
  SelectMenuInteraction,
  ButtonInteraction,
  ModalSubmitInteraction,
  MessageActionRowComponent,
  Message,
  InteractionCollector,
  Modal,
  TextInput,
  ComponentType,
  parseEmoji,
} from '@discord';

type ButtonNames = 'previous' | 'next' | 'search' | 'delete';

export class Context {

  readonly client;

  readonly util;
  readonly case;
  readonly terminal;
  readonly menu;

  constructor ({ client }: { client?: Client; } = {}) {

    let ctx: this = this;

    this.client = client;

    this.util = {

      progressBar (value: number, maxValue: number, options: { long?: boolean } = { long: false }): string {

        let Bar1Empty: string = `<:Bar1Empty:964815254284546048>`;
        let Bar2Empty: string = `<:Bar2Empty:964815251965112371>`;
        let Bar3Empty: string = `<:Bar3Empty:964815251352715265>`;

        let Bar1Mid: string = `<a:Bar1Mid:964815254062239805>`;
        let Bar2Mid: string = `<a:Bar2Mid:964815251663106069>`;
        let Bar3Mid: string = `<a:Bar3Mid:964815251205939231>`;

        let Bar1Full: string = `<a:Bar1Full:964815253907062784>`;
        let Bar2Full: string = `<a:Bar2Full:964815251499524104>`;
        let Bar3Full: string = `<a:Bar3Full:964815250916540476>`;

        let percent: number = Number(((value * 100) / maxValue).toFixed(0));

        if (options.long) {

          let bar: string = Bar1Empty + Bar2Empty + Bar2Empty + Bar2Empty + Bar2Empty + Bar2Empty + Bar2Empty + Bar2Empty + Bar2Empty + Bar3Empty;

          if (percent >= 99) bar = Bar1Full + Bar2Full + Bar2Full + Bar2Full + Bar2Full + Bar2Full + Bar2Full + Bar2Full + Bar2Full + Bar3Full;
          else if (percent >= 95) bar = Bar1Full + Bar2Full + Bar2Full + Bar2Full + Bar2Full + Bar2Full + Bar2Full + Bar2Full + Bar2Full + Bar3Mid;
          else if (percent >= 90) bar = Bar1Full + Bar2Full + Bar2Full + Bar2Full + Bar2Full + Bar2Full + Bar2Full + Bar2Full + Bar2Full + Bar3Empty;
          else if (percent >= 85) bar = Bar1Full + Bar2Full + Bar2Full + Bar2Full + Bar2Full + Bar2Full + Bar2Full + Bar2Full + Bar2Mid + Bar3Empty;
          else if (percent >= 80) bar = Bar1Full + Bar2Full + Bar2Full + Bar2Full + Bar2Full + Bar2Full + Bar2Full + Bar2Full + Bar2Empty + Bar3Empty;
          else if (percent >= 75) bar = Bar1Full + Bar2Full + Bar2Full + Bar2Full + Bar2Full + Bar2Full + Bar2Full + Bar2Mid + Bar2Empty + Bar3Empty;
          else if (percent >= 70) bar = Bar1Full + Bar2Full + Bar2Full + Bar2Full + Bar2Full + Bar2Full + Bar2Full + Bar2Empty + Bar2Empty + Bar3Empty;
          else if (percent >= 65) bar = Bar1Full + Bar2Full + Bar2Full + Bar2Full + Bar2Full + Bar2Full + Bar2Mid + Bar2Empty + Bar2Empty + Bar3Empty;
          else if (percent >= 60) bar = Bar1Full + Bar2Full + Bar2Full + Bar2Full + Bar2Full + Bar2Full + Bar2Empty + Bar2Empty + Bar2Empty + Bar3Empty;
          else if (percent >= 55) bar = Bar1Full + Bar2Full + Bar2Full + Bar2Full + Bar2Full + Bar2Mid + Bar2Empty + Bar2Empty + Bar2Empty + Bar3Empty;
          else if (percent >= 50) bar = Bar1Full + Bar2Full + Bar2Full + Bar2Full + Bar2Full + Bar2Empty + Bar2Empty + Bar2Empty + Bar2Empty + Bar3Empty;
          else if (percent >= 45) bar = Bar1Full + Bar2Full + Bar2Full + Bar2Full + Bar2Mid + Bar2Empty + Bar2Empty + Bar2Empty + Bar2Empty + Bar3Empty;
          else if (percent >= 40) bar = Bar1Full + Bar2Full + Bar2Full + Bar2Full + Bar2Empty + Bar2Empty + Bar2Empty + Bar2Empty + Bar2Empty + Bar3Empty;
          else if (percent >= 35) bar = Bar1Full + Bar2Full + Bar2Full + Bar2Mid + Bar2Empty + Bar2Empty + Bar2Empty + Bar2Empty + Bar2Empty + Bar3Empty;
          else if (percent >= 30) bar = Bar1Full + Bar2Full + Bar2Full + Bar2Empty + Bar2Empty + Bar2Empty + Bar2Empty + Bar2Empty + Bar2Empty + Bar3Empty;
          else if (percent >= 25) bar = Bar1Full + Bar2Full + Bar2Mid + Bar2Empty + Bar2Empty + Bar2Empty + Bar2Empty + Bar2Empty + Bar2Empty + Bar3Empty;
          else if (percent >= 20) bar = Bar1Full + Bar2Full + Bar2Empty + Bar2Empty + Bar2Empty + Bar2Empty + Bar2Empty + Bar2Empty + Bar2Empty + Bar3Empty;
          else if (percent >= 15) bar = Bar1Full + Bar2Mid + Bar2Empty + Bar2Empty + Bar2Empty + Bar2Empty + Bar2Empty + Bar2Empty + Bar2Empty + Bar3Empty;
          else if (percent >= 10) bar = Bar1Full + Bar2Empty + Bar2Empty + Bar2Empty + Bar2Empty + Bar2Empty + Bar2Empty + Bar2Empty + Bar2Empty + Bar3Empty;
          else if (percent >= 5) bar = Bar1Mid + Bar2Empty + Bar2Empty + Bar2Empty + Bar2Empty + Bar2Empty + Bar2Empty + Bar2Empty + Bar2Empty + Bar3Empty;

          return bar;
        };

        if (!options.long) {

          let bar: string = Bar1Empty + Bar2Empty + Bar2Empty + Bar2Empty + Bar3Empty;

          if (percent >= 99) bar = Bar1Full + Bar2Full + Bar2Full + Bar2Full + Bar3Full;
          else if (percent >= 90) bar = Bar1Full + Bar2Full + Bar2Full + Bar2Full + Bar3Mid;
          else if (percent >= 80) bar = Bar1Full + Bar2Full + Bar2Full + Bar2Full + Bar3Empty;
          else if (percent >= 70) bar = Bar1Full + Bar2Full + Bar2Full + Bar2Mid + Bar3Empty;
          else if (percent >= 60) bar = Bar1Full + Bar2Full + Bar2Full + Bar2Empty + Bar3Empty;
          else if (percent >= 50) bar = Bar1Full + Bar2Full + Bar2Mid + Bar2Empty + Bar3Empty;
          else if (percent >= 40) bar = Bar1Full + Bar2Full + Bar2Empty + Bar2Empty + Bar3Empty;
          else if (percent >= 30) bar = Bar1Full + Bar2Mid + Bar2Empty + Bar2Empty + Bar3Empty;
          else if (percent >= 20) bar = Bar1Full + Bar2Empty + Bar2Empty + Bar2Empty + Bar3Empty;
          else if (percent >= 10) bar = Bar1Mid + Bar2Empty + Bar2Empty + Bar2Empty + Bar3Empty;

          return bar;
        };
      },
    };

    this.case = {

      time (values: string): number {

        try {

          let blockedArgs: string[] = [ `-`, `.`, `ms`, `msec`, `msecs`, `milisecond`, `miliseconds` ];

          let result: number = 0;
          let input: number;

          for (let value of values.split(` `)) {

            if (!ms(value)) return;
            if (!isNaN(Number(value))) return;
            if (blockedArgs.some((arg: string) => value.includes(arg))) return;

            input = ms(value);
            result = input + result;
          };

          return result;

        } catch {

          return;
        };
      },

      timeformat (milliseconds: number, options: { long?: boolean; interpolation?: { prefix: string; suffix: string; } } = { long: false, interpolation: { prefix: ``, suffix: `` } }): string {

        const {
          long,
          interpolation,
        } = options;

        const {
          prefix,
          suffix,
        } = interpolation;

        let values: string[] = [];

        let time: { years: number; days: number; hours: number; minutes: number; seconds: number; milliseconds: number; } = {
          years: Math.trunc(milliseconds / 31556926000), 
          days: Math.trunc(milliseconds / 86400000) % 365,
          hours: Math.trunc(milliseconds / 3600000) % 24,
          minutes: Math.trunc(milliseconds / 60000) % 60,
          seconds: Math.trunc(milliseconds / 1000) % 60,
          milliseconds: Math.trunc(milliseconds) % 1000,
        };

        if (long) {

          if (time.years !== 0) values.push(`${prefix}${time.years}${suffix} year${time.years === 1 ? `` : `s`}`);
          if (time.days !== 0) values.push(`${prefix}${time.days}${suffix} day${time.days === 1 ? `` : `s`}`);
          if (time.hours !== 0) values.push(`${prefix}${time.hours}${suffix} hour${time.hours === 1 ? `` : `s`}`);
          if (time.minutes !== 0) values.push(`${prefix}${time.minutes}${suffix} minute${time.minutes === 1 ? `` : `s`}`);
          if (time.seconds !== 0) values.push(`${prefix}${time.seconds}${time.milliseconds !== 0 ? time.milliseconds >= 100 ? `.${time.milliseconds.toString()[0]}` : `` : ``}${suffix} second${time.seconds === 1 && time.milliseconds < 100 ? `` : `s`}`);
          if (time.seconds === 0) values.push(`${prefix}${time.milliseconds}${suffix} millisecond${time.milliseconds === 1 ? `` : `s`}`);
        };
        
        if (!long) {

          if (time.years !== 0) values.push(`${time.years}y`);
          if (time.days !== 0) values.push(`${time.days}d`);
          if (time.hours !== 0) values.push(`${time.hours}h`);
          if (time.minutes !== 0) values.push(`${time.minutes}menu`);
          if (time.seconds !== 0) values.push(`${time.seconds}s`);
          if (time.seconds === 0) values.push(`${time.milliseconds}ms`);
        };

        return values.join(` `);
      },

      formattedMap <T extends any[]>(array: T, { format }: { format: (value: T[number]) => any }): any {

        return array.length > 1 ? `${array.slice(0, -1).map((value: any) => format(value)).join(`, `)} and ${format(array[array.length -1])}` : format(array[0]);
      },

      timestamp (value: number | Date): number {

        return Math.floor(new Date(value).getTime() / 1000);
      },

      async imageColor (value: string): Promise<number> {

        let result: number;

        await extractColors(value).then((colors) => result = parseInt(colors[0].hex.replace(/#/, `0x`)));

        return result;
      },

      random (): string {

        return Math.random().toString(36).substring(2) + Date.now() + Math.random().toString(36).substring(2);
      },

      title (value: string): string {

        return value.split(` `).map((word: string) => `${word[0].toUpperCase()}${word.slice(1).toLowerCase()}`).join(` `);
      },

      permission (permission: PermissionsString): string {

        return permission.replace(/([A-Z])/g, ` $1`).trim().replaceAll(` And `, ` and `).replaceAll(` In `, ` in `).replaceAll(` To `, ` to `).replaceAll(`T T S`, `TTS`).replaceAll(`V A D`, `VAD`).replaceAll(`Guild`, `Server`);
      },

      filter (value: string): string {

        return value.replace(/([*_~~`])/g, `\\$1`).trim();
      },
    
      number (number: number): string {

        return Intl.NumberFormat().format(number);
      },

      formattedNumber (number: number, decPlaces: number = 1): string {

        decPlaces = Math.pow(10, decPlaces);
    
        let abbrev: string[] = [ `K`, `M`, `B`, `T` ];
    
        for (let i: number = abbrev.length -1; i >= 0; i--) {
    
          let size: number = Math.pow(10, (i +1) * 3);
    
          if (size <= number) {

            number = Math.round(number * decPlaces / size) / decPlaces;
  
            if ((number === 1000) && (i < abbrev.length -1)) number = 1, i++;

            (number as unknown as string) += abbrev[i];
            break;
          };
        };
    
        return String(number);
      },

      emojiNumber (number: number): string {

        return number.toString().replace(/([0-9])/g, (value: string) => {
          return {
            '0': `<a:Number_0:996127979048534096>`,
            '1': `<a:Number_1:996127984736010290>`,
            '2': `<a:Number_2:996127988523483157>`,
            '3': `<a:Number_3:996127995112730755>`,
            '4': `<a:Number_4:996128001479675935>`,
            '5': `<a:Number_5:996128008983285881>`,
            '6': `<a:Number_6:996128015920664617>`,
            '7': `<a:Number_7:996128022786740384>`,
            '8': `<a:Number_8:996128034388180992>`,
            '9': `<a:Number_9:996128041510113372>`,
          }[value];
        });
      },

      badge (badge: UserFlagsString, options: { icon?: boolean } = { icon: false }): UserFlagsString {

        let {
          icon,
        } = options;

        let badges: any;

        if (!icon) {

          badges = {
            'Staff': 'Discord Staff',
            'Partner': 'Partner',
            'CertifiedModerator': 'Discord Certified Moderator',
            'Hypesquad': 'HypeSquad Events',
  
            'HypeSquadOnlineHouse1': 'HypeSquad Bravery',
            'HypeSquadOnlineHouse2': 'HypeSquad Brilliance',
            'HypeSquadOnlineHouse3': 'HypeSquad Balance',
    
            'BugHunterLevel1': 'Bug Hunter',
            'BugHunterLevel2': 'Bug Hunter Gold',
    
            'VerifiedDeveloper': 'Early Verified Bot Developer',
            'PremiumEarlySupporter': 'Early Supporter',
          };

        } else if (icon) {

          badges = {
            'Staff': Emoji.Badge.Staff,
            'Partner': Emoji.Badge.Partner,
            'CertifiedModerator': Emoji.Badge.CertifiedModerator,
            'Hypesquad': Emoji.Badge.HypesquadEvents,
  
            'HypeSquadOnlineHouse1': Emoji.Badge.HypesquadBravery,
            'HypeSquadOnlineHouse2': Emoji.Badge.HypesquadBrilliance,
            'HypeSquadOnlineHouse3': Emoji.Badge.HypesquadBalance,
    
            'BugHunterLevel1': Emoji.Badge.BugHunter,
            'BugHunterLevel2': Emoji.Badge.BugHunterGold,
    
            'VerifiedDeveloper': Emoji.Badge.VerifiedDeveloper,
            'PremiumEarlySupporter': Emoji.Badge.EarlySupporter,
          };
        };

        return badges[badge];
      },
    };

    this.terminal = {

      color ({ text, hex, bold = false }: { text: string, hex: any, bold?: boolean }): string {
  
        return bold ? chalk.bold.hex(hex)(text) : chalk.hex(hex)(text);
      },

      log ({ content }: { content: string | string[] }): void {

        return console.log(`${ctx.terminal.color({ text: `${moment().tz('Europe/Istanbul').format('hh:mm:ss')} |`, hex: `#FFFFFF`, bold: true })} ${content instanceof Array ? content.join('\n') : content}`);
      },

      title ({ content }: { content: string | string[] }): void {

        return console.log(`${content instanceof Array ? content.join('\n') : content}`);
      },
    };

    this.menu = {

      async paginate (interaction: CommandInteraction | SelectMenuInteraction | ButtonInteraction | ModalSubmitInteraction, options: PaginateMenu): Promise<void> {
      
        const {
          users = [ interaction.user, ...Data.Developers.map((developer: { id: string }) => ctx.client.users.cache.get(developer.id)) ],
          ephemeral = false,
          pageSize = 1,
          sorts,
          menus,
          embeds,
        } = options;
      
        let defaultStyles = {
          previous: 2,
          next: 2,
          search: 1,
          delete: 4,
        };
      
        let defaultEmojis = {
          previous: parseEmoji(Emoji.Button.Previous).id,
          next: parseEmoji(Emoji.Button.Next).id,
          search: parseEmoji(Emoji.Button.Search).id,
          delete: parseEmoji(Emoji.Button.Delete).id,
        };
      
        let current = {
          sort: 0,
          menu: 0,
          page: 1,
          first: 0,
          last: pageSize,
        };

        let parseArray = (input: Embed[] | string[]): input is string[] => {

          let value: `String` | `Embed` = typeof input[0] === `string` ? `String` : `Embed`;
        
          if (value === `String`) return true;
          else if (value === `Embed`) return false;
        };

        let menu: Array<{ emoji?: string; label?: string; description?: string; value: Embed[] | string[]; }> = (await menus(sorts ? sorts[current.sort].sort : undefined));

        if (parseArray(menu[0].value))  {
      
          await Promise.all(menu.map(async () => {
      
            if (menu[current.menu].value.length < 1) return current.menu = current.menu +1;
          }));
        };
      
        let value: Embed[] | string[] = menu[current.menu].value;

        if (!value.length) return await interaction.error_reply({ content: `Not enough data was found.` });
      
        let pages: number = parseArray(value) ? Math.ceil(value.length / pageSize) : value.length;
      
        let buttons = (status?: boolean): Button[] => {
      
          let checkPage = (button: ButtonNames): boolean => {
      
            if (([ 'previous' ] as ButtonNames[]).includes(button) && current.page === 1) return true;
            if (([ 'next' ] as ButtonNames[]).includes(button) && current.page === pages) return true;
      
            return false;
          };
      
          let buttons: ButtonNames[] = [];
      
          if (pages > 1) buttons = [ 'previous', 'next' ];
          if (pages > 2) buttons = [ ...buttons, 'search' ];
          if (!ephemeral) buttons = [ ...buttons, 'delete' ];
      
          return buttons.reduce((buttons: Button[], button: ButtonNames): Button[] => {
      
            buttons.push(new Button({ style: defaultStyles[button], emoji: { id: defaultEmojis[button] }, custom_id: button, disabled: status || checkPage(button) }));
      
            return buttons;
          }, []);
        };
      
        let components = async (status?: boolean): Promise<ActionRow<MessageActionRowComponent>[]> => {
      
          let components: ActionRow<MessageActionRowComponent>[] = [];
      
          if (sorts && sorts.length > 1 && parseArray(value)) components = [
      
            new ActionRow<MessageActionRowComponent>({
              components: [
                new SelectMenu({
                  custom_id: `sort`,
                  disabled: status,
                  options: await Promise.all(sorts.map((selectMenu: { emoji?: string; label?: string; description?: string; sort: (first: any, last: any) => number; }, index: number) => {
                    return {
                      emoji: selectMenu.emoji === undefined ? undefined : { id: selectMenu.emoji },
                      label: selectMenu.label || 'undefined',
                      description: selectMenu.description,
                      value: String(index),
                      default: index === current.sort,
                    };
                  })),
                }),
              ],
            }),
          ];
          
          if (menu.length > 1) components = [
      
            ...components,
            new ActionRow<MessageActionRowComponent>({
              components: [
                new SelectMenu({
                  custom_id: `list`,
                  disabled: status,
                  options: await Promise.all(menu.map((selectMenu: { emoji?: string; label?: string; description?: string; value: Embed[] | string[]; }, index: number) => {
                    return {
                      emoji: selectMenu.emoji === undefined ? undefined : { id: selectMenu.emoji },
                      label: selectMenu.label || 'undefined',
                      description: selectMenu.description,
                      value: String(index),
                      default: index === current.menu,
                    };
                  })),
                }),
              ],
            }),
          ];
      
          if (buttons().length > 0) components = [
      
            ...components,
            new ActionRow<MessageActionRowComponent>({
              components: buttons(status),
            }),
          ];
      
          return components;
        };
      
        let embed = async (): Promise<Embed[]> => {

          let oldEmbed: Embed = parseArray(value) ? embeds(value, current.first, current.last)[0] : value[current.page -1];
          let newEmbed: Embed = new Embed(oldEmbed.data);

          if (oldEmbed?.data.author?.name && oldEmbed.data.author.name === 'undefined' ) [ newEmbed.setAuthor({ name: parseArray(value) ? menu[current.menu].label : oldEmbed.data.author.name, iconURL: oldEmbed.data.author.icon_url }) ];
          if (!oldEmbed?.data.title && menu.length > 1 && oldEmbed?.data.author?.name && oldEmbed.data.author.name !== 'undefined' && parseArray(value)) [ newEmbed.setTitle(`${menu[current.menu].emoji ? ctx.client.emojis.cache.get(menu[current.menu].emoji) : ``} ${menu[current.menu].label}`) ];
          if (!oldEmbed?.data.author) [ newEmbed.setTitle(`${menu[current.menu].emoji ? ctx.client.emojis.cache.get(menu[current.menu].emoji) : ``} ${menu[current.menu].label}`) ];

          if (pages === 1) return [ newEmbed ];

          if (oldEmbed?.data.footer?.text) return [ newEmbed.setFooter({ text: `${oldEmbed.data.footer.text} | Page: ${current.page}/${pages}`, iconURL: oldEmbed.data.footer.icon_url }) ];

          return [ newEmbed.setFooter({ text: `Page: ${current.page}/${pages}`}) ];
        };
      
        let message: Message;

        if (interaction.replied) message = await interaction.editReply({ content: null, embeds: await embed(), components: await components() });
        if (!interaction.replied) message = await interaction.reply({ ephemeral, embeds: await embed(), components: await components(), fetchReply: true });
        
        let collector: InteractionCollector<ButtonInteraction> = message.createMessageComponentCollector({ componentType: ComponentType.Button, time: 5 * 60 * 1000 });
        let collector2: InteractionCollector<SelectMenuInteraction> = message.createMessageComponentCollector({ componentType: ComponentType.SelectMenu, filter: (selectMenu: SelectMenuInteraction) => selectMenu.customId === 'sort', time: 5 * 60 * 1000 });
        let collector3: InteractionCollector<SelectMenuInteraction> = message.createMessageComponentCollector({ componentType: ComponentType.SelectMenu, filter: (selectMenu: SelectMenuInteraction) => selectMenu.customId === 'list', time: 5 * 60 * 1000 });
    
        collector.on('end', async () => await interaction.editReply({ components: await components(true) }).catch(() => undefined));
        
        collector.on('collect', async (button: ButtonInteraction) => {
    
          if (!users.some((user: User) => user.id === button.user.id)) {
    
            await button.deferUpdate();
            
            await button.error_reply({ content: `You cannot use this button.` }); return;
          };
    
          let id: ButtonNames = button.customId as ButtonNames;
    
          if (id === 'previous') current.page--, current.first = current.first -pageSize, current.last = current.last -pageSize;
          if (id === 'next') current.page++, current.first = current.first +pageSize, current.last = current.last +pageSize;
          if (id === 'delete') return await interaction.deleteReply();
    
          if (id === 'search') {
    
            await button.showModal(
              new Modal({ custom_id: 'page-selection', title: `Page Selection` }).addComponents(
                new ActionRow<TextInput>().addComponents(
                  new TextInput({
                    type: 4,
                    style: 1,
                    custom_id: `page`,
                    label: `Select Page (1-${pages})`,
                    placeholder: `1-${pages}`,
                    value: String(current.page),
                    min_length: 1,
                    max_length: String(pages).length,
                    required: true,
                  }),
                ),
              ),
            );
    
            return await button.awaitModalSubmit({ filter: (modal: ModalSubmitInteraction) => modal.customId === 'page-selection', time: 5 * 60 * 1000 }).then(async (modal: ModalSubmitInteraction) => {

              let fields = {
                page: Number(modal.fields.getTextInputValue('page')),
              };
    
              if (isNaN(fields.page) || fields.page > pages) return await modal.error_reply({ content: `The value does not fit the format.` });
              if (fields.page === current.page) return await modal.error_reply({ content: `Enter page number other than the selected page.` });
    
              current.page = fields.page;
    
              current.first = current.page * pageSize -pageSize;
              current.last = current.page * pageSize;
    
              await interaction.editReply({ embeds: await embed(), components: await components() });
    
              if (modal.isFromMessage()) await modal.deferUpdate();
            }).catch(() => undefined);
          };
    
          await interaction.editReply({ embeds: await embed(), components: await components() });
    
          await button.deferUpdate();
        });
    
        collector2.on('collect', async (selectMenu: SelectMenuInteraction) => {
          
          if (!users.some((user: User) => user.id === selectMenu.user.id)) {
    
            await selectMenu.deferUpdate();
            
            await selectMenu.error_reply({ content: `You cannot use this select menu.` }); return;
          };
    
          current.sort = Number(selectMenu.values[0]);
    
          menu = (await menus(sorts ? sorts[current.sort].sort : undefined));
          value = menu[current.menu].value;
    
          await interaction.editReply({ embeds: await embed(), components: await components() });
    
          await selectMenu.deferUpdate();
        });
    
        collector3.on('collect', async (selectMenu: SelectMenuInteraction) => {
          
          if (!users.some((user: User) => user.id === selectMenu.user.id)) {
    
            await selectMenu.deferUpdate();
            
            await selectMenu.error_reply({ content: `You cannot use this select menu.` }); return;
          };

          if (menu[Number(selectMenu.values[0])].value.length < 1) return await selectMenu.error_reply({ content: `Not enough data was found.` }); 
    
          current.menu = Number(selectMenu.values[0]);
          current.page = 1;
    
          current.first = 0;
          current.last = pageSize;
    
          value = menu[current.menu].value;
    
          pages = parseArray(value) ? Math.ceil(value.length / pageSize) : value.length;
    
          await interaction.editReply({ embeds: await embed(), components: await components() });
    
          await selectMenu.deferUpdate();
        });
      },

      async paginateWithTransactions (interaction: CommandInteraction | SelectMenuInteraction | ButtonInteraction | ModalSubmitInteraction, options: PaginateWithTransactionsMenu): Promise<void> {
      
        const {
          users = [ interaction.user, ...Data.Developers.map((developer: { id: string }) => ctx.client.users.cache.get(developer.id)) ],
          ephemeral = false,
          pageSize = 1,
          sorts,
          filters,
          menus,
          transactions,
          embeds,
        } = options;
      
        let defaultStyles = {
          previous: 2,
          next: 2,
          search: 1,
          delete: 4,
        };
      
        let defaultEmojis = {
          previous: parseEmoji(Emoji.Button.Previous).id,
          next: parseEmoji(Emoji.Button.Next).id,
          search: parseEmoji(Emoji.Button.Search).id,
          delete: parseEmoji(Emoji.Button.Delete).id,
        };
      
        let current = {
          filter: 0,
          sort: 0,
          menu: 0,
          page: 1,
          first: 0,
          last: pageSize,
        };

        let parseArray = (input: Embed[] | (string[] | Promise<string>[])): input is (string[] | Promise<string>[]) => {

          let value: `String` | `Embed` = typeof input[0] === `string` ? `String` : `Embed`;
        
          if (value === `String`) return true;
          else if (value === `Embed`) return false;
        };

        let menu = (await menus(sorts ? sorts[current.sort].sort : undefined, filters));
        let transaction = transactions ? (await transactions.options(current.first, current.last, sorts ? sorts[current.sort].sort : undefined, filters ? filters[current.filter].filter : undefined)) : undefined;

        if (parseArray(menu[0].value))  {
      
          await Promise.all(menu.map(async () => {
      
            if (menu[current.menu].value.length < 1) return current.menu = current.menu +1;
          }));
        };
      
        let value: Embed[] | (string[] | Promise<string>[]) = menu[current.menu].value;
      
        if (!value.length) return await interaction.error_reply({ content: `Not enough data was found.` });
      
        let pages: number = parseArray(value) ? Math.ceil(value.length / pageSize) : value.length;
      
        let buttons = (status?: boolean): Button[] => {
      
          let checkPage = (button: ButtonNames): boolean => {
      
            if (([ 'previous' ] as ButtonNames[]).includes(button) && current.page === 1) return true;
            if (([ 'next' ] as ButtonNames[]).includes(button) && current.page === pages) return true;
      
            return false;
          };
      
          let buttons: ButtonNames[] = [];
      
          if (pages > 1) buttons = [ 'previous', 'next' ];
          if (pages > 2) buttons = [ ...buttons, 'search' ];
          if (!ephemeral) buttons = [ ...buttons, 'delete' ];
      
          return buttons.reduce((buttons: Button[], button: ButtonNames): Button[] => {
      
            buttons.push(new Button({ style: defaultStyles[button], emoji: { id: defaultEmojis[button] }, custom_id: button, disabled: status || checkPage(button) }));
      
            return buttons;
          }, []);
        };
      
        let components = async (status?: boolean): Promise<ActionRow<MessageActionRowComponent>[]> => {
      
          let components: ActionRow<MessageActionRowComponent>[] = [];
      
          if (sorts && sorts.length > 1 && parseArray(value)) components = [
      
            new ActionRow<MessageActionRowComponent>({
              components: [
                new SelectMenu({
                  custom_id: `sort`,
                  disabled: status,
                  options: await Promise.all(sorts.map((selectMenu: { emoji?: string; label?: string; description?: string; sort: (first: any, last: any) => number; }, index: number) => {
                    return {
                      emoji: selectMenu.emoji === undefined ? undefined : { id: selectMenu.emoji },
                      label: selectMenu.label || 'undefined',
                      description: selectMenu.description,
                      value: String(index),
                      default: index === current.sort,
                    };
                  })),
                }),
              ],
            }),
          ];
          
          if (menu.length > 1) components = [
      
            ...components,
            new ActionRow<MessageActionRowComponent>({
              components: [
                new SelectMenu({
                  custom_id: `list`,
                  disabled: status,
                  options: await Promise.all(menu.map((selectMenu: { emoji?: string; label?: string; description?: string; value: Embed[] | (string[] | Promise<string>[]); }, index: number) => {
                    return {
                      emoji: selectMenu.emoji === undefined ? undefined : { id: selectMenu.emoji },
                      label: selectMenu.label || 'undefined',
                      description: selectMenu.description,
                      value: String(index),
                      default: index === current.menu,
                    };
                  })),
                }),
              ],
            }),
          ];

          if (transactions && transaction.length > 0 && parseArray(value)) components = [

            ...components,
            new ActionRow<MessageActionRowComponent>({
              components: [
                new SelectMenu({
                  custom_id: `transaction`,
                  placeholder: transactions.placeholder,
                  disabled: status,
                  options: await Promise.all(transaction.map((selectMenu: { emoji?: string; label?: string; description?: string; value: string; execute: (...items: any[]) => Promise<void>; }) => {
                    return {
                      emoji: selectMenu.emoji === undefined ? undefined : { id: selectMenu.emoji },
                      label: selectMenu.label || 'undefined',
                      description: selectMenu.description,
                      value: selectMenu.value,
                    };
                  })),
                }),
              ],
            }),
          ];
      
          if (buttons().length > 0) components = [

            ...components,
            new ActionRow<MessageActionRowComponent>({
              components: buttons(status),
            }),
          ];
      
          return components;
        };
      
        let embed = async (): Promise<Embed[]> => {

          let oldEmbed: Embed = parseArray(value) ? embeds(value as string[], current.first, current.last)[0] : value[current.page -1];
          let newEmbed: Embed = new Embed(oldEmbed.data);

          if (oldEmbed?.data.author?.name && oldEmbed.data.author.name === 'undefined' ) [ newEmbed.setAuthor({ name: parseArray(value) ? menu[current.menu].label : oldEmbed.data.author.name, iconURL: oldEmbed.data.author.icon_url }) ];
          if (!oldEmbed?.data.title && menu.length > 1 && oldEmbed?.data.author?.name && oldEmbed.data.author.name !== 'undefined' && parseArray(value)) [ newEmbed.setTitle(`${menu[current.menu].emoji ? ctx.client.emojis.cache.get(menu[current.menu].emoji) : ``} ${menu[current.menu].label}`) ];
          if (!oldEmbed?.data.author) [ newEmbed.setTitle(`${menu[current.menu].emoji ? ctx.client.emojis.cache.get(menu[current.menu].emoji) : ``} ${menu[current.menu].label}`) ];

          if (pages === 1) return [ newEmbed ];

          if (oldEmbed?.data.footer?.text) return [ newEmbed.setFooter({ text: `${oldEmbed.data.footer.text} | Page: ${current.page}/${pages}`, iconURL: oldEmbed.data.footer.icon_url }) ];

          return [ newEmbed.setFooter({ text: `Page: ${current.page}/${pages}`}) ];
        };
      
        let message: Message;

        if (interaction.replied) message = await interaction.editReply({ content: null, embeds: await embed(), components: await components() });
        if (!interaction.replied) message = await interaction.reply({ ephemeral, embeds: await embed(), components: await components(), fetchReply: true });
      
        let collector: InteractionCollector<ButtonInteraction> = message.createMessageComponentCollector({ componentType: ComponentType.Button, time: 5 * 60 * 1000 });
        let collector2: InteractionCollector<SelectMenuInteraction> = message.createMessageComponentCollector({ componentType: ComponentType.SelectMenu, filter: (selectMenu: SelectMenuInteraction) => selectMenu.customId === 'sort', time: 5 * 60 * 1000 });
        let collector3: InteractionCollector<SelectMenuInteraction> = message.createMessageComponentCollector({ componentType: ComponentType.SelectMenu, filter: (selectMenu: SelectMenuInteraction) => selectMenu.customId === 'list', time: 5 * 60 * 1000 });
        let collector4: InteractionCollector<SelectMenuInteraction> = message.createMessageComponentCollector({ componentType: ComponentType.SelectMenu, filter: (selectMenu: SelectMenuInteraction) => selectMenu.customId === 'transaction', time: 5 * 60 * 1000 });

        collector.on('end', async () => await interaction.editReply({ components: await components(true) }).catch(() => undefined));
        
        collector.on('collect', async (button: ButtonInteraction) => {
    
          if (!users.some((user: User) => user.id === button.user.id)) {
    
            await button.deferUpdate();
            
            await button.error_reply({ ephemeral: true, content: `You cannot use this button.` }); return;
          };
    
          let id: ButtonNames = button.customId as ButtonNames;
    
          if (id === 'previous') current.page--, current.first = current.first -pageSize, current.last = current.last -pageSize;
          if (id === 'next') current.page++, current.first = current.first +pageSize, current.last = current.last +pageSize;
          if (id === 'delete') return await interaction.deleteReply();
    
          if (id === 'search') {
    
            await button.showModal(
              new Modal({ custom_id: 'page-selection', title: `Page Selection` }).addComponents(
                new ActionRow<TextInput>().addComponents(
                  new TextInput({
                    type: 4,
                    style: 1,
                    custom_id: `page`,
                    label: `Select Page (1-${pages})`,
                    placeholder: `1-${pages}`,
                    value: String(current.page),
                    min_length: 1,
                    max_length: String(pages).length,
                    required: true,
                  }),
                ),
              ),
            );
    
            return await button.awaitModalSubmit({ filter: (modal: ModalSubmitInteraction) => modal.customId === 'page-selection', time: 5 * 60 * 1000 }).then(async (modal: ModalSubmitInteraction) => {

              let fields = {
                page: Number(modal.fields.getTextInputValue('page'))
              };
    
              if (isNaN(fields.page) || fields.page > pages) return await modal.error_reply({ content: `The value does not fit the format.` });
              if (fields.page === current.page) return await modal.error_reply({ content: `Enter page number other than the selected page.` });
    
              current.page = fields.page;
    
              current.first = current.page * pageSize -pageSize;
              current.last = current.page * pageSize;
    
              await interaction.editReply({ embeds: await embed(), components: await components() });
    
              if (modal.isFromMessage()) await modal.deferUpdate();
            }).catch(() => undefined);
          };
    
          await interaction.editReply({ embeds: await embed(), components: await components() });
    
          await button.deferUpdate();
        });
    
        collector2.on('collect', async (selectMenu: SelectMenuInteraction) => {
          
          if (!users.some((user: User) => user.id === selectMenu.user.id)) {
    
            await selectMenu.deferUpdate();
            
            await selectMenu.error_reply({ content: `You cannot use this select menu.` }); return;
          };
    
          current.sort = Number(selectMenu.values[0]);

          transaction = transactions ? (await transactions.options(current.first, current.last, sorts ? sorts[current.sort].sort : undefined, filters ? filters[current.filter].filter : undefined)) : undefined;
    
          menu = (await menus(sorts ? sorts[current.sort].sort : undefined, filters ? filters : undefined));
          value = menu[current.menu].value;
    
          await interaction.editReply({ embeds: await embed(), components: await components() });
    
          await selectMenu.deferUpdate();
        });
    
        collector3.on('collect', async (selectMenu: SelectMenuInteraction) => {
          
          if (!users.some((user: User) => user.id === selectMenu.user.id)) {
    
            await selectMenu.deferUpdate();
            
            await selectMenu.error_reply({ content: `You cannot use this select menu.` }); return;
          };

          if (menu[Number(selectMenu.values[0])].value.length < 1) return await selectMenu.error_reply({ content: `Not enough data was found.` }); 
    
          current.filter = Number(selectMenu.values[0]);
          current.menu = Number(selectMenu.values[0]);
          current.page = 1;
    
          transaction = transactions ? (await transactions.options(current.first, current.last, sorts ? sorts[current.sort].sort : undefined, filters ? filters[current.filter].filter : undefined)) : undefined;

          current.first = 0;
          current.last = pageSize;
    
          value = menu[current.menu].value;
    
          pages = parseArray(value) ? Math.ceil(value.length / pageSize) : value.length;
    
          await interaction.editReply({ embeds: await embed(), components: await components() });
    
          await selectMenu.deferUpdate();
        });

        collector4.on('collect', async (selectMenu: SelectMenuInteraction) => {
          
          if (!users.some((user: User) => user.id === selectMenu.user.id)) {
    
            await selectMenu.deferUpdate();
            
            await selectMenu.error_reply({ content: `You cannot use this select menu.` }); return;
          };
    
          current.page = 1;
    
          current.first = 0;
          current.last = pageSize;

          if (value.length === 1) {

            await selectMenu.deferUpdate();

            await interaction.error_reply({ content: `Data cannot be deleted.` }); return;
          };

          await transaction[0].execute(await transactions.get(selectMenu.values[0]), selectMenu);

          transaction = transactions ? (await transactions.options(current.first, current.last, sorts ? sorts[current.sort].sort : undefined, filters ? filters[current.filter].filter : undefined)) : undefined;

          menu = (await menus(sorts ? sorts[current.sort].sort : undefined, filters ? filters : undefined));
          value = menu[current.menu].value;
    
          pages = parseArray(value) ? Math.ceil(value.length / pageSize) : value.length;

          await interaction.editReply({ embeds: await embed(), components: await components() });
    
          await selectMenu.deferUpdate();
        });
      },

      async eval (interaction: CommandInteraction | SelectMenuInteraction | ButtonInteraction | ModalSubmitInteraction, options: EvalMenu): Promise<void> {

        const {
          users = [ interaction.user ],
          ephemeral = false,
          pageSize = 1000,
          value,
          embeds,
        } = options;

        let defaultStyles = {
          previous: 2,
          next: 2,
          search: 1,
          delete: 4,
        };

        let defaultEmojis = {
          previous: parseEmoji(Emoji.Button.Previous).id,
          next: parseEmoji(Emoji.Button.Next).id,
          search: parseEmoji(Emoji.Button.Search).id,
          delete: parseEmoji(Emoji.Button.Delete).id,
        };

        let page: number = 1;

        let first: number = 0;
        let last: number = pageSize;

        let pages: number = Math.ceil(value.length / pageSize);

        let buttons = (status?: boolean): Button[] => {

          let checkPage = (button: ButtonNames): boolean => {

            if (([ 'previous' ] as ButtonNames[]).includes(button) && page === 1) return true;
            if (([ 'next' ] as ButtonNames[]).includes(button) && page === pages) return true;

            return false;
          };
  
          let buttons: ButtonNames[] = [];

          if (pages > 1) buttons = [ 'previous', 'next' ];
          if (pages > 2) buttons = [ ...buttons, 'search' ];
          if (!ephemeral) buttons = [ ...buttons, 'delete' ];
  
          return buttons.reduce((buttons: Button[], button: ButtonNames): Button[] => {

            buttons.push(new Button({ style: defaultStyles[button], emoji: { id: defaultEmojis[button] }, custom_id: button, disabled: status || checkPage(button) }));

            return buttons;
          }, []);
        };

        let components = (status?: boolean): ActionRow<MessageActionRowComponent>[] => {

          let components: ActionRow<MessageActionRowComponent>[] = [];

          if (buttons().length > 0) components = [

            new ActionRow<MessageActionRowComponent>({
              components: buttons(status),
            }),
          ];

          return components;
        };

        let embed = (): Embed[] => {

          let oldEmbed: Embed = embeds(value, first, last, page, pages)[0];
          let newEmbed: Embed = new Embed(oldEmbed.data);

          if (oldEmbed?.data.footer?.text) return [ newEmbed.setFooter({ text: oldEmbed.data.footer.text, iconURL: oldEmbed.data.footer.icon_url }) ];
          return [ newEmbed ];
        };

        let message: Message;

        if (interaction.replied) message = await interaction.editReply({ content: null, embeds: embed(), components: components() });
        if (!interaction.replied) message = await interaction.reply({ ephemeral, embeds: embed(), components: components(), fetchReply: true });

        let collector: InteractionCollector<ButtonInteraction> = message.createMessageComponentCollector({ componentType: ComponentType.Button, time: 5 * 60 * 1000 });

        collector.on('end', async () => await interaction.editReply({ components: components(true) }).catch(() => undefined));
        
        collector.on('collect', async (button: ButtonInteraction) => {

          if (!users.some((user: User) => user.id === button.user.id)) {

            await button.deferUpdate();
            
            await button.error_reply({ content: `You cannot use this button.` }); return;
          };

          let id: ButtonNames = button.customId as ButtonNames;
  
          if (id === 'previous') page--, first = first -pageSize, last = last -pageSize;
          if (id === 'next') page++, first = first +pageSize, last = last +pageSize;
          if (id === 'delete') return await interaction.deleteReply();

          if (id === 'search') {

            await button.showModal(
              new Modal({ custom_id: 'page-selection', title: `Page Selection` }).addComponents(
                new ActionRow<TextInput>().addComponents(
                  new TextInput({
                    type: 4,
                    style: 1,
                    custom_id: `page`,
                    label: `Select Page (1-${pages})`,
                    placeholder: `1-${pages}`,
                    value: String(page),
                    min_length: 1,
                    max_length: String(pages).length,
                    required: true,
                  }),
                ),
              ),
            );

            return await button.awaitModalSubmit({ filter: (modal: ModalSubmitInteraction) => modal.customId === 'page-selection', time: 5 * 60 * 1000 }).then(async (modal: ModalSubmitInteraction) => {

              let pageValue: number = Number(modal.fields.getTextInputValue('page'));

              if (isNaN(pageValue) || pageValue > pages) return await modal.error_reply({ content: `The value does not fit the format.` });
              if (pageValue === page) return await modal.error_reply({ content: `Enter page number other than the selected page.` });

              page = pageValue;

              first = page * pageSize -pageSize;
              last = page * pageSize;

              await interaction.editReply({ embeds: embed(), components: components() });

              if (modal.isFromMessage()) await modal.deferUpdate();
            }).catch(() => undefined);
          };
  
          await interaction.editReply({ embeds: embed(), components: components() });

          await button.deferUpdate();
        });
      },
    };
  };
};
