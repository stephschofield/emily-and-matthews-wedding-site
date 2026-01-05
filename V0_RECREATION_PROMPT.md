# Wedding Website Recreation Prompt for v0

Build a complete wedding website for Emily & Matthew's wedding on May 9, 2026. The website should have a sophisticated, elegant design appropriate for a formal wedding celebration.

**IMPORTANT: Use JSON files for all data storage. NO backend services or databases. All data should be easily replaceable later.**

## Core Pages and Sections

### 1. **Main Landing Page** 
Single-page website with smooth scroll navigation to all sections:

- **Hero Section**: Wedding couple names, date (May 9, 2026), and elegant welcome message
- **Navigation Bar**: Sticky header with links to all sections (Timeline, Venue, Schedule, FAQ, Gallery, Registry, Playlist, Wedding Party, RSVP)
- **Timeline Section**: Display key wedding moments or countdown to the big day
- **Venue Section**: Location details, map integration, and venue information
- **Schedule Section**: Day-of timeline with ceremony and reception details
- **FAQ Section**: Common questions and answers for guests
- **Gallery Section**: Photo gallery showcasing the couple or venue
- **Registry Section**: Links to wedding registry
- **Playlist Section**: Interactive song request form (detailed below)
- **Wedding Party Section**: Display wedding party members from JSON data
- **RSVP Section**: Call-to-action directing guests to dedicated RSVP page
- **Footer Section**: Contact information and wedding details

### 2. **Dedicated RSVP Page** (`/rsvp`)
Multi-step RSVP form with party-based lookup system:

**Step 1: Guest Lookup**
- Search input for guest name
- Client-side search through parties JSON data (case-insensitive)
- Display found party with household label and all members
- Show "guest not found" message with contact email if no match
- Validation before proceeding

**Step 2: Attend or Decline Selection**
- Two clear options:
  - "Joyfully Accept" - for attending guests
  - "Regretfully Decline" - for guests who cannot attend
- Visual distinction between the two choices

**Step 3a: Declining Flow**
- Confirmation message showing party details
- Email input field (required)
- Optional message field for well wishes
- Submit button (logs data to console/saves to localStorage for demo)

**Step 3b: Attending Flow** (detailed individual RSVP)
- For each party member in the household:
  - Display member name (or "Plus One" for placeholders)
  - Yes/No radio buttons for each individual
  - If "Yes":
    - Plus-one name input (if `is_plus_one_placeholder` is true)
    - Dietary restrictions/allergies textarea
  - If "No": No additional fields needed
- Email input field (required, with validation)
- Optional message field for the couple
- Form validation ensuring:
  - All members have Yes/No selection
  - Plus-one names entered where required
  - Valid email provided
- Submit button (logs data to console/saves to localStorage for demo)

**Step 4: Success/Thank You Page**
- Personalized thank you message based on attending status
- Confirmation message
- Display optional message if provided
- Return to homepage link

**RSVP Technical Requirements:**
- Progress indicator showing current step (1/3, 2/3, 3/3)
- Back buttons to navigate between steps
- Loading states for form submission
- Error handling with user-friendly messages
- All data searches happen client-side using imported JSON
- Form submissions log to console and optionally save to localStorage

## JSON Data Structure

All data should be stored in JSON files in a `/data` directory that can be easily replaced:

### `/data/parties.json`
```json
{
  "parties": [
    {
      "id": "party-1",
      "householdLabel": "Karen Bueche",
      "members": [
        {
          "id": "member-1",
          "fullName": "Karen Bueche",
          "isPlusOnePlaceholder": false,
          "sortOrder": 0
        },
        {
          "id": "member-2",
          "fullName": "Brent Bueche",
          "isPlusOnePlaceholder": false,
          "sortOrder": 1
        }
      ]
    },
    {
      "id": "party-2",
      "householdLabel": "Helen Dyer",
      "members": [
        {
          "id": "member-3",
          "fullName": "Helen Dyer",
          "isPlusOnePlaceholder": false,
          "sortOrder": 0
        },
        {
          "id": "member-4",
          "fullName": "Guest",
          "isPlusOnePlaceholder": true,
          "sortOrder": 1
        }
      ]
    }
  ]
}
```

**Sample Data**: Include 10-15 example parties in the initial JSON with varied configurations:
- Single guests
- Couples
- Families with 3+ members
- Guests with plus-one placeholders
- Mix of different household sizes

### `/data/wedding-party.json`
```json
{
  "weddingParty": [
    {
      "id": "wp-1",
      "name": "Sarah Johnson",
      "role": "Maid of Honor",
      "side": "bride",
      "bio": "Emily's best friend since college",
      "imageUrl": "/images/wedding-party/sarah.jpg",
      "sortOrder": 1
    },
    {
      "id": "wp-2",
      "name": "Michael Smith",
      "role": "Best Man",
      "side": "groom",
      "bio": "Matthew's brother and lifelong friend",
      "imageUrl": "/images/wedding-party/michael.jpg",
      "sortOrder": 1
    }
  ]
}
```

**Sample Data**: Include 8-12 wedding party members (bridesmaids, groomsmen, maid of honor, best man) split between bride and groom sides.

