import { Link, useLocation } from "react-router";

import type { SwitchResponse } from "@/app/apiclient";
import SectionHeader from "@/app/base/components/SectionHeader";

type Props = {
  switchItem: SwitchResponse;
};

const SwitchDetailsHeader = ({ switchItem }: Props) => {
  const { pathname } = useLocation();
  const urlBase = `/switches/${switchItem.id}`;
  return (
    <SectionHeader
      tabLinks={[
        {
          active: pathname.startsWith(`${urlBase}/summary`),
          component: Link,
          label: "Summary",
          to: `${urlBase}/summary`,
        },
        // Add the following tabs once the API is ready
        // {
        //   active: pathname.startsWith(`${urlBase}/logs`),
        //   component: Link,
        //   label: "Logs",
        //   to: `${urlBase}/logs`,
        // },
        // {
        //   active: pathname.startsWith(`${urlBase}/ztp-scripts`),
        //   component: Link,
        //   label: "ZTP Scripts",
        //   to: `${urlBase}/ztp-scripts`,
        // },
      ]}
      title={switchItem.name}
    />
  );
};

export default SwitchDetailsHeader;
