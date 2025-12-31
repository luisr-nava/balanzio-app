const FALLBACK_LOCALE = "en-US";

export function formatCurrency(
  value: number,
  {
    currencyCode,
    countryCode,
    maximumFractionDigits = 0,
  }: {
    value: number;
    currencyCode: string;
    countryCode: string;
    maximumFractionDigits?: number;
  },
) {
  const localeCandidates = [
    `es-${countryCode}`,
    `en-${countryCode}`,
    FALLBACK_LOCALE,
  ];

  let formatter: Intl.NumberFormat | null = null;

  for (const locale of localeCandidates) {
    try {
      formatter = new Intl.NumberFormat(locale, {
        style: "currency",
        currency: currencyCode,
        maximumFractionDigits,
      });
      break;
    } catch {
      // probar siguiente locale
    }
  }

  return formatter!.format(value);
}

// utils/currency.ts
export const getCurrencySymbol = (
  currencyCode: string,
  locale: string = "es",
): string => {
  try {
    const formatter = new Intl.NumberFormat(locale, {
      style: "currency",
      currency: currencyCode,
      currencyDisplay: "symbol",
    });

    const parts = formatter.formatToParts(1);
    const currencyPart = parts.find((part) => part.type === "currency");

    return currencyPart?.value ?? currencyCode;
  } catch {
    return currencyCode;
  }
};

// utils/currency.ts
interface CurrencyOption {
  code: string;
}

export const mapCurrencyWithSymbol = (
  currencies: CurrencyOption[],
  locale?: string,
) =>
  currencies.map((currency) => ({
    code: currency.code,
    symbol: getCurrencySymbol(currency.code, locale),
  }));

export const formatMoney = (
  value: number,
  currencyCode: string,
  locale = "es-AR",
) => {
  const symbol = getCurrencySymbol(currencyCode, locale);
  return `${symbol}${value.toLocaleString(locale)}`;
};

export function getHslColor(variable: string, alpha = 1) {
  if (typeof window === "undefined") return "transparent";

  const value = getComputedStyle(document.documentElement)
    .getPropertyValue(variable)
    .trim();

  return `hsl(${value} / ${alpha})`;
}
export type Period = "week" | "month" | "year";
export function formatChartLabel(label: string | Date, period: Period) {
  const date = new Date(label + "T00:00:00");

  if (period === "week") {
    return date.toLocaleDateString("es-AR", { weekday: "long" });
  }

  if (period === "month") {
    return date.getDate().toString();
  }

  if (period === "year") {
    return date.toLocaleDateString("es-AR", { month: "long" });
  }

  return label;
}

