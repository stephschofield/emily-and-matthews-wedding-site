# Emily & Matthew's Wedding Website - Development TODO List

**Last Updated**: November 17, 2025  
**Wedding Date**: May 9, 2026

---

## ✅ Completed Tasks

### 1. Update Wedding Party Page to Use Supabase ✓
- **Status**: COMPLETED
- **Changes Made**:
  - Modified `app/wedding-party/page.tsx` to fetch from Supabase using `getWeddingParty()`
  - Converted from hardcoded array to dynamic server-rendered page
  - Added `export const dynamic = 'force-dynamic'` for runtime data fetching
- **Files Modified**:
  - `app/wedding-party/page.tsx`
- **Result**: Build successful, page now renders wedding party from database

### 2. Complete Database Migration to Party-Based RSVP System ✓
- **Status**: COMPLETED ✅
- **Changes Made**:
  - Created new database schema with `parties`, `party_members`, and `rsvps` tables
  - Implemented RLS (Row Level Security) policies
  - Created `lookup_party_by_name()` and `update_party_rsvps()` RPC functions
  - Migrated all 103 households (196 guests) to new structure
  - Updated RSVP form to use party lookup system
  - Created new API routes for party lookup and RSVP submission
- **Files Modified**:
  - `lib/supabase.ts` - Added new types and helper functions
  - `app/rsvp/page.tsx` - Updated to use party lookup
  - `app/api/rsvp/route.ts` - Updated to use new party system
  - `app/api/rsvp/lookup/route.ts` - New lookup endpoint
- **Database State**:
  - ✅ 103 parties (households)
  - ✅ 196 party members (individual guests)
  - ✅ 196 RSVPs (auto-created, all status="unknown")
  - ✅ 16 plus-one placeholder slots
- **Result**: RSVP system now fully functional with database lookup

---

## 📋 Pending Tasks

### 3. Email Confirmation System ✓
- **Status**: COMPLETED ✅
- **Changes Made**:
  - Integrated `resend` for transactional emails
  - Updated RSVP form to collect email address
  - Updated API to send HTML confirmation emails upon successful RSVP
  - Includes details of attending guests, meal choices, and dietary restrictions
- **Files Modified**:
  - `app/rsvp/page.tsx`
  - `app/api/rsvp/route.ts`
  - `package.json`
- **Result**: Users now receive an email confirmation after RSVPing

### 4. Song Request System
- **Status**: ✅ COMPLETED (Implementation complete, needs testing)
- **Completed Features**:
  - ✅ Database table: `song_requests` with RLS enabled
  - ✅ Insert & read policies configured for anonymous users
  - ✅ API route: `/api/song-requests` (POST & GET)
  - ✅ Frontend form: `components/playlist-section.tsx`
  - ✅ Spotify search integration for song lookup
  - ✅ Manual entry fallback option
  - ✅ Multi-song submission (add multiple at once)
  - ✅ Success/error handling with user feedback
- **Testing Required**:
  - [ ] Test song submission from website
  - [ ] Verify data appears in Supabase `song_requests` table
  - [ ] Test Spotify search functionality
  - [ ] Test manual entry mode
  - [ ] Test adding multiple songs at once
  - [ ] Test form validation (empty submissions)
- **Files Involved**:
  - `components/playlist-section.tsx` - Main form UI
  - `app/api/song-requests/route.ts` - Backend API
  - `components/song-search-input.tsx` - Spotify integration
  - Database: `public.song_requests` table
- **Next Steps**: Browser testing with real submissions

---

### 4. Build Full RSVP Form for Attending Guests
- **Priority**: HIGH
- **Current Status**: ✅ COMPLETED (Implementation complete, needs testing)
- **Completed Features**:
  - ✅ Full 3-step RSVP flow (lookup → attend/decline → details/submit)
  - ✅ Individual RSVP per party member with Yes/No controls
  - ✅ Meal choice selection (Chicken, Beef, Vegetarian)
  - ✅ Dietary restrictions/allergies text areas per person
  - ✅ Plus-one name entry with database updates
  - ✅ Form validation and error handling
  - ✅ Thank you page for both attending and declining
  - ✅ API endpoint for updating plus-one names
- **Testing Required**:
  - [ ] Test full RSVP submission flow in browser
  - [ ] Test attending with meal selections
  - [ ] Test declining flow
  - [ ] Test plus-one name updates
  - [ ] Test mobile responsiveness
  - [ ] Test with real guest names
- **Files Modified**:
  - `app/rsvp/page.tsx` - Complete 3-step form
  - `app/api/rsvp/update-names/route.ts` - Plus-one name updates
  - `lib/supabase.ts` - Fixed RPC parameter (p_items)
- **Database State**: Ready with 196 RSVPs (all status="unknown")
- **Timeline**: Ready to launch ~January 2026 (3-4 months before wedding)
- **Next Steps**: Browser testing and potential UI refinements

---

### 5. Create Admin Dashboard for RSVP Management
- **Priority**: MEDIUM
- **Features Needed**:
  - [ ] View all RSVPs with filters (attending/not attending, by event)
  - [ ] View all song requests
  - [ ] Export to CSV/Excel
  - [ ] Summary statistics (total attending, dietary restrictions summary)
  - [ ] Search functionality
  - [ ] Basic authentication (password-protected)
