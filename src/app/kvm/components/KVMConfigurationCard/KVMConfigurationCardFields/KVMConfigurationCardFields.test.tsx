import { render } from "@testing-library/react";
import { Provider } from "react-redux";
import { MemoryRouter } from "react-router-dom";
import { CompatRouter } from "react-router-dom-v5-compat";
import configureStore from "redux-mock-store";

import KVMConfigurationCard from "../KVMConfigurationCard";

import { PodType } from "app/store/pod/constants";
import {
  podDetails as podFactory,
  podPowerParameters as powerParametersFactory,
  podState as podStateFactory,
  rootState as rootStateFactory,
} from "testing/factories";
import { renderWithBrowserRouter, screen } from "testing/utils";

const mockStore = configureStore();

describe("KVMConfigurationCardFields", () => {
  let state: RootState;

  beforeEach(() => {
    state = rootStateFactory({
      pod: podStateFactory({ items: [], loaded: true }),
    });
  });

  it("correctly sets initial values for virsh pods", () => {
    const pod = podFactory({
      id: 1,
      power_parameters: powerParametersFactory({
        power_address: "abc123",
        power_pass: "maxpower",
      }),
      type: PodType.VIRSH,
    });
    state.pod.items = [pod];
    const store = mockStore(state);
    const { container } = renderWithBrowserRouter(
      <KVMConfigurationCard pod={pod} />,
      { route: "/kvm/1/edit", store }
    );
    expect(screen.getByDisplayValue(/virsh/i)).toBeInTheDocument();
    expect(screen.getByDisplayValue(pod.zone)).toBeInTheDocument();
    expect(screen.getByDisplayValue(pod.pool)).toBeInTheDocument();
    expect(
      screen.getByRole("slider", { name: /cpu over commit ratio/i })
    ).toHaveValue(pod.cpu_over_commit_ratio);
    expect(
      screen.getByRole("slider", { name: /memory over commit ratio/i })
    ).toHaveValue(pod.memory_over_commit_ratio);
  });

  it("correctly sets initial values for lxd pods", () => {
    const pod = podFactory({
      id: 1,
      power_parameters: powerParametersFactory({
        power_address: "abc123",
      }),
      type: PodType.LXD,
    });
    state.pod.items = [pod];
    const store = mockStore(state);
    renderWithBrowserRouter(<KVMConfigurationCard pod={pod} />, {
      route: "/kvm/1/edit",
      store,
    });
    expect(screen.getByDisplayValue(/lxd/i)).toBeInTheDocument();
    expect(screen.getByDisplayValue(pod.zone)).toBeInTheDocument();
    expect(screen.getByDisplayValue(pod.pool)).toBeInTheDocument();
    expect(
      screen.getByRole("slider", { name: /cpu over commit ratio/i })
    ).toHaveValue(pod.cpu_over_commit_ratio);
    expect(
      screen.getByRole("slider", { name: /memory over commit ratio/i })
    ).toHaveValue(pod.memory_over_commit_ratio);
  });

  it("can disable the zone field", () => {
    const pod = podFactory({
      id: 1,
      power_parameters: powerParametersFactory({
        power_address: "abc123",
      }),
      type: PodType.LXD,
    });
    state.pod.items = [pod];
    const store = mockStore(state);
    renderWithBrowserRouter(<KVMConfigurationCard pod={pod} zoneDisabled />, {
      route: "/kvm/1/edit",
      store,
    });
    expect(screen.getByDisplayValue(pod.zone)).toBeDisabled();
  });
});
