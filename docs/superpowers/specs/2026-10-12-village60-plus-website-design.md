# Village 60 Plus Website Specification

**Status:** Draft for client verification and user review  
**Date:** 12 October 2026  
**Domain:** `https://www.village60plus.lk`  
**Primary market:** Families in Sri Lanka seeking care or later-living options  
**Primary conversion:** Phone call or WhatsApp conversation  
**Language at launch:** English  

## 1. Purpose

Create a premium, trustworthy, family-first marketing website that explains Village 60 Plus clearly, helps families identify an appropriate next step, and converts high-intent visitors into phone or WhatsApp conversations.

The site must present the complete Village 60 Plus ecosystem without implying that future services are already available. It must distinguish:

- **Village 60 Plus:** The parent brand and care provider.
- **Oracle:** The flagship independent-living residence.
- **Our Homes:** The residence portfolio.
- **Living & Care:** Care types and support options.
- **Silver Roots:** The broader services and care-discovery platform.
- **Destination Retirement:** The retirement-stay concept.
- **SAGE:** The technology layer supporting the ecosystem.

This project is a marketing website. It does not include the Silver Roots marketplace, online payments, resident or family accounts, provider accounts, care records, or SAGE application functionality.

## 2. Confirmed Product Decisions

- Use the full ecosystem described in the client brief.
- Prioritize adult children and family members researching care.
- Optimize the main conversion path for calls and WhatsApp.
- Launch in English only.
- Use Next.js with a headless CMS.
- Send form notifications by email and offer a WhatsApp continuation.
- Keep pricing private.
- Rewrite and consolidate the supplied copy while preserving verified facts.
- Give each residence a dedicated page.
- Give The Grove a dedicated, clearly labelled coming-soon page.
- Use public or licensed placeholder media initially and replace it later.
- Evolve the ivory, green, gold, and charcoal palette.
- Use a family-decision structure with Oracle as the flagship.
- Use the Fable-selected “Verandah” visual system in this specification.

## 3. Success Criteria

The website succeeds when:

- A visitor can understand what Village 60 Plus offers within 30 seconds.
- A family can distinguish independent living, residential care, respite, recovery, and rehabilitation without specialist knowledge.
- A visitor can reach Call or WhatsApp in one action from every page.
- Each residence clearly states who it suits, where it is, and what support is available.
- Current services and future concepts are labelled accurately.
- Oracle feels distinctive and premium without obscuring the wider care offering.
- The experience meets WCAG 2.2 AA and remains usable on mid-range mobile devices.
- Content editors can update residences, services, statuses, contact details, FAQs, and media without code changes.

## 4. Audience

### Primary

Adult children and family members in Sri Lanka who are:

- Concerned about a parent or relative living safely.
- Comparing homes or care options.
- Seeking short-term support after illness or surgery.
- Unsure which level of care is appropriate.
- Ready to call, message, or arrange a visit.

### Secondary

- Adults over 60 researching for themselves.
- Overseas relatives coordinating care in Sri Lanka.
- Independent adults interested in Oracle.
- Potential Silver Roots service partners.
- Prospective Destination Retirement customers.

### Audience needs

- Plain explanations rather than institutional terminology.
- Evidence of trust, safety, dignity, and continuity.
- Real photographs and specific residence information.
- Transparent next steps without requiring public pricing.
- Fast access to a person by phone or WhatsApp.

## 5. Positioning and Message Hierarchy

### Core promise

**Live well. Age exceptionally.**

Village 60 Plus provides homes, care, practical support, and new possibilities for later life—built around the individual rather than the institution.

### Supporting messages

1. Families do not need to know the exact care category before contacting the team.
2. Different people need different homes and levels of support.
3. Independence should be preserved wherever possible.
4. Village 60 Plus has operated in Sri Lanka for nearly two decades, subject to confirmation of the exact founding year.
5. Oracle represents a new standard of independent later living.
6. Silver Roots extends support beyond Village 60 Plus residences.
7. SAGE supports people and teams quietly; it is not the product being sold.

### Tone

- Warm, assured, clear, and dignified.
- Family-aware without speaking over the prospective resident.
- Premium without sounding like a hotel or property development.
- Honest about service boundaries and availability.
- Free from fear-based selling, infantilizing language, and unsupported superlatives.

