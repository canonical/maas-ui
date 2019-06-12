import { shallow } from "enzyme";
import React from "react";
import sinon from "sinon";

import { App } from "./App";

it("works with enzyme", () => {
  const wrapper = shallow(
    <App
      fetchMachines={sinon.stub()}
      machines={[
        {
          id: 1,
          ready: true,
          title: "machine 1"
        }
      ]}
    />
  );
  expect(wrapper).toMatchSnapshot();
});
