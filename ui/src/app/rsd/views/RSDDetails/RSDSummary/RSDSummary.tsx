import { Code, Spinner } from "@canonical/react-components";
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router";

import { useWindowTitle } from "app/base/hooks";
import PodAggregateResources from "app/kvm/components/PodAggregateResources";
import PodStorage from "app/kvm/components/PodStorage";
import { actions as podActions } from "app/store/pod";
import podSelectors from "app/store/pod/selectors";

import type { RouteParams } from "app/base/types";
import type { RootState } from "app/store/root/types";

const RSDSummary = (): JSX.Element => {
  const dispatch = useDispatch();
  const { id } = useParams<RouteParams>();
  const rsd = useSelector((state: RootState) =>
    podSelectors.getById(state, Number(id))
  );

  useWindowTitle(`RSD ${`${rsd?.name} ` || ""} details`);

  useEffect(() => {
    dispatch(podActions.fetch());
  }, [dispatch]);

  if (!!rsd) {
    return (
      <>
        <div className="u-flex">
          <p className="u-nudge-left">Power address:</p>
          <Code copyable className="u-flex--grow">
            {rsd.power_address}
          </Code>
        </div>
        <hr className="u-sv1" />
        <h4>Resources</h4>
        <PodAggregateResources id={rsd.id} />
        <PodStorage id={rsd.id} />
      </>
    );
  }
  return <Spinner text="Loading" />;
};

export default RSDSummary;