## 6. Information Architecture

### Primary navigation

- Find the Right Care
- Our Homes
- Living & Care
- Oracle
- Silver Roots
- More
  - Destination Retirement
  - SAGE
  - Our Story
  - Contact

### Persistent actions

- Call
- WhatsApp

### Sitemap

- `/` — Home
- `/find-the-right-care`
- `/homes`
- `/homes/tranquility`
- `/homes/serenity`
- `/homes/house-on-the-hill`
- `/homes/enchanted-fields`
- `/oracle`
- `/homes/the-grove`
- `/living-and-care`
- `/living-and-care/independent-living`
- `/living-and-care/residential-care`
- `/living-and-care/respite-care`
- `/living-and-care/recovery`
- `/living-and-care/rehabilitation`
- `/silver-roots`
- `/destination-retirement`
- `/sage`
- `/our-story`
- `/contact`
- `/privacy`
- `/terms`
- `/accessibility`

Oracle uses `/oracle` as its only canonical URL. The Our Homes hub links to that URL rather than creating a duplicate `/homes/oracle` page.

Articles, news, a searchable care-home directory, and customer portals are excluded from the initial launch.

## 7. Primary User Journeys

### Family unsure what is needed

1. Arrives on Home.
2. Selects “Find the right care.”
3. Answers a short set of non-clinical questions.
4. Submits a phone number.
5. Receives confirmation and an optional prefilled WhatsApp link.
6. The team follows up by the stated response time.

The website must not diagnose or automatically recommend a medical treatment.

### Family comparing residences

1. Opens Our Homes.
2. Compares location, care type, atmosphere, and status.
3. Opens a residence page.
4. Reviews gallery, room information, care availability, team, and location.
5. Calls, starts WhatsApp, or submits an enquiry.

### Oracle prospect

1. Encounters Oracle on Home or opens Oracle directly.
2. Reviews the residence, rooms, daily life, shared spaces, and included support.
3. Requests a private visit using the Oracle-specific form.
4. Receives a confirmation and optional WhatsApp continuation.

### Recovery or respite enquiry

1. Opens Living & Care.
2. Selects Respite, Recovery, or Rehabilitation.
3. Reviews suitability, included support, expected process, and participating homes.
4. Calls or starts WhatsApp.

### Silver Roots partner

1. Opens Silver Roots.
2. Reads the current, verified platform scope.
3. Opens the partner-interest form.
4. Submits business and contact details.

## 8. Page Requirements

### 8.1 Home

The homepage must remain concise and contain eight visual sections:

1. **Hero**
   - Muted, caption-ready video with a still-image fallback.
   - “Live Well. Age Exceptionally.”
   - One supporting sentence.
   - Primary action: Find the Right Care.
   - Secondary action: Call Us.

2. **Find the Right Care**
   - Three pathways:
     - For a parent or relative.
     - For myself.
     - After hospital or surgery.

3. **Oracle**
   - The homepage’s main cinematic dark section.
   - Short flagship introduction.
   - Link to Oracle.
   - Private-visit action.

4. **Our Homes**
   - Residence cards for Tranquility, Serenity, House on the Hill, Enchanted Fields, Oracle, and The Grove.
   - Care-type and status labels.

5. **Living & Care**
   - Five scannable cards: Independent Living, Residential Care, Respite, Recovery, Rehabilitation.

6. **Silver Roots**
   - Explain how it extends support and helps people find services.
   - Avoid implying that marketplace functions are live unless verified.

7. **Destination Retirement and SAGE**
   - Two secondary cards.
   - Destination Retirement remains enquiry-led.
   - SAGE remains understated.

8. **Our Story and Contact**
   - Short trust statement.
   - Inline enquiry prompt.
   - Footer with contact and legal information.

### 8.2 Find the Right Care

Purpose: reduce uncertainty and begin a human conversation.

Required content:

- Reassurance that visitors do not need to know the formal care category.
- Plain-language explanation of the process.
- Short guided enquiry.
- Clear statement that the form is not a medical assessment.
- Phone and WhatsApp alternatives.
- Privacy link next to submission.

The form asks:

