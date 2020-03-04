import React from "react";

import SideNav from "app/base/components/SideNav";

export const Nav = () => (
  <SideNav
    sectionList={[
      {
        path: "details",
        label: "Details"
      },
      {
        path: "api-keys",
        label: "API keys"
      },
      {
        path: "ssh-keys",
        label: "SSH keys"
      },
      {
        path: "ssl-keys",
        label: "SSL keys"
      }
    ]}
  />
);

export default Nav;
