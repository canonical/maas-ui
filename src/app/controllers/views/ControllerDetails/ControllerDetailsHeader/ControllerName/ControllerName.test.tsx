import userEvent from "@testing-library/user-event";
import { Provider } from "react-redux";
import { MemoryRouter } from "react-router-dom";
import { CompatRouter } from "react-router-dom-v5-compat";
import configureStore from "redux-mock-store";

import ControllerName from "./ControllerName";

import urls from "app/base/urls";
import {
  domain as domainFactory,
  domainState as domainStateFactory,
  controllerDetails as controllerDetailsFactory,
  controllerState as controllerStateFactory,
  generalState as generalStateFactory,
  powerType as powerTypeFactory,
  powerTypesState as powerTypesStateFactory,
  rootState as rootStateFactory,
} from "testing/factories";
import { render, screen, waitFor } from "testing/utils";

const mockStore = configureStore();

const domain0 = domainFactory();
const domain1 = domainFactory({ id: 99, name: "domain1" });
const controller = controllerDetailsFactory({
  domain: domain0,
  locked: false,
  permissions: ["edit"],
  system_id: "abc123",
});

it("can update a controller with the new domain", async () => {
  const state = rootStateFactory({
    domain: domainStateFactory({
      loaded: true,
      items: [domain0, domain1],
    }),
    general: generalStateFactory({
      powerTypes: powerTypesStateFactory({
        data: [powerTypeFactory()],
      }),
    }),
    controller: controllerStateFactory({
      loaded: true,
      items: [controller],
    }),
  });
  const store = mockStore(state);
  render(
    <Provider store={store}>
      <MemoryRouter
        initialEntries={[
          {
            pathname: urls.controllers.controller.index({
              id: controller.system_id,
            }),
            key: "testKey",
          },
        ]}
      >
        <CompatRouter>
          <ControllerName
            id={controller.system_id}
            isEditing={true}
            setIsEditing={jest.fn()}
          />
        </CompatRouter>
      </MemoryRouter>
    </Provider>
  );

  await userEvent.selectOptions(
    screen.getByRole("combobox", { name: "Domain" }),
    domain1.name
  );

  await userEvent.click(screen.getByRole("button", { name: /Save/ }));

  await waitFor(() =>
    expect(
      store.getActions().find((action) => action.type === "controller/update")
    ).toStrictEqual({
      type: "controller/update",
      payload: {
        params: {
          domain: domain1,
          system_id: controller.system_id,
        },
      },
      meta: {
        model: "controller",
        method: "update",
      },
    })
  );
});