- Who the enquiry is for.
- Type of help being considered.
- Preferred residence or location, optional.
- Name.
- One contact method, preferably phone.

Do not request diagnoses, detailed medical histories, identification numbers, or payment information.

### 8.3 Our Homes

Purpose: compare the residence portfolio.

Required content:

- Introductory explanation of the portfolio.
- Filter or comparison controls for location, care type, and status.
- Consistent cards for all residences.
- “Which home may suit you?” guidance.
- Call and WhatsApp actions.
- Clear coming-soon treatment for The Grove.

### 8.4 Residence Template

Used by Tranquility, Serenity, House on the Hill, Enchanted Fields, and The Grove.

Required sections:

- Hero image, name, verified location, care-type labels, and operating status.
- “Who this home suits.”
- Distinctive atmosphere and daily life.
- Rooms and shared spaces.
- Care and support available at this location.
- Meals, housekeeping, activities, and family visits.
- Gallery using only correctly mapped images.
- Team or care-lead information where approved.
- Address, nearby landmarks, static map, directions, and visiting details.
- FAQs.
- Contextual enquiry, Call, and WhatsApp.

The Grove substitutes unavailable operational sections with honest coming-soon content and a register-interest form.

### 8.5 Oracle

Purpose: present the flagship independent-living residence and generate private visits.

Required sections:

- Cinematic hero and concise positioning.
- “Not an institution; a home designed around you” concept, subject to regulatory copy review.
- Ten named rooms:
  - Jade, Onyx, Ruby, Ivory, Coral.
  - Pearl, Amber, Sapphire, Opal, Emerald.
- Room facts and photography once verified.
- Shared spaces.
- “Live your day, your way.”
- Dining, housekeeping, laundry, maintenance, security, and everyday assistance.
- Optional Silver Roots services.
- SAGE overview limited to verified capabilities.
- Independence and changing-care-needs explanation.
- Location, map, and visit information.
- Private-visit form repeated at logical decision points.

The page must distinguish included services from paid or partner-arranged services.

### 8.6 Living & Care

Purpose: provide the site’s clearest practical explanation of available care.

The hub opens with five large choices:

- Independent Living.
- Residential Care.
- Respite Care.
- Recovery.
- Rehabilitation.

The hub also explains:

- Everyday care and personal support.
- Meals and dining.
- Housekeeping and laundry.
- Health and appointment coordination.
- Staying active.
- Family communication.
- Transport and personal services.
- How the team determines an appropriate option.
- What happens when Village 60 Plus is not the right fit.

Each care detail page must include:

- Who the service is for.
- Typical duration where relevant.
- What is included.
- What is delivered directly versus coordinated externally.
- Which residences offer it.
- What the enquiry and assessment process involves.
- FAQs and a contextual contact action.

No page may imply guaranteed outcomes.

### 8.7 Silver Roots

Purpose: explain the platform and capture enquiries without implementing the product.

Required sections:

- One-sentence distinction from Village 60 Plus.
- Current service categories, limited to verified availability.
- Find care.
- Support at home.
- Health and wellbeing coordination.
- Transport and appointment escorts.
- Everyday services.
- Recovery and respite support.
- Family benefits.
- Provider benefits.
- Three-step “How it works.”
- General enquiry and partner-interest forms.

Future app, payment, review, pricing, account, and provider-dashboard functions must be labelled as planned or omitted until verified.

### 8.8 Destination Retirement

Purpose: introduce the concept and collect qualified enquiries.

Required sections:

- Concept and intended audience.
- Sri Lanka as the initial destination.
- Longer stays rather than fast tourism.
- Accommodation types that are actually available or clearly described as planned.
- Optional wellness and practical services, subject to verification.
- Trial-stay concept.
- Silver Roots connection.
- Enquiry form.

The page must not imply confirmed properties, packages, healthcare, visas, insurance, or international destinations unless they are approved and bookable.

### 8.9 SAGE

Purpose: explain the role of technology without turning the website into a software pitch.

Required sections:

- “Technology in the background. Life in the foreground.”
- Benefits for residents, families, care teams, and management.
- Connection to Silver Roots.
- Privacy and permissions.
- Clear labels for available, pilot, and planned capabilities.

Prohibited:

