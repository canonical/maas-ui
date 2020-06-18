import { Spinner } from "@canonical/react-components";
import pluralize from "pluralize";
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router";

import { pod as podActions } from "app/base/actions";
import { pod as podSelectors } from "app/base/selectors";
import { useRouter, useWindowTitle } from "app/base/hooks";

import { RootState } from "app/base/types";
import Section from "app/base/components/Section";
import Tabs from "app/base/components/Tabs";

const KVMDetails = (): JSX.Element => {
  const dispatch = useDispatch();
  const { id } = useParams();
  const { location } = useRouter();

  const pod = useSelector((state: RootState) =>
    podSelectors.getById(state, Number(id))
  );

  useWindowTitle(`KVM ${pod?.name || "details"}`);

  useEffect(() => {
    dispatch(podActions.fetch());
  }, [dispatch]);

  return (
    <Section
      headerClassName={pod && "u-no-padding--bottom"}
      title={
        pod ? (
          <>
            <div>
              <h4 className="u-sv1" data-test="pod-name">
                {pod.name}
              </h4>
            </div>
            <hr className="u-no-margin--bottom" />
            <Tabs
              data-test="kvm-details-tabs"
              links={[
                {
                  active: location.pathname.endsWith(`/kvm/${pod.id}`),
                  label: `${pod.composed_machines_count} ${pluralize(
                    "composed machine",
                    pod.composed_machines_count
                  )}`,
                  path: `/kvm/${pod.id}`,
                },
                {
                  active: location.pathname.endsWith(`/kvm/${pod.id}/edit`),
                  label: "Configuration",
                  path: `/kvm/${pod.id}/edit`,
                },
              ]}
              listClassName="u-no-margin--bottom"
              noBorder
            />
          </>
        ) : (
          <>
            <span className="p-heading--four"></span>
            <Spinner
              className="u-no-padding u-no-margin"
              inline
              text="Loading..."
            />
          </>
        )
      }
    />
  );
};

export default KVMDetails;
