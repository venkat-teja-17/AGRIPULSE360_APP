window.onload = () => {
  // The intro animation runs when the page loads.
  setTimeout(() => {
    // After the animation completes (2 seconds), redirect to the main app page (or next screen).
    window.location.href = 'login.html'; // Replace with your app's main page URL.
  }, 7000); // Wait 3 seconds (adjust time if needed)
};
