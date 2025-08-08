export const siteConfig = {
  title: 'Christon',
  description: 'Hip hop artist and producer. Music, news, merch, and more.',
  twitterHandle: 'christonwords',
  instagramHandle: 'christonwords',
  dsp: {
    spotify: 'https://open.spotify.com/artist/6LgDkSbPafoOa0Yl5HlIjG?si=fyAORRLsS-WCFhhg8qGaTw',
    apple: 'https://music.apple.com/us/artist/christon/1782316214',
    youtube: 'https://youtube.com/@christoncl',
    tiktok: 'https://www.tiktok.com/@christonwords',
  },
  analytics: {
    gaId: import.meta.env.VITE_GA_ID as string | undefined,
  },
  features: {
    aiDevEnabled: (import.meta.env.VITE_AI_DEV_ENABLED as string | undefined) === 'true',
  },
};