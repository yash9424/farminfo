"use client";

import * as Dialog from "@radix-ui/react-dialog";
import { AnimatePresence } from "motion/react";
import * as m from "motion/react-m";
import { CheckCircle2, Loader2, Send, X } from "lucide-react";
import { useActionState, useId } from "react";
import { sendEnquiry, type EnquiryState } from "@/app/actions/enquiry";
import { cn } from "@/lib/utils";

const initial: EnquiryState = { status: "idle" };

function Field({
  label,
  error,
  children,
  optional,
}: {
  label: string;
  error?: string;
  children: (id: string, describedBy?: string) => React.ReactNode;
  optional?: boolean;
}) {
  const id = useId();
  const errId = `${id}-err`;
  return (
    <div>
      <label htmlFor={id} className="mb-1.5 block text-sm font-semibold text-ink">
        {label} {optional && <span className="font-normal text-muted">(optional)</span>}
      </label>
      {children(id, error ? errId : undefined)}
      {error && (
        <p id={errId} className="mt-1 text-xs font-medium text-danger">
          {error}
        </p>
      )}
    </div>
  );
}

const input =
  "w-full rounded-xl border bg-white px-3.5 text-[0.9375rem] text-ink outline-none transition-[border-color,box-shadow] placeholder:text-graphite-400 focus:border-graphite-500 focus:ring-4 focus:ring-graphite-500/10";

function EnquiryForm({ slug, title, sellerName, onDone }: { slug: string; title: string; sellerName: string; onDone: () => void }) {
  const [state, action, pending] = useActionState(sendEnquiry, initial);
  const fe = state.fieldErrors ?? {};

  if (state.status === "success") {
    return (
      <div className="px-6 py-10 text-center">
        <m.span
          initial={{ scale: 0.6, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: "spring", stiffness: 300, damping: 18 }}
          className="mx-auto grid size-16 place-items-center rounded-full bg-ok-soft text-ok"
        >
          <CheckCircle2 className="size-8" aria-hidden />
        </m.span>
        <h3 className="mt-5 text-xl font-bold text-ink">Enquiry sent</h3>
        <p className="mx-auto mt-2 max-w-sm text-sm leading-relaxed text-muted">
          {sellerName} will contact you about <span className="font-semibold text-ink">{title}</span>.
        </p>
        {state.reference && <p className="mt-3 text-xs text-muted tabular">Reference: {state.reference}</p>}
        {state.isDemo && (
          <p className="mx-auto mt-5 max-w-sm rounded-xl bg-accent-50 px-4 py-3 text-xs leading-relaxed text-accent-700 ring-1 ring-accent-200">
            Demo mode: this is a sample listing, so no message was actually sent to anyone.
          </p>
        )}
        <button type="button" onClick={onDone} className="mt-6 h-11 rounded-xl bg-graphite-950 px-6 text-sm font-semibold text-white hover:bg-graphite-800">
          Done
        </button>
      </div>
    );
  }

  return (
    <form action={action} className="space-y-4 px-6 pt-2 pb-6" noValidate>
      <input type="hidden" name="slug" value={slug} />
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Name" error={fe.name}>
          {(id, d) => <input id={id} name="name" autoComplete="name" required aria-invalid={!!fe.name} aria-describedby={d} className={cn(input, "h-11", fe.name ? "border-danger" : "border-line-strong")} />}
        </Field>
        <Field label="Phone Number" error={fe.phone}>
          {(id, d) => (
            <input id={id} name="phone" type="tel" inputMode="tel" autoComplete="tel" placeholder="10-digit mobile" required aria-invalid={!!fe.phone} aria-describedby={d} className={cn(input, "h-11", fe.phone ? "border-danger" : "border-line-strong")} />
          )}
        </Field>
      </div>
      <Field label="Email" error={fe.email} optional>
        {(id, d) => <input id={id} name="email" type="email" autoComplete="email" aria-invalid={!!fe.email} aria-describedby={d} className={cn(input, "h-11", fe.email ? "border-danger" : "border-line-strong")} />}
      </Field>
      <Field label="Message" error={fe.message}>
        {(id, d) => (
          <textarea
            id={id}
            name="message"
            rows={4}
            defaultValue={`I'm interested in ${title}. Please share more details on availability, condition and price.`}
            aria-invalid={!!fe.message}
            aria-describedby={d}
            className={cn(input, "resize-y py-3 leading-relaxed", fe.message ? "border-danger" : "border-line-strong")}
          />
        )}
      </Field>
      {state.status === "error" && state.message && (
        <p role="alert" className="rounded-xl bg-danger-soft px-4 py-2.5 text-sm font-medium text-danger">
          {state.message}
        </p>
      )}
      <button
        type="submit"
        disabled={pending}
        className="inline-flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-accent-500 text-[0.9375rem] font-semibold text-white shadow-[inset_0_1px_0_rgb(255_255_255/0.2)] transition-colors hover:bg-accent-600 disabled:opacity-70"
      >
        {pending ? <Loader2 className="size-4 animate-spin" aria-hidden /> : <Send className="size-4" aria-hidden />}
        {pending ? "Sending…" : "Send Enquiry"}
      </button>
      <p className="text-center text-xs text-muted">Your details are shared only with this seller.</p>
    </form>
  );
}

export function EnquiryDialog({
  open,
  onOpenChange,
  slug,
  title,
  sellerName,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  slug: string;
  title: string;
  sellerName: string;
}) {
  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <AnimatePresence>
        {open && (
          <Dialog.Portal forceMount>
            <Dialog.Overlay asChild forceMount>
              <m.div className="fixed inset-0 z-[85] bg-graphite-950/60 backdrop-blur-sm" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} />
            </Dialog.Overlay>
            <Dialog.Content asChild forceMount>
              <m.div
                className="fixed inset-x-0 bottom-0 z-[86] max-h-[94dvh] overflow-y-auto rounded-t-3xl bg-white shadow-float outline-none sm:inset-x-auto sm:top-1/2 sm:bottom-auto sm:left-1/2 sm:w-[34rem] sm:-translate-x-1/2 sm:-translate-y-1/2 sm:rounded-3xl"
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 40 }}
                transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
              >
                <div className="flex items-start justify-between gap-4 px-6 pt-6 pb-3">
                  <div className="min-w-0">
                    <Dialog.Title className="text-xl font-bold text-ink">Contact Seller</Dialog.Title>
                    <Dialog.Description className="mt-1 truncate text-sm text-muted">
                      {sellerName} · {title}
                    </Dialog.Description>
                  </div>
                  <Dialog.Close className="grid size-9 shrink-0 place-items-center rounded-lg hover:bg-graphite-100" aria-label="Close">
                    <X className="size-5" />
                  </Dialog.Close>
                </div>
                <EnquiryForm slug={slug} title={title} sellerName={sellerName} onDone={() => onOpenChange(false)} />
              </m.div>
            </Dialog.Content>
          </Dialog.Portal>
        )}
      </AnimatePresence>
    </Dialog.Root>
  );
}
