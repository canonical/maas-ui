import { useEffect } from "react";

import { Button, Col, Row, Spinner } from "@canonical/react-components";
import { useDispatch, useSelector } from "react-redux";

import AuthenticationCard from "./AuthenticationCard";
import KVMConfiguration from "./KVMConfiguration";

import FormCard from "app/base/components/FormCard";
import { useWindowTitle } from "app/base/hooks";
import { KVMHeaderViews } from "app/kvm/constants";
import type { KVMSetHeaderContent } from "app/kvm/types";
import { actions as podActions } from "app/store/pod";
import { PodType } from "app/store/pod/constants";
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

const KVMSettings = ({ id, setHeaderContent }: Props): JSX.Element => {
  const dispatch = useDispatch();
  const pod = useSelector((state: RootState) =>
    podSelectors.getById(state, id)
  );
  const resourcePoolsLoaded = useSelector(resourcePoolSelectors.loaded);
  const tagsLoaded = useSelector(tagSelectors.loaded);
  const zonesLoaded = useSelector(zoneSelectors.loaded);

  useWindowTitle(`KVM ${`${pod?.name} ` || ""} settings`);

  useEffect(() => {
    dispatch(podActions.fetch());
    dispatch(resourcePoolActions.fetch());
    dispatch(tagActions.fetch());
    dispatch(zoneActions.fetch());
  }, [dispatch]);

  const loaded = resourcePoolsLoaded && tagsLoaded && zonesLoaded;

  if (loaded && isPodDetails(pod)) {
    return (
      <>
        <KVMConfiguration pod={pod} />
        <AuthenticationCard pod={pod} />
        {pod.type === PodType.LXD && (
          <FormCard sidebar={false} title="Danger zone">
            <Row>
              <Col size={5}>
                <p>
                  <strong>Remove this KVM</strong>
                </p>
                <p>
                  Once a KVM is removed, you can still access this project from
                  the LXD server.
                </p>
              </Col>
              <Col className="u-align--right u-flex--column-align-end" size={5}>
                <Button
                  appearance="neutral"
                  data-test="remove-kvm"
                  onClick={() =>
                    setHeaderContent({ view: KVMHeaderViews.DELETE_KVM })
                  }
                >
                  Remove KVM
                </Button>
              </Col>
            </Row>
          </FormCard>
        )}
      </>
    );
  }
  return <Spinner text="Loading" />;
};

export default KVMSettings;
