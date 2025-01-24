import React from "react";

import { useZoneById } from "@/app/api/query/zones";
import SectionHeader from "@/app/base/components/SectionHeader";

type Props = {
  id: number;
};

const ZoneDetailsHeader: React.FC<Props> = ({ id }) => {
  const zone = useZoneById(id);

  let title = "";

  if (!zone.isPending) {
    title = zone.data
      ? `Availability zone: ${zone.data.name}`
      : "Availability zone not found";
  }

  if (!zone.isPending && zone.data) {
    title = `Availability zone: ${zone.data.name}`;
  } else if (zone.isFetched) {
    title = "Availability zone not found";
  }

  return <SectionHeader loading={!zone.isFetched} title={title} />;
};

export default ZoneDetailsHeader;
