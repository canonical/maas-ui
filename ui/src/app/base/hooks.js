import { useEffect, useRef } from "react";
import { useContext } from "react";
import { __RouterContext as RouterContext } from "react-router";

const DELAY_TIMER = 400; // minimium duration (ms) saving spinner displays
const SUCCESS_TIMER = 2000; // duration (ms) success tick is displayed

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

export const usePrevious = value => {
  const ref = useRef();
  useEffect(() => {
    ref.current = value;
  });
  return ref.current;
};

export const useSettingsSave = (saving, setLoading, setSuccess) => {
  const delayTimer = useRef();
  const saveTimer = useRef();
  const prevSaving = usePrevious(saving);

  // Temporarily set success to true if saving changes from true to false
  // TODO: Add a check for errors too: https://github.com/canonical-web-and-design/maas-ui/issues/39
  useEffect(() => {
    if (!prevSaving && saving) {
      setLoading(true);
      // resetForm(values);
      delayTimer.current = setTimeout(() => {
        setLoading(false);
        setSuccess(true);
        saveTimer.current = setTimeout(() => {
          setSuccess(false);
        }, SUCCESS_TIMER);
      }, DELAY_TIMER);
    }
  }, [prevSaving, saving, setLoading, setSuccess]);

  useEffect(() => {
    return () => {
      clearTimeout(delayTimer.current);
      clearTimeout(saveTimer.current);
    };
  }, []);
};
