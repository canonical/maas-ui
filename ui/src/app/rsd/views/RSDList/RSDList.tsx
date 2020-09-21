import React from "react";
import { Redirect, Route, Switch } from "react-router-dom";

import { useWindowTitle } from "app/base/hooks";
import RSDListHeader from "./RSDListHeader";
import RSDListTable from "./RSDListTable";
import Section from "app/base/components/Section";

const RSDList = (): JSX.Element => {
  useWindowTitle("RSD");

  return (
    <Section header={<RSDListHeader />} headerClassName="u-no-padding--bottom">
      <Switch>
        <Route exact path="/rsd">
          <RSDListTable />
        </Route>
        <Route exact path="/rsd/add">
          <Redirect to="/machines/rsd/add" />
        </Route>
      </Switch>
    </Section>
  );
};

export default RSDList;
