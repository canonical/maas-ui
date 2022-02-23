import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { Provider } from "react-redux";
import { MemoryRouter } from "react-router-dom";
import configureStore from "redux-mock-store";

import KVMConfigurationCard from "./KVMConfigurationCard";

import { actions as podActions } from "app/store/pod";
import { PodType } from "app/store/pod/constants";
import type { RootState } from "app/store/root/types";
import {
  podDetails as podFactory,
  podState as podStateFactory,
  resourcePool as resourcePoolFactory,
  resourcePoolState as resourcePoolStateFactory,
  rootState as rootStateFactory,
  zone as zoneFactory,
  zoneState as zoneStateFactory,
} from "testing/factories";

const mockStore = configureStore();
let state: RootState;

beforeEach(() => {
  state = rootStateFactory({
    pod: podStateFactory({
      items: [podFactory({ id: 1, name: "pod1" })],
      loaded: true,
    }),
    resourcepool: resourcePoolStateFactory({
      items: [resourcePoolFactory({ id: 2 })],
      loaded: true,
    }),
    zone: zoneStateFactory({
      items: [zoneFactory({ id: 3 })],
      loaded: true,
    }),
  });
});

it("can handle updating a lxd KVM", async () => {
  const pod = podFactory({
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
        <KVMConfigurationCard pod={pod} />
      </MemoryRouter>
    </Provider>
  );

  await waitFor(() => {
    fireEvent.change(screen.getByRole("combobox", { name: "Zone" }), {
      target: { value: "3" },
    });
    fireEvent.change(screen.getByRole("combobox", { name: "Resource pool" }), {
      target: { value: "2" },
    });
    fireEvent.change(screen.getByRole("slider", { name: "CPU overcommit" }), {
      target: { value: "5" },
    });
    fireEvent.change(
      screen.getByRole("slider", { name: "Memory overcommit" }),
      { target: { value: "7" } }
    );
  });
  await waitFor(() => {
    fireEvent.click(screen.getByRole("button", { name: "Save changes" }));
  });

  const expectedAction = podActions.update({
    cpu_over_commit_ratio: 5,
    id: pod.id,
    memory_over_commit_ratio: 7,
    pool: 2,
    power_address: pod.power_parameters.power_address,
    tags: "tag1,tag2",
    type: PodType.LXD,
    zone: 3,
  });
  expect(
    store.getActions().find((action) => action.type === expectedAction.type)
  ).toStrictEqual(expectedAction);
});

it("can handle updating a virsh KVM", async () => {
  const pod = podFactory({
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
        <KVMConfigurationCard pod={pod} />
      </MemoryRouter>
    </Provider>
  );

  await waitFor(() => {
    fireEvent.change(screen.getByRole("combobox", { name: "Zone" }), {
      target: { value: "3" },
    });
    fireEvent.change(screen.getByRole("combobox", { name: "Resource pool" }), {
      target: { value: "2" },
    });
    fireEvent.change(screen.getByLabelText("Password (optional)"), {
      target: { value: "password" },
    });
    fireEvent.change(screen.getByRole("slider", { name: "CPU overcommit" }), {
      target: { value: "5" },
    });
    fireEvent.change(
      screen.getByRole("slider", { name: "Memory overcommit" }),
      { target: { value: "7" } }
    );
  });
  await waitFor(() => {
    fireEvent.click(screen.getByRole("button", { name: "Save changes" }));
  });

  const expectedAction = podActions.update({
    cpu_over_commit_ratio: 5,
    id: pod.id,
    memory_over_commit_ratio: 7,
    pool: 2,
    power_address: pod.power_parameters.power_address,
    power_pass: "password",
    tags: "tag1,tag2",
    type: PodType.VIRSH,
    zone: 3,
  });
  expect(
    store.getActions().find((action) => action.type === expectedAction.type)
  ).toStrictEqual(expectedAction);
});

it("enables the submit button if form is unchanged after pod successfully updated", async () => {
  const pod = podFactory({
    cpu_over_commit_ratio: 1,
    id: 1,
    type: PodType.LXD,
  });
  const store = mockStore(state);
  const { rerender } = render(
    <Provider store={store}>
      <MemoryRouter
        initialEntries={[{ pathname: "/kvm/1/edit", key: "testKey" }]}
      >
        <KVMConfigurationCard pod={pod} />
      </MemoryRouter>
    </Provider>
  );

  // Submit should be disabled by default.
  expect(screen.getByRole("button", { name: "Save changes" })).toBeDisabled();

  // Change value to something other than the initial.
  await waitFor(() => {
    fireEvent.change(screen.getByRole("slider", { name: "CPU overcommit" }), {
      target: { value: (pod.cpu_over_commit_ratio + 1).toString() },
    });
  });

  // Submit should be enabled.
  expect(
    screen.getByRole("button", { name: "Save changes" })
  ).not.toBeDisabled();

  // Trigger success handler by changing pod saved value to true.
  const newStore = mockStore({ ...state, pod: { ...state.pod, saved: true } });
  rerender(
    <Provider store={newStore}>
      <MemoryRouter
        initialEntries={[{ pathname: "/kvm/1/edit", key: "testKey" }]}
      >
        <KVMConfigurationCard pod={pod} />
      </MemoryRouter>
    </Provider>
  );

  // Change back to initial value.
  await waitFor(() => {
    fireEvent.change(screen.getByRole("slider", { name: "CPU overcommit" }), {
      target: { value: pod.cpu_over_commit_ratio.toString() },
    });
  });

  // Submit should still be enabled.
  expect(
    screen.getByRole("button", { name: "Save changes" })
  ).not.toBeDisabled();
});
