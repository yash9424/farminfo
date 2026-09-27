"use client";

import { AlertTriangle, RotateCcw } from "lucide-react";
import { useEffect } from "react";
import { Button, ButtonLink } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";

export default function RootError({ error, retry }: { error: Error & { digest?: string }; retry: () => void }) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="bg-canvas pt-28 pb-24">
      <div className="container-x">
        <EmptyState
          icon={AlertTriangle}
          tone="error"
          role="alert"
          title="Something went wrong while loading parts."
          description={
            <>
              This is usually temporary — please try again.
              {error.digest && <span className="mt-2 block text-xs text-muted/80">Reference: {error.digest}</span>}
            </>
          }
          action={
            <>
              <Button onClick={() => retry()}>
                <RotateCcw /> Retry
              </Button>
              <ButtonLink href="/" variant="outline">
                Back to home
              </ButtonLink>
            </>
          }
        />
      </div>
    </div>
  );
}
