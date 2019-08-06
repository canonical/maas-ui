import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { useContext } from "react";
import { __RouterContext as RouterContext } from "react-router";

export const useFetchOnce = (fetchAction, loadedSelector) => {
  const dispatch = useDispatch();
  const loaded = useSelector(loadedSelector);
  useEffect(() => {
    if (!loaded) {
      dispatch(fetchAction());
    }
  }, [loaded, dispatch, fetchAction, loadedSelector]);
  return loaded;
};

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
