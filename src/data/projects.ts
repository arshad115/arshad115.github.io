export type Project = {
  name: string;
  description: string;
  href: string;
  image?: string;
  title?: string;
  role: string;
  stack: string[];
  status?: string;
};

export type ProjectGroup = {
  id: string;
  name: string;
  items: Project[];
};

export const projectGroups: ProjectGroup[] = [
  {
    id: 'open-source',
    name: 'Current open source',
    items: [
      {
        name: 'vault-linker',
        description:
          'A CLI and Obsidian community plugin that safely turns note-title mentions into wikilinks, with dry-run, audit, and unlink workflows.',
        href: '/development/introducing-vault-linker/',
        image: '/assets/images/posts/vault-linker/after.png',
        role: 'Creator and maintainer',
        stack: ['Python', 'TypeScript', 'Obsidian'],
        status: 'Active',
      },
      {
        name: 'today-i-learned',
        description:
          'A maintained, searchable notebook of concise programming, infrastructure, and command-line references.',
        href: '/today-i-learned/',
        role: 'Author and maintainer',
        stack: ['Markdown', 'Git', 'Astro'],
        status: 'Active',
      },
    ],
  },
  {
    id: 'android',
    name: 'Earlier Android work',
    items: [
      {
        name: 'mosques-nearby',
        description: 'Find the Mosques/Masjids nearest to your location.',
        href: 'https://play.google.com/store/apps/details?id=com.kookydroidapps.mosquesnearme',
        image: '/assets/images/repo_images/mosques-nearby.jpg',
        role: 'Product design and Android development',
        stack: ['Android', 'Java', 'Maps'],
        status: 'Earlier work',
      },
      {
        name: 'pakistani-recipes-in-urdu',
        description: 'Encrypted recipes in Urdu which also work offline. Recipes also deeplinked with Facebook.',
        href: 'https://play.google.com/store/apps/details?id=com.kookydroidapps.pakistanifoodrecipes.urdu',
        image: '/assets/images/repo_images/pakistani-recipes-in-urdu.jpg',
        role: 'Product design and Android development',
        stack: ['Android', 'Java', 'Offline data'],
        status: 'Earlier work',
      },
      {
        name: 'qibla-compass',
        description: 'Find the direction of Makkah based on your location.',
        href: 'https://play.google.com/store/apps/details?id=com.kookydroidapps.qiblacompass',
        image: '/assets/images/repo_images/qibla-compass.jpg',
        role: 'Product design and Android development',
        stack: ['Android', 'Java', 'Location'],
        status: 'Earlier work',
      },
      {
        name: 'surah-yaseen-urdu-recitation',
        description: 'Line by line recitation of Surah Yasin with multiple reciters.',
        href: 'https://play.google.com/store/apps/details?id=com.kookydroidapps.audiomp3.surahyaseenfree',
        image: '/assets/images/repo_images/surah-yaseen-urdu-recitation.jpg',
        role: 'Product design and Android development',
        stack: ['Android', 'Java', 'Audio'],
        status: 'Earlier work',
      },
      {
        name: 'uae-prayer-times',
        description:
          'Accurate prayer times in 12 hour/24 hour format. Find nearest mosques, maps, and Qibla direction.',
        href: 'https://play.google.com/store/apps/details?id=com.kookydroidapps.uae.unitedarabemiratesprayertimings',
        image: '/assets/images/repo_images/uae-prayer-times.jpg',
        role: 'Product design and Android development',
        stack: ['Android', 'Java', 'Location'],
        status: 'Earlier work',
      },
    ],
  },
  {
    id: 'csharp',
    name: 'Client and integration work',
    items: [
      {
        name: 'ms-access-db-sync',
        description:
          'Two-way sync between an Android app and a Microsoft Access desktop database using C# web services. Also the database architect for moving the database from Access to SQL Server.',
        href: 'https://www.kentech.ie/',
        role: 'Software development and database architecture',
        stack: ['C#', 'SQL Server', 'Android'],
        status: 'Client work',
      },
    ],
  },
  {
    id: 'javascript',
    name: 'Web work',
    items: [
      {
        name: 'orenhold-website',
        title: 'Orenhold',
        description: 'Single page website.',
        href: 'https://orenhold.no/',
        role: 'Frontend development',
        stack: ['JavaScript', 'HTML', 'CSS'],
        status: 'Client work',
      },
    ],
  },
  {
    id: 'microsoftbotframework',
    name: 'Experiments',
    items: [
      {
        name: 'langur',
        description:
          'Langur is a translation chatbot I made for translating from one language to another in chat apps.',
        href: '/portfolio/langur-language-translation-bot/',
        image: '/assets/images/repo_images/langur.jpg',
        role: 'Creator and developer',
        stack: ['Node.js', 'Microsoft Bot Framework', 'Translation APIs'],
        status: 'Archived experiment',
      },
    ],
  },
];
