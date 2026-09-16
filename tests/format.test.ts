import { describe, expect, it } from "vitest";

import { formatDate, formatMoney } from "@/lib/format";

describe("formatDate", () => {
  it("renders the house-style date", () => {
    expect(formatDate("2026-09-15")).toBe("15 Sep 2026");
  });

  it("drops the leading zero on single-digit days", () => {
    expect(formatDate("2004-09-03")).toBe("3 Sep 2004");
  });

  it("uses the three-letter month, never the ICU en-GB 'Sept' variant", () => {
    expect(formatDate("2018-09-01")).not.toContain("Sept ");
    expect(formatDate("2018-09-01")).toBe("1 Sep 2018");
  });

  it("never uses slashes, long month names or ordinals", () => {
    const formatted = formatDate("2026-09-15");

    expect(formatted).not.toMatch(/\//);
    expect(formatted).not.toMatch(/September/);
    expect(formatted).not.toMatch(/\d(st|nd|rd|th)/);
  });

  it("formats every month correctly", () => {
    expect(formatDate("2020-01-31")).toBe("31 Jan 2020");
    expect(formatDate("2020-12-25")).toBe("25 Dec 2020");
  });

  it("rejects a value that is not an ISO date", () => {
    expect(() => formatDate("15/09/2026")).toThrow();
  });
});

describe("formatMoney", () => {
  it("renders two decimals, a space and the ISO currency code", () => {
    expect(formatMoney(12.5, "EUR")).toBe("12.50 EUR");
  });

  it("pads and rounds to two decimals", () => {
    expect(formatMoney(69, "EUR")).toBe("69.00 EUR");
    expect(formatMoney(19.999, "EUR")).toBe("20.00 EUR");
  });

  it("never renders a currency symbol", () => {
    const formatted = formatMoney(74.5, "EUR");

    expect(formatted).not.toMatch(/[$€£]/);
  });
});
