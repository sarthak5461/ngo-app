// ────────────────────────────────────────────────────────────
//  Maa Karma Devi Sangh Trust  —  Static content (Programs + Blog)
//  In Phase 2 (Admin dashboard) this will move to MongoDB.
// ────────────────────────────────────────────────────────────

export const NGO_FULL_NAME = 'Shree Jagannath Swami Bhakt Shiromadi Maa Karma Devi Sangh Trust'
export const NGO_SHORT = 'Maa Karma Devi Sangh Trust'

export const IMG = {
  hero: 'https://images.unsplash.com/photo-1758390286125-bd31d5c8f592?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NTY2NjZ8MHwxfHNlYXJjaHwxfHxJbmRpYSUyMHZvbHVudGVlcnMlMjBjb21tdW5pdHl8ZW58MHx8fHwxNzc4MzE0MjEzfDA&ixlib=rb-4.1.0&q=85',
  education: 'https://images.unsplash.com/flagged/photo-1574097656146-0b43b7660cb6?crop=entropy&cs=srgb&fm=jpg&ixid=M3w4NjAzNDR8MHwxfHNlYXJjaHwyfHxjaGlsZHJlbiUyMGNsYXNzcm9vbSUyMEluZGlhfGVufDB8fHx8MTc3ODMxNDIxM3ww&ixlib=rb-4.1.0&q=85',
  disaster: 'https://images.unsplash.com/photo-1588681805300-516bdf3e1539?crop=entropy&cs=srgb&fm=jpg&ixid=M3w4NjA1MDV8MHwxfHNlYXJjaHw0fHxkaXNhc3RlciUyMHJlbGllZiUyMHZvbHVudGVlcnN8ZW58MHx8fHwxNzc4MzE0MjEzfDA&ixlib=rb-4.1.0&q=85',
  environment: 'https://images.unsplash.com/photo-1777150895644-2ca253ee1c93?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NTY2OTV8MHwxfHNlYXJjaHwzfHx0cmVlJTIwcGxhbnRpbmclMjBlbnZpcm9ubWVudHxlbnwwfHx8fDE3NzgzMTQyMTN8MA&ixlib=rb-4.1.0&q=85',
  community: 'https://images.unsplash.com/photo-1524069290683-0457abfe42c3?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NTY2NjZ8MHwxfHNlYXJjaHwzfHxJbmRpYSUyMHZvbHVudGVlcnMlMjBjb21tdW5pdHl8ZW58MHx8fHwxNzc4MzE0MjIwfDA&ixlib=rb-4.1.0&q=85',
  about: 'https://images.unsplash.com/photo-1707760509904-1507ee621999?crop=entropy&cs=srgb&fm=jpg&ixid=M3w4NjA1OTV8MHwxfHNlYXJjaHw0fHxJbmRpYSUyMGNvbW11bml0eSUyMGhvcGV8ZW58MHx8fHwxNzc4MzE0MjIwfDA&ixlib=rb-4.1.0&q=85',
  healthcare: 'https://images.unsplash.com/photo-1596450514537-fae68a81346b?w=1600&q=85',
}

