import {
  Embed,
  User,
} from '@discord';

export declare global {

  interface PaginateMenu {
  
    users?: User[];
    ephemeral?: boolean;
    pageSize?: number;
    sorts?: Array<{ emoji?: string; label?: string; description?: string; sort: (first: any, last: any) => number; }>,
    menus: (sort?: (first: any, last: any) => number) => Promise<Array<{ emoji?: string; label?: string; description?: string; value: Embed[] | string[]; }>>;
    embeds: (value: string[], first: number, last: number) => Embed[];
  };
  
  interface EvalMenu {

    users?: User[];
    ephemeral?: boolean;
    pageSize?: number;
    value: string;
    embeds: (value: string, firstIndex: number, lastIndex: number, page: number, pages: number) => Embed[];
  };

  interface PaginateWithTransactionsMenu {
  
    users?: User[];
    ephemeral?: boolean;
    pageSize?: number;
    sorts?: Array<{ emoji?: string; label?: string; description?: string; sort: (first: any, last: any) => number; }>;
    filters?: Array<{ emoji?: string; label?: string; description?: string; filter: (value: any) => boolean; }>;
    menus: (sort?: (first: any, last: any) => number, filters: Array<{ emoji?: string; label?: string; description?: string; filter: (value: any) => boolean; }>) => Promise<Array<{ emoji?: string; label?: string; description?: string; value: Embed[] | (string[] | Promise<string>[]); }>>;
    transactions?: { placeholder: string; get: (any: string) => Promise<any>; options: (first: number, last: number, sort?: (first: any, last: any) => number, filter?: (value: any) => boolean) => Promise<Array<{ emoji?: string; label?: string; description?: string; value: string; execute: (...items: any[]) => Promise<void>; }>>; };
    embeds: (value: string[], first: number, last: number) => Embed[];
  };
};