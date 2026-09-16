export function SiteFooter() {
  return (
    <footer className="border-t border-line bg-surface">
      <div className="mx-auto w-full max-w-5xl px-4 py-6 text-sm text-muted sm:px-6">
        <p>
          Meeple &amp; Co is a demo catalogue. Prices and release dates are placeholder data.
          Photography, when available, comes from{" "}
          <a
            className="font-medium text-brand underline underline-offset-2 hover:text-brand-strong"
            href="https://unsplash.com"
            rel="noreferrer noopener"
            target="_blank"
          >
            Unsplash (opens in a new tab)
          </a>
          .
        </p>
      </div>
    </footer>
  );
}
