(function () {
  if (!("serviceWorker" in navigator)) {
    return;
  }

  const localHosts = ["localhost", "127.0.0.1", "::1"];
  const isLocalhost = localHosts.includes(window.location.hostname);

  function clearLocalServiceWorker() {
    const unregisterWorkers = navigator.serviceWorker
      .getRegistrations()
      .then(function (registrations) {
        return Promise.all(
          registrations.map(function (registration) {
            return registration.unregister();
          })
        );
      });

    const clearCaches = "caches" in window
      ? caches.keys().then(function (keys) {
          return Promise.all(
            keys.map(function (key) {
              return caches.delete(key);
            })
          );
        })
      : Promise.resolve();

    Promise.all([unregisterWorkers, clearCaches]).then(function () {
      if (
        navigator.serviceWorker.controller &&
        sessionStorage.getItem("jhonfs-dev-sw-cleared") !== "true"
      ) {
        sessionStorage.setItem("jhonfs-dev-sw-cleared", "true");
        window.location.reload();
        return;
      }

      sessionStorage.removeItem("jhonfs-dev-sw-cleared");
    });
  }

  if (isLocalhost) {
    clearLocalServiceWorker();
    return;
  }

  window.addEventListener("load", function () {
    navigator.serviceWorker.register("/sw.js", { updateViaCache: "none" }).catch(function () {
      // A instalação PWA é progressiva; o site continua normal se falhar.
    });
  });
})();
