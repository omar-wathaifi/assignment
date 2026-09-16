/** Photo shape shared by the Unsplash client, the API route and the browser. */
export interface Photo {
  id: string;
  /** Card-sized image (about 400px wide). */
  url: string;
  /** Larger image for the detail page (about 1080px wide). */
  largeUrl: string;
  alt: string;
  credit: {
    name: string;
    profileUrl: string;
  };
}
