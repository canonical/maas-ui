import { Spinner } from "@canonical/react-components";
import pluralize from "pluralize";
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router";
import { useLocation } from "react-router-dom";

import { pod as podActions } from "app/base/actions";
import { pod as podSelectors } from "app/base/selectors";
import { useWindowTitle } from "app/base/hooks";

import type { RootState } from "app/store/root/types";
import Section from "app/base/components/Section";
import SectionHeader from "app/base/components/SectionHeader";

const KVMDetails = (): JSX.Element => {
  const dispatch = useDispatch();
  const { id } = useParams();
  const location = useLocation();

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
      header={
        pod ? (
          <SectionHeader
            tabLinks={[
              {
                active: location.pathname.endsWith(`/kvm/${pod.id}`),
                label: pluralize(
                  "composed machine",
                  pod.composed_machines_count,
                  true
                ),
                path: `/kvm/${pod.id}`,
              },
              {
                active: location.pathname.endsWith(`/kvm/${pod.id}/edit`),
                label: "Configuration",
                path: `/kvm/${pod.id}/edit`,
              },
            ]}
            title={pod.name}
          />
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
