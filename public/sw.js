self.addEventListener("install", (event) => {
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    clients.claim().then(() => {
      return self.clients.matchAll().then((clients) => {
        clients.forEach((client) => client.postMessage({ type: "SW_UPDATED" }));
      });
    })
  );
});
