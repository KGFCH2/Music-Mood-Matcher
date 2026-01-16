// Register service worker for PWA - only in production to avoid dev errors
if ('serviceWorker' in navigator) {
  if (import.meta.env.PROD) {
    window.addEventListener('load', () => {
      navigator.serviceWorker.register('/sw.js').then(
        (registration) => {
          console.log('ServiceWorker registration successful', registration)
        },
        (err) => {
          console.log('ServiceWorker registration failed: ', err)
        }
      )
    })
  } else {
    // In development mode, unregister any existing service worker from production/previous tests
    navigator.serviceWorker.getRegistrations().then((registrations) => {
      for (const registration of registrations) {
        registration.unregister()
          .then(() => console.log('Development Mode: ServiceWorker unregistered'))
      }
    })
  }
}
