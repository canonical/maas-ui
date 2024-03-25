import { Provider } from "react-redux";
import { MemoryRouter } from "react-router-dom";
import { CompatRouter } from "react-router-dom";
import configureStore from "redux-mock-store";

import KVMConfigurationCard from "./KVMConfigurationCard";

import { podActions } from "@/app/store/pod";
import { PodType } from "@/app/store/pod/constants";
import type { RootState } from "@/app/store/root/types";
import * as factory from "@/testing/factories";
import { userEvent, fireEvent, render, screen, waitFor } from "@/testing/utils";

const mockStore = configureStore();
let state: RootState;

beforeEach(() => {
  state = factory.rootState({
    pod: factory.podState({
      items: [factory.podDetails({ id: 1, name: "pod1" })],
      loaded: true,
    }),
    resourcepool: factory.resourcePoolState({
      items: [factory.resourcePool({ id: 2 })],
      loaded: true,
    }),
    zone: factory.zoneState({
      genericActions: factory.zoneGenericActions({ fetch: "success" }),
      items: [factory.zone({ id: 3 })],
    }),
  });
});

it("can handle updating a lxd KVM", async () => {
  const pod = factory.podDetails({
    id: 1,
    tags: ["tag1", "tag2"],
    type: PodType.LXD,
  });
  const store = mockStore(state);
  render(
    <Provider store={store}>
      <MemoryRouter
        initialEntries={[{ pathname: "/kvm/1/edit", key: "testKey" }]}
      >
        <CompatRouter>
          <KVMConfigurationCard pod={pod} />
        </CompatRouter>
      </MemoryRouter>
    </Provider>
  );

  await userEvent.selectOptions(
    screen.getByRole("combobox", { name: "Zone" }),
    "3"
  );
  await userEvent.selectOptions(
    screen.getByRole("combobox", { name: "Resource pool" }),
    "2"
  );
  fireEvent.change(screen.getByRole("slider", { name: "CPU overcommit" }), {
    target: { value: "5" },
  });
  fireEvent.change(screen.getByRole("slider", { name: "Memory overcommit" }), {
    target: { value: "7" },
  });
  await waitFor(() => {
    expect(screen.getByRole("button", { name: "Save changes" })).toBeEnabled();
  });
  await userEvent.click(screen.getByRole("button", { name: "Save changes" }));

  const expectedAction = podActions.update({
    cpu_over_commit_ratio: 5,
    id: pod.id,
    memory_over_commit_ratio: 7,
    pool: 2,
    power_address: pod.power_parameters?.power_address,
    tags: "tag1,tag2",
    type: PodType.LXD,
    zone: 3,
  });
  await waitFor(() => {
    expect(
      store.getActions().find((action) => action.type === expectedAction.type)
    ).toStrictEqual(expectedAction);
  });
});

it("can handle updating a virsh KVM", async () => {
  const pod = factory.podDetails({
    id: 1,
    tags: ["tag1", "tag2"],
    type: PodType.VIRSH,
  });
  const store = mockStore(state);
  render(
    <Provider store={store}>
      <MemoryRouter
        initialEntries={[{ pathname: "/kvm/1/edit", key: "testKey" }]}
      >
        <CompatRouter>
          <KVMConfigurationCard pod={pod} />
        </CompatRouter>
      </MemoryRouter>
    </Provider>
  );

  await userEvent.selectOptions(
    screen.getByRole("combobox", { name: "Zone" }),
    "3"
  );
  await userEvent.selectOptions(
    screen.getByRole("combobox", { name: "Resource pool" }),
    "2"
  );
  await userEvent.type(
    screen.getByLabelText("Password (optional)"),
    "password"
  );
  fireEvent.change(screen.getByRole("slider", { name: "CPU overcommit" }), {
    target: { value: "5" },
  });
  fireEvent.change(screen.getByRole("slider", { name: "Memory overcommit" }), {
    target: { value: "7" },
  });
  await waitFor(() => {
    expect(screen.getByRole("button", { name: "Save changes" })).toBeEnabled();
  });
  await userEvent.click(screen.getByRole("button", { name: "Save changes" }));

  const expectedAction = podActions.update({
    cpu_over_commit_ratio: 5,
    id: pod.id,
    memory_over_commit_ratio: 7,
    pool: 2,
    power_address: pod.power_parameters?.power_address,
    power_pass: "password",
    tags: "tag1,tag2",
    type: PodType.VIRSH,
    zone: 3,
  });
  await waitFor(() => {
    expect(
      store.getActions().find((action) => action.type === expectedAction.type)
    ).toStrictEqual(expectedAction);
  });
});

it("enables the submit button if form values are different to pod values", async () => {
  const pod = factory.podDetails({
    cpu_over_commit_ratio: 1,
    id: 1,
  });
  const store = mockStore(state);
  const { rerender } = render(
    <Provider store={store}>
      <MemoryRouter
        initialEntries={[{ pathname: "/kvm/1/edit", key: "testKey" }]}
      >
        <CompatRouter>
          <KVMConfigurationCard pod={pod} />
        </CompatRouter>
      </MemoryRouter>
    </Provider>
  );

  // Submit should be disabled by default.
  expect(screen.getByRole("button", { name: "Save changes" })).toBeDisabled();

  // Change value to something other than the initial.
  fireEvent.change(screen.getByRole("slider", { name: "CPU overcommit" }), {
    target: { value: (pod.cpu_over_commit_ratio + 1).toString() },
  });

  // Submit should be enabled.
  await waitFor(() => {
    expect(
      screen.getByRole("button", { name: "Save changes" })
    ).not.toBeDisabled();
  });

  // Update the pod with a new value.
  const updatedPod = {
    ...pod,
    cpu_over_commit_ratio: pod.cpu_over_commit_ratio + 1,
  };
  rerender(
    <Provider store={store}>
      <MemoryRouter
        initialEntries={[{ pathname: "/kvm/1/edit", key: "testKey" }]}
      >
        <CompatRouter>
          <KVMConfigurationCard pod={updatedPod} />
        </CompatRouter>
      </MemoryRouter>
    </Provider>
  );

  // Submit should be disabled again.
  expect(screen.getByRole("button", { name: "Save changes" })).toBeDisabled();
});
