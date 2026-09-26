"use client";

import { CloudOff, RotateCcw } from "lucide-react";
import { useEffect } from "react";
import { useLanguage } from "@/components/i18n/language-provider";
import { PricesHeader } from "@/components/prices/prices-header";
import { Button, ButtonLink } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";

export default function PricesError({
  error,
  retry,
}: {
  error: Error & { digest?: string };
  retry: () => void;
}) {
  const { t } = useLanguage();
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <>
      <PricesHeader />
      <div className="bg-cream-100 pt-12 pb-24">
        <div className="container-x">
          <EmptyState
            icon={CloudOff}
            tone="error"
            role="alert"
            title={t.errors.pricesTitle}
            description={
              <>
                {t.errors.pricesBody}
                {error.digest && (
                  <span className="mt-2 block text-xs text-muted/80">
                    {t.errors.reference}: {error.digest}
                  </span>
                )}
              </>
            }
            action={
              <>
                <Button onClick={() => retry()}>
                  <RotateCcw /> {t.common.tryAgain}
                </Button>
                <ButtonLink href="/" variant="outline">
                  {t.common.backHome}
                </ButtonLink>
              </>
            }
          />
        </div>
      </div>
    </>
  );
}
