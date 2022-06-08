import { mount } from "enzyme";
import { createMemoryHistory } from "history";
import { Router } from "react-router-dom";
import { CompatRouter } from "react-router-dom-v5-compat";

import SettingsBackLink from "./SettingsBackLink";

describe("SettingsBackLink", () => {
  it("does not render is no from is provided", () => {
    const history = createMemoryHistory();
    const wrapper = mount(
      <Router history={history}>
        <CompatRouter>
          <SettingsBackLink />
        </CompatRouter>
      </Router>
    );

    expect(wrapper.find(".settings-back-link").exists()).toBe(false);
  });

  it("links to previous state when provided", () => {
    const expectedReturnURL = "/kvm/lxd/cluster/20/hosts";
    const locationState = { from: expectedReturnURL };
    const history = createMemoryHistory();
    history.push(`/MAAS/${expectedReturnURL}`, locationState);

    const wrapper = mount(
      <Router history={history}>
        <CompatRouter>
          <SettingsBackLink />
        </CompatRouter>
      </Router>
    );

    expect(wrapper.find("Link").prop("to")).toBe(`${expectedReturnURL}`);
  });
});
