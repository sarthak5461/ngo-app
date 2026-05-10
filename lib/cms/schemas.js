// CMS Page Schemas — the "blueprint" for every editable page.
// Each page has sections; each section has fields; each field has a type.
// Field types: text | textarea | image | list (with itemFields)
import { IMG } from '@/lib/content'

const DEFAULT_NAV = [
  { label: 'Home', href: '/', enabled: true },
  { label: 'About', href: '/about', enabled: true },
  { label: 'Programs', href: '/programs', enabled: true },
  { label: 'CSR Activities', href: '/csr', enabled: true },
  { label: 'Blog', href: '/blog', enabled: true },
  { label: 'Volunteer', href: '/#volunteer', enabled: true },
  { label: 'Contact', href: '/contact', enabled: true },
]

const DEFAULT_FOOTER_LINKS = [
  { label: 'About Us', href: '/about' },
  { label: 'Programs', href: '/programs' },
  { label: 'CSR Activities', href: '/csr' },
  { label: 'Become a Member', href: '/membership' },
  { label: 'Blog & News', href: '/blog' },
  { label: 'Volunteer', href: '/#volunteer' },
]

export const PAGES = {
  header: {
    label: 'Header / Navbar',
    description: 'The top navigation bar that appears on every page.',
    href: '/',
    sections: [
      { id: 'logo', label: 'Logo & Brand', fields: [
        { key: 'header.logo.title', label: 'Brand Name', type: 'text', fallback: 'Maa Karma Devi' },
        { key: 'header.logo.subtitle', label: 'Brand Subtitle', type: 'text', fallback: 'Sangh Trust • since 2008' },
      ]},
      { id: 'nav', label: 'Menu Items', fields: [
        { key: 'header.nav', label: 'Navigation Links', type: 'list', fallback: DEFAULT_NAV, help: 'Drag to reorder. Toggle visibility per item.', itemFields: [
          { key: 'label', label: 'Label', type: 'text' },
          { key: 'href', label: 'Link URL', type: 'text' },
          { key: 'enabled', label: 'Visible', type: 'toggle' },
        ]},
      ]},
      { id: 'cta', label: 'Header CTA Button', fields: [
        { key: 'header.cta.label', label: 'Button Text', type: 'text', fallback: 'Become a Member' },
        { key: 'header.cta.href', label: 'Button Link', type: 'text', fallback: '/membership' },
      ]},
    ],
  },

  homepage: {
    label: 'Homepage',
    description: 'The main landing page — hero, about, programs, impact, gallery, blog, testimonials, volunteer.',
    href: '/',
    sections: [
      { id: 'hero', label: 'Hero Section', fields: [
        { key: 'home.hero.badge', label: 'Top Badge Text', type: 'text', fallback: 'Registered NGO • Serving since 2008' },
        { key: 'home.hero.headline', label: 'Main Headline', type: 'text', fallback: 'Hope has a home.', help: 'The last word "home." is highlighted in amber automatically.' },
        { key: 'home.hero.tagline', label: 'NGO Full Name', type: 'text', fallback: 'Shree Jagannath Swami Bhakt Shiromadi Maa Karma Devi Sangh Trust' },
        { key: 'home.hero.subline', label: 'Sub-headline / Description', type: 'textarea', fallback: 'A community-driven non-profit working across Education, Disaster Relief, Environment and Healthcare — with full transparency.' },
        { key: 'home.hero.image', label: 'Background Image', type: 'image', fallback: IMG.hero },
        { key: 'home.hero.ctaPrimary.label', label: 'Primary Button Text', type: 'text', fallback: 'Explore Our Programs' },
        { key: 'home.hero.ctaPrimary.href', label: 'Primary Button Link', type: 'text', fallback: '/programs' },
        { key: 'home.hero.ctaSecondary.label', label: 'Secondary Button Text', type: 'text', fallback: 'Join the Mission' },
        { key: 'home.hero.ctaSecondary.href', label: 'Secondary Button Link', type: 'text', fallback: '/membership' },
      ]},
      { id: 'about', label: 'About Section', fields: [
        { key: 'home.about.headline', label: 'Headline', type: 'text', fallback: 'A Trust born of devotion, grown by service.' },
        { key: 'home.about.body1', label: 'Paragraph 1', type: 'textarea', fallback: 'Founded in 2008 in the holy land of Odisha, the Trust began as a small community kitchen serving the elderly and homeless near the temples of Puri.' },
        { key: 'home.about.body2', label: 'Paragraph 2', type: 'textarea', fallback: 'Today, we are a pan-India movement working across four pillars — Education, Disaster Relief, Environment and Healthcare.' },
        { key: 'home.about.image', label: 'Section Image', type: 'image', fallback: IMG.about },
        { key: 'home.about.stat1.value', label: 'Stat 1 — Number', type: 'text', fallback: '17+' },
        { key: 'home.about.stat1.label', label: 'Stat 1 — Label', type: 'text', fallback: 'Years of selfless service' },
        { key: 'home.about.stat2.value', label: 'Stat 2 — Number', type: 'text', fallback: '4,200+' },
        { key: 'home.about.stat2.label', label: 'Stat 2 — Label', type: 'text', fallback: 'Lives transformed' },
      ]},
      { id: 'programs', label: 'Programs Section Header', fields: [
        { key: 'home.programs.headline', label: 'Headline', type: 'text', fallback: 'Four pillars, one purpose.' },
        { key: 'home.programs.subline', label: 'Sub-headline', type: 'textarea', fallback: 'Each programme is measurable, transparent, and run by volunteers from the communities we serve.' },
      ]},
      { id: 'impact', label: 'Impact Counter', fields: [
        { key: 'home.impact.headline', label: 'Headline', type: 'text', fallback: 'Numbers that mean lives.' },
        { key: 'home.impact.subline', label: 'Sub-headline', type: 'textarea', fallback: '17 years of service, audited every year, visible to everyone who supports us.' },
      ]},
    ],
  },

  about: {
    label: 'About Page',
    description: 'The dedicated /about page — story, values, mission, vision, trustees.',
    href: '/about',
    sections: [
      { id: 'hero', label: 'Hero', fields: [
        { key: 'about.hero.headline', label: 'Headline', type: 'text', fallback: 'A Trust born of devotion, grown by service.' },
        { key: 'about.hero.image', label: 'Hero Image', type: 'image', fallback: IMG.about },
      ]},
      { id: 'story', label: 'Our Story', fields: [
        { key: 'about.story.body', label: 'Story Body (full)', type: 'textarea', fallback: 'The Trust began in 2008, in a borrowed room three lanes from the Jagannath Temple in Puri…' },
      ]},
      { id: 'mission', label: 'Mission & Vision', fields: [
        { key: 'about.mission.text', label: 'Mission Statement', type: 'textarea', fallback: 'To uplift the most vulnerable sections of Indian society…' },
        { key: 'about.vision.text', label: 'Vision Statement', type: 'textarea', fallback: 'An India where every child is in school, every disaster victim is rescued within hours…' },
      ]},
    ],
  },

  // Program detail pages — same shape, one entry per program
  ...['education', 'disaster-relief', 'environment', 'healthcare'].reduce((acc, slug) => {
    const titles = {
      'education': 'Education Program', 'disaster-relief': 'Disaster Relief Program',
      'environment': 'Environment Program', 'healthcare': 'Healthcare Program',
    }
    acc[`program-${slug}`] = {
      label: titles[slug],
      description: `Edit the /${'/programs/'}${slug} page.`,
      href: `/programs/${slug}`,
      sections: [
        { id: 'hero', label: 'Hero', fields: [
          { key: `program.${slug}.title`, label: 'Title', type: 'text' },
          { key: `program.${slug}.tagline`, label: 'Tagline', type: 'text' },
          { key: `program.${slug}.image`, label: 'Hero Image', type: 'image' },
        ]},
        { id: 'description', label: 'Description', fields: [
          { key: `program.${slug}.shortDesc`, label: 'Short Description', type: 'textarea' },
          { key: `program.${slug}.longDesc`, label: 'Long Description', type: 'textarea' },
        ]},
        { id: 'cta', label: 'Donation CTA Text', fields: [
          { key: `program.${slug}.ctaLabel`, label: 'Donate Button Text', type: 'text' },
          { key: `program.${slug}.ctaSubtext`, label: 'CTA Subtext', type: 'textarea' },
        ]},
      ],
    }
    return acc
  }, {}),

  csr: {
    label: 'CSR Activities Page',
    description: 'The /csr page — corporate partnerships.',
    href: '/csr',
    sections: [
      { id: 'hero', label: 'Hero', fields: [
        { key: 'csr.hero.headline', label: 'Headline', type: 'text', fallback: 'CSR partnerships that deliver real, audited impact.' },
        { key: 'csr.hero.subline', label: 'Sub-headline', type: 'textarea' },
      ]},
      { id: 'cta', label: 'Contact CTA', fields: [
        { key: 'csr.cta.headline', label: 'Form Section Headline', type: 'text', fallback: 'Let\u2019s explore a partnership.' },
      ]},
    ],
  },

  membership: {
    label: 'Become a Member Page',
    description: 'The /membership page — hero, FAQs, form.',
    href: '/membership',
    sections: [
      { id: 'hero', label: 'Hero', fields: [
        { key: 'membership.hero.headline', label: 'Headline', type: 'text', fallback: 'Stand with the Trust. Become a member.' },
        { key: 'membership.hero.subline', label: 'Sub-headline', type: 'textarea' },
      ]},
      { id: 'token', label: 'Token Contribution Note', fields: [
        { key: 'membership.token.note', label: 'Note Text', type: 'textarea', fallback: 'We call it a support contribution, not a membership fee…' },
        { key: 'membership.token.minimum', label: 'Minimum Amount', type: 'text', fallback: '500' },
      ]},
    ],
  },

  contact: {
    label: 'Contact Page',
    description: 'The /contact page — address, phone, email.',
    href: '/contact',
    sections: [
      { id: 'info', label: 'Contact Information', fields: [
        { key: 'contact.address', label: 'Address', type: 'textarea', fallback: 'Trust Bhavan, Grand Road, Puri, Odisha 752001, India' },
        { key: 'contact.phone', label: 'Phone', type: 'text', fallback: '+91 99999 88888' },
        { key: 'contact.email1', label: 'Email — Contact', type: 'text', fallback: 'contact@maakarmadevitrust.org' },
        { key: 'contact.email2', label: 'Email — Membership', type: 'text', fallback: 'membership@maakarmadevitrust.org' },
        { key: 'contact.hours', label: 'Office Hours', type: 'text', fallback: 'Mon–Sat, 10 AM – 6 PM IST' },
      ]},
    ],
  },

  footer: {
    label: 'Footer',
    description: 'Site-wide footer — address, social, links, registration details.',
    href: '/',
    sections: [
      { id: 'about', label: 'About Block', fields: [
        { key: 'footer.about', label: 'Short Description', type: 'textarea', fallback: 'Maa Karma Devi Sangh Trust is a registered non-profit working across Education, Disaster Relief, Environment and Healthcare.' },
      ]},
      { id: 'links', label: 'Footer Links', fields: [
        { key: 'footer.links', label: 'Quick Links', type: 'list', fallback: DEFAULT_FOOTER_LINKS, itemFields: [
          { key: 'label', label: 'Label', type: 'text' },
          { key: 'href', label: 'URL', type: 'text' },
        ]},
      ]},
      { id: 'contact', label: 'Contact in Footer', fields: [
        { key: 'footer.address', label: 'Address', type: 'textarea', fallback: 'Trust Bhavan, Grand Road, Puri, Odisha 752001' },
        { key: 'footer.phone', label: 'Phone', type: 'text', fallback: '+91 99999 88888' },
        { key: 'footer.email', label: 'Email', type: 'text', fallback: 'contact@maakarmadevitrust.org' },
      ]},
      { id: 'social', label: 'Social Media Links', fields: [
        { key: 'footer.social', label: 'Social Links', type: 'list', fallback: [], itemFields: [
          { key: 'label', label: 'Platform', type: 'text' },
          { key: 'href', label: 'URL', type: 'text' },
        ]},
      ]},
      { id: 'legal', label: 'Legal & Registration', fields: [
        { key: 'footer.reg.trust', label: 'Trust Registration', type: 'text', fallback: 'Trust Reg: 432/2008' },
        { key: 'footer.reg.pan', label: 'PAN', type: 'text', fallback: 'PAN: AAATM0000K' },
        { key: 'footer.reg.12a', label: '12A', type: 'text', fallback: '12A: AAATM0000K/12A' },
        { key: 'footer.reg.80g', label: '80G', type: 'text', fallback: '80G: AAATM0000K/80G' },
        { key: 'footer.copyright', label: 'Copyright Notice', type: 'text', fallback: '© Maa Karma Devi Sangh Trust. All rights reserved.' },
      ]},
    ],
  },
}

// All keys this CMS manages — used by the public /api/content endpoint to know
// which content blocks are admin-managed.
export function getAllManagedKeys() {
  const keys = []
  for (const page of Object.values(PAGES)) {
    for (const section of page.sections) {
      for (const f of section.fields) keys.push(f.key)
    }
  }
  return keys
}

// Returns a map of every CMS-managed key to its hard-coded fallback value.
// Used to seed `content_blocks` on first run so the admin editor opens with
// populated fields and the public site reads identical values from the DB.
export function getDefaultsFromSchemas() {
  const out = {}
  for (const page of Object.values(PAGES)) {
    for (const section of page.sections) {
      for (const f of section.fields) {
        if (f.fallback !== undefined) out[f.key] = f.fallback
      }
    }
  }
  return out
}

export function getPagesList() {
  return Object.entries(PAGES).map(([slug, page]) => ({ slug, ...page }))
}
