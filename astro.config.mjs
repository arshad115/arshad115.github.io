import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import starlight from '@astrojs/starlight';
import pagePlugin from '@pelagornis/page';
import sitegraphIntegration from 'starlight-site-graph/integration';

const analyticsId = 'UA-114855578-1';

export default defineConfig({
  site: 'https://arshadmehmood.com',
  output: 'static',
  trailingSlash: 'always',
  integrations: [
    sitemap(),
    starlight({
      plugins: [
        pagePlugin({
          siteTitle: 'Arshad Mehmood',
          navigation: [
            { href: '/', label: 'Home' },
            { href: '/posts/', label: 'Posts' },
            { href: '/today-i-learned/', label: 'Today I Learned' },
            { href: '/portfolio/', label: 'Portfolio' },
            { href: '/about/', label: 'About' },
          ],
          skipComponents: ['Footer'],
        }),
      ],
      title: 'Arshad Mehmood',
      description:
        'Personal blog by Arshad Mehmood covering software engineering, DevOps, Android, and continuous learning.',
      logo: {
        src: './public/assets/images/logo.png',
        alt: 'Arshad Mehmood',
      },
      favicon: '/assets/images/favicon.ico',
      customCss: [
        './src/styles/custom.css',
        'starlight-site-graph/styles/layers.css',
        'starlight-site-graph/styles/common.css',
        'starlight-site-graph/styles/starlight.css',
      ],
      social: [
        { icon: 'github', label: 'GitHub', href: 'https://github.com/arshad115' },
        { icon: 'linkedin', label: 'LinkedIn', href: 'https://www.linkedin.com/in/arshadmehmood115/' },
        { icon: 'twitter', label: 'Twitter', href: 'https://twitter.com/arshad115' },
      ],
      sidebar: [
        {
          label: 'Explore',
          items: [
            { label: 'Home', link: '/' },
            { label: 'About', link: '/about/' },
            { label: 'All Posts', link: '/posts/' },
            { label: 'Categories', link: '/categories/' },
            { label: 'Tags', link: '/tags/' },
            { label: 'Today I Learned', link: '/today-i-learned/' },
            { label: 'Portfolio', link: '/portfolio/' },
          ],
        },
        {
          label: 'Pages',
          collapsed: true,
          items: [
            { label: 'Resources', link: '/resources/' },
            { label: 'Newsletter', link: '/newsletter/' },
            { label: 'Resume', link: '/resume/' },
            { label: 'Support', link: '/support/' },
            { label: 'Contact', link: '/contact/' },
            { label: 'Terms', link: '/terms/' },
          ],
        },
      ],
      pagination: false,
      lastUpdated: true,
      credits: false,
      disable404Route: true,
      components: {
        Footer: './src/components/StarlightFooter.astro',
        PageTitle: './src/components/PageTitle.astro',
        PageSidebar: './src/components/PageSidebar.astro',
      },
      editLink: {
        baseUrl: 'https://github.com/arshad115/arshad115.github.io/edit/master/',
      },
      head: [
        {
          tag: 'meta',
          attrs: {
            name: 'theme-color',
            content: '#b8563d',
          },
        },
        {
          tag: 'script',
          attrs: {
            async: true,
            src: `https://www.googletagmanager.com/gtag/js?id=${analyticsId}`,
          },
        },
        {
          tag: 'script',
          content: `window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
gtag('js', new Date());
gtag('config', '${analyticsId}');`,
        },
      ],
    }),
    sitegraphIntegration({
      starlight: true,
      overridePageSidebar: false,
      backlinks: false,
      graph: true,
      trackVisitedPages: 'session',
      graphConfig: {
        actions: ['fullscreen', 'depth', 'reset-zoom', 'render-arrows', 'settings'],
        prefetchPages: false,
        enableDrag: true,
        enableZoom: true,
        enablePan: true,
        renderLabels: true,
        renderExternal: true,
        hoverDuration: 120,
        zoomDuration: 50,
        alphaDecay: 0.05,
      },
    }),
  ],
});
