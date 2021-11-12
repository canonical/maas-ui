import { useEffect } from "react";

import { Spinner, Strip } from "@canonical/react-components";
import { useDispatch, useSelector } from "react-redux";

import AuthenticationCard from "./AuthenticationCard";
import DangerZoneCard from "./DangerZoneCard";

import { useWindowTitle } from "app/base/hooks";
import KVMConfigurationCard from "app/kvm/components/KVMConfigurationCard";
import LXDHostToolbar from "app/kvm/components/LXDHostToolbar";
import type { KVMSetHeaderContent } from "app/kvm/types";
import podSelectors from "app/store/pod/selectors";
import type { Pod } from "app/store/pod/types";
import { isPodDetails } from "app/store/pod/utils";
import { actions as resourcePoolActions } from "app/store/resourcepool";
import resourcePoolSelectors from "app/store/resourcepool/selectors";
import type { RootState } from "app/store/root/types";
import { actions as tagActions } from "app/store/tag";
import tagSelectors from "app/store/tag/selectors";
import { actions as zoneActions } from "app/store/zone";
import zoneSelectors from "app/store/zone/selectors";

type Props = {
  id: Pod["id"];
  setHeaderContent: KVMSetHeaderContent;
};

const LXDSingleSettings = ({
  id,
  setHeaderContent,
}: Props): JSX.Element | null => {
  const dispatch = useDispatch();
  const pod = useSelector((state: RootState) =>
    podSelectors.getById(state, id)
  );
  const resourcePoolsLoaded = useSelector(resourcePoolSelectors.loaded);
  const tagsLoaded = useSelector(tagSelectors.loaded);
  const zonesLoaded = useSelector(zoneSelectors.loaded);
  const loaded = resourcePoolsLoaded && tagsLoaded && zonesLoaded;
  useWindowTitle(`LXD ${`${pod?.name} ` || ""} settings`);

  useEffect(() => {
    dispatch(resourcePoolActions.fetch());
    dispatch(tagActions.fetch());
    dispatch(zoneActions.fetch());
  }, [dispatch]);

  if (!isPodDetails(pod) || !loaded) {
    return <Spinner text="Loading..." />;
  }
  return (
    <Strip className="u-no-padding--top" shallow>
      <LXDHostToolbar hostId={id} showBasic />
      <KVMConfigurationCard pod={pod} />
      <AuthenticationCard hostId={id} objectName={pod.name} />
      <DangerZoneCard
        hostId={id}
        message={
          <>
            <p>
              <strong>Remove this KVM host</strong>
            </p>
            <p>
              Once a KVM host is removed, you can still access this project from
              the LXD server.
            </p>
          </>
        }
        setHeaderContent={setHeaderContent}
      />
    </Strip>
  );
};

export default LXDSingleSettings;
