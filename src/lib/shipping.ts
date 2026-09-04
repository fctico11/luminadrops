import "server-only";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { getCheapestRate, type ShippoRate } from "@/lib/shippo";

export const destinationAddressSchema = z.object({
  name: z.string().trim().min(1, "Name is required."),
  street1: z.string().trim().min(1, "Street address is required."),
  street2: z.string().trim().optional(),
  city: z.string().trim().min(1, "City is required."),
  state: z.string().trim().min(2, "State is required.").max(2),
  zip: z.string().trim().min(3, "ZIP code is required."),
  country: z.enum(["US", "CA"]),
});

export type DestinationAddress = z.infer<typeof destinationAddressSchema>;

/** Looks up the product's package details and ship-from address, then asks
 * Shippo for the cheapest live carrier rate to the given destination.
 * Weight scales with quantity; box dimensions stay fixed (max quantity is 2,
 * so this is a reasonable approximation rather than needing per-quantity box sizes).
 *
 * Falls back to the product's flat `shippingCents` if Shippo can't be reached
 * or returns no rates, so a carrier outage never blocks a sale — it just means
 * the customer gets the flat-rate fallback price instead of a live quote. */
export async function quoteShippingForProduct(
  productId: string,
  quantity: number,
  destination: DestinationAddress
): Promise<ShippoRate | null> {
  const product = await prisma.product.findUnique({ where: { id: productId } });
  if (!product) return null;

  const fallback: ShippoRate = {
    amountCents: product.shippingCents,
    provider: "Standard",
    serviceLevel: "Shipping",
  };

  try {
    const liveRate = await getCheapestRate(
      {
        name: product.shipFromName,
        street1: product.shipFromStreet1,
        street2: product.shipFromStreet2 || undefined,
        city: product.shipFromCity,
        state: product.shipFromState,
        zip: product.shipFromZip,
        country: product.shipFromCountry,
      },
      {
        name: destination.name,
        street1: destination.street1,
        street2: destination.street2,
        city: destination.city,
        state: destination.state,
        zip: destination.zip,
        country: destination.country,
      },
      {
        lengthIn: product.lengthIn,
        widthIn: product.widthIn,
        heightIn: product.heightIn,
        weightOz: product.weightOz * quantity,
      }
    );
    return liveRate ?? fallback;
  } catch {
    return fallback;
  }
}
