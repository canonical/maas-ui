import AuthenticationCard from "./AuthenticationCard";

import { PodType } from "app/store/pod/constants";
import type { PodDetails, PodPowerParameters } from "app/store/pod/types";
import type { RootState } from "app/store/root/types";
import {
  certificateMetadata as certificateFactory,
  pod as podFactory,
  podDetails as podDetailsFactory,
  podPowerParameters as powerParametersFactory,
  podState as podStateFactory,
  rootState as rootStateFactory,
} from "testing/factories";
import { renderWithBrowserRouter, screen, userEvent } from "testing/utils";

describe("AuthenticationCard", () => {
  let state: RootState;
  let pod: PodDetails;

  beforeEach(() => {
    pod = podDetailsFactory({
      certificate: certificateFactory(),
      id: 1,
      power_parameters: powerParametersFactory({
        certificate: "abc123",
        key: "abc123",
      }),
      type: PodType.LXD,
    });
    state = rootStateFactory({
      pod: podStateFactory({ items: [pod] }),
    });
  });

  it("shows a spinner if pod is not PodDetails type", () => {
    state.pod.items[0] = podFactory({ id: 1 });
    renderWithBrowserRouter(<AuthenticationCard hostId={pod.id} />, {
      route: "/machines",
      state,
    });
    expect(screen.getByText(/loading/i)).toBeInTheDocument();
  });

  it("can open the update certificate form", async () => {
    renderWithBrowserRouter(<AuthenticationCard hostId={pod.id} />, {
      route: "/machines",
      state,
    });
    expect(screen.queryByText("Update Certificate")).not.toBeInTheDocument();
    expect(
      screen.queryByRole("form", { name: "Update certificate" })
    ).not.toBeInTheDocument();
    await userEvent.click(screen.getByTestId("show-update-certificate"));

    expect(
      screen.getByRole("form", { name: "Update certificate" })
    ).toBeInTheDocument();
  });

  it("opens the update certificate form automatically if pod has no certificate", () => {
    pod.certificate = undefined;
    const power_parameters = pod.power_parameters as PodPowerParameters;
    power_parameters.certificate = undefined;
    power_parameters.key = undefined;
    renderWithBrowserRouter(<AuthenticationCard hostId={pod.id} />, {
      route: "/machines",
      state,
    });

    expect(
      screen.getByRole("form", { name: "Update certificate" })
    ).toBeInTheDocument();
  });
});
