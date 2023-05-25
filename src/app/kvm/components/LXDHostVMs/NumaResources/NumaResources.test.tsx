import NumaResources, { TRUNCATION_POINT } from "./NumaResources";

import * as hooks from "app/base/hooks/analytics";
import { ConfigNames } from "app/store/config/types";
import {
  config as configFactory,
  configState as configStateFactory,
  pod as podFactory,
  podNuma as podNumaFactory,
  podResources as podResourcesFactory,
  podState as podStateFactory,
  rootState as rootStateFactory,
} from "testing/factories";
import { renderWithBrowserRouter, screen, userEvent } from "testing/utils";

describe("NumaResources", () => {
  it("can expand truncated NUMA nodes if above truncation point", async () => {
    const pod = podFactory({
      id: 1,
      resources: podResourcesFactory({
        numa: Array.from(Array(TRUNCATION_POINT + 1)).map(() =>
          podNumaFactory()
        ),
      }),
    });
    const state = rootStateFactory({ pod: podStateFactory({ items: [pod] }) });

    renderWithBrowserRouter(<NumaResources id={pod.id} />, {
      state,
      route: "/kvm/1",
    });

    expect(screen.getByTestId("show-more-numas")).toBeInTheDocument();
    expect(screen.getAllByLabelText("numa resources card")).toHaveLength(
      TRUNCATION_POINT
    );

    await userEvent.click(screen.getByTestId("show-more-numas"));

    expect(screen.getByTestId("show-more-numas")).toHaveTextContent(
      "Show less NUMA nodes"
    );
    expect(screen.getAllByLabelText("numa resources card")).toHaveLength(
      TRUNCATION_POINT + 1
    );
  });

  it("shows wide cards if the pod has less than or equal to 2 NUMA nodes", () => {
    const pod = podFactory({
      id: 1,
      resources: podResourcesFactory({
        numa: [podNumaFactory()],
      }),
    });
    const state = rootStateFactory({ pod: podStateFactory({ items: [pod] }) });
    renderWithBrowserRouter(<NumaResources id={pod.id} />, {
      state,
      route: "/kvm/1",
    });

    expect(screen.getByTestId("numa-resources")).toHaveClass("is-wide");
  });

  it("can send an analytics event when expanding NUMA nodes if analytics enabled", async () => {
    const pod = podFactory({
      id: 1,
      resources: podResourcesFactory({
        numa: Array.from(Array(TRUNCATION_POINT + 1)).map(() =>
          podNumaFactory()
        ),
      }),
    });
    const state = rootStateFactory({
      config: configStateFactory({
        items: [
          configFactory({
            name: ConfigNames.ENABLE_ANALYTICS,
            value: false,
          }),
        ],
      }),
      pod: podStateFactory({ items: [pod] }),
    });
    const useSendMock = jest.spyOn(hooks, "useSendAnalytics");
    renderWithBrowserRouter(<NumaResources id={pod.id} />, {
      state,
      route: "/kvm/1",
    });

    await userEvent.click(screen.getByTestId("show-more-numas"));
    expect(useSendMock).toHaveBeenCalled();
    useSendMock.mockRestore();
  });
});
