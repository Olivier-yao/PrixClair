// Service worker minimal : rend l'app installable (PWA).
// La strategie de cache hors-ligne sera affinee au polish mobile (etape 8).
self.addEventListener("install", () => {
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(self.clients.claim());
});

self.addEventListener("fetch", () => {
  // Passthrough reseau pour l'instant.
});
