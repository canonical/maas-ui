import { MemoryRouter } from "react-router-dom";
import { mount } from "enzyme";
import React from "react";

import FormCardButtons from "./FormCardButtons";

describe("FormCardButtons ", () => {
  it("renders", () => {
    const wrapper = mount(
      <MemoryRouter initialEntries={[{ pathname: "/", key: "testKey" }]}>
        <FormCardButtons submitLabel="Save user" />
      </MemoryRouter>
    );
    expect(wrapper.find("FormCardButtons")).toMatchSnapshot();
  });

  it("can perform a secondary submit action if function and label provided", () => {
    const secondarySubmit = jest.fn();
    const wrapper = mount(
      <MemoryRouter initialEntries={[{ pathname: "/", key: "testKey" }]}>
        <FormCardButtons
          submitLabel="Save user"
          secondarySubmit={secondarySubmit}
          secondarySubmitLabel="Save and add another"
        />
      </MemoryRouter>
    );
    expect(wrapper.find("[data-test='secondary-submit'] button").text()).toBe(
      "Save and add another"
    );
    wrapper.find("[data-test='secondary-submit'] button").simulate("click");
    expect(secondarySubmit).toHaveBeenCalled();
  });
});
