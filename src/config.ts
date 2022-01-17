export default {

  data: {

    developers: ['Developer ID'] as string[], 
    token: 'Client Token' as string,
    database: 'MongoDB URL' as string,
  },

  color: {

    default: '#2F3136' as unknown as number,

    success: '#3BA55D' as unknown as number,
    error: '#ED4245' as unknown as number,

    info: '#1593CB' as unknown as number,
    warning: '#CB8515' as unknown as number,
  },

  terminal: {

    color: {

      green: '#5DFF6A' as unknown as number,
      red: '#FF5D5D' as unknown as number,
      blue: '#5D86FF' as unknown as number,
      yellow: '#FFCB5D' as unknown as number,
    },
  },

  emoji: {

    blank: '875274727965462528' as string,

    success: '931054465480540190' as string,
    error: '931054474158542909' as string,

    info: '931054483767705610' as string,
    warning: '931054491820777522' as string,

    button: {

      first: '890905185218600980' as string,
      previous: '890905185260544020' as string,
      next: '890905184883064883' as string,
      last: '890905185398980638' as string,

      delete: '902176551561474110' as string,
    },

    guild: {
      
      tier_1: '876756659551227904' as string,
      tier_2: '876756662281699338' as string,
      tier_3: '876756661891641355' as string,
    },

    badge: {

      discord_employee: '875650347446710292' as string,
      partnered_server_owner: '875650433572564992' as string,
      certified_moderator: '875650446000283658' as string,
      hypesquad_events: '875650515151761420' as string,
  
      house_bravery: '875650549482156073' as string,
      house_brilliance: '875650570504003617' as string,
      house_balance: '875650584101928981' as string,
  
      bug_hunter: '875650614930051122' as string,
      bug_hunter_gold: '875650630293815317' as string,
  
      early_verified_bot_developer: '875650694714109962' as string,
      early_supporter: '875650742277537803' as string,

      nitro_subscriber: '875650765706907669' as string,
    },
  },
};