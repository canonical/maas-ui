import { useEffect } from "react";

import { useDispatch } from "react-redux";
import type { AnyAction } from "redux";

/**
 * Runs a set of actions on mount.
 * @param {Array<() => AnyAction>} actions - The actions to run.
 */
export const useFetchActions = (actions: (() => AnyAction)[]) => {
  const dispatch = useDispatch();

  useEffect(() => {
    actions.forEach((action) => {
      dispatch(action());
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch]);
};
