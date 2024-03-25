import { Provider } from "react-redux";
import { MemoryRouter } from "react-router-dom";
import { CompatRouter } from "react-router-dom";
import configureStore from "redux-mock-store";

import ControllerName from "./ControllerName";

import urls from "@/app/base/urls";
import * as factory from "@/testing/factories";
import { userEvent, render, screen, waitFor } from "@/testing/utils";

const mockStore = configureStore();

const domain0 = factory.domain();
const domain1 = factory.domain({ id: 99, name: "domain1" });
const controller = factory.controllerDetails({
  domain: domain0,
  locked: false,
  permissions: ["edit"],
  system_id: "abc123",
});

it("can update a controller with the new domain", async () => {
  const state = factory.rootState({
    domain: factory.domainState({
      loaded: true,
      items: [domain0, domain1],
    }),
    general: factory.generalState({
      powerTypes: factory.powerTypesState({
        data: [factory.powerType()],
      }),
    }),
    controller: factory.controllerState({
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
            setIsEditing={vi.fn()}
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