- Robots, holograms, generic AI imagery, or invented dashboards.
- Claims that a family portal, voice interface, connected room, or automated care feature exists unless verified.

### 8.10 Our Story

Required content:

- Verified founding year and founder story.
- Leadership and relevant credentials.
- Evolution from residential care to the wider ecosystem.
- Verified milestones only.
- Current residences.
- Oracle, The Grove, Silver Roots, SAGE, and Destination Retirement as the next chapter, using accurate status language.
- Human values: dignity, privacy, choice, family, and independence.

### 8.11 Contact

Required content:

- Primary phone.
- WhatsApp.
- Email.
- Head-office address.
- Contact hours and expected response time.
- Residence addresses and directions.
- General enquiry form.
- Emergency disclaimer where legally and operationally appropriate.

## 9. Conversion and Form Behavior

### Global contact behavior

- Desktop header shows the phone number and WhatsApp action.
- Mobile shows a sticky Call and WhatsApp bar.
- No floating chatbot.
- No entry pop-up.
- Call uses a `tel:` link.
- WhatsApp uses an official `wa.me` link with page-specific prefilled context.

### General enquiry

- Opens as a right-side panel on desktop and bottom sheet on mobile.
- Uses no more than five primary fields.
- Sends a structured email to the configured team inbox.
- Displays a success state without losing the submitted context.
- Offers “Continue on WhatsApp.”
- States the expected response time.

### Oracle private visit

Fields:

- Name.
- Phone or WhatsApp.
- Preferred date.
- Preferred time.
- Number of visitors.
- Optional note.
- Privacy acknowledgement.

Submission sends an email with an Oracle-specific subject and offers WhatsApp continuation. It is a request, not instant calendar confirmation.

### Contextual forms

- Grove register interest.
- Silver Roots partner interest.
- Destination Retirement enquiry.

All use the shared form system with context-specific fields and email routing.

### Form errors

- Validate client-side for immediate guidance and server-side for security.
- Preserve entered values after recoverable errors.
- Place a text error next to each field and summarize errors at the top.
- Move focus to the error summary after failed submission.
- If email delivery fails, provide Call and WhatsApp immediately and log a non-sensitive failure event.
- Never expose internal error details.

### Abuse prevention

- Honeypot field.
- Server-side rate limiting.
- Origin checks.
- Optional invisible challenge only if abuse warrants it.
- No inaccessible CAPTCHA puzzles.

## 10. Visual System

The final Fable-selected concept is **Verandah**.

It takes its cues from a Sri Lankan verandah: warm plaster, deep green shade, polished brass, long sightlines, natural daylight, and family conversation. It must feel human, calm, and established rather than clinical, hotel-like, or technologically performative.

### Colors

Core:

- Warm Ivory `#F7F3EA` — default background.
- Deep Heritage Green `#18352D` — primary actions, dark sections, footer.
- Antique Gold `#A88A42` — lines, large icons, and restrained decorative accents.
- Charcoal `#20211F` — primary text.

Supporting:

- Paper `#FFFDF8` — cards and forms.
- Sand `#EDE6D6` — alternating sections and skeleton states.
- Stone `#D9D1BF` — borders and dividers.
- Bronze `#6F5A24` — accessible gold-family text on light backgrounds.
- Pale Gold `#D4B86A` — labels, focus, and icons on dark backgrounds.
- Oracle Night `#0F1F1B` — Oracle hero and deep cinematic surfaces.
- Mist `#E4EBE3` — care panels and selected light states.
- Leaf `#3F6B4F` — Silver Roots accent.
- Error `#9B2C2C`.

Rules:

- Do not use Antique Gold for body or small text on Ivory.
- Do not use white text on Antique Gold.
- Primary buttons use Heritage Green with Ivory text.
- WhatsApp’s brand green is used only where brand policy and contrast permit; standard site controls use the site palette.
- Dark treatments are reserved for Oracle, the SAGE hero, the footer, and one optional story quote band.

### Typography

- Display: **Fraunces**, variable, weight 500–600.
- Body and interface: **Source Sans 3**, variable, weight 400–600.
- Self-host both fonts using `next/font`.
- Desktop display: up to 60px.
- H1: 48px desktop, 34px mobile.
- H2: 38px desktop, 30px mobile.
- Body: 18px desktop, 17px mobile, line height 1.6.
- Minimum text size: 14px for captions only.
- Maximum prose width: 68 characters.
- No font weight below 400.
- No justified text or long all-capital phrases.

