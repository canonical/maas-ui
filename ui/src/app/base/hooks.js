import { __RouterContext as RouterContext } from "react-router";
import { notificationTypes } from "@canonical/react-components";
import { useContext } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useRef } from "react";
import { useFormikContext } from "formik";

import { config as configSelectors } from "app/settings/selectors";
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
  const { setFieldError, values } = useFormikContext();
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
      });
    }
  }, [errors, previousErrors, setFieldError, values]);
};

/**
 * Returns whether a formik form should be disabled, given the current state
 * of the form.
 * @param {Object} formikProps - Props required for formik forms.
 * @param {Boolean} success - Form is in success state.
 * @returns {Boolean} Form is disabled.
 */
export const useFormikFormDisabled = () => {
  const { initialValues, errors, values } = useFormikContext();
  let hasErrors = false;

  if (errors) {
    hasErrors = Object.keys(errors).length > 0;
  }

  return simpleObjectEquality(initialValues, values) || hasErrors;
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
