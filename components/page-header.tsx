/**
 * House-style page header: an uppercase, letter-spaced eyebrow naming the
 * section, then the `h1`, then one muted descriptive sentence.
 */
export function PageHeader({
  eyebrow,
  title,
  description,
}: {
  eyebrow: string;
  title: string;
  description: string;
}) {
  return (
    <div className="mb-10">
      <p className="text-xs font-semibold uppercase tracking-[0.2em] text-brand">{eyebrow}</p>
      <h1 className="mt-3 text-3xl font-semibold tracking-tight text-ink sm:text-4xl">{title}</h1>
      <p className="mt-3 max-w-2xl text-base leading-relaxed text-muted">{description}</p>
    </div>
  );
}