// ────────────────────────────────────────────────────────────
//  PROGRAMS
// ────────────────────────────────────────────────────────────
export const PROGRAMS = [
  {
    slug: 'education',
    title: 'Education for All',
    icon: 'GraduationCap',
    image: IMG.education,
    color: 'from-blue-700 to-blue-900',
    tagline: 'Books, schools, and second chances.',
    shortDesc: 'We sponsor underprivileged children, build village libraries, and run free coaching centres so no child is ever forced to drop out of school.',
    longDesc: 'Education is the most powerful lever to break generational poverty. Across Odisha, Jharkhand, West Bengal and Bihar, our Education Programme reaches 1,200+ children every year — from first-graders learning to read, to teenagers preparing for engineering and nursing entrance exams.',
    stats: [
      { label: 'Children supported', value: '1,200+' },
      { label: 'Libraries built', value: '24' },
      { label: 'Scholarships disbursed', value: '₹18L' },
      { label: 'Pass rate (Class X)', value: '94%' },
    ],
    initiatives: [
      { title: 'Bal Shiksha Scholarship', desc: 'Annual fees, books and uniforms for 800+ children from below-poverty-line families.' },
      { title: 'Village Library Project', desc: 'Solar-lit reading corners with books in Odia, Hindi & English in 24 villages — each open until 9 PM.' },
      { title: 'Free Evening Coaching', desc: 'Class 8–12 students get free coaching from retired teachers and volunteer engineers/doctors.' },
      { title: 'Girl-Child Drive', desc: 'Targeted re-enrolment of girls who dropped out due to early marriage or migration.' },
    ],
    howItWorks: [
      'Local volunteers identify out-of-school or at-risk children in target villages.',
      'A field officer verifies family income, school records and willingness.',
      'The Trust covers fees, uniform, books and a monthly stipend for the family.',
      'A volunteer mentor checks in every fortnight; quarterly progress reports are shared with sponsors.',
    ],
  },
  {
    slug: 'disaster-relief',
    title: 'Disaster Relief',
    icon: 'LifeBuoy',
    image: IMG.disaster,
    color: 'from-red-700 to-rose-900',
    tagline: 'On the ground when it matters most.',
    shortDesc: 'Rapid relief kits, food, shelter and medical aid for families struck by floods, cyclones and earthquakes — delivered within 24 hours.',
    longDesc: 'India faces a major natural disaster almost every year. Our Disaster Relief Wing maintains pre-positioned kits in three coastal warehouses (Puri, Kolkata, Vizag) and a roster of 240+ trained volunteers who can mobilise within 6 hours of an alert.',
    stats: [
      { label: 'Operations completed', value: '38' },
      { label: 'Families served', value: '14,000+' },
      { label: 'Avg. response time', value: '6 hrs' },
      { label: 'States reached', value: '11' },
    ],
    initiatives: [
      { title: 'Pre-positioned Relief Kits', desc: '5,000 kits ready at all times — 14-day food, water purifiers, ORS, tarpaulin, hygiene supplies.' },
      { title: 'Mobile Medical Camps', desc: 'Doctor-led camps deployed within 48 hours of a disaster zone declaration.' },
      { title: 'Shelter & Rebuild Programme', desc: 'Temporary shelters in week 1; permanent rebuilds for the worst-hit families over 6–12 months.' },
      { title: 'Trauma & Counselling', desc: 'Trained counsellors for children and women survivors — because rebuilding lives is more than rebuilding homes.' },
    ],
    howItWorks: [
      'IMD/NDMA alert is received — our state coordinators activate the volunteer roster.',
      'Within 6 hours, kits are dispatched from the nearest warehouse to the disaster zone.',
      'Field teams set up kitchens, medical camps and child-safe spaces within 24 hours.',
      'Long-term rebuild support continues for 6–12 months; donors get monthly updates.',
    ],
  },
  {
    slug: 'environment',
    title: 'Environment & Green Future',
    icon: 'Leaf',
    image: IMG.environment,
    color: 'from-emerald-700 to-emerald-900',
    tagline: 'A greener India for the next generation.',
    shortDesc: 'Tree plantation drives, clean-water initiatives, river cleanups and rural awareness camps — building a sustainable, climate-resilient Bharat.',
    longDesc: 'Climate change is no longer a tomorrow problem — our farmers and coastal villages are living it today. Our Environment Programme combines large-scale plantation drives with deep, localised work on water, waste and rural climate resilience.',
    stats: [
      { label: 'Saplings planted', value: '24,000+' },
      { label: 'Survival rate (Year 3)', value: '78%' },
      { label: 'Villages covered', value: '46' },
      { label: 'River cleanup drives', value: '32' },
    ],
    initiatives: [
      { title: 'Mahavriksha Drive', desc: 'Native tree plantations — neem, peepal, mahua — with 3-year care contracts (no abandoned saplings).' },
      { title: 'Clean Water for Villages', desc: 'Solar-powered water purifiers in 18 fluoride-affected villages.' },
      { title: 'Mahanadi River Watch', desc: 'Monthly cleanup drives + plastic waste collection + awareness camps along the Mahanadi.' },
      { title: 'School Eco-Clubs', desc: '40+ school eco-clubs running composting, rainwater harvesting and local biodiversity surveys.' },
    ],
    howItWorks: [
      'Site selection: degraded common land, school grounds or public spaces with community consent.',
      'Saplings sourced from Forest Department / certified nurseries; native species only.',
      'Local caretaker hired for 3 years — watering, fencing, pest control.',
      'Quarterly survival audits with photos shared with all donors.',
    ],
  },
  {
    slug: 'healthcare',
    title: 'Healthcare Support',
    icon: 'Stethoscope',
    image: IMG.healthcare,
    color: 'from-rose-700 to-rose-900',
    tagline: 'Care that travels to where it’s needed.',
    shortDesc: 'Free medical camps, subsidised medicines for the elderly, and 24×7 ambulance support for villages with no nearby clinic.',
    longDesc: 'Across the rural belts where we work, the nearest doctor is often 30 km away. Our Healthcare Support programme brings basic primary care to the doorstep — from pop-up medical camps every month, to subsidised medicines for elderly patients living below the poverty line, to a small fleet of ambulances that have ferried hundreds of expectant mothers and emergency patients to district hospitals.',
    stats: [
      { label: 'Patients seen', value: '8,200+' },
      { label: 'Health camps held', value: '76' },
      { label: 'Medicines distributed', value: '₹12L' },
      { label: 'Ambulance trips', value: '340+' },
    ],
    initiatives: [
      { title: 'Mobile Medical Camps', desc: 'Once-a-month free general OPD camps with a doctor, ANM and basic diagnostics in remote villages.' },
      { title: 'Elderly Medicine Programme', desc: 'Subsidised long-term medicines (BP, diabetes, joint pain) for patients above 60 living below the poverty line.' },
      { title: '24×7 Ambulance Network', desc: 'Two ambulances responding to maternal-care and emergency calls in our operating clusters.' },
      { title: 'Awareness & Screening Drives', desc: 'TB, anaemia, tobacco and mental-health awareness camps in schools and panchayats.' },
    ],
    howItWorks: [
      'Local ASHA workers identify high-need patients in target villages.',
      'Medical camps are scheduled monthly with rotating specialists — paediatricians, gynaecologists, ophthalmologists.',
      'Eligible patients are enrolled into our medicine subsidy programme with quarterly verification.',
      'Ambulance dispatch is handled by a small 24×7 control room in Cuttack.',
    ],
  },
]

