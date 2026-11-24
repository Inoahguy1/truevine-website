# Truevine Automation website

The website for Truevine Automation, my freelance AI automation business. It's live at
[truevineautomation.com](https://truevineautomation.com).

## At a glance

- **What it is:** a one-page marketing site that explains what Truevine does (websites,
  chatbots, AI receptionists, follow-up automation and more) and lets visitors book a call.
- **Tech:** React 18 loaded from a CDN with in-browser JSX (no build step), custom
  scroll-driven animations, hand-written CSS, and GitHub Pages hosting with a custom domain.
- **How AI is used:** I designed and built the site with Claude as my pair programmer, from
  layout and animation to copy edits. Visitors can request a call from a booking form that
  shows open time slots in Eastern time.
- **Related:** my CRM, which is built to take these bookings directly, is in
  [Crm-calendly](https://github.com/Inoahguy1/Crm-calendly).

## Files

| File | What it is |
|---|---|
| `index.html` | Page shell, loads React and the components |
| `sections.jsx` | The page sections (hero, services, case studies, why Truevine, FAQ, contact) |
| `booking.jsx` | The booking form (sends requests by email through FormSubmit) |
| `vine.jsx`, `vine.css` | The animated vine artwork |
| `scrollcraft.js`, `scrollcraft.css` | Scroll-driven animation helpers |
| `tweaks.jsx`, `styles.css` | Headline options and the main styles |
| `assets/` | Logo, vine images and the hero video |
| `CNAME` | Custom domain for GitHub Pages |

## Run it locally

It's static files, so any local web server works:

```bash
python3 -m http.server 8000
```

Then open http://localhost:8000.
