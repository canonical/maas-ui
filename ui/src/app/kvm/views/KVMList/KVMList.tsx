import { useEffect } from "react";

import { Strip } from "@canonical/react-components";
import { useDispatch, useSelector } from "react-redux";
import { Route, Switch } from "react-router-dom";

import AddKVM from "./AddKVM";
import KVMListHeader from "./KVMListHeader";
import LxdTable from "./LxdTable";
import VirshTable from "./VirshTable";

import Section from "app/base/components/Section";
import { useWindowTitle } from "app/base/hooks";
import { actions as podActions } from "app/store/pod";
import podSelectors from "app/store/pod/selectors";
import { actions as poolActions } from "app/store/resourcepool";
import { actions as zoneActions } from "app/store/zone";

const KVMList = (): JSX.Element => {
  const dispatch = useDispatch();
  const lxdKvms = useSelector(podSelectors.lxd);
  const virshKvms = useSelector(podSelectors.virsh);
  useWindowTitle("KVM");

  useEffect(() => {
    dispatch(podActions.fetch());
    dispatch(poolActions.fetch());
    dispatch(zoneActions.fetch());
  }, [dispatch]);

  return (
    <Section header={<KVMListHeader />} headerClassName="u-no-padding--bottom">
      <Switch>
        <Route exact path="/kvm">
          {lxdKvms.length > 0 && (
            <Strip
              className="u-no-padding--bottom"
              data-test="lxd-table"
              shallow
            >
              <h3 className="p-heading--four">LXD</h3>
              <LxdTable />
            </Strip>
          )}
          {virshKvms.length > 0 && (
            <Strip data-test="virsh-table" shallow>
              <h3 className="p-heading--four">Virsh</h3>
              <VirshTable />
            </Strip>
          )}
        </Route>
        <Route exact path="/kvm/add">
          <AddKVM />
        </Route>
      </Switch>
    </Section>
  );
};

export default KVMList;
