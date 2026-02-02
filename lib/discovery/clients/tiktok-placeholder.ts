/**
 * Placeholder TikTok API client. No real keys.
 * Replace with real TikTok API (e.g. Research API / Display API) after approval.
 */

export type TikTokPlatform = 'tiktok';

export interface TikTokPlaceholderPost {
  id: string;
  authorHandle: string;
  caption: string;
  postUrl: string;
  /** Mock location from API response; not scraped. */
  locationName?: string;
}

/**
 * Placeholder: returns mock posts. No network call, no API key.
 */
export async function searchTikTokPlaceholder(
  _keywords: string[]
): Promise<TikTokPlaceholderPost[]> {
  // Simulate API delay
  await new Promise((r) => setTimeout(r, 300));

  return [
    {
      id: 'tiktok_placeholder_1',
      authorHandle: '@cookiehunter',
      caption: 'Dubai chocolate chewy cookie at Grace Street in NYC 🍪',
      postUrl: 'https://www.tiktok.com/@cookiehunter/video/placeholder1',
      locationName: 'New York, NY',
    },
    {
      id: 'tiktok_placeholder_2',
      authorHandle: '@dessertlover',
      caption: 'Tried the dubai chewy cookie at Bear Donut midtown',
      postUrl: 'https://www.tiktok.com/@dessertlover/video/placeholder2',
      locationName: 'New York, NY',
    },
  ];
}
