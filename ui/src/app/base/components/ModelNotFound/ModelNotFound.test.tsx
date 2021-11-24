import { mount } from "enzyme";
import { Provider } from "react-redux";
import { MemoryRouter } from "react-router-dom";
import configureStore from "redux-mock-store";

import ModelNotFound from "./ModelNotFound";

import { rootState as rootStateFactory } from "testing/factories";

const mockStore = configureStore();

describe("ModelNotFound", () => {
  it("renders the correct heading", () => {
    const state = rootStateFactory();
    const store = mockStore(state);
    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter>
          <ModelNotFound id={1} linkURL="www.url.com" modelName="model" />
        </MemoryRouter>
      </Provider>
    );

    expect(wrapper.find("[data-test='section-header-title']").text()).toBe(
      "Model not found"
    );
  });

  it("renders the default link correctly", () => {
    const state = rootStateFactory();
    const store = mockStore(state);
    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter>
          <ModelNotFound id={1} linkURL="www.url.com" modelName="model" />
        </MemoryRouter>
      </Provider>
    );

    expect(wrapper.find("Link").prop("to")).toBe("www.url.com");
    expect(wrapper.find("Link").text()).toBe("View all models");
  });

  it("can be given customised link text", () => {
    const state = rootStateFactory();
    const store = mockStore(state);
    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter>
          <ModelNotFound
            id={1}
            linkText="Click here to win $500"
            linkURL="www.url.com"
            modelName="model"
          />
        </MemoryRouter>
      </Provider>
    );

    expect(wrapper.find("Link").text()).toBe("Click here to win $500");
  });
});