### Layout

- Twelve-column grid.
- Maximum content width: 1280px.
- Gutters: 32px desktop, 24px tablet, 20px mobile.
- Section spacing: 128px desktop, 96px tablet, 64px mobile.
- Maximum three cards per desktop row.
- Use generous whitespace and no more than two card rows without a visual pause.

### Shape and elevation

- Inputs and chips: 6px radius.
- Images and small cards: 12px radius.
- Large cards and panels: 20px radius.
- Buttons: pill-shaped.
- Default border: 1px Stone.
- One approved shadow: `0 8px 24px rgba(32, 33, 31, 0.08)`.
- Resting cards use borders, not shadows.

### Core component behavior

- Buttons have primary, secondary, and text-link variants.
- Cards show an image, location or category, concise description, status or care chips, and an explicit link.
- Inputs always have visible labels.
- Accordions are used for FAQs and supplementary detail, never essential primary content.
- Galleries use scroll snap and visible controls; no autoplay carousels.
- Maps load as static images until activated.
- Testimonials identify the person’s relationship and residence, with documented consent.
- Coming-soon content uses honest status labels and a single interest action.

### Motion

- 150ms for hover and focus.
- 250ms for menus and accordions.
- 400ms for panels and lightboxes.
- Small one-time reveal only; no parallax or pinned scroll sequences.
- Honor `prefers-reduced-motion`.
- Disable autoplay video for reduced-motion and data-saver users.

### Prohibited UI patterns

- Gold body text.
- Black-and-gold luxury styling.
- High-contrast fashion serifs or decorative scripts.
- Hero or testimonial sliders.
- Autoplay audio.
- Floating chat bubbles.
- Clinical stock imagery.
- AI-generated people.
- Medical-equipment hero imagery.
- Parallax, animated counters, countdowns, or urgency banners.
- Hidden phone numbers.
- Placeholder-only form labels.
- Unverified dashboards or futuristic AI visuals.

## 11. Responsive and Accessible Behavior

Supported design widths begin at 360px. Primary breakpoints are 600, 900, 1200, and 1440px.

Requirements:

- WCAG 2.2 AA.
- Touch targets at least 44 by 44px.
- Text contrast at least 4.5:1; large text and UI boundaries at least 3:1.
- Visible keyboard focus.
- Skip link and semantic landmarks.
- One H1 per page and ordered headings.
- Zoom to 200% without loss of functionality or horizontal page scrolling.
- Captions for videos containing speech.
- Visible pause control for hero video.
- No interaction dependent solely on dragging or hovering.
- Form labels, autocomplete, accessible error messages, and no time limits.
- Sticky controls must not obscure focused elements.
- `lang="en-LK"`.

## 12. Photography and Video

### Direction

- Natural daylight and warm, slightly underexposed shadows.
- Real Sri Lankan settings, architecture, gardens, and people.
- Residents and families engaged in ordinary life.
- Staff present without dominating every frame.
- Eye-level or seated-height photography.
- True skin tones and restrained grading.

Avoid:

- Generic Western retirement imagery.
- Stethoscopes, pill boxes, wheelchairs, or medical equipment as visual shorthand.
- Empty luxury interiors that resemble a hotel.
- Hands-only care clichés.
- Images implying that a stock model is an actual resident.

### Temporary asset policy

- Existing images on the official Village 60 Plus website may be considered only after written confirmation of ownership and consent.
- Public social-media images require client confirmation before reuse.
- Use licensed commercial stock from a source with clear model-release terms when client media is unavailable.
- Store source, license, expiry, consent, and placeholder status in the CMS.
- Mark temporary assets as `placeholder: true`.
- Produce a pre-launch report listing every remaining placeholder.
- Do not use the current website’s generic YouTube sample video.
- Do not use AI-generated people.

Replacement priority:

1. Homepage hero.
2. Oracle.
3. Residence hero images.
4. Living & Care.
5. Story and team.
6. Secondary ecosystem pages.

## 13. Content Strategy

