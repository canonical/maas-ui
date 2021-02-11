import { useCallback, useEffect, useRef, useState } from "react";

import { notificationTypes } from "@canonical/react-components";
import type { MenuLink } from "@canonical/react-components/dist/components/ContextualMenu/ContextualMenuDropdown/ContextualMenuDropdown";
import { usePrevious } from "@canonical/react-components/dist/hooks";
import { useFormikContext } from "formik";
import { useDispatch, useSelector } from "react-redux";

import { messages } from "app/base/actions";
import type { TSFixMe } from "app/base/types";
import { simpleObjectEquality } from "app/settings/utils";
import configSelectors from "app/store/config/selectors";
import generalSelectors from "app/store/general/selectors";
import { actions as machineActions } from "app/store/machine";
import machineSelectors from "app/store/machine/selectors";
import type { Machine } from "app/store/machine/types";
import type { RootState } from "app/store/root/types";
import { kebabToCamelCase } from "app/utils";

/**
 * Combines formik validation errors and errors returned from server
 * for use in formik forms.
 * @param errors - The errors object in redux state.
 */
export const useFormikErrors = (errors: TSFixMe): void => {
  const { setFieldError, setFieldTouched, values } = useFormikContext();
  const previousErrors = usePrevious(errors);
  useEffect(() => {
    // Only run this effect if the errors have changed.
    if (
      errors &&
      typeof errors === "object" &&
      !simpleObjectEquality(errors, previousErrors)
    ) {
      Object.keys(errors).forEach((field) => {
        let errorString: string;
        if (Array.isArray(errors[field])) {
          errorString = errors[field].join(" ");
        } else {
          errorString = errors[field];
        }
        setFieldError(field, errorString);
        setFieldTouched(field, true, false);
      });
    }
  }, [errors, previousErrors, setFieldError, setFieldTouched, values]);
};

/**
 * Returns whether a formik form should be disabled, given the current state
 * of the form.
 * @param allowAllEmpty - Whether all fields are allowed to be empty.
 * @param allowUnchanged - Whether the form is enabled even when unchanged.
 * @returns Form is disabled.
 */
