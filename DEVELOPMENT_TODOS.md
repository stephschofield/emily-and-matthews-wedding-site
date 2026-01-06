# Emily & Matthew's Wedding Website - Development TODO List

**Last Updated**: January 6, 2026  
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

### 4. Song Request System ✓
- **Status**: COMPLETED ✅ (Implementation complete, tested and working)
- **Completed Features**:
  - ✅ Database table: `song_requests` with RLS enabled
  - ✅ Insert & read policies configured for anonymous users
  - ✅ API route: `/api/song-requests` (POST & GET)
  - ✅ Frontend form: `components/playlist-section.tsx`
  - ✅ Spotify search integration for song lookup
  - ✅ Manual entry fallback option
  - ✅ Multi-song submission (add multiple at once)
  - ✅ Success/error handling with user feedback
- **Files Involved**:
  - `components/playlist-section.tsx` - Main form UI
  - `app/api/song-requests/route.ts` - Backend API
  - `components/song-search-input.tsx` - Spotify integration
  - Database: `public.song_requests` table

### 5. Build Full RSVP Form for Attending Guests ✓
- **Status**: COMPLETED ✅ (Implementation complete, tested and working)
- **Completed Features**:
  - ✅ Full 3-step RSVP flow (lookup → attend/decline → details/submit)
  - ✅ Individual RSVP per party member with Yes/No controls
  - ✅ Meal choice selection (Chicken, Beef, Vegetarian)
  - ✅ Dietary restrictions/allergies text areas per person
  - ✅ Plus-one name entry with database updates
  - ✅ Form validation and error handling
  - ✅ Thank you page for both attending and declining
  - ✅ API endpoint for updating plus-one names
- **Files Modified**:
  - `app/rsvp/page.tsx` - Complete 3-step form
  - `app/api/rsvp/update-names/route.ts` - Plus-one name updates
  - `lib/supabase.ts` - Fixed RPC parameter (p_items)
- **Database State**: Ready with 196 RSVPs
- **Timeline**: Ready to launch now (January 2026, ~4 months before wedding)

### 6. Admin Authentication System ✓
- **Status**: COMPLETED ✅
- **Changes Made**:
  - Implemented password-based authentication using ADMIN_PASSWORD env variable
  - Created login page at `/admin/login`
  - Added authentication middleware for route protection
  - Secure HTTP-only session cookies with 7-day expiration
- **Files Created**:
  - `app/admin/login/page.tsx` - Login UI
  - `app/api/admin/auth/route.ts` - Auth API (login/logout)
  - `lib/auth.ts` - Auth helper functions
  - `middleware.ts` - Route protection
  - `app/admin/page.tsx` - Protected admin dashboard
- **Security Features**:
  - HTTP-only cookies prevent XSS attacks
  - Secure flag enabled in production
  - SameSite strict policy
  - All /admin/* routes protected except /admin/login
- **Environment Variable**: ADMIN_PASSWORD (required in .env.local)

---

## 📋 Current Tasks (In Progress)

### 7. Complete Admin Dashboard Layout and Navigation
- **Status**: IN PROGRESS (Backlog Task #002)
- **Priority**: MEDIUM
- **What's Done**:
  - ✅ Basic admin dashboard page at `/admin/page.tsx`
  - ✅ Authentication protection via middleware
  - ✅ Basic navigation links to RSVP and Song sections
- **Remaining Work**:
  - [ ] Build RSVP management page (task #003)
  - [ ] Build song requests page (task #004)
  - [ ] Add proper header with logout functionality
  - [ ] Improve mobile responsiveness
  - [ ] Add dashboard statistics/overview (task #005)

---

## 📋 Pending Tasks

### 8. Build RSVP List View with Filtering (Backlog Task #003)
- **Priority**: HIGH
- **Features Needed**:
  - [ ] RSVP list page at `/admin/rsvps/page.tsx`
  - [ ] Display all RSVPs with party name and member details
  - [ ] Show RSVP status (attending/declined/unknown) for each member
  - [ ] Filter by status (attending/not attending/unknown)
  - [ ] Search functionality by guest name
  - [ ] Display meal choices and dietary restrictions
  - [ ] Show total counts at top of page
  - [ ] Sortable table columns
  - [ ] Pagination for large guest lists
- **Database Query**: Needs to join `parties`, `party_members`, and `rsvps` tables

### 9. Build Song Requests View Page (Backlog Task #004)
- **Priority**: MEDIUM
- **Features Needed**:
  - [ ] Song requests page at `/admin/songs/page.tsx`
  - [ ] Display all song requests with guest info
  - [ ] Show song title and artist for each request
  - [ ] Search by song title or artist name
  - [ ] Filter by date submitted
  - [ ] Show total count of requests
  - [ ] Sortable table columns
  - [ ] Display submission timestamp
- **Database Table**: `song_requests` (already created and populated)

### 10. Add Summary Statistics to Admin Dashboard (Backlog Task #005)
- **Priority**: MEDIUM
- **Features Needed**:
  - [ ] Total invited guests count
  - [ ] RSVPs received (yes/no/unknown) counts
  - [ ] Total attending count
  - [ ] Breakdown of meal choices with counts
  - [ ] List of dietary restrictions with guest names
  - [ ] Song request count
  - [ ] Real-time updates from database
  - [ ] Visual cards or charts
- **Implementation**: Add stats API endpoint and dashboard cards

### 11. Implement CSV Export Functionality (Backlog Task #006)
- **Priority**: LOW
- **Features Needed**:
  - [ ] Export button on RSVP list page
  - [ ] Download CSV file with all RSVP data
  - [ ] Include names, status, meals, dietary restrictions
  - [ ] File naming with date (e.g., rsvps-2026-01-06.csv)
  - [ ] Excel/Google Sheets compatible format
  - [ ] Export respects current filters
  - [ ] API endpoint at `/api/admin/export/route.ts`
  - [ ] Handle large guest lists without timeout

### 12. Run Postgres Diagnostic and Apply Security Patches
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

### 12. Run Postgres Diagnostic and Apply Security Patches
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

### 13. Add Rate Limiting and Spam Protection
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

### 14. Testing and Launch Preparation
- **Priority**: HIGH (Before Launch)
- **Testing Checklist**:
  - [x] Full RSVP submission flow (attending & not attending)
  - [x] Song request submission
  - [x] Email notifications
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
ADMIN_PASSWORD=your-secure-password (for admin dashboard access)
```

### Backlog Management
All tasks are tracked in the `backlog/` directory:
- **Completed**: `backlog/completed/` - Finished tasks
- **In Progress**: `backlog/tasks/` - Active tasks (task-002 currently)
- **Pending**: `backlog/tasks/` - Tasks 003-006 ready to start

### Important Dates
- **Wedding Date**: May 9, 2026
- **RSVP Open**: January 2026 (NOW - ready to launch!)
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
- Dynamic routes: `/wedding-party`, `/admin`, `/api/*`

**Vercel Deployment**:
```bash
# Production deployment
git push origin main

# Preview deployment
vercel --prod
```

---

*This document is a living document and should be updated as tasks are completed or priorities change.*
