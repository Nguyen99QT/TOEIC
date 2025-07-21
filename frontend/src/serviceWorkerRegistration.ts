// This optional code is used to register a service worker.
// register() is not called by default.

type Config = {
  onSuccess?: (registration: ServiceWorkerRegistration) => void;
  onUpdate?: (registration: ServiceWorkerRegistration) => void;
  onError?: (error: Error) => void;
};

export function register(config?: Config) {
  if (
    process.env.NODE_ENV === "production" &&
    "serviceWorker" in navigator &&
    (window.location.protocol === "https:" ||
      window.location.hostname === "localhost")
  ) {
    window.addEventListener("load", () => {
      navigator.serviceWorker
        .register("/service-worker.js")
        .then((registration) => {
          // Đăng ký thành công
          console.log("Service Worker registered: ", registration);
          if (config && config.onSuccess) {
            config.onSuccess(registration);
          }
        })
        .catch((error) => {
          // Đăng ký thất bại
          console.error("Service Worker registration failed:", error);
          if (config && config.onError) {
            config.onError(error);
          }
        });
    });
  }
}

export function unregister() {
  if ("serviceWorker" in navigator) {
    navigator.serviceWorker.ready
      .then((registration) => {
        registration.unregister();
      })
      .catch(() => {});
  }
}
