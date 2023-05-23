import type { KeyboardEvent, KeyboardEventHandler } from "react";
import { useCallback, useEffect, useRef, useState } from "react";

import { NotificationSeverity } from "@canonical/react-components";
import type { NotificationProps } from "@canonical/react-components";
import { nanoid } from "@reduxjs/toolkit";
import { useDispatch, useSelector } from "react-redux";
import { useLocation } from "react-router-dom";

import type { KeyboardShortcut } from "../constants";

import configSelectors from "app/store/config/selectors";
import { actions as messageActions } from "app/store/message";

/**
 * Add a message in response to a state change e.g. when something is created.
 * @param addCondition - Whether the message should be added.
 * @param cleanup - A cleanup action to fire.
 * @param message - The message to be displayed.
 * @param onMessageAdded - A function to call once the message has
                                      been displayed.
 * @param messageType - The notification type.
 */
export const useAddMessage = (
  addCondition: boolean,
  cleanup: () => { type: string },
  message: string,
  onMessageAdded?: (() => void) | null,
  messageSeverity: NotificationProps["severity"] = NotificationSeverity.INFORMATION
): void => {
  const dispatch = useDispatch();

  useEffect(() => {
    if (addCondition) {
      dispatch(messageActions.add(message, messageSeverity));
      onMessageAdded && onMessageAdded();
      dispatch(cleanup());
    }
  }, [
    addCondition,
    cleanup,
    dispatch,
    message,
    messageSeverity,
    onMessageAdded,
  ]);
};

/**
 * Set the browser window title.
 * @param title - The title to set.
 */
export const useWindowTitle = (title?: string): void => {
  const maasName = useSelector(configSelectors.maasName);
  const maasNamePart = maasName ? `${maasName} ` : "";
  const titlePart = title ? `${title} | ` : "";
  useEffect(() => {
    document.title = `${titlePart}${maasNamePart}MAAS`;
  }, [maasNamePart, titlePart]);
};

/**
 * Handle checking when a value has cycled from false to true.
 * @param value - The value to check.
 * @param onCycled - The function to call when the value changes from false to true.
 */
export const useCycled = (
  value: boolean,
  onCycled?: () => void
): [boolean, () => void] => {
  const previousValue = useRef(value);
  const [hasCycled, setHasCycled] = useState(false);
  useEffect(() => {
    if (value && !previousValue.current) {
      onCycled && onCycled();
      setHasCycled(true);
    }
    if (previousValue.current !== value) {
      previousValue.current = value;
    }
  }, [value, onCycled]);
  const resetHasCycled = useCallback(() => {
    setHasCycled(false);
    previousValue.current = false;
  }, [setHasCycled]);
  return [hasCycled, resetHasCycled];
};

/**
 * Handle displaying action progress for batched actions.
 * @param processingCount - The number of items currently being processed.
 * @param onComplete - The function to call when all the items have been processed.
 * @param hasErrors - Whether there are any item errors in state.
 * @param onError - The function to call when an error occurs.
 * @returns Whether the list of items has been processed successfully.
 */
export const useProcessing = ({
  hasErrors = false,
  onComplete,
  onError,
  processingCount,
}: {
  hasErrors?: boolean;
  onComplete?: () => void;
  onError?: () => void;
  processingCount?: number;
}): boolean => {
  const [processingStarted] = useCycled(processingCount !== 0);
  const [processingComplete, setProcessingComplete] = useState(false);

  // If all the items have finished processing and there are no errors, run the
  // onComplete function.
  useCycled(processingCount === 0, () => {
    if (!hasErrors) {
      setProcessingComplete(true);
      onComplete && onComplete();
    }
  });

  // If processing has started and an error occurs, run the onError function.
  useCycled(hasErrors && processingStarted, () => {
    setProcessingComplete(false);
    onError && onError();
  });

  return processingComplete;
};

/**
 * Scroll an element into view on render.
 */
export const useScrollOnRender = <T extends HTMLElement>(): ((
  targetNode: T | null
) => void) => {
  const htmlRef = useRef<HTMLElement>(document.querySelector("html"));
  const onRenderRef = useCallback((targetNode: T | null) => {
    if (targetNode && htmlRef?.current) {
      const { height: targetHeight, y: targetTop } =
        targetNode.getBoundingClientRect();
      const windowTop = htmlRef.current.scrollTop;
      const windowBottom = windowTop + window.innerHeight;
      const targetBottom = targetTop + targetHeight;
      // Whether the top of the target is below the bottom of the screen.
      const topOffBottom = targetTop > windowBottom;
      // Whether the top of the target is above the top of the screen.
      const topOffTop = targetTop < windowTop;
      // Whether the top of the target is on the screen.
      const topOnScreen = !topOffTop && !topOffBottom;
      // Whether the bottom of the target is below the bottom of the screen.
      const bottomOffBottom = targetBottom > windowBottom;
      // Whether the target top is on the screen but the bottom is below the bottom.
      const targetPartiallyOffBottom = topOnScreen && bottomOffBottom;
      if (topOffBottom || topOffTop || targetPartiallyOffBottom) {
        window.scrollTo({
          top: targetTop,
          left: 0,
          behavior: "smooth",
        });
      }
    }
  }, []);
  return onRenderRef;
};

/**
 * Get a random ID string
 * @returns non-secure random ID string
 */
export const useId = (): string => useRef(nanoid()).current;

/**
 * Scroll to the top of the window on URL pathname change.
 */
export const useScrollToTop = (): void => {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
};

/**
 * Returns the previous value reference persisted across the render cycles
 * @param value - value to persist across the render cycles
 * @returns previous value
 */
export const usePreviousPersistent = <T extends unknown>(
  value: T
): T | null => {
  const ref = useRef<{ value: T; prev: T | null }>({
    value: value,
    prev: null,
  });

  const current = ref.current.value;

  if (value !== current) {
    ref.current = {
      value: value,
      prev: current,
    };
  }

  return ref.current.prev;
};

/**
 * Handle key pressed event.
 */
export const useOnKeyPressed = (
  key: string,
  onAfterPressed: KeyboardEventHandler
): void => {
  const keyDown = useCallback(
    (event) => {
      if (event.key === key) {
        onAfterPressed(event);
      }
    },
    [onAfterPressed, key]
  );
  useEffect(() => {
    document.addEventListener("keydown", keyDown);
    return () => {
      document.removeEventListener("keydown", keyDown);
    };
  }, [keyDown]);
};

/**
 * Add a new global key shortcut handler.
 */
export const useGlobalKeyShortcut = (
  key: KeyboardShortcut,
  onAfterPressed: KeyboardEventHandler
): void => {
  useOnKeyPressed(key, (event: KeyboardEvent) => {
    // ignore keyboard events with modifiers
    if (event.ctrlKey || event.altKey || event.metaKey) {
      return;
    }
    // ignore keyboard events from input elements
    if ((event.target as Element).nodeName !== "INPUT") {
      onAfterPressed(event);
    }
  });
};
