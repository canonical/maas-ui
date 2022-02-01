import { useEffect, useRef } from "react";

import { Strip } from "@canonical/react-components";
import { nanoid } from "@reduxjs/toolkit";
import { useDispatch, useSelector } from "react-redux";

import DHCPTable from "app/base/components/DHCPTable";
import type { RootState } from "app/store/root/types";
import { actions as subnetActions } from "app/store/subnet";
import subnetSelectors from "app/store/subnet/selectors";
import type { Subnet, SubnetMeta } from "app/store/subnet/types";

type Props = {
  modelName: string;
  subnetIds: Subnet[SubnetMeta.PK][];
};

const DHCPSnippets = ({ modelName, subnetIds }: Props): JSX.Element => {
  const dispatch = useDispatch();
  const sectionID = useRef(nanoid());
  const subnets = useSelector((state: RootState) =>
    subnetSelectors.getByIds(state, subnetIds)
  );

  useEffect(() => {
    dispatch(subnetActions.fetch());
  }, [dispatch]);

  return (
    <Strip aria-labelledby={sectionID.current} element="section" shallow>
      <DHCPTable
        headerId={sectionID.current}
        subnets={subnets}
        modelName={modelName}
      />
    </Strip>
  );
};

export default DHCPSnippets;