### Editing rules

- Treat the client document as a source, not final page copy.
- Remove duplicate Oracle, SAGE, Silver Roots, and Living & Care passages.
- Lead with the family’s question before brand detail.
- Use short paragraphs and meaningful headings.
- Define care terminology once and use it consistently.
- Distinguish direct services from externally coordinated services.
- Distinguish live, pilot, planned, and coming-soon features.
- Do not publish unsupported statistics, awards, rankings, outcome claims, or “international standard” claims.
- Do not use “best,” “number one,” “only,” or similar claims without evidence and approval.

### Content status labels

The CMS must support:

- Available now.
- Limited availability.
- Pilot.
- Coming soon.
- In development.
- Planned.

Status labels must appear wherever a future-facing service could otherwise be mistaken for a current offering.

### Required trust content

- Legal organization name.
- Verified operating history.
- Leadership and credentials.
- Residence addresses.
- Care and support boundaries.
- Visitor and enquiry process.
- Registration or licensing language approved by the client and local counsel.
- Testimonials with permission.
- Response hours and contact expectations.

## 14. Headless CMS

### Recommended platform

Use **Sanity** as the default headless CMS because the site needs structured relationships among residences, care types, brand offerings, FAQs, forms, and media-rights records.

If the implementation team chooses another CMS, it must provide equivalent structured content, references, role-based editing, previews, media metadata, and revision history.

### Content types

**Site settings**

- Brand name and tagline.
- Header and footer navigation.
- Primary phone, WhatsApp, email, and opening hours.
- Form-recipient addresses.
- Social links.
- Default SEO and organization schema.

**Residence**

- Name and slug.
- Status.
- Location, address, coordinates, and landmarks.
- Summary and full description.
- Care types.
- Audience fit.
- Rooms and shared spaces.
- Services included and optional.
- Gallery.
- Team references.
- FAQs.
- Enquiry routing.
- SEO fields.

**Care service**

- Name and slug.
- Summary.
- Who it suits.
- Typical duration.
- Included services.
- Direct versus partner-delivered support.
- Participating residences.
- FAQs.
- Status.
- SEO fields.

**Ecosystem offering**

- Oracle, Silver Roots, Destination Retirement, SAGE, or Grove.
- Current status.
- Approved capabilities.
- Planned capabilities.
- CTA and form context.
- SEO fields.

**Team member**

- Name.
- Role.
- Credentials.
- Biography.
- Image and consent metadata.

**Testimonial**

- Quote.
- First name or approved display name.
- Relationship.
- Residence.
- Consent record.

**FAQ**

- Question.
- Answer.
- Applicable pages.
- Review date.

**Media asset**

- File and alt text.
- Caption.
- Focal point.
- Source.
- License.
- Consent record.
- Placeholder flag.
- Replacement deadline.

**SEO**

- Title.
- Meta description.
- Canonical override.
- Social image.
- Indexing controls.

### Editorial workflow

- Draft.
- Internal review.
- Client or compliance review when required.
- Published.
- Archived.

Clinical, privacy, licensing, and future-product claims require an explicit review flag before publication.

## 15. Technical Architecture

### Application

- Current supported stable Next.js release at implementation start.
- App Router.
- TypeScript.
- React Server Components by default.
- Client components only for interactive controls.
- Static or incremental rendering for marketing pages.
- Preview mode for CMS drafts.
- Automated sitemap and robots configuration.

### Hosting

- Vercel or an equivalent platform supporting edge delivery, image optimization, secure environment variables, preview deployments, and rollback.

### Forms and email

- Server-side form handler or server action.
- Schema validation shared between client and server.
- Transactional email through Resend, Postmark, or equivalent.
- Separate routing by form context.
- No sensitive health information in email subject lines.
- Store the minimum submission data needed for follow-up.

### WhatsApp

- Direct `wa.me` links with international number format.
- Page-specific prefilled text.
- No WhatsApp API automation required at launch.

### Maps

- Static map first.
- Interactive Google Maps or Mapbox content loads only on request.
- Address and directions remain available without the map.

### Security

- HTTPS only.
- Secure headers and a documented Content Security Policy.
- Input validation and output escaping.
- Rate limiting.
- Dependency and secret scanning.
- Least-privilege CMS roles.
- No personal data in analytics events.
- Documented data retention and deletion process.

