import { useEffect } from "react";

import { useDispatch } from "react-redux";

import { actions as podActions } from "app/store/pod";
import type { Pod } from "app/store/pod/types";

/**
 * Handle setting a pod as active while a component is mounted.
 * @param id - The id of the pod to handle active state.
 */
export const useActivePod = (id: Pod["id"]): void => {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(podActions.get(id));
    // Set pod as active to ensure all pod data is sent from the server.
    dispatch(podActions.setActive(id));

    // Unset active pod on cleanup.
    return () => {
      dispatch(podActions.setActive(null));
    };
  }, [dispatch, id]);
};
