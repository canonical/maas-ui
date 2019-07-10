import { shallow } from "enzyme";
import React from "react";
import sinon from "sinon";

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
        fetchRepositories={sinon.stub()}
      />
    );
    expect(wrapper).toMatchSnapshot();
  });

  it("connects to the WebSocket", () => {
    const fetchRepositories = sinon.stub();
    shallow(
      <Repositories fetchRepositories={fetchRepositories} repositories={[]} />
    );
    expect(fetchRepositories.callCount).toBe(1);
  });
});
