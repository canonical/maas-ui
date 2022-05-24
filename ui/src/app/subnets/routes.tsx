import Subnets from "./views/Subnets";

import subnetsURLs from "app/subnets/urls";
import FabricDetails from "app/subnets/views/FabricDetails";
import SpaceDetails from "app/subnets/views/SpaceDetails";
import SubnetDetails from "app/subnets/views/SubnetDetails";
import SubnetsList from "app/subnets/views/SubnetsList/SubnetsList";
import VLANDetails from "app/subnets/views/VLANDetails";

const routes = [
  {
    path: subnetsURLs.index,
    element: (
      // Where required the components the child will get wrapped in the section
      // component. In this case the Subnets component is not doing much but
      // some sections like Machines the wrapping component will be doing a lot.
      <Subnets>
        <SubnetsList />
      </Subnets>
    ),
  },
  {
    path: subnetsURLs.fabric.index(null, true),
    element: (
      <Subnets>
        <FabricDetails />
      </Subnets>
    ),
  },
  {
    path: subnetsURLs.space.index(null, true),
    element: (
      <Subnets>
        <SpaceDetails />
      </Subnets>
    ),
  },
  {
    path: subnetsURLs.subnet.index(null, true),
    element: (
      <Subnets>
        <SubnetDetails />
      </Subnets>
    ),
  },
  {
    path: subnetsURLs.vlan.index(null, true),
    element: (
      <Subnets>
        <VLANDetails />
      </Subnets>
    ),
  },
];

export default routes;
