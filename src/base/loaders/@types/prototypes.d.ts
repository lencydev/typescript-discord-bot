import {
  CommandInteraction,
  SelectMenuInteraction,
  ButtonInteraction,
  ModalSubmitInteraction,
  User,
  Guild,
  GuildEmoji,
} from '@discord';

export declare global {

  interface Date {

    toUnix (type?: 't' | 'T' | 'd' | 'D' | 'f' | 'F' | 'R'): string;
  };

  interface Number {

    toUnix (type?: 't' | 'T' | 'd' | 'D' | 'f' | 'F' | 'R'): string;
  };
};

export declare module 'discord.js' {

  interface CommandInteraction {

    success_reply ({ ephemeral, content, timeout }: { ephemeral?: boolean, content: string | string[], timeout?: number }): Promise<void>;
    error_reply ({ ephemeral, content }: { ephemeral?: boolean, content: string | string[] }): Promise<void>;
  };

  interface SelectMenuInteraction {

    success_reply ({ ephemeral, content, timeout }: { ephemeral?: boolean, content: string | string[], timeout?: number }): Promise<void>;
    error_reply ({ ephemeral, content }: { ephemeral?: boolean, content: string | string[] }): Promise<void>;
  };

  interface ButtonInteraction {

    success_reply ({ ephemeral, content, timeout }: { ephemeral?: boolean, content: string | string[], timeout?: number }): Promise<void>;
    error_reply ({ ephemeral, content }: { ephemeral?: boolean, content: string | string[] }): Promise<void>;
  };

  interface ModalSubmitInteraction {

    success_reply ({ ephemeral, content, timeout }: { ephemeral?: boolean, content: string | string[], timeout?: number }): Promise<void>;
    error_reply ({ ephemeral, content }: { ephemeral?: boolean, content: string | string[] }): Promise<void>;
  };

  interface User {

    badges (): string;
    link (block?: boolean): string;
  };

  interface Guild {

    link (bold?: boolean): string;
  };

  interface GuildEmoji {

    link (block?: boolean): string;
  };
};