## 16. SEO and Local Discovery

### Launch requirements

- Unique title and meta description for every indexable page.
- Canonical URLs.
- XML sitemap.
- Robots configuration.
- Open Graph and social metadata.
- Search Console verification.
- Google Business Profile links aligned with verified name, address, and phone data.
- Consistent NAP information.
- Server-rendered primary content.
- Descriptive image alt text.
- Breadcrumbs on nested pages.

### Structured data

Use only accurate, visible information:

- `Organization`.
- `WebSite`.
- `LocalBusiness` for physical residences when appropriate.
- `Service` for verified care offerings.
- `BreadcrumbList`.

Do not publish prices, ratings, medical organization types, or review markup unless the visible content and business status support them.

### Search themes

Content should naturally address:

- Retirement village Sri Lanka.
- Senior living Colombo.
- Assisted living Sri Lanka.
- Elder care homes near relevant locations.
- Independent living for older adults.
- Respite care.
- Post-hospital recovery.
- Rehabilitation support.
- Care for a parent in Sri Lanka.
- How to choose a care home.
- Elder-care costs and what affects a private quote.

Do not create thin location pages containing only swapped place names.

## 17. Analytics

Use Google Analytics 4 or an approved privacy-conscious alternative, plus Search Console.

Track:

- Call clicks.
- WhatsApp clicks.
- General enquiry opens and submissions.
- Oracle private-visit requests.
- Grove interest submissions.
- Silver Roots partner submissions.
- Destination Retirement enquiries.
- Find-the-Right-Care starts and completions.
- Residence page views.
- Directions clicks.
- Form errors.

Do not send names, phone numbers, email addresses, messages, diagnoses, or other personal data to analytics.

## 18. Performance

Field targets at the 75th percentile:

- Largest Contentful Paint: 2.5 seconds or less.
- Interaction to Next Paint: 200 milliseconds or less.
- Cumulative Layout Shift: 0.1 or less.

Requirements:

- Responsive AVIF/WebP images.
- Explicit image dimensions.
- Hero poster image.
- Video below 4MB where used.
- No hero video on reduced-motion or data-saver settings.
- Minimal client-side JavaScript.
- Lazy-load below-fold media.
- Self-host fonts and preload only required subsets.
- CDN delivery appropriate for Sri Lankan visitors.

## 19. Privacy, Legal, and Care-Claim Controls

The implementation is not legal advice. The client and Sri Lankan counsel must approve:

- Privacy notice and lawful basis for enquiries.
- Data retention.
- Use of email, CMS, analytics, and WhatsApp processors.
- Cross-border processing.
- Cookie behavior.
- Residence registration and licensing language.
- Nursing-home, medical, rehabilitation, and medication claims.
- Emergency-service wording.
- Testimonials and image consent.
- Partner-referral disclosures.
- Destination Retirement health, travel, insurance, and visa wording.

The first-contact forms should collect the minimum information necessary to respond. Detailed health information belongs in an approved assessment process, not a marketing form.

## 20. Known Facts and Verification Gates

### Publicly evidenced

The current public site presents:

- Tranquility.
- Serenity.
- House on the Hill.
- Enchanted Fields.
- Home nursing.
- Care products.
- Caregiver training.

The current public contact details found during research are:

- Phone: `+94 11 250 4838`.
- WhatsApp widget: `+94 74 100 3994`.
- Email: `enquiries@village60plus.org`.
- Head office: `133/19 Nawala Road, Narahenpita, Colombo 05`.

These details still require client confirmation before launch.

### Must be confirmed

- Founded in 2008 or 2009.
- Official spelling and location for every residence.
- Serenity: Railway Avenue, Kirulapone, or Nugegoda.
- House on the Hill versus Hope on the Hill.
- House on the Hill location: Kirulapone or Nugegoda.
- Enchanted Field versus Enchanted Fields.
- Oracle opening and operating status.
- Oracle room names, capacity, services, and visit availability.
- The Grove timeline and whether it represents all or part of the 80-room expansion.
- Which care types are available at each residence.
- Which services are delivered directly and which are coordinated by partners.
- Silver Roots features available now.
- SAGE features deployed now.
- Destination Retirement inventory available now.
- Whether the new site should retain, reposition, or retire the current public Home Nursing, Care Products, and Caregiver Training offerings.
- Whether CILS belongs on the public story timeline and how its relationship to Village 60 Plus should be described.
- Registration, licensing, staffing, and medical-service language.
- Primary phone, WhatsApp, email, contact hours, and response time.
- Ownership and consent for existing photographs.

