import { Route, Switch } from "react-router-dom";

import Section from "app/base/components/Section";
import NotFound from "app/base/views/NotFound";
import zonesURLs from "app/zones/urls";

const Zones = (): JSX.Element => {
  return (
    <Switch>
      <Route exact path={[zonesURLs.index]}>
        <Section header="Availability zones"></Section>
      </Route>
      <Route path="*">
        <NotFound />
      </Route>
    </Switch>
  );
};

export default Zones;
