/* istanbul ignore file */
import { clientsClaim, setCacheNameDetails } from "workbox-core";
import { cleanupOutdatedCaches, precacheAndRoute, PrecacheEntry } from "workbox-precaching";

declare let self: ServiceWorkerGlobalScope;

self.__WB_DISABLE_DEV_LOGS = true;
const CACHE = "react-ssr-cache";
const API_CACHE = "react-ssr-api-cache";

// cache name
setCacheNameDetails({
  prefix: CACHE,
  precache: "precache",
  runtime: "runtime",
});

// Open the cache where the assets were stored and search for the requested resource. Notice that in case of no matching, the promise still resolves but it does with undefined as value.
function fromCache(request: Request) {
  return caches.open(API_CACHE).then((cache) => {
    return cache.match(request).then((req) => {
      if (!req) {
        return fetch(request);
      }
      return req;
    });
  });
}

// Update consists in opening the cache, performing a network request and storing the new response data.
function update(request: Request) {
  return caches.open(API_CACHE).then((cache) => {
    return cache
      .match(request)
      .then((cachedResponse) => {
        if (cachedResponse) {
          const headers: Record<string, string> = {};
          request.headers.forEach((value, key) => {
            headers[key] = value;
          });
          const newRequest = new Request(request, {
            headers: {
              ...headers,
              etag: cachedResponse.headers.get("etag") || "",
            },
          });
          return newRequest;
        }
        return request;
      })
      .then((newRequest) => {
        return fetch(newRequest).then((response) => {
          return cache
            .match(request)
            .then((cachedResponse) => {
              if (cachedResponse) {
                const prevEtag = cachedResponse.headers.get("etag");
                const newEtag = response.headers.get("etag");
                return prevEtag === newEtag;
              }
              return false;
            })
            .then((etagMatched) => {
              if (etagMatched) {
                return { response, etagMatched: etagMatched as boolean };
              }
              return cache.put(request, response.clone()).then(() => {
                return { response, etagMatched };
              });
            });
        });
      });
  });
}

// Sends a message to the clients.
function refresh(response: Response, extra: string | null, etagMatched = false) {
  return self.clients.matchAll().then(function (clients) {
    clients.forEach((client) => {
      if (etagMatched) {
        return;
      }
      // Encode which resource has been updated. By including the ETag the client can check if the content has changed.
      const message = {
        type: "refresh",
        url: response.url,
        // Notice not all servers return the ETag header. If this is not provided you should use other cache headers or rely on your own means to check if the content has changed.
        eTag: response.headers.get("ETag"),
        extra,
        data: null,
      };
      response.json().then((data) => {
        message.data = data;
        // Tell the client about the update.
        client.postMessage(JSON.stringify(message));
      });
    });
  });
}

self.addEventListener("fetch", (event) => {
  const { request } = event;
  const url = new URL(request.url);

  if (url.pathname.match(/^(\/api)/g)) {
    const extra = request.headers.get("extra");

    // You can use respondWith() to answer ASAP…
    const headers: Record<string, string> = {};
    request.headers.forEach((value, key) => {
      if (key !== "extra" && key !== "doCache") {
        headers[key] = value;
      }
    });

    const newRequest = new Request(request, {
      headers,
    });
    const doCache = request.headers.get("doCache");
    if (doCache === "false" || request.method !== "GET") {
      event.respondWith(fetch(newRequest));
      return;
    }
    console.log(`service worker: serving api ${url.pathname} from cache!!`);

    event.respondWith(fromCache(newRequest));
    // ...and waitUntil() to prevent the worker to be killed until the cache is updated.
    event.waitUntil(
      update(newRequest)
        // Finally, send a message to the client to inform it about the resource is up to date.
        .then((respWithEtag) => refresh(respWithEtag.response, extra, respWithEtag.etagMatched)),
    );
  }
});

const manifest = [...self.__WB_MANIFEST] as PrecacheEntry[];
self.skipWaiting();
clientsClaim();
precacheAndRoute([...manifest]);
cleanupOutdatedCaches();
