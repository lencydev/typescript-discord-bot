import { Context } from '@context';

import { Color } from '@config';

import { init } from 'i18next';

import { sync } from 'glob';
import { resolve } from 'path';

export default async function (ctx: Context): Promise<void> {

  let resources: any = {};

  let languagesData: string[] = [];

  let languages: string[] = sync(resolve(`./src/base/languages/*.json`));

  if (languages.length > 0) {

    await Promise.all(languages.map(async (file: string) => {

      let language: string = file.split(`languages/`)[1].split(`.`)[0];

      languagesData.push(`${ctx.terminal.color({ text: language, hex: Color.Terminal.Green })} ${ctx.terminal.color({ text: `(${file.split(`languages/`)[1]})`, hex: Color.Terminal.Blue })}`);
  
      resources[language] = {
        translation: require(`../languages/${language}.json`),
      };
    }));

    ctx.terminal.title({
      content: [
        `${ctx.terminal.color({ text: `LANGUAGES (${languagesData.length})`, hex: `#FFFFFF`, bold: true })}`,
        ``,
        `${languagesData.map((value: string, row: number) => `  ${ctx.terminal.color({ text: `${row +1}.`, hex: `#FFFFFF`, bold: true })} ${value}`).join('\n')}`,
        ``,
      ],
    });
  };

  await init({
    fallbackLng: `en`,
    supportedLngs: [ `en`, `tr` ],
    returnObjects: false,
    debug: false,
    resources,
    interpolation: {
      prefix: `{`,
      suffix: `}`,
    },
  });
};