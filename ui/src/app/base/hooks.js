import { __RouterContext as RouterContext } from "react-router";
import { notificationTypes } from "@canonical/react-components";
import { useContext } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useRef } from "react";
import { useFormikContext } from "formik";

import { sendAnalyticsEvent } from "analytics";
import { config as configSelectors } from "app/settings/selectors";
import { general as generalSelectors } from "app/base/selectors";
import { machine as machineActions } from "app/base/actions";
import { machine as machineSelectors } from "app/base/selectors";
import { messages } from "app/base/actions";
import { simpleObjectEquality } from "app/settings/utils";

// Router hooks inspired by: https://github.com/ReactTraining/react-router/issues/6430#issuecomment-510266079
// These should be replaced with official hooks if/when they become available.

export const useRouter = () => useContext(RouterContext);

export const useParams = () => useRouter().match.params;

export const useLocation = () => {
  const { location, history } = useRouter();
  function navigate(to, { replace = false } = {}) {
    if (replace) {
      history.replace(to);
    } else {
      history.push(to);
    }
  }
  return {
    location,
    navigate
  };
};

/**
 * Returns previous value of a variable.
 * @param {*} value - Current value.
 * @returns {*} Previous value.
 */
export const usePrevious = value => {
  const ref = useRef();
  useEffect(() => {
    ref.current = value;
  });
  return ref.current;
};

/**
 * Combines formik validation errors and errors returned from server
 * for use in formik forms.
 * @param {Object} errors - The errors object in redux state.
 */
export const useFormikErrors = errors => {
  const { setFieldError, setFieldTouched, values } = useFormikContext();
  const previousErrors = usePrevious(errors);
  useEffect(() => {
    // Only run this effect if the errors have changed.
    if (
      errors &&
      typeof errors === "object" &&
      !simpleObjectEquality(errors, previousErrors)
    ) {
      Object.keys(errors).forEach(field => {
        setFieldError(field, errors[field].join(" "));
        setFieldTouched(field, true, false);
      });
    }
  }, [errors, previousErrors, setFieldError, setFieldTouched, values]);
};

/**
 * Returns whether a formik form should be disabled, given the current state
 * of the form.
 * @param {Object} allowAllEmpty - Whether all fields are allowed to be empty.
 * @returns {Boolean} Form is disabled.
 */
export const useFormikFormDisabled = allowAllEmpty => {
  const { initialValues, errors, values } = useFormikContext();
  let hasErrors = false;
  if (errors) {
    hasErrors = Object.keys(errors).length > 0;
  }
  if (allowAllEmpty) {
    // If all fields are allowed to be empty then remove the from the values.
    Object.keys(values).forEach(key => {
      if (!values[key]) {
        delete values[key];
      }
    });
  }
  let matchesInitial = false;
  // Now that fields have been removed then make sure there are some fields left
  // to compare.
  if (Object.keys(values).length) {
    matchesInitial = simpleObjectEquality(initialValues, values);
  }
  return matchesInitial || hasErrors;
};

/**
 * Add a message in response to a state change e.g. when something is created.
 * @param {Boolean} addCondition - Whether the message should be added.
 * @param {Function} cleanup - A cleanup action to fire.
 * @param {String} message - The message to be displayed.
 * @param {Function} onMessageAdded - A function to call once the message has
                                      been displayed.
 * @param {String} messageType - The notification type.
 */
export const useAddMessage = (
  addCondition,
  cleanup,
  message,
  onMessageAdded,
  messageType = notificationTypes.INFORMATION
) => {
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
 * @param {String} title - The title to set.
 */
export const useWindowTitle = title => {
  const maasName = useSelector(configSelectors.maasName);
  const maasNamePart = maasName ? `${maasName} ` : "";
  const titlePart = title ? `${title} | ` : "";
  useEffect(() => {
    document.title = `${titlePart}${maasNamePart}MAAS`;
  }, [maasNamePart, titlePart]);
};

/**
 * Send an analytics event.
 * @param {String} sendCondition - Whether the analytics event should be sent.
 * @param {String} eventCategory - The analytics category.
 * @param {String} eventAction - The analytics action.
 * @param {String} eventLabel - The analytics label.
 */
export const useSendAnalytics = (
  sendCondition,
  eventCategory,
  eventAction,
  eventLabel
) => {
  useEffect(() => {
    if (sendCondition && eventCategory && eventAction && eventLabel) {
      sendAnalyticsEvent(eventCategory, eventAction, eventLabel);
    }
  }, [sendCondition, eventCategory, eventAction, eventLabel]);
};

//
const actionMethodOverrides = new Map([
  ["exit-rescue-mode", "exitRescueMode"],
  ["mark-broken", "markBroken"],
  ["mark-fixed", "markFixed"],
  ["override-failed-testing", "overrideFailedTesting"],
  ["rescue-mode", "rescueMode"]
]);

/**
 * Generate menu items for the available actins on a machine.
 * @param {String} systemId - The system id for a machine.
 * @param {Array} actions - The actions to generate menu items for.
 * @param {String} noneMessage - The message to display if there are no items.
 * @param {Function} onClick - A function to call when the item is clicked.
 */
export const useMachineActions = (systemId, actions, noneMessage, onClick) => {
  const dispatch = useDispatch();
  const generalMachineActions = useSelector(
    generalSelectors.machineActions.get
  );
  const machine = useSelector(state =>
    machineSelectors.getBySystemId(state, systemId)
  );
  let actionLinks = [];
  actions.forEach(action => {
    if (machine.actions.includes(action)) {
      let actionLabel = action;
      generalMachineActions.forEach(machineAction => {
        if (machineAction.name === action) {
          actionLabel = machineAction.title;
        }
      });

      actionLinks.push({
        children: actionLabel,
        onClick: () => {
          const actionMethod = actionMethodOverrides.get(action) || action;
          dispatch(machineActions[actionMethod](systemId));
          onClick && onClick();
        }
      });
    }
  });
  if (actionLinks.length === 0 && noneMessage) {
    return [
      {
        children: noneMessage,
        disabled: true
      }
    ];
  }
  return actionLinks;
};
