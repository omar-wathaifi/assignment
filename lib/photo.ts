/** Photo shape shared by the Unsplash client, the API route and the browser. */
export interface Photo {
  id: string;
  url: string;
  alt: string;
  credit: {
    name: string;
    profileUrl: string;
  };
}
