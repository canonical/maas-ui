import { useCallback, useEffect, useRef, useState } from "react";

import { NotificationSeverity } from "@canonical/react-components";
import type { NotificationProps } from "@canonical/react-components";
import { useDispatch, useSelector } from "react-redux";

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
 */
export const useProcessing = ({
  hasErrors = false,
  onComplete = () => null,
  onError = () => null,
  processingCount,
}: {
  hasErrors?: boolean;
  onComplete?: () => void;
  onError?: () => void;
  processingCount: number;
}): boolean => {
  const [processingComplete, setProcessingComplete] = useState(false);

  // If all the items have finished processing and there are no errors, run the
  // onComplete function.
  useCycled(processingCount === 0, () => {
    if (!hasErrors) {
      setProcessingComplete(true);
      onComplete();
    }
  });

  // If the items are processing and errors occur, run the onError function.
  useCycled(hasErrors, () => {
    if (processingCount !== 0) {
      setProcessingComplete(false);
      onError();
    }
  });

  return processingComplete;
};

/**
 * Scroll an element into view on render.
 */
export const useScrollOnRender = <T extends HTMLElement>(): ((
  targetNode: T
) => void) => {
  const htmlRef = useRef<HTMLElement>(document.querySelector("html"));
  const onRenderRef = useCallback((targetNode) => {
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
