import { MemoryRouter } from "react-router-dom";
import { mount } from "enzyme";
import React from "react";

import FormCardButtons from "./FormCardButtons";

describe("FormCardButtons ", () => {
  it("renders", () => {
    const wrapper = mount(
      <MemoryRouter initialEntries={[{ pathname: "/", key: "testKey" }]}>
        <FormCardButtons actionLabel="Save user" />
      </MemoryRouter>
    );
    expect(wrapper.find("FormCardButtons")).toMatchSnapshot();
  });
});
