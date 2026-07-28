import localFont from "next/font/local";

// Meme police que le PDF (src/lib/documents/fonts) pour que le recu affiche
// a l'ecran soit identique a celui telecharge.
export const courierPrime = localFont({
  src: [
    { path: "../documents/fonts/CourierPrime-Regular.ttf", weight: "400", style: "normal" },
    { path: "../documents/fonts/CourierPrime-Bold.ttf", weight: "700", style: "normal" },
  ],
  variable: "--font-courier-prime",
});