Nothing in this list may be silently inferred from marketing copy.

## 21. Testing

### Functional

- Navigation, menus, anchors, and breadcrumbs.
- Call, WhatsApp, email, directions, and social links.
- All forms, validation, routing, success states, and failure states.
- CMS preview and publishing.
- Status labels.
- Canonical URLs and redirects.

### Accessibility

- Automated axe checks with zero critical issues.
- Keyboard-only navigation.
- Screen-reader checks for menus, forms, accordions, galleries, and lightboxes.
- Focus visibility and focus order.
- 200% zoom and text-spacing override.
- Reduced-motion behavior.
- Contrast validation.

### Performance

- Lighthouse and WebPageTest on representative mobile conditions.
- Image and video budgets.
- Core Web Vitals monitoring after launch.

### Browser and device

- Current and previous major versions of Chrome, Safari, Edge, and Firefox.
- iOS Safari and Android Chrome.
- Layout checks from 360px through 1440px and above.

### Content and SEO

- No placeholders or “TBD” in published content.
- No broken internal links.
- One H1 per page.
- Unique titles and descriptions.
- Valid structured data.
- Correct addresses, status labels, and contact details.
- Rights and consent recorded for every published image.

## 22. Launch Acceptance Criteria

- Every sitemap page is implemented or intentionally redirected.
- The homepage follows the approved eight-section sequence.
- Find the Right Care appears before Oracle on Home.
- Call and WhatsApp are reachable in one action on every page.
- Tranquility, Serenity, House on the Hill, Enchanted Fields, and The Grove use the shared residence template; Oracle uses its approved flagship template.
- The Grove is clearly labelled coming soon.
- Future Silver Roots, SAGE, and Destination Retirement features are labelled accurately.
- No public pricing appears.
- No unsupported medical, outcome, ranking, or availability claim appears.
- Forms deliver to the correct inbox and provide WhatsApp continuation.
- Accessibility checks meet WCAG 2.2 AA expectations.
- Lighthouse accessibility score is at least 95 on core templates.
- Core Web Vitals targets are met or have documented remediation.
- No critical security issue remains.
- Every placeholder asset has source and license metadata.
- Every identifiable resident or family image has documented consent.
- Client signs off the verification checklist.

## 23. Explicit Non-Goals

- Silver Roots search marketplace.
- Live room availability.
- Online booking confirmation.
- Online payments.
- Customer, family, resident, staff, or provider accounts.
- Care records or clinical workflows.
- SAGE application interfaces.
- Public pricing.
- Automated medical recommendations.
- Multi-language content at launch.
- Blog or news publishing at launch.
- Live chat or AI chatbot.

## 24. Source References

Client source:

- `website.docx`

Public brand sources:

- [Village 60 Plus](https://www.village60plus.lk/)
- [Current retirement villages](https://village60plus.lk/retirement-villages/)
- [Current services](https://village60plus.lk/our-services/)
- [Current gallery](https://village60plus.lk/image-gallery-2/)
- [Current contact page](https://village60plus.lk/contact-us/)

Standards and implementation references:

- [WCAG 2.2](https://www.w3.org/TR/WCAG22/)
- [W3C guidance for older users](https://www.w3.org/WAI/older-users/)
- [Google people-first content guidance](https://developers.google.com/search/docs/fundamentals/creating-helpful-content)
- [Google LocalBusiness structured data](https://developers.google.com/search/docs/appearance/structured-data/local-business)
- [Google Business Profile local ranking guidance](https://support.google.com/business/answer/7091)
- [Web Vitals](https://web.dev/articles/vitals)
- [Next.js metadata documentation](https://nextjs.org/docs/app/api-reference/metadata)
- [Sri Lanka Data Protection Authority](https://www.dpa.gov.lk/guidelines.php)

