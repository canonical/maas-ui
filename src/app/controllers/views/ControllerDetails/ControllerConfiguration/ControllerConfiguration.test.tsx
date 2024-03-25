import { Provider } from "react-redux";
import { MemoryRouter } from "react-router-dom";
import { CompatRouter } from "react-router-dom";
import configureStore from "redux-mock-store";

import ControllerConfiguration from "./ControllerConfiguration";
import { Label as ConfigurationLabel } from "./ControllerConfigurationForm";
import { Label as PowerConfigurationLabel } from "./ControllerPowerConfiguration";

import { Labels as EditableSectionLabels } from "@/app/base/components/EditableSection";
import { Label as NodeConfigurationFieldsLabel } from "@/app/base/components/NodeConfigurationFields/NodeConfigurationFields";
import { Label as TagFieldLabel } from "@/app/base/components/TagField/TagField";
import { Label as ZoneSelectLabel } from "@/app/base/components/ZoneSelect/ZoneSelect";
import { controllerActions } from "@/app/store/controller";
import { PodType } from "@/app/store/pod/constants";
import type { RootState } from "@/app/store/root/types";
import * as factory from "@/testing/factories";
import { userEvent, render, screen, waitFor } from "@/testing/utils";

const mockStore = configureStore();
let state: RootState;
const controller = factory.controllerDetails({ system_id: "abc123" });

beforeEach(() => {
  state = factory.rootState({
    controller: factory.controllerState({
      items: [controller],
      loaded: true,
      loading: false,
    }),
    general: factory.generalState({
      generatedCertificate: factory.generatedCertificateState({
        data: null,
      }),
      powerTypes: factory.powerTypesState({
        data: [
          factory.powerType({
            name: PodType.LXD,
            fields: [
              factory.powerField({ name: "power_address" }),
              factory.powerField({ name: "password" }),
            ],
          }),
        ],
        loaded: true,
      }),
    }),
    tag: factory.tagState({
      loaded: true,
      items: [
        factory.tag({ id: 1, name: "tag1" }),
        factory.tag({ id: 2, name: "tag2" }),
      ],
    }),
    zone: factory.zoneState({
      genericActions: factory.zoneGenericActions({ fetch: "success" }),
      items: [factory.zone({ name: "twilight" })],
    }),
  });
});

it("displays controller configuration sections", async () => {
  const store = mockStore(state);
  render(
    <Provider store={store}>
      <MemoryRouter>
        <CompatRouter>
          <ControllerConfiguration systemId={controller.system_id} />
        </CompatRouter>
      </MemoryRouter>
    </Provider>
  );

  expect(
    screen.getByRole("heading", { name: /Controller configuration/i })
  ).toBeInTheDocument();
  expect(
    screen.getByRole("heading", { name: /Power configuration/i })
  ).toBeInTheDocument();
});

it("displays a loading indicator if the controller has not loaded", () => {
  state.controller.items = [];
  const store = mockStore(state);
  render(
    <Provider store={store}>
      <MemoryRouter>
        <CompatRouter>
          <ControllerConfiguration systemId={controller.system_id} />
        </CompatRouter>
      </MemoryRouter>
    </Provider>
  );

  expect(
    screen.getByRole("alert", { name: /loading controller configuration/ })
  ).toBeInTheDocument();
});

it("displays non-editable controller details by default", () => {
  const store = mockStore(state);
  render(
    <Provider store={store}>
      <MemoryRouter>
        <CompatRouter>
          <ControllerConfiguration systemId={controller.system_id} />
        </CompatRouter>
      </MemoryRouter>
    </Provider>
  );

  expect(
    screen.getByTestId("non-editable-controller-details")
  ).toBeInTheDocument();
  expect(
    screen.getByTestId("non-editable-controller-power-details")
  ).toBeInTheDocument();
  expect(
    screen.queryByRole("form", { name: ConfigurationLabel.Title })
  ).not.toBeInTheDocument();
  expect(
    screen.queryByRole("form", { name: PowerConfigurationLabel.Title })
  ).not.toBeInTheDocument();
});

it("can switch to controller configuration forms", async () => {
  const store = mockStore(state);
  render(
    <Provider store={store}>
      <MemoryRouter>
        <CompatRouter>
          <ControllerConfiguration systemId={controller.system_id} />
        </CompatRouter>
      </MemoryRouter>
    </Provider>
  );

  await userEvent.click(
    screen.getAllByRole("button", {
      name: EditableSectionLabels.EditButton,
    })[0]
  );

  expect(
    screen.queryByTestId("non-editable-controller-details")
  ).not.toBeInTheDocument();
  expect(
    screen.getByRole("form", { name: ConfigurationLabel.Title })
  ).toBeInTheDocument();

  await userEvent.click(
    screen.getAllByRole("button", {
      name: EditableSectionLabels.EditButton,
    })[1]
  );
  expect(
    screen.queryByTestId("non-editable-controller-power-details")
  ).not.toBeInTheDocument();
  expect(
    screen.getByRole("form", { name: PowerConfigurationLabel.Title })
  ).toBeInTheDocument();
});

it("correctly dispatches an action to update a controller", async () => {
  const store = mockStore(state);
  render(
    <Provider store={store}>
      <MemoryRouter>
        <CompatRouter>
          <ControllerConfiguration systemId="abc123" />
        </CompatRouter>
      </MemoryRouter>
    </Provider>
  );
  await userEvent.click(
    screen.getAllByRole("button", {
      name: EditableSectionLabels.EditButton,
    })[0]
  );
  const note = screen.getByRole("textbox", {
    name: NodeConfigurationFieldsLabel.Note,
  });
  await userEvent.clear(note);
  await userEvent.type(note, "controller's note text");
  await userEvent.selectOptions(
    screen.getByRole("combobox", { name: ZoneSelectLabel.Zone }),
    "twilight"
  );
  await userEvent.click(
    screen.getByRole("textbox", { name: TagFieldLabel.Input })
  );
  await userEvent.click(screen.getByRole("option", { name: "tag1" }));
  await userEvent.click(screen.getByRole("option", { name: "tag2" }));
  await userEvent.click(screen.getByRole("button", { name: /save/i }));

  const expectedAction = controllerActions.update({
    description: "controller's note text",
    tags: [1, 2],
    system_id: controller.system_id,
    zone: { name: "twilight" },
  });
  const actualActions = store.getActions();

  await waitFor(() =>
    expect(
      actualActions.find((action) => action.type === expectedAction.type)
    ).toStrictEqual(expectedAction)
  );
});

it("displays an alert on edit when controller manages more than 1 node", async () => {
  const store = mockStore(state);
  state.controller.items = [{ ...controller, power_bmc_node_count: 3 }];
  render(
    <Provider store={store}>
      <MemoryRouter>
        <CompatRouter>
          <ControllerConfiguration systemId="abc123" />
        </CompatRouter>
      </MemoryRouter>
    </Provider>
  );
  await userEvent.click(
    screen.getAllByRole("button", {
      name: EditableSectionLabels.EditButton,
    })[2]
  );
  await expect(
    screen.getByText(/This power controller manages 2 other nodes/)
  ).toBeInTheDocument();
  await expect(
    screen.getByText(
      /Changing the IP address or outlet delay will affect all these nodes./
    )
  ).toBeInTheDocument();
});
