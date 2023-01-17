import { Provider } from "react-redux";
import { MemoryRouter } from "react-router-dom";
import { CompatRouter } from "react-router-dom-v5-compat";
import configureStore from "redux-mock-store";

import ModelNotFound from "./ModelNotFound";

import { rootState as rootStateFactory } from "testing/factories";
import { render, screen } from "testing/utils";

const mockStore = configureStore();

describe("ModelNotFound", () => {
  it("renders the correct heading", () => {
    const state = rootStateFactory();
    const store = mockStore(state);
    render(
      <Provider store={store}>
        <MemoryRouter>
          <CompatRouter>
            <ModelNotFound id={1} linkURL="www.url.com" modelName="model" />
          </CompatRouter>
        </MemoryRouter>
      </Provider>
    );

    expect(screen.getByRole("heading").textContent).toBe("Model not found");
  });

  it("renders the default link correctly", () => {
    const state = rootStateFactory();
    const store = mockStore(state);
    render(
      <Provider store={store}>
        <MemoryRouter>
          <CompatRouter>
            <ModelNotFound id={1} linkURL="/models" modelName="model" />
          </CompatRouter>
        </MemoryRouter>
      </Provider>
    );

    expect(
      screen.getByRole("link", { name: "View all models" })
    ).toHaveAttribute("href", "/models");
  });

  it("can be given customised link text", () => {
    const state = rootStateFactory();
    const store = mockStore(state);
    render(
      <Provider store={store}>
        <MemoryRouter>
          <CompatRouter>
            <ModelNotFound
              id={1}
              linkText="Click here to win $500"
              linkURL="/models"
              modelName="model"
            />
          </CompatRouter>
        </MemoryRouter>
      </Provider>
    );

    expect(
      screen.getByRole("link", { name: "Click here to win $500" })
    ).toBeInTheDocument();
  });
});
