import { shallow } from "enzyme";
import React from "react";

import { Repositories } from "./Repositories";

describe("Repositories", () => {
  it("renders", () => {
    const wrapper = shallow(
      <Repositories
        repositories={[
          {
            arches: [],
            components: [],
            created: "",
            default: true,
            disable_sources: true,
            disabled_components: [],
            disabled_pockets: [],
            distributions: [],
            enabled: true,
            id: 0,
            key: "",
            name: "",
            updated: "",
            url: ""
          }
        ]}
        fetchRepositories={jest.fn()}
      />
    );
    expect(wrapper).toMatchSnapshot();
  });

  it("connects to the WebSocket", () => {
    const fetchRepositories = jest.fn();
    shallow(
      <Repositories fetchRepositories={fetchRepositories} repositories={[]} />
    );
    expect(fetchRepositories.mock.calls.length).toBe(1);
  });
});
