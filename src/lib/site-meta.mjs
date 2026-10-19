/** Site identity used by layouts, JSON-LD, and llms.txt. */
export const SITE = {
  title: 'Arshad Mehmood',
  homeTitle: 'Arshad Mehmood – Software Engineer at SAP (Germany) | Tech Blog',
  description:
    'Arshad Mehmood is a Software Engineer at SAP SE in Germany and founder of Kookydroid, specializing in Go, Kubernetes, DevOps, self-hosted systems, and Android development.',
  url: process.env.SITE_URL || 'https://arshadmehmood.com',
  author: 'Arshad Mehmood',
  givenName: 'Arshad',
  familyName: 'Mehmood',
  jobTitle: 'Software Engineer',
  disambiguatingDescription:
    'Software Engineer at SAP SE in Germany and M.Sc. Business Informatics graduate from the University of Mannheim, specializing in Go, Kubernetes, DevOps, self-hosted systems, and Android development.',
  location: 'Mannheim, Germany',
  locality: 'Mannheim',
  country: 'DE',
  locale: 'en_GB',
  language: 'en-GB',
  profileImage: '/assets/images/arshad-mehmood-software-engineer-germany.jpg',
  profileImageAlt: 'Arshad Mehmood - Software Engineer at SAP in Germany',
  defaultImage: '/assets/images/social-default.png',
  defaultImageAlt: 'Abstract software systems diagram in soft grey and teal',
  employer: {
    name: 'SAP SE',
    sameAs: 'https://www.wikidata.org/wiki/Q552581',
  },
  university: {
    name: 'University of Mannheim',
    sameAs: 'https://www.wikidata.org/wiki/Q317070',
  },
  knowsAbout: [
    'Software Engineering',
    'Go (Programming Language)',
    'Kubernetes',
    'DevOps',
    'Self-Hosting',
    'Android Development',
  ],
  github: 'https://github.com/arshad115',
  linkedin: 'https://www.linkedin.com/in/arshadmehmood115/',
  twitter: 'https://x.com/arshad115',
  twitterHandle: '@arshad115',
  instagram: 'https://instagram.com/arshad115',
  playStore: 'https://play.google.com/store/apps/dev?id=7044232667654327190',
};

export const PERSON_ID = `${SITE.url}/#person`;
export const WEBSITE_ID = `${SITE.url}/#website`;
export const BLOG_ID = `${SITE.url}/#blog`;
