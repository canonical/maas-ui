import NotFound from "app/base/views/NotFound";
import subnetsRoutes from "app/subnets/routes";

const routes = [
  // Routes will get spread into this array.
  ...subnetsRoutes,
  { path: "*", element: <NotFound /> },
];

export default routes;
