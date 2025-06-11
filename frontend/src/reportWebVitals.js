const reportWebVitals = onPerfEntry => {
  if (onPerfEntry && onPerfEntry instanceof Function) {
    import('web-vitals').then(({ getCLS, getFID, getFCP, getLCP, getTTFB }) => {
      getCLS(onPerfEntry);
      getFID(onPerfEntry);
      getFCP(onPerfEntry);
      getLCP(onPerfEntry);
      getTTFB(onPerfEntry);
    }).catch(err => {
      // Optional: Add more robust error handling or logging if needed
      // For example, you might want to log this to an error reporting service
      // in a production environment, but for development, console.error is often sufficient.
      console.error('Failed to load web-vitals:', err);
    });
  }
};

export default reportWebVitals;
