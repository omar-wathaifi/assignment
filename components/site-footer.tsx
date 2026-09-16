export function SiteFooter() {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-line bg-surface">
      <div className="mx-auto w-full max-w-5xl px-4 py-8 text-sm sm:px-6">
        <p className="text-base font-semibold tracking-tight text-ink">Meeple &amp; Co</p>
        <p className="mt-1 text-muted">A little place for big games. 🎲</p>
        <p className="mt-4 text-xs text-muted">&copy; {year} Meeple &amp; Co</p>
      </div>
    </footer>
  );
}
