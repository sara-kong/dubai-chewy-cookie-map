/**
 * Placeholder Instagram API client. No real keys.
 * Replace with Meta Graph API (Instagram) after approval.
 */

export type InstagramPlatform = 'instagram';

export interface InstagramPlaceholderPost {
  id: string;
  username: string;
  caption: string;
  permalink: string;
  /** Mock location from API; not scraped. */
  locationName?: string;
}

/**
 * Placeholder: returns mock posts. No network call, no API key.
 */
export async function searchInstagramPlaceholder(
  _keywords: string[]
): Promise<InstagramPlaceholderPost[]> {
  await new Promise((r) => setTimeout(r, 300));

  return [
    {
      id: 'ig_placeholder_1',
      username: 'gracestreet',
      caption: 'Dubai chocolate chewy cookie 🍪 17 W 32nd St',
      permalink: 'https://www.instagram.com/p/placeholder1/',
      locationName: 'New York, NY',
    },
    {
      id: 'ig_placeholder_2',
      username: 'beardonutinc',
      caption: 'dubai cookie alert! 40 W 31st',
      permalink: 'https://www.instagram.com/p/placeholder2/',
      locationName: 'New York, NY',
    },
  ];
}
