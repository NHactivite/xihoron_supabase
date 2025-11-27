/**
 * Copyright 2018 Google Inc. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *     http://www.apache.org/licenses/LICENSE-2.0
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

// If the loader is already loaded, just stop.
const CACHE_VERSION = "v4";   // <= CHANGE this every time you update logo/icons

if (!self.define) { 
  let registry = {};

  let nextDefineUri;

  const singleRequire = (uri, parentUri) => {
    uri = new URL(uri + ".js", parentUri).href;
    return registry[uri] || (
      
        new Promise(resolve => {
          if ("document" in self) {
            const script = document.createElement("script");
            script.src = uri;
            script.onload = resolve;
            document.head.appendChild(script);
          } else {
            nextDefineUri = uri;
            importScripts(uri);
            resolve();
          }
        })
      
      .then(() => {
        let promise = registry[uri];
        if (!promise) {
          throw new Error(`Module ${uri} didn’t register its module`);
        }
        return promise;
      })
    );
  };

  self.define = (depsNames, factory) => {
    const uri = nextDefineUri || ("document" in self ? document.currentScript.src : "") || location.href;
    if (registry[uri]) {
      return;
    }
    let exports = {};
    const require = depUri => singleRequire(depUri, uri);
    const specialDeps = {
      module: { uri },
      exports,
      require
    };
    registry[uri] = Promise.all(depsNames.map(
      depName => specialDeps[depName] || require(depName)
    )).then(deps => {
      factory(...deps);
      return exports;
    });
  };
}

define(['./workbox-e43f5367'], function (workbox) {
  'use strict';

  importScripts();

  // ⚡ IMPORTANT: instantly replace old service worker
  self.skipWaiting();
  workbox.clientsClaim();

  // 🚀 Start URL cache (with version)
  workbox.registerRoute(
    "/",
    new workbox.NetworkFirst({
      cacheName: "start-url-" + CACHE_VERSION,
      plugins: [{
        cacheWillUpdate: async ({ response }) => {
          if (response && response.type === "opaqueredirect") {
            return new Response(response.body, {
              status: 200,
              statusText: "OK",
              headers: response.headers
            });
          }
          return response;
        }
      }]
    }),
    "GET"
  );

  // 🔥 All other files (new dev cache)
  workbox.registerRoute(
    /.*/i,
    new workbox.NetworkOnly({
      cacheName: "dev-" + CACHE_VERSION,
      plugins: []
    }),
    "GET"
  );
});
