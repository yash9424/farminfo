"use server";

export interface ListingState {
  status: "idle" | "success" | "error";
  message?: string;
  reference?: string;
  fieldErrors?: Partial<Record<"title" | "category" | "state" | "city" | "name" | "phone" | "condition", string>>;
}

/**
 * "List Your Part" submission. Frontend-only demo: validates and returns a
 * reference without storing anything. Connect this to your listings backend
 * (create listing + image upload + seller onboarding) when ready.
 */
export async function submitListing(_prev: ListingState, form: FormData): Promise<ListingState> {
  const get = (k: string) => String(form.get(k) ?? "").trim();
  const fe: ListingState["fieldErrors"] = {};
  if (get("title").length < 4) fe.title = "Enter the part name (e.g. “FANUC servo motor 12 Nm”).";
  if (!get("category")) fe.category = "Choose a category.";
  if (!get("condition")) fe.condition = "Choose the condition.";
  if (!get("state")) fe.state = "Choose a state.";
  if (get("city").length < 2) fe.city = "Enter your city.";
  if (get("name").length < 2) fe.name = "Enter your or your business name.";
  if (!/^(\+91)?[6-9]\d{9}$/.test(get("phone").replace(/[\s-]/g, ""))) fe.phone = "Enter a valid 10-digit Indian mobile number.";
  if (Object.keys(fe).length) return { status: "error", fieldErrors: fe, message: "Please check the highlighted fields." };

  await new Promise((r) => setTimeout(r, 600));
  return { status: "success", reference: `DEMO-L-${Date.now().toString(36).slice(-6).toUpperCase()}` };
}
