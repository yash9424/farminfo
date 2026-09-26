"use client";

import { CloudOff, RotateCcw } from "lucide-react";
import { useEffect } from "react";
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
            title="We couldn't load market prices"
            description={
              <>
                The price source didn&apos;t respond as expected. This is usually temporary — please
                try again in a moment.
                {error.digest && (
                  <span className="mt-2 block text-xs text-muted/80">Reference: {error.digest}</span>
                )}
              </>
            }
            action={
              <>
                <Button onClick={() => retry()}>
                  <RotateCcw /> Try again
                </Button>
                <ButtonLink href="/" variant="outline">
                  Back to home
                </ButtonLink>
              </>
            }
          />
        </div>
      </div>
    </>
  );
}