export const PROGRAM_BY_SLUG = Object.fromEntries(PROGRAMS.map(p => [p.slug, p]))

// Cause-driven CTA labels per program (no aggressive "Donate" wording).
export const PROGRAM_DONATE_LABEL = {
  'education': 'Support Child Education',
  'disaster-relief': 'Help Families Recover',
  'environment': 'Contribute to Environmental Change',
  'healthcare': 'Support Healthcare Access',
  'general': 'Support the Cause',
}

// "How your support helps" tier breakdown — shown on each program detail page.
export const SUPPORT_TIERS = {
  'education': [
    { amount: 500, helps: 'Books, notebooks and a uniform set for one child for a full term.' },
    { amount: 2500, helps: 'A full scholarship for one underprivileged student for a year.' },
    { amount: 10000, helps: 'Runs an entire village library for a quarter — books, light, librarian.' },
  ],
  'disaster-relief': [
    { amount: 500, helps: 'A 14-day relief kit for one displaced person — food, water purifier, hygiene.' },
    { amount: 2500, helps: 'A complete relief kit for an entire family of five.' },
    { amount: 10000, helps: 'Funds a mobile medical camp for a day inside a disaster zone.' },
  ],
  'environment': [
    { amount: 500, helps: 'Plants and protects 10 native saplings for 3 years (with caretaker support).' },
    { amount: 2500, helps: 'Funds a rainwater-harvesting installation in one school.' },
    { amount: 10000, helps: 'Sponsors clean-water access for an entire village for a month.' },
  ],
  'healthcare': [
    { amount: 500, helps: 'Free general check-up and basic medicines for 5 villagers.' },
    { amount: 2500, helps: 'A month of subsidised medicines for 4 elderly patients with chronic illness.' },
    { amount: 10000, helps: 'Funds a full-day mobile health camp with a doctor and ANM in a remote village.' },
  ],
}

