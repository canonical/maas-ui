import { notificationTypes } from "@canonical/react-components";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useMemo, useRef, useState } from "react";
import { useFormikContext } from "formik";
import * as Yup from "yup";

import { sendAnalyticsEvent } from "analytics";
import { config as configSelectors } from "app/settings/selectors";
import { general as generalSelectors } from "app/base/selectors";
import { machine as machineActions } from "app/base/actions";
import { machine as machineSelectors } from "app/base/selectors";
import { messages } from "app/base/actions";
import { kebabToCamelCase } from "app/utils";
import { simpleObjectEquality } from "app/settings/utils";

/**
 * Returns previous value of a variable.
 * @param {*} value - Current value.
 * @returns {*} Previous value.
 */
export const usePrevious = (value) => {
  const ref = useRef(value);
  useEffect(() => {
    ref.current = value;
  }, [value]);
  return ref.current;
};

/**
 * Combines formik validation errors and errors returned from server
 * for use in formik forms.
 * @param {Object} errors - The errors object in redux state.
 */
export const useFormikErrors = (errors) => {
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
        let errorString;
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
 * @param {Object} allowAllEmpty - Whether all fields are allowed to be empty.
 * @param {Object} allowUnchanged - Whether the form is enabled even when unchanged.
 * @returns {Boolean} Form is disabled.
 */
export const useFormikFormDisabled = ({
  allowAllEmpty = false,
  allowUnchanged = false,
}) => {
  const { initialValues, errors, values } = useFormikContext();
  let hasErrors = false;
  if (errors) {
    hasErrors = Object.keys(errors).length > 0;
  }
  if (allowAllEmpty) {
    // If all fields are allowed to be empty then remove the from the values.
    Object.keys(values).forEach((key) => {
      if (!values[key]) {
        delete values[key];
      }
    });
  }
  if (allowUnchanged) {
    return hasErrors;
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
export const useWindowTitle = (title) => {
  const maasName = useSelector(configSelectors.maasName);
  const maasNamePart = maasName ? `${maasName} ` : "";
  const titlePart = title ? `${title} | ` : "";
  useEffect(() => {
    document.title = `${titlePart}${maasNamePart}MAAS`;
  }, [maasNamePart, titlePart]);
};

/**
 * Send an analytics event.
 * @param {boolean} sendCondition - Whether the analytics event should be sent.
 * @param {string} eventCategory - The analytics category.
 * @param {string} eventAction - The analytics action.
 * @param {string} eventLabel - The analytics label.
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
  const machine = useSelector((state) =>
    machineSelectors.getBySystemId(state, systemId)
  );
  let actionLinks = [];
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
  return actionLinks;
};

/**
 * Simple hook for visibility toggles.
 * @param {Bool} initialValue - initial toggle value.
 */
export const useVisible = (initialValue) => {
  const [value, setValue] = useState(initialValue);
  const toggleValue = (evt) => {
    evt.preventDefault();
    setValue(!value);
  };
  return [value, toggleValue];
};

/**
 * Returns a Yup validation schema with dynamically generated power parameters
 * schema, depending on the selected power type in the form.
 * @param {Object} powerType - Power type selected in the form.
 * @param {Function} generateSchemaFunc - Schema generation function.
 * @returns {Object} Yup validation schema with power parameters.
 */
export const usePowerParametersSchema = (
  powerType,
  generateSchemaFunc,
  chassis = false
) => {
  const [Schema, setSchema] = useState(generateSchemaFunc({}));

  useEffect(() => {
    if (powerType && powerType.fields) {
      const parametersSchema = powerType.fields.reduce((schema, field) => {
        if (!chassis || (chassis && field.scope !== "node")) {
          if (field.required) {
            schema[field.name] = Yup.string().required(
              `${field.label} required`
            );
          } else {
            schema[field.name] = Yup.string();
          }
        }
        return schema;
      }, {});
      const newSchema = generateSchemaFunc(parametersSchema);
      setSchema(newSchema);
    }
  }, [chassis, generateSchemaFunc, powerType]);

  return Schema;
};

/**
 * Returns a memoized object of all possible power parameters from all given
 * power types. Used to initialise Formik forms so React doesn't complain about
 * unexpected values. Parameters should be trimmed to only relevant parameters
 * on form submit.
 * @param {Array} powerTypes - Power types to collate parameters from.
 * @returns {Object} All possible power parameters from given power types.
 */
export const useAllPowerParameters = (powerTypes) =>
  useMemo(
    () =>
      powerTypes.reduce((parameters, powerType) => {
        powerType.fields.forEach((field) => {
          if (!(field.name in parameters)) {
            parameters[field.name] = field.default;
          }
        });
        return parameters;
      }, {}),
    [powerTypes]
  );

export const THROTTLE_DELAY = 100;

/**
 * Handle window resize events.
 * @param {Function} callback - The function to call when the window resizes.
 */
export const useOnWindowResize = (callback) => {
  const storedCallback = useRef(callback);
  const timeout = useRef();
  const lastCall = useRef(Date.now());
  useEffect(() => {
    // Clean up the previous listener:
    window.removeEventListener("resize", storedCallback.current);
    // Store the callback for the cleanup method.
    storedCallback.current = () => {
      if (Date.now() - lastCall.current >= THROTTLE_DELAY) {
        // This is after the throttle delay so call the callback and reset
        // the timer.
        clearTimeout(timeout.current);
        callback();
        lastCall.current = Date.now();
        timeout.current = null;
      } else if (!timeout.current) {
        // Set a timeout to call the callback if the window is not resized
        // after the delay time.
        timeout.current = setTimeout(() => {
          callback();
        }, THROTTLE_DELAY);
      }
    };
    window.addEventListener("resize", storedCallback.current);
    return () => {
      clearTimeout(timeout.current);
      window.removeEventListener("resize", storedCallback.current);
    };
  }, [callback]);
};

/**
 * Handle checking when a value has cycled from false to true.
 * @param {boolean} value - The value to check.
 * @param {() => void} onCycled - The function to call when the value changes from false to true.
 */
const useCycled = (value, onCycled) => {
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
 * @param {number} processingCount - The number of items currently being processed.
 * @param {() => void} onComplete - The function to call when all the items have been processed.
 * @param {boolean} hasErrors - Whether there are any item errors in state.
 * @param {() => void} onError - The function to call when an error occurs.
 */
export const useProcessing = (
  processingCount,
  onComplete,
  hasErrors = false,
  onError
) => {
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
