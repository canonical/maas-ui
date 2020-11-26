import { Route, Switch } from "react-router-dom";

import AddRSDForm from "./AddRSDForm";
import RSDListHeader from "./RSDListHeader";
import RSDListTable from "./RSDListTable";

import Section from "app/base/components/Section";
import { useWindowTitle } from "app/base/hooks";

const RSDList = (): JSX.Element => {
  useWindowTitle("RSD");

  return (
    <Section header={<RSDListHeader />} headerClassName="u-no-padding--bottom">
      <Switch>
        <Route exact path="/rsd">
          <RSDListTable />
        </Route>
        <Route exact path="/rsd/add">
          <AddRSDForm />
        </Route>
      </Switch>
    </Section>
  );
};

export default RSDList;
