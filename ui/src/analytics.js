export const sendAnalyticsEvent = (eventCategory, eventAction, eventLabel) => {
  if (window.ga && eventCategory && eventAction && eventLabel) {
    window.ga("send", "event", eventCategory, eventAction, eventLabel);
  }
};