// ────────────────────────────────────────────────────────────
//  BLOG POSTS
//  Each block in `content` is { type: 'p'|'h2'|'quote'|'list', text|items }
// ────────────────────────────────────────────────────────────
export const BLOG_POSTS = [
  {
    slug: 'rapid-response-team',
    title: 'How Our 24-Hour Rapid Response Team Works',
    category: 'disaster-relief',
    author: 'Pratap Mohanty',
    authorRole: 'Head of Disaster Operations',
    date: '2025-04-12',
    readTime: '6 min read',
    image: IMG.disaster,
    excerpt: 'When Cyclone Remal made landfall in May, our team had food kitchens running in three districts within fourteen hours. Here is the playbook.',
    content: [
      { type: 'p', text: 'On the night of 26 May 2024, Cyclone Remal slammed into the Bengal-Odisha coast with winds touching 135 km/h. By 7 AM the next morning, our volunteer Whatsapp group had 312 messages, our Puri warehouse was unloaded, and three convoy trucks were already on NH-16 headed north.' },
      { type: 'p', text: 'For most NGOs, the bottleneck in disaster relief is not money or willingness — it is logistics. Roads are flooded. Phones are dead. Local administration is overwhelmed. We’ve spent 17 years building a system to cut through that fog.' },
      { type: 'h2', text: 'The 6-hour activation window' },
      { type: 'p', text: 'The moment IMD issues a Red alert, our State Coordinator triggers the response tree. Within 60 minutes, volunteer captains in every district must respond YES/NO to deployment. By hour 3, kits are being loaded. By hour 6, trucks are moving.' },
      { type: 'p', text: 'We never wait for a disaster to be “official.” Pre-positioning is everything. Our three warehouses (Puri, Kolkata, Vizag) hold 5,000 ready-to-distribute kits at all times, each containing 14 days of dry rations, water purification tablets, ORS, a tarpaulin, hygiene supplies and a torch.' },
      { type: 'h2', text: 'Boots on ground, not flags on map' },
      { type: 'quote', text: 'You don’t need to look like a hero. You need to be there before the cameras arrive, and stay long after they leave.' },
      { type: 'p', text: 'Our second principle is to never duplicate. We coordinate daily with NDRF, district magistrates and other registered NGOs to ensure each village is covered exactly once. Two relief trucks in one village while another stays empty is inexcusable.' },
      { type: 'h2', text: 'The long tail nobody sees' },
      { type: 'p', text: 'The hardest work is not week one — it is months 2 through 12, when news cycles have moved on but families are still living under tarpaulins. That is when we shift from rations to rebuild: classrooms, livelihood kits, mental health support.' },
      { type: 'p', text: 'Every donation tagged “Disaster Relief” on our website goes into this rotating fund. Even when there is no active disaster, we are using it to refill warehouses and train volunteers — so that when the next siren sounds, we are six hours ahead, not behind.' },
    ],
  },
  {
    slug: 'kavita-graduate-story',
    title: 'Meet Kavita: From Dropout to College Graduate',
    category: 'education',
    author: 'Sunita Behera',
    authorRole: 'Programme Lead, Education',
    date: '2025-03-08',
    readTime: '5 min read',
    image: IMG.education,
    excerpt: 'Eight years ago Kavita was pulled out of Class 6 to look after her younger siblings. Last week, she walked into a B.A. classroom in Cuttack as a paying college student.',
    content: [
      { type: 'p', text: 'There is a photograph in our Cuttack office of a small, serious girl in a blue salwar-kameez, hair pulled into two tight braids, holding a Class 6 Hindi textbook. The photograph is from 2017. The girl is Kavita Sahu. The textbook was the last one she ever owned, until we found her again.' },
      { type: 'h2', text: 'The day school stopped' },
      { type: 'p', text: 'Kavita’s mother died of tuberculosis when Kavita was 11. Her father, a daily-wage construction worker, did what most fathers in his situation are forced to do: he kept the eldest daughter at home to mind the two younger ones while he worked twelve-hour shifts in Bhubaneswar.' },
      { type: 'p', text: 'For three years, Kavita’s world shrank to a one-room house, a kerosene stove, and the school bell of her old classroom — audible from the lane outside but no longer hers.' },
      { type: 'h2', text: 'The visit that changed everything' },
      { type: 'p', text: 'In 2020, our Girl-Child Drive volunteer Rajshree visited Kavita’s village to identify out-of-school adolescent girls. She found Kavita stirring dal at noon, a school book she had borrowed from a neighbour open beside her on the floor.' },
      { type: 'quote', text: '“I didn’t want to forget how to read. I was scared that one day I would.” — Kavita, on why she kept reading after dropping out.' },
      { type: 'p', text: 'Within a month, the Trust enrolled Kavita in our Bridge Course — nine months of intensive coaching to catch up on the four years she had missed. We paid for childcare for her siblings during class hours. Her father, who had wept the day he pulled her out of school, now walked her to the Bridge classroom every morning.' },
      { type: 'h2', text: 'Five years later' },
      { type: 'p', text: 'In April 2025, Kavita scored 84% in her Class 12 board exams — the highest in her village. She is now a first-year B.A. student at Ravenshaw University, on a full scholarship from our Bal Shiksha programme.' },
      { type: 'p', text: 'She wants to be a teacher. Specifically, she wants to come back to her village and run a Bridge classroom of her own.' },
      { type: 'p', text: 'Every ₹1,000 you give to our Education programme either keeps a Kavita in school, or brings one back to it. There is no third option.' },
    ],
  },
  {
    slug: 'cyclone-yaas-one-year',
    title: 'Cyclone Yaas: One Year Later — A Photo Diary',
    category: 'disaster-relief',
    author: 'Field Team',
    authorRole: 'Bay-of-Bengal Operations',
    date: '2025-02-22',
    readTime: '4 min read',
    image: IMG.community,
    excerpt: 'Twelve months on from Cyclone Yaas, our team returned to Balasore. The roads have changed. The roofs are mostly back. The children have not forgotten.',
    content: [
      { type: 'p', text: 'Cyclone Yaas made landfall on 26 May 2021 with peak winds of 140 km/h. It tore through Odisha and Bengal, displaced 1.5 lakh people in our operating zone alone, and was, at the time, the strongest cyclone our youngest volunteers had ever seen.' },
      { type: 'p', text: 'Twelve months later, our team returned to three of the worst-hit villages in Balasore — not to do an audit, but to listen.' },
      { type: 'h2', text: 'What rebuilds, and what doesn’t' },
      { type: 'p', text: 'Roofs come back. Schools repaint. Kitchens restart. But ask any child in Bahabalpur which year they were most afraid, and they will say 2021. The wind, they say, sounded like a goods train that never ended.' },
      { type: 'quote', text: '“We rebuilt their houses in three months. The trauma took longer than the bricks.” — Anjali Sahu, Counsellor' },
      { type: 'h2', text: 'The numbers behind the photographs' },
      { type: 'list', items: [
        '412 homes structurally repaired or rebuilt with our partner masons',
        '14 schools repainted, re-roofed and re-supplied with books',
        '1,800 children received trauma-counselling sessions over 18 months',
        '₹1.7 crore disbursed in livelihood-restart kits to fishermen and farmers',
      ] },
      { type: 'p', text: 'None of this happens with one-time emergency donations. The work that matters is the work that lasts twelve months — and that is the work your monthly giving makes possible.' },
    ],
  },
  {
    slug: 'tree-plantation-truth',
    title: 'Why Tree Plantation Alone Won’t Save Us',
    category: 'environment',
    author: 'Dr. Asha Patnaik',
    authorRole: 'Environment Programme Director',
    date: '2025-01-30',
    readTime: '7 min read',
    image: IMG.environment,
    excerpt: 'Every NGO loves a tree-plantation drive. Few of us talk about what happens to the saplings six months later. We owe our donors that conversation.',
    content: [
      { type: 'p', text: 'Tree plantation is the most photogenic activity in development work. Children with saplings, smiling officials with golden shovels, a clean before-and-after frame for the news camera. We do plenty of this work. But we owe our donors a more honest conversation.' },
      { type: 'h2', text: 'The 70% problem' },
      { type: 'p', text: 'A 2022 study by IIM-Ahmedabad found that 60–70% of saplings planted in NGO and government drives in eastern India are dead within 18 months. Goats. Drought. Neglect. No one to water them in summer.' },
      { type: 'p', text: 'Planting a tree without a 3-year care plan is theatre, not climate action. We say this not to shame the sector — we have made every one of these mistakes ourselves — but because the climate clock is running.' },
      { type: 'h2', text: 'What we do differently now' },
      { type: 'list', items: [
        'Native species only — neem, peepal, mahua, jamun. No eucalyptus, no acacia.',
        'Local caretaker hired and paid for three years per planting site.',
        'Fencing and tree-guards budgeted upfront — not as an afterthought.',
        'Quarterly survival audit with photographs, GPS-tagged, shared with donors.',
      ] },
      { type: 'h2', text: 'Beyond saplings' },
      { type: 'p', text: 'Plantations alone will not solve a climate crisis. The harder, less photogenic work is upstream: rainwater harvesting in drought-prone villages, low-cost solar dryers for farmers, eco-clubs in 40 schools that are turning the next generation into custodians of their own ponds and forests.' },
      { type: 'quote', text: '“The best time to plant a tree was twenty years ago. The second-best time is today — with a three-year care contract.”' },
      { type: 'p', text: 'When you donate to our Environment programme, you are not just funding saplings. You are funding the boring, expensive, three-year follow-through that makes the planting actually count.' },
    ],
  },
  {
    slug: 'village-school-programme',
    title: 'Inside Our Village School Programme',
    category: 'education',
    author: 'Manoj Pradhan',
    authorRole: 'Field Coordinator, Odisha',
    date: '2024-12-15',
    readTime: '5 min read',
    image: IMG.about,
    excerpt: 'A tour through one of our 24 village libraries — solar-lit, open till 9 PM, and the only place in many villages where a girl can study after sunset.',
    content: [
      { type: 'p', text: 'Walk into the village of Khordha at 7 PM and most homes are dark — either because the power has cut, or because kerosene has become too expensive to burn for studies. The one building still glowing is a tin-roofed room with a faded blue door. Children call it the Pothi-Ghar. We call it Library 17.' },
      { type: 'h2', text: 'Why the library matters more than the school' },
      { type: 'p', text: 'Most government schools in our operating zone have an attendance rate above 80% in the morning. The collapse happens in the evening — when there is no electricity, no quiet space at home, and no one in the family who has finished even Class 8.' },
      { type: 'p', text: 'Our 24 village libraries solve exactly that problem. Each is solar-powered, has 200–1,200 books in Odia/Hindi/English, and stays open from 4 PM to 9 PM seven days a week. A volunteer librarian — usually a college student from the village — helps with homework.' },
      { type: 'h2', text: 'What three years of data tells us' },
      { type: 'list', items: [
        'Class X pass rate jumped from 61% to 94% in our intervention villages.',
        '38% of girls who used the library went on to Class 12 — vs. 11% in non-library villages.',
        'Library running cost per child per month: ₹118.',
      ] },
      { type: 'p', text: 'For ₹118 a month — less than the cost of a single restaurant meal — a child gets a year of safe study time, mentorship, and access to books their school may never afford. Donate now to sponsor a child for an entire year.' },
    ],
  },
  {
    slug: 'annual-report-2024',
    title: 'Annual Report 2024: Where Every Rupee Went',
    category: 'general',
    author: 'Trustee Board',
    authorRole: 'Maa Karma Devi Sangh Trust',
    date: '2025-01-05',
    readTime: '3 min read',
    image: IMG.hero,
    excerpt: 'Total funds received: ₹ 4.62 crore. Programme spend: 87.4%. Admin: 8.1%. Reserves: 4.5%. Here is the breakdown, line by line.',
    content: [
      { type: 'p', text: 'In 2024, donors and partners contributed ₹ 4 crore 62 lakh to our work. Every rupee is accounted for, every line is third-party audited (M/s Behera & Co., Chartered Accountants, Bhubaneswar), and the full report is downloadable below.' },
      { type: 'h2', text: 'Top-line numbers' },
      { type: 'list', items: [
        'Total funds received: ₹ 4,62,30,114',
        'Programme expenditure: 87.4% (₹ 4,04,06,422)',
        'Administration & overheads: 8.1% (₹ 37,44,639)',
        'Reserves & contingency: 4.5% (₹ 20,79,053)',
      ] },
      { type: 'h2', text: 'Programme split' },
      { type: 'list', items: [
        'Education: ₹ 1.62 crore — 1,200+ children, 24 libraries, scholarships',
        'Disaster Relief: ₹ 1.78 crore — 4 active deployments, warehouse pre-positioning',
        'Environment: ₹ 64 lakh — 12,400 saplings, 18 villages with clean water',
      ] },
      { type: 'p', text: 'We hold ourselves to a strict 90/10 promise: at least 85% of every rupee donated must reach the field, every year. In 2024 we hit 87.4% — our best year yet.' },
      { type: 'quote', text: 'Trust isn’t built by the size of your work. It’s built by the size of your transparency.' },
      { type: 'p', text: 'Thank you to every single one of you — our 4,800 individual donors, 19 corporate partners, and 240+ volunteers. The next chapter of this Trust is being written by you.' },
    ],
  },
]

export const BLOG_BY_SLUG = Object.fromEntries(BLOG_POSTS.map(p => [p.slug, p]))

export const CATEGORY_LABEL = {
  education: 'Education',
  'disaster-relief': 'Disaster Relief',
  environment: 'Environment',
  general: 'Trust News',
}

export const CATEGORY_COLOR = {
  education: 'bg-blue-50 text-blue-800 border-blue-100',
  'disaster-relief': 'bg-rose-50 text-rose-800 border-rose-100',
  environment: 'bg-emerald-50 text-emerald-800 border-emerald-100',
  general: 'bg-amber-50 text-amber-800 border-amber-100',
}
