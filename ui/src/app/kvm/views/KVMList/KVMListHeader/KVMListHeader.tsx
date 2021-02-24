import { useEffect } from "react";

import { Button } from "@canonical/react-components";
import pluralize from "pluralize";
import { useDispatch, useSelector } from "react-redux";
import { Link, useLocation } from "react-router-dom";

import SectionHeader from "app/base/components/SectionHeader";
import { actions as podActions } from "app/store/pod";
import podSelectors from "app/store/pod/selectors";

const KVMListHeader = (): JSX.Element => {
  const dispatch = useDispatch();
  const location = useLocation();
  const kvms = useSelector(podSelectors.kvms);
  const podsLoaded = useSelector(podSelectors.loaded);

  useEffect(() => {
    dispatch(podActions.fetch());
  }, [dispatch]);

  return (
    <SectionHeader
      buttons={
        location.pathname === "/kvm" && [
          <Button
            appearance="positive"
            data-test="add-kvm"
            element={Link}
            key="add-kvm"
            to="/kvm/add"
          >
            Add KVM
          </Button>,
        ]
      }
      loading={!podsLoaded}
      subtitle={`${pluralize("VM host", kvms.length, true)} available`}
      title="KVM"
    />
  );
};

export default KVMListHeader;