export const useFormikFormDisabled = ({
  allowAllEmpty = false,
  allowUnchanged = false,
}: {
  allowAllEmpty?: boolean;
  allowUnchanged?: boolean;
}): boolean => {
  const { initialValues, errors, values } = useFormikContext<TSFixMe>();
  // As we delete keys from values below, we don't want to
  // mutate the actual form values
  const newValues = { ...values };
  let hasErrors = false;
  if (errors) {
    hasErrors = Object.keys(errors).length > 0;
  }
  if (allowAllEmpty) {
    // If all fields are allowed to be empty then remove the from the values.
    Object.keys(newValues).forEach((key) => {
      if (!newValues[key]) {
        delete newValues[key];
      }
    });
  }
  if (allowUnchanged) {
    return hasErrors;
  }
  let matchesInitial = false;
  // Now that fields have been removed then make sure there are some fields left
  // to compare.
  if (Object.keys(newValues).length) {
    matchesInitial = simpleObjectEquality(initialValues, newValues);
  }
  return matchesInitial || hasErrors;
};

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
  onMessageAdded: () => void,
  messageType: notificationTypes = notificationTypes.INFORMATION
): void => {
  const dispatch = useDispatch();

  useEffect(() => {
    if (addCondition) {
      dispatch(messages.add(message, messageType));
      onMessageAdded && onMessageAdded();
      dispatch(cleanup());
    }
  }, [addCondition, cleanup, dispatch, message, messageType, onMessageAdded]);
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

export type SendAnalytics = (
  eventCategory?: string,
  eventAction?: string,
  eventLabel?: string
) => void;

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
  sendCondition: boolean,
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

/**
 * Generate menu items for the available actins on a machine.
 * @param systemId - The system id for a machine.
 * @param actions - The actions to generate menu items for.
 * @param noneMessage - The message to display if there are no items.
 * @param onClick - A function to call when the item is clicked.
 */
export const useMachineActions = (
  systemId: Machine["system_id"],
  actions: string[],
  noneMessage?: string | null,
  onClick?: () => void
): MenuLink => {
  const dispatch = useDispatch();
  const generalMachineActions = useSelector(
    generalSelectors.machineActions.get
  );
  const machine = useSelector((state: RootState) =>
    machineSelectors.getById(state, systemId)
  );
  const actionLinks: MenuLink = [];
  if (machine) {
    actions.forEach((action) => {
      if (machine.actions.includes(action)) {
        let actionLabel = action;
        generalMachineActions.forEach((machineAction) => {
          if (machineAction.name === action) {
            actionLabel = machineAction.title;
          }
        });

        actionLinks.push({
          children: actionLabel,
          onClick: () => {
            const actionMethod = kebabToCamelCase(action);
            dispatch(machineActions[actionMethod](systemId));
            onClick && onClick();
          },
        });
      }
    });
    if (actionLinks.length === 0 && noneMessage) {
      return [
        {
          children: noneMessage,
          disabled: true,
        },
      ];
    }
  }
  return actionLinks;
};

/**
 * Simple hook for visibility toggles.
 * @param initialValue - initial toggle value.
 */
export const useVisible = (
  initialValue: boolean
): [boolean, (evt: React.MouseEvent) => void] => {
  const [value, setValue] = useState(initialValue);
  const toggleValue = (evt: React.MouseEvent) => {
    evt.preventDefault();
    setValue(!value);
  };
  return [value, toggleValue];
};

/**
 * Track and untrack ids.
 */
export const useTrackById = <T>(): {
  tracked: T[];
  toggleTracked: (id: T) => void;
} => {
  const [tracked, setTracked] = useState<T[]>([]);

  const toggleTracked = (id: T) => {
    if (tracked.find((trackedId) => trackedId === id)) {
      setTracked(tracked.filter((trackedId) => trackedId !== id));
    } else {
      setTracked([...tracked, id]);
    }
  };

  return { tracked, toggleTracked };
};

/**
 * Handle checking when a value has cycled from false to true.
 * @param value - The value to check.
 * @param onCycled - The function to call when the value changes from false to true.
 */
const useCycled = (value: boolean, onCycled: () => void) => {
  const previousValue = useRef(value);
  useEffect(() => {
    if (value && !previousValue.current) {
      onCycled();
    }
    if (previousValue.current !== value) {
      previousValue.current = value;
    }
  }, [value, onCycled]);
};

/**
 * Handle displaying action progress for batched actions.
 * @param processingCount - The number of items currently being processed.
 * @param onComplete - The function to call when all the items have been processed.
 * @param hasErrors - Whether there are any item errors in state.
 * @param onError - The function to call when an error occurs.
 */
export const useProcessing = (
  processingCount: number,
  onComplete: () => void,
  hasErrors = false,
  onError: () => void
): void => {
  const processingStarted = useRef(false);
  if (processingStarted.current === false && processingCount > 0) {
    processingStarted.current = true;
  }

  // If all the items have finished processing and there are no errors, run the
  // onComplete function.
  useCycled(processingCount === 0, () => {
    if (!hasErrors) {
      onComplete();
    }
  });

  // If the items are processing and errors occur, run the onError function.
  useCycled(hasErrors, () => {
    if (processingStarted) {
      onError();
    }
  });
};

type SortValueGetter<I, K extends string | null> = (
  sortKey: K,
  item: I,
  ...args: unknown[]
) => unknown;

export type Sort<K extends string | null> = {
  key: K | null;
  direction: "ascending" | "descending" | "none";
};

type TableSort<I, K extends string | null> = {
  currentSort: Sort<K>;
  sortRows: (items: I[], ...args: unknown[]) => I[];
  updateSort: (newSort: K) => void;
};

/**
 * Handle sorting in tables.
 * @param sortValueGetter - The function that determines what value to use when comparing row objects.
 * @param initialSort - The initial sort key and direction on table render.
 * @param sortFunction - A function to be used to sort the items.
 * @returns The properties and helper functions to use in table sorting.
 */
export const useTableSort = <I, K extends string | null>(
  sortValueGetter: SortValueGetter<I, K>,
  initialSort: Sort<K>,
  sortFunction?: (
    itemA: I,
    itemB: I,
    key: Sort<K>["key"],
    args: unknown[],
    direction: Sort<K>["direction"],
    items: I[]
  ) => -1 | 0 | 1
): TableSort<I, K> => {
  const [currentSort, setCurrentSort] = useState(initialSort);

  // Update current sort depending on whether the same sort key was clicked.
  const updateSort = (newSortKey: K) => {
    const { key, direction } = currentSort;

    if (newSortKey === key) {
      if (direction === "ascending") {
        setCurrentSort({ key: null, direction: "none" });
      } else {
        setCurrentSort({ key, direction: "ascending" });
      }
    } else {
      setCurrentSort({ key: newSortKey, direction: "descending" });
    }
  };

  // Sort rows according to sortValueGetter. Additional arguments will need to be
  // passed to both the sortValueGetter and sortRows functions.
  const sortRows = (items: I[], ...args: unknown[]): I[] => {
    const { key, direction } = currentSort;

    const sortFunctionGenerator = (itemA: I, itemB: I) => {
      if (sortFunction) {
        return sortFunction(itemA, itemB, key, args, direction, items);
      }
      const sortA = sortValueGetter(key, itemA, ...args);
      const sortB = sortValueGetter(key, itemB, ...args);

      if (direction === "none" || (!sortA && !sortB)) {
        return 0;
      }
      if ((sortB && !sortA) || sortA < sortB) {
        return direction === "descending" ? -1 : 1;
      }
      if ((sortA && !sortB) || sortA > sortB) {
        return direction === "descending" ? 1 : -1;
      }
      return 0;
    };

    return [...items].sort(sortFunctionGenerator);
  };

  return { currentSort, sortRows, updateSort };
};