### `/data/rsvps.json` (initially empty, populated by form submissions)
```json
{
  "rsvps": [
    {
      "partyId": "party-1",
      "email": "karen@example.com",
      "submittedAt": "2025-12-26T10:30:00Z",
      "message": "So excited to celebrate with you!",
      "members": [
        {
          "memberId": "member-1",
          "fullName": "Karen Bueche",
          "status": "yes",
          "dietaryRestrictions": "Vegetarian"
        },
        {
          "memberId": "member-2",
          "fullName": "Brent Bueche",
          "status": "yes",
          "dietaryRestrictions": ""
        }
      ]
    }
  ]
}
```

### `/data/song-requests.json` (initially empty, populated by form submissions)
```json
{
  "songRequests": [
    {
      "id": "song-1",
      "guestName": "Emily Smith",
      "email": "emily@example.com",
      "songTitle": "Can't Help Falling in Love",
      "artist": "Elvis Presley",
      "submittedAt": "2025-12-26T10:30:00Z"
    }
  ]
}
```

## Interactive Features

### Song Request System (Playlist Section)
- **Spotify Integration**: Search for songs via Spotify API (optional - can be client-side or skip for mock version)
  - If implementing: Use Spotify Web API with client credentials
  - Display search results with song title, artist, album art
  - Allow selection from results
- **Manual Entry Alternative**: Simple text inputs for song title and artist
- **Multi-song Addition**: Allow guests to add multiple songs to a list before submitting
- **Form Fields**:
  - Guest name (optional)
  - Email (optional)
  - Song title (required)
  - Artist (required)
- **Submission**: Log to console and append to localStorage or internal state
- Display success message after submission
- Error handling for validation

### Wedding Party Display
- Import and display from `/data/wedding-party.json`
- Display in organized layout separated by bride's side and groom's side
- Show name, role, photo (use placeholder images), and optional bio for each member
- Use `sortOrder` for display sequence
- Responsive grid layout

## Technical Implementation Requirements

### Framework
- Next.js App Router (latest version)
- Client-side data management (no backend APIs needed)
- Client components for interactive features
- Use React hooks for state management

### Data Management
- Import JSON files directly in components
- Use React Context or simple prop drilling for shared data
- For form submissions:
  - Option 1: Log to console with `console.log()`
  - Option 2: Save to `localStorage` for persistence during demo
  - Option 3: Update in-memory state to show in admin view
- All searches and filtering happen client-side

### Client-Side Search Function
```typescript
// Example implementation for party lookup
function searchParties(query: string, partiesData: Party[]) {
  const searchTerm = query.toLowerCase().trim();
  
  return partiesData.filter(party => {
    // Search in household label
    if (party.householdLabel.toLowerCase().includes(searchTerm)) {
      return true;
    }
    
    // Search in member names
    return party.members.some(member => 
      member.fullName.toLowerCase().includes(searchTerm)
    );
  });
}
```

### Form Validation
- Client-side validation with clear error messages
- Email format validation using regex
- Required field indicators
- Disabled submit buttons until form is valid
- Visual feedback during form processing

### User Experience
- Mobile-responsive design
- Smooth scroll navigation between sections
- Loading indicators for simulated async operations
- Accessible form labels and ARIA attributes
- Success/error toast notifications or inline messages
- Graceful handling of edge cases (no results, empty data, etc.)

### Mock Data Suggestions
Include realistic sample data:
- **10-15 parties** with varied household sizes
- **8-12 wedding party members** evenly split
- **Party configurations**:
  - 3-4 single guests (1 person)
  - 4-5 couples (2 people)
  - 2-3 families (3+ people)
  - 2-3 guests with plus-one placeholders
- **Diverse names** to test search functionality
- **Wedding party roles**: Maid of Honor, Best Man, Bridesmaids, Groomsmen, Flower Girl, Ring Bearer

## Key User Flows

1. **Guest arrives at website** → Views beautiful landing page → Navigates through sections → Clicks RSVP
2. **Guest searches name** → Finds party → Chooses to attend → Fills individual details for each person → Submits → Sees confirmation (data logged to console)
3. **Guest searches name** → Finds party → Chooses to decline → Optionally leaves message → Submits → Sees confirmation
4. **Guest requests songs** → Searches or manually enters → Adds multiple songs → Submits all requests (logged to console)
5. **Guest views wedding party** → Sees organized list with photos and roles from JSON data

## Admin View (Optional Enhancement)
Create a simple `/admin` page that displays submitted data from localStorage:
- List all RSVP submissions
- Show attending/declining counts
- Display song requests
- Basic filtering and search
- Export to JSON button
- Clear demo data button

This allows demonstration of the full functionality without a backend.

## Important Notes
- **NO backend services or databases** - Everything client-side
- **NO API routes needed** - All data comes from JSON files
- **Easy data replacement** - All data in `/data` directory as JSON files
- **Demo-ready** - Uses console.log and localStorage for submissions
- **Production-ready structure** - Easy to swap JSON files for real API calls later
- **Realistic sample data** - Include enough variety to test all features
- **Wedding date**: May 9, 2026 (hardcode this where needed)
- **Contact email**: eebueche@gmail.com (for "guest not found" messages)
- Focus on functionality and user experience, not specific visual styling
- All searches and data filtering happen client-side for instant feedback
- Form validation should be comprehensive with helpful error messages
- Mobile-first responsive design

## Migration Path for Later
When ready to add backend:
1. Replace JSON imports with API fetch calls
2. Swap localStorage saves with POST requests to API
3. Add Supabase or database integration
4. Keep the same component structure and user flows
5. Update search functions to call backend APIs
6. Add authentication for admin features

The entire data layer can be swapped out without changing the UI components.
