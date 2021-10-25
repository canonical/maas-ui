import { mount } from "enzyme";
import { createMemoryHistory } from "history";
import { Router } from "react-router-dom";

import SettingsBackLink from "./SettingsBackLink";

describe("SettingsBackLink", () => {
  it("does not render is no from is provided", () => {
    const history = createMemoryHistory();
    const wrapper = mount(
      <Router history={history}>
        <SettingsBackLink />
      </Router>
    );

    expect(wrapper.find(".settings-back-link").exists()).toBe(false);
  });

  it("links to previous state when provided", () => {
    const expectedReturnURL = "/kvm/lxd/cluster/20/hosts";
    const locationState = { from: expectedReturnURL };
    const history = createMemoryHistory();
    history.push(`/MAAS/r${expectedReturnURL}`, locationState);

    const wrapper = mount(
      <Router history={history}>
        <SettingsBackLink />
      </Router>
    );

    expect(wrapper.find("Link").prop("to")).toBe(`${expectedReturnURL}`);
  });
});
