let counter = 0;

//Great for doing first time configurations
self.oninstall = (event) => {
  console.log("service worker install");
};

//Great for doing some clean up code, for tearing down old version of caches
self.onactivate = (event) => {
  console.log("service worker activate");
  event.waitUntil(self.clients.claim());
};

self.onfetch = (event) => {
  // Would be called every time a network request is dene
  console.log("fetch", event.request.url);

  if (event.request.url.endsWith("/data.json")) {
    counter++;
    event.respondWith(
      new Response(JSON.stringify({ counter }), {
        headers: {
          "Content-Type": "application/json",
        },
      })
    );
    return;
  }
  // fallback to normal HTTP request
  event.respondWith(fetch(event.request));
};
