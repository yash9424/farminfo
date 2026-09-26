import type { Metadata, Viewport } from "next";
import { Anek_Gujarati, Fraunces, Manrope, Rasa } from "next/font/google";
import { LanguageProvider, LocaleFade } from "@/components/i18n/language-provider";
import { Footer } from "@/components/layout/footer";
import { Header } from "@/components/layout/header";
import { MotionProvider } from "@/components/motion/motion-provider";
import { getI18n } from "@/lib/i18n";
import { siteConfig } from "@/lib/site";
import { intlLocale } from "@/locales";
import "./globals.css";

const manrope = Manrope({
  variable: "--font-manrope",
  subsets: ["latin"],
  display: "swap",
});

const fraunces = Fraunces({
  variable: "--font-fraunces",
  subsets: ["latin"],
  display: "swap",
  axes: ["SOFT", "opsz"],
});

// Gujarati faces: only the Gujarati subset, so they download only when
// Gujarati text is on the page (unicode-range), pairing with Manrope / Fraunces.
const anekGujarati = Anek_Gujarati({
  variable: "--font-anek-gujarati",
  subsets: ["gujarati"],
  display: "swap",
  preload: false,
});

const rasa = Rasa({
  variable: "--font-rasa",
  subsets: ["gujarati"],
  display: "swap",
  preload: false,
});

export async function generateMetadata(): Promise<Metadata> {
  const { locale, t } = await getI18n();
  return {
    metadataBase: new URL(siteConfig.url),
    title: {
      default: t.meta.title,
      template: `%s · ${siteConfig.name}`,
    },
    description: t.meta.description,
    applicationName: siteConfig.name,
    keywords: [
      "Gujarat market yard bhav",
      "APMC prices Gujarat",
      "mandi bhav",
      "Rajkot APMC",
      "Gondal market yard",
      "crop prices",
      "jeera bhav",
      "kapas bhav",
      "groundnut price",
      "બજાર ભાવ",
      "માર્કેટ યાર્ડ ભાવ",
    ],
    openGraph: {
      type: "website",
      locale: locale === "gu" ? "gu_IN" : "en_IN",
      alternateLocale: locale === "gu" ? "en_IN" : "gu_IN",
      siteName: siteConfig.name,
      title: t.meta.title,
      description: t.meta.description,
      url: "/",
    },
    twitter: {
      card: "summary_large_image",
      title: t.meta.title,
      description: t.meta.description,
    },
    alternates: { canonical: "/" },
    formatDetection: { telephone: false },
  };
}

export const viewport: Viewport = {
  themeColor: "#0d3423",
  colorScheme: "light",
};

export default async function RootLayout({ children }: LayoutProps<"/">) {
  const { locale, t } = await getI18n();

  return (
    <html
      lang={intlLocale(locale)}
      className={`${manrope.variable} ${fraunces.variable} ${anekGujarati.variable} ${rasa.variable}`}
    >
      <body className="flex min-h-dvh flex-col">
        <a href="#main" className="skip-link">
          {t.common.skipToContent}
        </a>
        <LanguageProvider locale={locale}>
          <MotionProvider>
            <Header />
            <LocaleFade>
              <main id="main" className="flex-1">
                {children}
              </main>
              <Footer />
            </LocaleFade>
          </MotionProvider>
        </LanguageProvider>
      </body>
    </html>
  );
}
