import { render } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import NameColumn from "./NameColumn";

import urls from "app/base/urls";
import { PodType } from "app/store/pod/constants";
import {
  pod as podFactory,
  podPowerParameters as powerParametersFactory,
} from "testing/factories";

describe("NameColumn", () => {
  it("can display a link to Virsh pod's details page", () => {
    const pod = podFactory({ id: 1, name: "pod-1", type: PodType.VIRSH });
    const { getByText } = render(
      <NameColumn
        name={pod.name}
        secondary={pod.power_parameters?.project}
        url={urls.kvm.virsh.details.index({ id: 1 })}
      />
    );

    const link = getByText("pod-1");
    expect(link).toHaveAttribute(
      "href",
      urls.kvm.virsh.details.index({ id: 1 })
    );
  });

  it("can display a link to a LXD pod's details page", () => {
    const pod = podFactory({ id: 1, name: "pod-1", type: PodType.LXD });
    const { getByText } = render(
      <NameColumn
        name={pod.name}
        secondary={pod.power_parameters?.project}
        url={urls.kvm.lxd.single.index({ id: 1 })}
      />
    );

    const link = getByText("pod-1");
    expect(link).toHaveAttribute("href", urls.kvm.lxd.single.index({ id: 1 }));
  });

  it("can show a secondary row", () => {
    const pod = podFactory({
      id: 1,
      name: "pod-1",
      power_parameters: powerParametersFactory({
        project: "group-project",
      }),
      type: PodType.LXD,
    });
    const { getByTestId, queryByTestId } = render(
      <NameColumn
        name={pod.name}
        secondary={pod.power_parameters?.project}
        url={urls.kvm.virsh.details.index({ id: 1 })}
      />
    );

    expect(queryByTestId("power-address")).toBeNull();
    const secondary = getByTestId("secondary");
    expect(secondary).toHaveTextContent("group-project");
  });
});

// Note:
// renderWithBrowserRouter utility function may be used for testing components with Router.
// An example implementation can be:
// function renderWithBrowserRouter(
//   ui: ReactElement,
//   { route = "/", store }: { route?: string; store: any }
// ) {
//   window.history.pushState({}, "Test page", route);

//   return render(
//     <Provider store={store}>
//       <BrowserRouter>{ui}</BrowserRouter>
//     </Provider>
//   );
// }
