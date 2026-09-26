"use client";

import { CloudOff, RotateCcw } from "lucide-react";
import { useEffect } from "react";
import { Button, ButtonLink } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";

export default function RootError({
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
    <div className="bg-cream-100 pt-32 pb-24">
      <div className="container-x">
        <EmptyState
          icon={CloudOff}
          tone="error"
          role="alert"
          title="Something went wrong"
          description="We couldn't load this page. Please try again in a moment."
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
  );
}
