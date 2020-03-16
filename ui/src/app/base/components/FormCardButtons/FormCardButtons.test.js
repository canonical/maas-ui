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

  it("displays a border if bordered is true", () => {
    const wrapper = mount(
      <MemoryRouter initialEntries={[{ pathname: "/", key: "testKey" }]}>
        <FormCardButtons bordered submitLabel="Save" />
      </MemoryRouter>
    );
    expect(wrapper.find("hr").exists()).toBe(true);
    expect(wrapper.find(".form-card__buttons.is-bordered").exists()).toBe(true);
  });

  it("can fire custom onCancel function", () => {
    const onCancel = jest.fn();
    const wrapper = mount(
      <MemoryRouter initialEntries={[{ pathname: "/", key: "testKey" }]}>
        <FormCardButtons onCancel={onCancel} submitLabel="Save" />
      </MemoryRouter>
    );
    wrapper.find('[data-test="cancel-action"] button').simulate("click");
    expect(onCancel).toHaveBeenCalled();
  });
});
