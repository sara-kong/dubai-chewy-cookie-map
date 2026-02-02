# Dubai Chocolate Chewy Cookie Map

A curated map-based web app that shows **U.S. only** locations selling the "Dubai Chocolate Chewy Cookie" (the product name; not the city of Dubai). All locations are within the United States; the default map view is centered on the continental U.S.

## Features

- **Onboarding Flow**: Beautiful landing page with call-to-action
- **Interactive Map**: Google Maps integration with custom cookie markers
- **Store Popups**: Swipeable popup cards with store details, "New" badges, and Google Maps integration
- **Search Functionality**: Search only within curated store data
- **Dynamic "New" Status**: Automatically tags locations as new if discovered less than 7 days ago

## Getting Started

### Prerequisites

- Node.js 18+ and npm/yarn
- Google Maps API key

### Installation

1. Install dependencies:
```bash
npm install
```

2. Create a `.env.local` file in the root directory (only Maps JavaScript API is used for map display; no Geocoding or billing-required APIs):
```
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=your_google_maps_api_key_here
```

3. Run the development server:
```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```
├── app/
│   ├── layout.tsx          # Root layout
│   ├── page.tsx             # Onboarding page
│   ├── map/
│   │   └── page.tsx         # Map view page
│   └── globals.css          # Global styles
├── components/
│   ├── StorePopup.tsx       # Swipeable popup component
│   └── SearchBar.tsx        # Search functionality
├── data/
│   └── stores.ts            # Store data
├── types/
│   └── store.ts             # TypeScript types
└── package.json
```

## Data Model

Stores are defined with the following structure:

```typescript
interface Store {
  id: string;
  name: string;
  address: string;
  lat: number;
  lng: number;
  discoveredAt: Date;
}
```

## Key Features

- **Swipeable Popups**: Swipe down to close popup cards (Framer Motion)
- **Single Popup**: Only one popup can be open at a time
- **Static Markers**: Clicking one marker doesn't affect others
- **Map Panning**: Markers move naturally with map panning
- **Internal Search**: Search only works on curated store data

## Technologies

- Next.js 14 (App Router)
- TypeScript
- Google Maps JavaScript API (map display and markers only; locations use stored `lat`/`lng`; no Geocoding API)
- Framer Motion (swipe gestures)
- Tailwind CSS
- Lucide React (icons)

## Geographic Constraint

- **U.S. only**: The app displays only locations within the United States. The default map view is centered on the continental U.S. All seed and mock data are U.S.-based. "Dubai Chocolate Chewy Cookie" is the name of the cookie product, not a geographic reference.

## Notes

- Scraping functionality is not implemented (as per requirements)
- Authentication is not implemented (as per requirements)
- Sample store data is provided in `data/stores.ts`
