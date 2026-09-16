/**
 * House-style formatters.
 *
 * Every date and price in the UI goes through this module so the conventions
 * stay in one place:
 *   - dates  -> `15 Sep 2026`
 *   - money  -> `12.50 EUR`
 */

const MONTHS = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
] as const;

/**
 * Formats an ISO 8601 date (`2026-09-15`) as `15 Sep 2026`.
 *
 * Deliberately hand-rolled rather than `Intl.DateTimeFormat`: recent ICU
 * versions render September as `Sept` for en-GB, which breaks the house style.
 */
export function formatDate(isoDate: string): string {
  const match = /^(\d{4})-(\d{2})-(\d{2})/.exec(isoDate);

  if (!match) {
    throw new Error(`Expected an ISO date such as 2026-09-15, received "${isoDate}".`);
  }

  const [, year, month, day] = match;
  const monthName = MONTHS[Number(month) - 1];

  if (!monthName) {
    throw new Error(`"${isoDate}" does not contain a valid month.`);
  }

  return `${Number(day)} ${monthName} ${year}`;
}

/**
 * Formats an amount as `12.50 EUR`: two decimal places, a space, then the
 * ISO 4217 currency code. Never a currency symbol.
 */
export function formatMoney(amount: number, currency: string): string {
  if (!Number.isFinite(amount)) {
    throw new Error(`Expected a finite amount, received "${amount}".`);
  }

  return `${amount.toFixed(2)} ${currency.toUpperCase()}`;
}
