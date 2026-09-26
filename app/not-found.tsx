import { ArrowRight, Sprout } from "lucide-react";
import { ButtonLink } from "@/components/ui/button";
import { getI18n } from "@/lib/i18n";

export default async function NotFound() {
  const { t } = await getI18n();
  return (
    <section className="relative flex min-h-[80svh] items-center overflow-hidden bg-forest-950 pt-24 text-white">
      <div aria-hidden className="bg-dots absolute inset-0 opacity-50" />
      <div className="container-x relative flex flex-col items-center text-center">
        <span className="grid size-16 place-items-center rounded-2xl bg-white/8 text-gold-300 ring-1 ring-white/15">
          <Sprout className="size-7" aria-hidden />
        </span>
        <p className="mt-8 font-display text-8xl text-gold-200/90">404</p>
        <h1 className="mt-4 text-3xl font-medium sm:text-4xl">{t.errors.notFoundTitle}</h1>
        <p className="mt-4 max-w-md text-cream-100/75">
          {t.errors.notFoundBody}
        </p>
        <div className="mt-10 flex flex-col gap-3 sm:flex-row">
          <ButtonLink href="/prices" variant="gold" size="lg">
            {t.nav.checkTodayBhav} <ArrowRight />
          </ButtonLink>
          <ButtonLink href="/" variant="glass" size="lg">
            {t.common.backHome}
          </ButtonLink>
        </div>
      </div>
    </section>
  );
}