- **Routes to Create**:
  - `app/admin/page.tsx` (dashboard home)
  - `app/admin/rsvps/page.tsx` (RSVP list)
  - `app/admin/songs/page.tsx` (song requests)
  - `app/api/admin/export/route.ts` (export functionality)
- **Authentication Options**:
  - Simple: Environment variable password check
  - Better: Supabase Auth with email/password
  - Best: Supabase Auth with magic link

**Example Admin Route Protection**:
```typescript
// middleware.ts
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  if (request.nextUrl.pathname.startsWith('/admin')) {
    const authHeader = request.headers.get('authorization')
    // Add your auth logic here
    if (!authHeader) {
      return NextResponse.redirect(new URL('/admin/login', request.url))
    }
  }
}
```

---

### 6. Run Postgres Diagnostic and Apply Security Patches
- **Priority**: MEDIUM-HIGH (Security)
- **Current Version**: PostgreSQL 17.4.1.064 (has security patches available)
- **Required Actions**:
  1. Open Supabase Dashboard → SQL Editor
  2. Run `scripts/postgres-diagnostic.sql`
  3. Review results for:
     - MD5 password roles (security issue)
     - Large tables (upgrade time estimate)
     - Active connections (pick quiet time for upgrade)
  4. Schedule maintenance window
  5. Take backup (Supabase Dashboard → Database → Backups)
  6. Upgrade to latest Postgres 17.x via Dashboard → Settings → Database
- **Timeline**: Complete before production launch
- **Downtime**: ~2-10 minutes (small database)

---

### 7. Add Rate Limiting and Spam Protection
- **Priority**: MEDIUM
- **Current Issue**: No protection against spam submissions
- **Options**:
  1. **Rate Limiting**: Implement via Upstash Redis or Vercel Edge Config
  2. **CAPTCHA**: Add reCAPTCHA or hCaptcha to forms
  3. **Honeypot**: Add hidden field to catch bots
- **Files to Modify**:
  - `app/api/rsvp/route.ts`
  - `app/api/song-requests/route.ts`
- **Recommended Package**: `@upstash/ratelimit` with Vercel Edge

**Example Rate Limiting**:
```typescript
import { Ratelimit } from '@upstash/ratelimit'
import { Redis } from '@upstash/redis'

const ratelimit = new Ratelimit({
  redis: Redis.fromEnv(),
  limiter: Ratelimit.slidingWindow(5, '1 h'), // 5 requests per hour
})

export async function POST(request: Request) {
  const ip = request.headers.get('x-forwarded-for') ?? 'anonymous'
  const { success } = await ratelimit.limit(ip)
  
  if (!success) {
    return Response.json({ error: 'Too many requests' }, { status: 429 })
  }
  // ... rest of handler
}
```

---

### 8. Testing and Launch Preparation
- **Priority**: HIGH (Before Launch)
- **Testing Checklist**:
  - [ ] Full RSVP submission flow (attending & not attending)
  - [ ] Song request submission
  - [ ] Email notifications (if implemented)
  - [ ] Mobile responsiveness (all pages)
  - [ ] Cross-browser testing (Chrome, Safari, Firefox, Edge)
  - [ ] Performance optimization (Lighthouse score)
  - [ ] Accessibility testing
  - [ ] Security review (RLS policies, rate limiting)
  - [ ] Database backup system
  - [ ] Environment variables in production
- **Monitoring Setup**:
  - [ ] Vercel Analytics
  - [ ] Error tracking (Sentry or similar)
  - [ ] Uptime monitoring
- **Pre-Launch Checklist**:
  - [ ] Custom domain configured
  - [ ] SSL certificate
  - [ ] Favicon and metadata
  - [ ] Social media preview images
  - [ ] 404 page customization
  - [ ] Contact information verified

---

## 🎯 Quick Reference

### Supabase Tables
```
✅ parties - Invitation households (103 total)
✅ party_members - Individual guests (196 total)
✅ rsvps - Guest responses (196 auto-created)
✅ song_requests - Playlist requests
✅ wedding_party - Wedding party members
```

### New RPC Functions
```sql
✅ lookup_party_by_name(q text) - Search for parties by guest name
✅ update_party_rsvps(p_party_id uuid, p_rsvps jsonb) - Bulk update RSVPs
```

### Environment Variables Required
```env
NEXT_PUBLIC_SUPABASE_URL=your-project-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key (for admin)
RESEND_API_KEY=re_123456789 (for email confirmations)
EMAIL_FROM=rsvp@emandmatthew.com (optional, defaults to onboarding@resend.dev)
```

### Important Dates
- **Wedding Date**: May 9, 2026
- **RSVP Open**: ~January 2026 (3-4 months before)
- **RSVP Deadline**: ~April 2026 (1 month before)

---

## 📞 Support & Resources

- **Supabase Dashboard**: https://supabase.com/dashboard/project/riciiavqocbojlkewdgs
- **Project Repository**: https://github.com/stephschofield/emily-and-matthews-wedding-site
- **Wedding Email**: eebueche@gmail.com

---

## 🚀 Deployment Notes

**Current Build Status**: ✅ Passing
- Static routes: `/`, `/rsvp`, `/_not-found`
- Dynamic routes: `/wedding-party`, `/api/*`

**Vercel Deployment**:
```bash
# Production deployment
git push origin main

# Preview deployment
vercel --prod
```

---

*This document is a living document and should be updated as tasks are completed or priorities change.*
