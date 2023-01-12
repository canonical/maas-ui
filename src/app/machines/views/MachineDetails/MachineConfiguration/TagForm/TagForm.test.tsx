import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Provider } from "react-redux";
import { MemoryRouter } from "react-router-dom";
import { CompatRouter } from "react-router-dom-v5-compat";
import configureStore from "redux-mock-store";

import TagForm from "./TagForm";

import { Labels as EditableSectionLabels } from "app/base/components/EditableSection";
import urls from "app/base/urls";
import { Label as TagFormFieldsLabel } from "app/machines/components/MachineHeaderForms/MachineActionFormWrapper/TagForm/TagFormFields";
import { FilterMachines } from "app/store/machine/utils";
import type { RootState } from "app/store/root/types";
import {
  machineDetails as machineDetailsFactory,
  machineState as machineStateFactory,
  machineStatus as machineStatusFactory,
  machineStatuses as machineStatusesFactory,
  rootState as rootStateFactory,
  tag as tagFactory,
  tagState as tagStateFactory,
} from "testing/factories";

const mockStore = configureStore();

describe("TagForm", () => {
  let state: RootState;

  beforeEach(() => {
    state = rootStateFactory({
      machine: machineStateFactory({
        items: [
          machineDetailsFactory({
            permissions: ["edit"],
            system_id: "abc123",
            tags: [1, 2],
          }),
        ],
        statuses: machineStatusesFactory({
          abc123: machineStatusFactory(),
        }),
      }),
      tag: tagStateFactory({
        items: [
          tagFactory({ id: 1, name: "tag-1" }),
          tagFactory({ id: 2, name: "tag-2" }),
        ],
        loaded: true,
      }),
    });
  });

  it("is not editable if machine does not have edit permission", () => {
    state.machine.items[0].permissions = [];
    const store = mockStore(state);
    render(
      <Provider store={store}>
        <MemoryRouter>
          <CompatRouter>
            <TagForm systemId="abc123" />
          </CompatRouter>
        </MemoryRouter>
      </Provider>
    );

    expect(
      screen.queryByRole("button", { name: EditableSectionLabels.EditButton })
    ).not.toBeInTheDocument();
  });

  it("is editable if machine has edit permission", () => {
    state.machine.items[0].permissions = ["edit"];
    const store = mockStore(state);
    render(
      <Provider store={store}>
        <MemoryRouter>
          <CompatRouter>
            <TagForm systemId="abc123" />
          </CompatRouter>
        </MemoryRouter>
      </Provider>
    );

    expect(
      screen.getAllByRole("button", { name: EditableSectionLabels.EditButton })
        .length
    ).not.toBe(0);
  });

  it("renders list of tag links until edit button is pressed", async () => {
    const store = mockStore(state);
    render(
      <Provider store={store}>
        <MemoryRouter>
          <CompatRouter>
            <TagForm systemId="abc123" />
          </CompatRouter>
        </MemoryRouter>
      </Provider>
    );

    expect(screen.queryByLabelText("tag-form")).not.toBeInTheDocument();
    expect(screen.getByRole("link", { name: "tag-1" })).toHaveAttribute(
      "href",
      `${urls.machines.index}${FilterMachines.filtersToQueryString({
        tags: ["=tag-1"],
      })}`
    );
    expect(screen.getByRole("link", { name: "tag-2" })).toHaveAttribute(
      "href",
      `${urls.machines.index}${FilterMachines.filtersToQueryString({
        tags: ["=tag-2"],
      })}`
    );

    await userEvent.click(
      screen.getAllByRole("button", {
        name: EditableSectionLabels.EditButton,
      })[0]
    );

    expect(
      screen.getByRole("textbox", { name: TagFormFieldsLabel.TagInput })
    ).toBeInTheDocument();
    expect(screen.queryByRole("link")).not.toBeInTheDocument();
  });
});
