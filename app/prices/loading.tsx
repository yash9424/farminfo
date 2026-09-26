import { PricesHeader } from "@/components/prices/prices-header";
import { PricesSkeleton } from "@/components/prices/prices-skeleton";
import { getI18n } from "@/lib/i18n";

export default async function PricesLoading() {
  const { t } = await getI18n();
  return (
    <>
      <PricesHeader />
      <div className="bg-cream-100 pb-24">
        <PricesSkeleton label={t.prices.loading} />
      </div>
    </>
  );
}
