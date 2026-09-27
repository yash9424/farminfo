"use server";

import { getPartBySlug, submitEnquiry } from "@/lib/parts";

export interface EnquiryState {
  status: "idle" | "success" | "error";
  message?: string;
  reference?: string;
  isDemo?: boolean;
  fieldErrors?: Partial<Record<"name" | "phone" | "email" | "message", string>>;
}

/**
 * Server action behind "Contact Seller" / "Send Enquiry".
 * Validates input server-side, then hands it to the data provider — the place
 * to plug in a real leads API / CRM / email service later.
 */
export async function sendEnquiry(_prev: EnquiryState, form: FormData): Promise<EnquiryState> {
  const get = (k: string) => String(form.get(k) ?? "").trim();
  const slug = get("slug");
  const name = get("name");
  const phone = get("phone").replace(/[\s-]/g, "");
  const email = get("email");
  const message = get("message");

  const fieldErrors: EnquiryState["fieldErrors"] = {};
  if (name.length < 2) fieldErrors.name = "Please enter your name.";
  if (!/^(\+91)?[6-9]\d{9}$/.test(phone)) fieldErrors.phone = "Enter a valid 10-digit Indian mobile number.";
  if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) fieldErrors.email = "Enter a valid email address.";
  if (message.length < 10) fieldErrors.message = "Please add a short message (10+ characters).";
  if (Object.keys(fieldErrors).length) return { status: "error", fieldErrors, message: "Please check the highlighted fields." };

  const part = await getPartBySlug(slug);
  if (!part) return { status: "error", message: "This listing is no longer available." };

  const result = await submitEnquiry({
    partId: part.id,
    sellerId: part.sellerId,
    name: name.slice(0, 80),
    phone,
    email: email.slice(0, 120),
    message: message.slice(0, 1500),
  });
  return result.ok
    ? { status: "success", reference: result.reference, isDemo: result.isDemo }
    : { status: "error", message: result.error ?? "We couldn't send your enquiry. Please try again." };
}
