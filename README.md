# Emily + Matthew's Wedding Site

Welcome to the official repository for Emily and Matthew's wedding website, created for their special day on May 26. This project is designed to be a dynamic, easy-to-update site that shares all the essential wedding details and keeps guests informed.

## Project Overview

This repository hosts the source code for a wedding website deployed via the v0.dev platform, backend configured using Supabase, and hosted on Vercel. The website offers a user-friendly interface where guests can find event information, RSVP, and receive updates.

The main features of Emily and Matthew's wedding website include the following features:

- **Event Information**: Clear details of the wedding date, time, and venue locations, including maps or directions to help guests navigate where the ceremony and reception are taking place.
- **RSVP Tool**: An integrated feature allowing guests to easily respond to invitations online, including options for meal preferences and RSVP deadlines to streamline guest management.
- **Schedule of Events**: A timeline or itinerary for the wedding day (and possibly surrounding events) that informs guests about ceremony start times, receptions, after parties, and other planned activities.
- **Venue Showcase**: Photos and descriptions of the wedding venue to give guests a preview and build excitement.
- **Love Story \& Bridal Party Bios**: Personal pages sharing how the couple met, the proposal story, and introductions to the wedding party members with photos and short bios to connect guests to the people involved.
- **Wedding Registry Links**: Clear access to the couple’s gift registry or honeymoon fund information for convenient gifting.
- **Travel \& Accommodation Information**: Recommendations for hotels, transportation options, shuttle services, and local attractions for out-of-town guests.
- **FAQ Section**: Answers to common guest questions regarding dress code, parking, kids attendance, accessibility, and any social media guidelines for the event.
- **Design Consistency**: The site’s visual style is coordinated with the wedding’s theme or venue ambiance for a cohesive and welcoming experience.

These features create a comprehensive, user-friendly hub for guests to find everything they need for the wedding celebration, reducing confusion and increasing guest engagement before the event.

## 🚀 Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS v4 + shadcn/ui components
- **Database**: Supabase (PostgreSQL)
- **Authentication**: Custom session-based auth with HTTP-only cookies
- **Email**: Resend API
- **Music Integration**: Spotify Web API
- **Deployment**: Vercel
- **Package Manager**: pnpm

## 📦 Environment Variables

Required environment variables (stored in `.env.local`, not committed):

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=your-project-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

# Email
RESEND_API_KEY=your-resend-key
EMAIL_FROM=rsvp@emandmatthew.com

# Admin
ADMIN_PASSWORD=your-secure-password

# Spotify (optional for song search)
SPOTIFY_CLIENT_ID=your-client-id
SPOTIFY_CLIENT_SECRET=your-client-secret
```

## 🏃‍♂️ Getting Started

```bash
# Install dependencies
pnpm install

# Run development server
pnpm dev

# Build for production
pnpm build

# Start production server
pnpm start
```

Visit `http://localhost:3000` to see the site.

## 📁 Project Structure

```
├── app/                    # Next.js App Router pages
│   ├── admin/             # Admin dashboard (protected)
│   ├── api/               # API routes (RSVP, songs, auth)
│   └── rsvp/              # RSVP flow pages
├── components/            # React components
│   ├── ui/                # shadcn/ui components
│   └── *-section.tsx      # Page sections
├── lib/                   # Utilities and helpers
│   ├── supabase.ts        # Database client and types
│   ├── auth.ts            # Authentication helpers
│   └── spotify.ts         # Spotify API integration
├── scripts/               # Database migration scripts
└── backlog/               # Task management and documentation
```

## 🗓️ Project Status

**Current Phase**: Pre-Launch (January 2026)
- ✅ Core RSVP system complete
- ✅ Email confirmations working
- ✅ Song requests operational
- ✅ Admin authentication in place
- 📋 Admin dashboard views in progress
- 🎯 Ready to launch to guests

**Wedding Date**: May 9, 2026

## 📚 Documentation

- [Development TODOs](DEVELOPMENT_TODOS.md) - Current tasks and project roadmap
- [Backlog Updates](backlog/docs/) - Development history and decisions
- [RSVP Implementation](RSVP_IMPLEMENTATION_COMPLETE.md) - Technical details of RSVP system

## 🔐 Security

- All API keys and secrets stored in `.env.local` (gitignored)
- Row Level Security (RLS) enabled on all Supabase tables
- Admin routes protected with session-based authentication
- HTTP-only cookies prevent XSS attacks
- Database credentials never exposed to client

## 📞 Contact

- **Wedding Contact**: eebueche@gmail.com
- **Repository Maintainer**: stephschofield
- **Live Site**: [Visit the Wedding Site](https://vercel.com/sschofield-microsoftcos-projects/v0-emily-matthew-s-wedding-may-26)

---

*Built with ❤️ for Emily & Matthew's special day*
