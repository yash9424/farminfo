"use client";

import { CloudOff, RotateCcw } from "lucide-react";
import { useEffect } from "react";
import { useLanguage } from "@/components/i18n/language-provider";
import { Button, ButtonLink } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";

export default function RootError({
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
    <div className="bg-cream-100 pt-32 pb-24">
      <div className="container-x">
        <EmptyState
          icon={CloudOff}
          tone="error"
          role="alert"
          title={t.errors.rootTitle}
          description={t.errors.rootBody}
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
  );
}
