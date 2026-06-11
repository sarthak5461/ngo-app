// CMS Page Schemas — the "blueprint" for every editable page.
// Each page has sections; each section has fields; each field has a type.
// Field types: text | textarea | image | list (with itemFields)
import { IMG } from "@/lib/content";
// import { IMG } from "../content.js";

const DEFAULT_NAV = [
  { label: "Home", href: "/", enabled: true },
  { label: "About", href: "/about", enabled: true },
  { label: "Programs", href: "/programs", enabled: true },
  { label: "CSR Activities", href: "/csr", enabled: true },
  { label: "Blog", href: "/blog", enabled: true },
  { label: "Volunteer", href: "/#volunteer", enabled: true },
  { label: "Contact", href: "/contact", enabled: true },
];

const DEFAULT_FOOTER_LINKS = [
  { label: "About Us", href: "/about" },
  { label: "Programs", href: "/programs" },
  { label: "CSR Activities", href: "/csr" },
  { label: "Become a Member", href: "/membership" },
  { label: "Blog & News", href: "/blog" },
  { label: "Volunteer", href: "/#volunteer" },
];

export const PAGES = {
  header: {
    label: "Header / Navbar",
    description: "The top navigation bar that appears on every page.",
    href: "/",
    sections: [
      {
        id: "branding",
        label: "Branding",
        fields: [
          {
            key: "header.brand.name",
            label: "Brand Name",
            type: "text",
            fallback: "Maa Karma Devi",
          },

          {
            key: "header.brand.subtitle",
            label: "Brand Subtitle",
            type: "text",
            fallback: "Sangh Trust • since 2008",
          },

          {
            key: "header.brand.logo",
            label: "Logo Image",
            type: "image",
            fallback: "/logo.png",
            help: "Upload or select logo image",
          },
        ],
      },

      {
        id: "nav",
        label: "Menu Items",
        fields: [
          {
            key: "header.nav",
            label: "Navigation Links",
            type: "list",
            fallback: DEFAULT_NAV,
            help: "Reorder and manage navigation items.",
            itemFields: [
              {
                key: "label",
                label: "Label",
                type: "text",
              },

              {
                key: "href",
                label: "Link URL",
                type: "text",
              },

              {
                key: "enabled",
                label: "Visible",
                type: "toggle",
              },

              {
                key: "external",
                label: "Open in new tab",
                type: "toggle",
              },
            ],
          },
        ],
      },

      {
        id: "cta",
        label: "Header CTA Button",
        fields: [
          {
            key: "header.cta.label",
            label: "Button Text",
            type: "text",
            fallback: "Become a Member",
          },

          {
            key: "header.cta.href",
            label: "Button Link",
            type: "text",
            fallback: "/membership",
          },

          {
            key: "header.cta.enabled",
            label: "Show CTA Button",
            type: "toggle",
            fallback: true,
          },
        ],
      },
    ],
  },

  homepage: {
    label: "Homepage",
    description:
      "The main landing page — hero, about, programs, impact, gallery, blog, testimonials, volunteer.",
    href: "/",
    sections: [
      {
        id: "hero",
        label: "Hero Section",
        fields: [
          {
            key: "home.hero.badge",
            label: "Top Badge Text",
            type: "text",
            fallback: "Registered NGO • Serving since 2008",
          },
          {
            key: "home.hero.headline",
            label: "Main Headline",
            type: "text",
            fallback: "Hope has a home.",
            help: 'The last word "home." is highlighted in amber automatically.',
          },
          {
            key: "home.hero.tagline",
            label: "NGO Full Name",
            type: "text",
            fallback:
              "Shree Jagannath Swami Bhakt Shiromadi Maa Karma Devi Sangh Trust",
          },
          {
            key: "home.hero.subline",
            label: "Sub-headline / Description",
            type: "textarea",
            fallback:
              "A community-driven non-profit working across Education, Disaster Relief, Environment and Healthcare — with full transparency.",
          },
          {
            key: "home.hero.image",
            label: "Background Image",
            type: "image",
            fallback: IMG.hero,
          },
          {
            key: "home.hero.ctaPrimary.label",
            label: "Primary Button Text",
            type: "text",
            fallback: "Explore Our Programs",
          },
          {
            key: "home.hero.ctaPrimary.href",
            label: "Primary Button Link",
            type: "text",
            fallback: "/programs",
          },
          {
            key: "home.hero.ctaSecondary.label",
            label: "Secondary Button Text",
            type: "text",
            fallback: "Join the Mission",
          },
          {
            key: "home.hero.ctaSecondary.href",
            label: "Secondary Button Link",
            type: "text",
            fallback: "/membership",
          },
        ],
      },
      {
        id: "about",
        label: "About Section",
        fields: [
          {
            key: "home.about.headline",
            label: "Headline",
            type: "text",
            fallback: "A Trust born of devotion, grown by service.",
          },
          {
            key: "home.about.body1",
            label: "Paragraph 1",
            type: "textarea",
            fallback:
              "Founded in 2008 in the holy land of Odisha, the Trust began as a small community kitchen serving the elderly and homeless near the temples of Puri.",
          },
          {
            key: "home.about.body2",
            label: "Paragraph 2",
            type: "textarea",
            fallback:
              "Today, we are a pan-India movement working across four pillars — Education, Disaster Relief, Environment and Healthcare.",
          },
          {
            key: "home.about.image",
            label: "Section Image",
            type: "image",
            fallback: IMG.about,
          },
          {
            key: "home.about.stat1.value",
            label: "Stat 1 — Number",
            type: "text",
            fallback: "17+",
          },
          {
            key: "home.about.stat1.label",
            label: "Stat 1 — Label",
            type: "text",
            fallback: "Years of selfless service",
          },
          {
            key: "home.about.stat2.value",
            label: "Stat 2 — Number",
            type: "text",
            fallback: "4,200+",
          },
          {
            key: "home.about.stat2.label",
            label: "Stat 2 — Label",
            type: "text",
            fallback: "Lives transformed",
          },
        ],
      },
      {
        id: "programs",
        label: "Programs Section Header",
        fields: [
          {
            key: "home.programs.headline",
            label: "Headline",
            type: "text",
            fallback: "Four pillars, one purpose.",
          },
          {
            key: "home.programs.subline",
            label: "Sub-headline",
            type: "textarea",
            fallback:
              "Each programme is measurable, transparent, and run by volunteers from the communities we serve.",
          },
        ],
      },
      {
        id: "impact",
        label: "Impact Counter",
        fields: [
          {
            key: "home.impact.headline",
            label: "Headline",
            type: "text",
            fallback: "Numbers that mean lives.",
          },
          {
            key: "home.impact.subline",
            label: "Sub-headline",
            type: "textarea",
            fallback:
              "17 years of service, audited every year, visible to everyone who supports us.",
          },
          {
            key: "home.impact.cards",
            label: "Impact Cards",
            type: "list",
            itemFields: [
              {
                key: "label",
                label: "Label",
                type: "text",
              },
              {
                key: "value",
                label: "Value",
                type: "text",
              },
              {
                key: "icon",
                label: "Icon",
                type: "text",
              },
            ],
          },
        ],
      },
      {
        id: "transparency",
        label: "Transparency",
        fields: [
          {
            key: "home.transparency.headline",
            label: "Headline",
            type: "text",
          },
          {
            key: "home.transparency.subline",
            label: "subline",
            type: "text",
          },
          {
            key: "home.transparency.cards",
            label: "Transparency Cards",
            type: "list",
            itemFields: [
              {
                key: "label",
                label: "Label",
                type: "text",
              },
              {
                key: "value",
                label: "Value",
                type: "text",
              },
              {
                key: "icon",
                label: "Icon",
                type: "text",
              },
            ],
          },
          {
            key: "home.transparency.buttonText",
            label: "Button Text",
            type: "text",
          },
          {
            key: "home.annualReport.pdf",
            label: "Annual Report PDF",
            type: "file",
          },
        ],
      },
      {
        id: "gallery",
        label: "Gallery Images",
        fields: [
          {
            key: "home.gallery.headline",
            label: "Headline",
            type: "text",
          },
          {
            key: "home.gallery.subline",
            label: "subline",
            type: "text",
          },
          {
            key: "home.gallery.images",
            label: "Gallery Images",
            type: "list",
            itemFields: [
              {
                key: "image",
                label: "Image",
                type: "image",
              },
            ],
          },
        ],
      },
    ],
  },

  about: {
    label: "About Page",
    description:
      "The dedicated /about page — story, values, mission, vision, trustees.",
    href: "/about",
    sections: [
      {
        id: "hero",
        label: "Hero",
        fields: [
          {
            key: "about.hero.headline",
            label: "Headline",
            type: "text",
          },
          {
            key: "about.hero.subline",
            label: "Subline",
            type: "text",
          },
          {
            key: "about.hero.image",
            label: "Hero Image",
            type: "image",
            fallback: IMG.about,
          },
        ],
      },
      {
        id: "story",
        label: "Our Story",
        fields: [
          {
            key: "about.story.headline",
            label: "Headline",
            type: "text",
          },
          {
            key: "about.story.body",
            label: "Story Body",
            type: "richtext",
          },
          {
            key: "about.story.points",
            label: "Key Points",
            type: "list",
            itemFields: [
              {
                key: "point",
                label: "Points",
                type: "text",
              },
            ],
          },
        ],
      },
      {
        id: "values",
        label: "What we stand for",
        fields: [
          {
            key: "about.values.headline",
            label: "Headline",
            type: "text",
          },
          {
            key: "about.values.cards",
            label: "Value Cards",
            type: "list",
            itemFields: [
              {
                key: "label",
                label: "Label",
                type: "text",
              },
              {
                key: "value",
                label: "Value",
                type: "text",
              },
              {
                key: "icon",
                label: "Icon",
                type: "text",
              },
            ],
          },
        ],
      },
      {
        id: "mission",
        label: "Mission & Vision",
        fields: [
          {
            key: "about.mission.cards",
            label: "Misson & Vision Cards",
            type: "list",
            itemFields: [
              {
                key: "label",
                label: "Label",
                type: "text",
              },
              {
                key: "value",
                label: "Value",
                type: "text",
              },
              {
                key: "icon",
                label: "Icon",
                type: "text",
              },
            ],
          },
        ],
      },
      {
        id: "trustees",
        label: "Trust Members",
        fields: [
          {
            key: "about.trustees.headline",
            label: "Headline",
            type: "text",
          },
          {
            key: "about.trustees.cards",
            label: "Members Cards",
            type: "list",
            itemFields: [
              {
                key: "name",
                label: "Name",
                type: "text",
              },
              {
                key: "position",
                label: "Position",
                type: "text",
              },
              {
                key: "value",
                label: "Summary",
                type: "text",
              },
            ],
          },
        ],
      },
      {
        id: "bottom_pane",
        label: "Bottom Pane",
        fields: [
          {
            key: "about.bottom_pane.headline",
            label: "Headline",
            type: "text",
          },
          {
            key: "about.bottom_pane.subline",
            label: "Subline",
            type: "text",
          },
          {
            key: "about.bottom_pane.program_button_text",
            label: "Program Button text",
            type: "text",
          },
          {
            key: "about.bottom_pane.program_button_link",
            label: "Program Button link",
            type: "link",
          },
          {
            key: "about.bottom_pane.vol_button_text",
            label: "Volunteer Button text",
            type: "text",
          },
          {
            key: "about.bottom_pane.vol_button_link",
            label: "Volunteer Button link",
            type: "link",
          },
        ],
      },
    ],
  },

  // Program detail pages — same shape, one entry per program

  csr: {
    label: "CSR Activities Page",
    description: "The /csr page — corporate partnerships.",
    href: "/csr",
    sections: [
      {
        id: "hero",
        label: "Hero",
        fields: [
          {
            key: "csr.hero.headline",
            label: "Headline",
            type: "text",
          },
          { key: "csr.hero.subline", label: "Sub-headline", type: "richtext" },
        ],
      },
      {
        id: "cards",
        label: "CSR Cards",
        fields: [
          {
            key: "csr.cards.cards",
            label: "CSR Cards",
            type: "list",
            itemFields: [
              {
                key: "label",
                label: "Label",
                type: "text",
              },
              {
                key: "content",
                label: "Content",
                type: "text",
              },
              {
                key: "icon",
                label: "Icon",
                type: "text",
              },
            ],
          },
        ],
      },
      {
        id: "partnerships",
        label: "Partnership Types",
        fields: [
          {
            key: "csr.partnerships.headline",
            label: "Headline",
            type: "text",
          },
          {
            key: "csr.partnerships.subline",
            label: "Subline",
            type: "text",
          },
          {
            key: "csr.partnerships.cards",
            label: "Partnership Cards",
            type: "list",
            itemFields: [
              {
                key: "label",
                label: "Title",
                type: "text",
              },
              {
                key: "icon",
                label: "Icon",
                type: "text",
              },
              {
                label: "Content",
                key: "contnet",
                type: "richtext",
              },
            ],
          },
        ],
      },
      {
        id: "partners",
        label: "Partners",
        fields: [
          {
            key: "csr.partners.headline",
            label: "Headline",
            type: "text",
          },
          {
            key: "csr.partners.partners",
            label: "Partners",
            type: "list",
            itemFields: [{ key: "partner", label: "Partner", type: "text" }],
          },
        ],
      },
      {
        id: "benifits",
        label: "Benifits",
        fields: [
          {
            key: "csr.benifits.headline",
            label: "Headline",
            type: "text",
          },
          {
            key: "csr.benifits.points",
            label: "Benifits Points",
            type: "list",
            itemFields: [
              {
                key: "label",
                label: "points",
                type: "text",
              },
            ],
          },
        ],
      },
      {
        id: "cta",
        label: "Contact CTA",
        fields: [
          {
            key: "csr.cta.headline",
            label: "Form Section Headline",
            type: "text",
            fallback: "Let\u2019s explore a partnership.",
          },
        ],
      },
    ],
  },

  membership: {
    label: "Become a Member Page",
    description: "The /membership page — hero, FAQs, form.",
    href: "/membership",
    sections: [
      {
        id: "hero",
        label: "Hero",
        fields: [
          {
            key: "membership.hero.headline",
            label: "Headline",
            type: "text",
          },
          {
            key: "membership.hero.subline",
            label: "Sub-headline",
            type: "textarea",
          },
        ],
      },
      {
        id: "why",
        label: "Why",
        fields: [
          {
            key: "membership.why.headline",
            label: "headline",
            type: "text",
          },
          {
            key: "membership.why.cards",
            label: "Why Cards",
            type: "list",
            itemFields: [
              {
                key: "label",
                label: "Label",
                type: "text",
              },
              {
                key: "value",
                label: "Value",
                type: "text",
              },
              {
                key: "icon",
                label: "Icon",
                type: "text",
              },
            ],
          },
        ],
      },
      {
        id: "token",
        label: "Token Contribution Note",
        fields: [
          {
            key: "membership.token.headline",
            label: "Note Headline",
            type: "text",
          },
          {
            key: "membership.token.note",
            label: "Note Text",
            type: "richtext",
          },
          {
            key: "membership.token.minimum",
            label: "Minimum Amount",
            type: "text",
            fallback: "500",
          },
        ],
      },
      {
        id: "faqs",
        label: "FAQs",
        fields: [
          {
            key: "membership.faqs.headline",
            label: "headline",
            type: "text",
          },
          {
            key: "membership.faqs.accordion",
            label: "Accordion",
            type: "list",
            itemFields: [
              {
                key: "title",
                label: "Acc title",
                type: "text",
              },
              {
                key: "content",
                label: "Acc content",
                type: "text",
              },
            ],
          },
        ],
      },
    ],
  },

  contact: {
    label: "Contact Page",
    description: "The /contact page — address, phone, email.",
    href: "/contact",
    sections: [
      {
        id: "hero",
        label: "Hero",
        fields: [
          {
            key: "contact.hero.headline",
            label: "Headline",
            type: "text",
          },
          {
            key: "contact.hero.subline",
            label: "Subline",
            type: "text",
          },
        ],
      },
      {
        id: "info",
        label: "Contact Information",
        fields: [
          {
            key: "contact.info.address",
            label: "Address",
            type: "textarea",
          },
          {
            key: "contact.info.phone",
            label: "Phone",
            type: "textarea",
          },
          {
            key: "contact.info.email",
            label: "Email — Contact",
            type: "textarea",
          },
          {
            key: "contact.info.hours",
            label: "Office Hours",
            type: "textarea",
          },
        ],
      },
    ],
  },

  footer: {
    label: "Footer",
    description:
      "Site-wide footer — address, social, links, registration details.",
    href: "/",
    sections: [
      {
        id: "about",
        label: "About Block",
        fields: [
          {
            key: "footer.about",
            label: "Short Description",
            type: "textarea",
            fallback:
              "Maa Karma Devi Sangh Trust is a registered non-profit working across Education, Disaster Relief, Environment and Healthcare.",
          },
        ],
      },
      {
        id: "links",
        label: "Footer Links",
        fields: [
          {
            key: "footer.links",
            label: "Quick Links",
            type: "list",
            fallback: DEFAULT_FOOTER_LINKS,
            itemFields: [
              { key: "label", label: "Label", type: "text" },
              { key: "href", label: "URL", type: "text" },
            ],
          },
        ],
      },
      {
        id: "contact",
        label: "Contact in Footer",
        fields: [
          {
            key: "footer.address",
            label: "Address",
            type: "textarea",
            fallback: "Trust Bhavan, Grand Road, Puri, Odisha 752001",
          },
          {
            key: "footer.phone",
            label: "Phone",
            type: "text",
            fallback: "+91 99999 88888",
          },
          {
            key: "footer.email",
            label: "Email",
            type: "text",
            fallback: "contact@maakarmadevitrust.org",
          },
        ],
      },
      {
        id: "social",
        label: "Social Media Links",
        fields: [
          {
            key: "footer.social",
            label: "Social Links",
            type: "list",
            fallback: [],
            itemFields: [
              { key: "label", label: "Platform", type: "text" },
              { key: "href", label: "URL", type: "text" },
            ],
          },
        ],
      },
      {
        id: "legal",
        label: "Legal & Registration",
        fields: [
          {
            key: "footer.reg.trust",
            label: "Trust Registration",
            type: "text",
            fallback: "Trust Reg: 432/2008",
          },
          {
            key: "footer.reg.pan",
            label: "PAN",
            type: "text",
            fallback: "PAN: AAATM0000K",
          },
          {
            key: "footer.reg.12a",
            label: "12A",
            type: "text",
            fallback: "12A: AAATM0000K/12A",
          },
          {
            key: "footer.reg.80g",
            label: "80G",
            type: "text",
            fallback: "80G: AAATM0000K/80G",
          },
          {
            key: "footer.copyright",
            label: "Copyright Notice",
            type: "text",
            fallback: "© Maa Karma Devi Sangh Trust. All rights reserved.",
          },
        ],
      },
    ],
  },
};

// All keys this CMS manages — used by the public /api/content endpoint to know
// which content blocks are admin-managed.
export function getAllManagedKeys() {
  const keys = [];
  for (const page of Object.values(PAGES)) {
    for (const section of page.sections) {
      for (const f of section.fields) keys.push(f.key);
    }
  }
  return keys;
}

// Returns a map of every CMS-managed key to its hard-coded fallback value.
// Used to seed `content_blocks` on first run so the admin editor opens with
// populated fields and the public site reads identical values from the DB.
export function getDefaultsFromSchemas() {
  const out = {};
  for (const page of Object.values(PAGES)) {
    for (const section of page.sections) {
      for (const f of section.fields) {
        if (f.fallback !== undefined) out[f.key] = f.fallback;
      }
    }
  }
  return out;
}

export function getPagesList() {
  return Object.entries(PAGES).map(([slug, page]) => ({ slug, ...page }));
}
