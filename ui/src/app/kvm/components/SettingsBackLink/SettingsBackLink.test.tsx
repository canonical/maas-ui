import { shallow } from "enzyme";
import { createMemoryHistory } from "history";
import { Router } from "react-router-dom";

import SettingsBackLink from "./SettingsBackLink";

describe("SettingsBackLink", () => {
  it("does not render is no from is provided", () => {
    let history = createMemoryHistory();
    const wrapper = shallow(
      <Router history={history}>
        <SettingsBackLink />
      </Router>
    );

    expect(wrapper.find("Link").exists()).toBe(false);
  });

  // XXX: Work out how to test this.
  xit("links to previous state when provided", () => {
    const expectedReturnURL = "/kvm/lxd/cluster/20/hosts";
    const locationState = `/MAAS/r${expectedReturnURL}`;
    const mockLocation = { state: { from: locationState } };
    const route = "/";
    const history = createMemoryHistory({
      initialEntries: [route, mockLocation.state.from],
    });
    const wrapper = shallow(
      <Router history={history}>
        <SettingsBackLink />
      </Router>
    );

    expect(wrapper.find("Link").prop("to")).toBe(`${expectedReturnURL}`);
  });
});
