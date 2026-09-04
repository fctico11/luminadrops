import "server-only";

const SHIPPO_API_BASE = "https://api.goshippo.com";

export type ShippoAddress = {
  name: string;
  street1: string;
  street2?: string;
  city: string;
  state: string;
  zip: string;
  country: string;
};

export type ShippoParcel = {
  lengthIn: number;
  widthIn: number;
  heightIn: number;
  weightOz: number;
};

export type ShippoRate = {
  amountCents: number;
  provider: string;
  serviceLevel: string;
};

// Shippo test-mode accounts come with a long tail of regional/international
// carrier accounts pre-enabled (Correos, Hermes UK, Chronopost, etc.) that
// mostly just fail with "not supported" messages, but could occasionally
// return a real, unwanted rate. Restrict to the well-known US carriers.
const ALLOWED_PROVIDERS = new Set(["USPS", "UPS", "FedEx", "DHL Express"]);

function getApiKey() {
  const key = process.env.SHIPPO_API_KEY;
  if (!key) throw new Error("SHIPPO_API_KEY environment variable is not set");
  return key;
}

/** Asks Shippo for live carrier rates and returns the cheapest one, or null if
 * none came back (e.g. an unshippable address). Throws on a hard API failure
 * so callers can fall back to a flat rate rather than silently charging $0. */
export async function getCheapestRate(
  addressFrom: ShippoAddress,
  addressTo: ShippoAddress,
  parcel: ShippoParcel
): Promise<ShippoRate | null> {
  const res = await fetch(`${SHIPPO_API_BASE}/shipments/`, {
    method: "POST",
    headers: {
      Authorization: `ShippoToken ${getApiKey()}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      address_from: addressFrom,
      address_to: addressTo,
      parcels: [
        {
          length: String(parcel.lengthIn),
          width: String(parcel.widthIn),
          height: String(parcel.heightIn),
          distance_unit: "in",
          weight: String(parcel.weightOz),
          mass_unit: "oz",
        },
      ],
      async: false,
    }),
  });

  if (!res.ok) {
    throw new Error(`Shippo request failed: ${res.status} ${await res.text()}`);
  }

  const data = await res.json();
  const allRates: Array<{ amount: string; provider: string; servicelevel: { name: string } }> = data.rates ?? [];
  const rates = allRates.filter((r) => ALLOWED_PROVIDERS.has(r.provider));

  if (rates.length === 0) return null;

  const cheapest = rates.reduce((min, r) => (parseFloat(r.amount) < parseFloat(min.amount) ? r : min));

  return {
    amountCents: Math.round(parseFloat(cheapest.amount) * 100),
    provider: cheapest.provider,
    serviceLevel: cheapest.servicelevel.name,
  };
}
