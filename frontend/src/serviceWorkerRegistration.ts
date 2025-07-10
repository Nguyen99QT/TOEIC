// This optional code is used to register a service worker.
// register() is not called by default.

const isLocalhost = Boolean(
  window.location.hostname === "localhost" ||
    // [::1] is the IPv6 localhost address.
    window.location.hostname === "[::1]" ||
    // 127.0.0.0/8 are considered localhost for IPv4.
    window.location.hostname.match(
      /^127(?:\.(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)){3}$/
    )
);

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
