export type Project = {
  name: string;
  description: string;
  href: string;
  image?: string;
};

export type ProjectGroup = {
  id: string;
  name: string;
  items: Project[];
};

export const projectGroups: ProjectGroup[] = [
  {
    id: 'android',
    name: 'Android',
    items: [
      {
        name: 'mosques-nearby',
        description: 'Find the Mosques/Masjids nearest to your location.',
        href: 'https://play.google.com/store/apps/details?id=com.kookydroidapps.mosquesnearme',
        image: '/assets/images/repo_images/mosques-nearby.jpg',
      },
      {
        name: 'pakistani-recipes-in-urdu',
        description: 'Encrypted recipes in Urdu which also work offline. Recipes also deeplinked with Facebook.',
        href: 'https://play.google.com/store/apps/details?id=com.kookydroidapps.pakistanifoodrecipes.urdu',
        image: '/assets/images/repo_images/pakistani-recipes-in-urdu.jpg',
      },
      {
        name: 'qibla-compass',
        description: 'Find the direction of Makkah based on your location.',
        href: 'https://play.google.com/store/apps/details?id=com.kookydroidapps.qiblacompass',
        image: '/assets/images/repo_images/qibla-compass.jpg',
      },
      {
        name: 'surah-yaseen-urdu-recitation',
        description: 'Line by line recitation of Surah Yasin with multiple reciters.',
        href: 'https://play.google.com/store/apps/details?id=com.kookydroidapps.audiomp3.surahyaseenfree',
        image: '/assets/images/repo_images/surah-yaseen-urdu-recitation.jpg',
      },
      {
        name: 'uae-prayer-times',
        description:
          'Accurate prayer times in 12 hour/24 hour format. Find nearest mosques, maps, and Qibla direction.',
        href: 'https://play.google.com/store/apps/details?id=com.kookydroidapps.uae.unitedarabemiratesprayertimings',
        image: '/assets/images/repo_images/uae-prayer-times.jpg',
      },
    ],
  },
  {
    id: 'csharp',
    name: 'C#',
    items: [
      {
        name: 'ms-access-db-sync',
        description:
          'Two-way sync between an Android app and a Microsoft Access desktop database using C# web services. Also the database architect for moving the database from Access to SQL Server.',
        href: 'https://www.kentech.ie/',
      },
    ],
  },
  {
    id: 'javascript',
    name: 'Javascript',
    items: [
      {
        name: 'orenhold-website',
        description: 'Single page website.',
        href: 'https://orenhold.no/',
      },
    ],
  },
  {
    id: 'microsoftbotframework',
    name: 'Microsoft Bot Framework',
    items: [
      {
        name: 'langur',
        description:
          'Langur is a translation chatbot I made for translating from one language to another in chat apps.',
        href: '/portfolio/langur-language-translation-bot/',
        image: '/assets/images/repo_images/langur.jpg',
      },
    ],
  },
];
