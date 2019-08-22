import { useEffect, useRef } from "react";
import { useContext } from "react";
import { __RouterContext as RouterContext } from "react-router";

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
 * @param {Object} formikProps - Entire formik props object.
 */
export const useFormikErrors = (errors, formikProps) => {
  const { setStatus, values } = formikProps;
  const previousErrors = usePrevious(errors);
  useEffect(() => {
    // Only run this effect if the errors have changed.
    if (!simpleObjectEquality(errors, previousErrors)) {
      const formikErrors = {};
      const invalidValues = {};
      Object.keys(errors).forEach(field => {
        formikErrors[field] = errors[field].join(" ");
        invalidValues[field] = values[field];
      });
      setStatus({ serverErrors: formikErrors, invalidValues });
    }
  }, [errors, previousErrors, setStatus, values]);
};
