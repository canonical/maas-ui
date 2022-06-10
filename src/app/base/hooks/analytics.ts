import { useCallback, useEffect } from "react";

import { useSelector } from "react-redux";

import configSelectors from "app/store/config/selectors";

declare global {
  interface Window {
    ga: (...args: unknown[]) => void;
  }
}

export type SendAnalytics = (
  eventCategory?: string,
  eventAction?: string,
  eventLabel?: string
) => void;

/**
 * Send a google analytics event
 * @param eventCategory - The analytics category.
 * @param eventAction - The analytics action.
 * @param eventLabel - The analytics label.
 */
const sendAnalytics = (
  eventCategory = "",
  eventAction = "",
  eventLabel = ""
) => {
  window.ga &&
    window.ga("send", "event", eventCategory, eventAction, eventLabel);
};

/**
 * Send an analytics event if analytics config is enabled
 */
export const useSendAnalytics = (): SendAnalytics => {
  const analyticsEnabled = useSelector(configSelectors.analyticsEnabled);
  return useCallback(
    (eventCategory?, eventAction?, eventLabel?) => {
      if (analyticsEnabled && eventCategory && eventAction && eventLabel) {
        sendAnalytics(eventCategory, eventAction, eventLabel);
      }
    },
    [analyticsEnabled]
  );
};

/**
 * Send an analytics event if a condition is met
 * @param sendCondition - Whether an analytics event is sent.
 * @param eventCategory - The analytics category.
 * @param eventAction - The analytics action.
 * @param eventLabel - The analytics label.
 */
export const useSendAnalyticsWhen = (
  sendCondition?: boolean,
  eventCategory?: string,
  eventAction?: string,
  eventLabel?: string
): void => {
  const sendAnalytics = useSendAnalytics();

  useEffect(() => {
    if (sendCondition) {
      sendAnalytics(eventCategory, eventAction, eventLabel);
    }
  }, [eventCategory, eventAction, eventLabel, sendCondition, sendAnalytics]);
};
