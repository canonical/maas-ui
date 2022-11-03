import { screen, render } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Provider } from "react-redux";
import { MemoryRouter } from "react-router-dom";
import { CompatRouter } from "react-router-dom-v5-compat";
import configureStore from "redux-mock-store";

import UbuntuCoreImages, {
  Labels as UbuntuCoreImagesLabels,
} from "./UbuntuCoreImages";

import { actions as bootResourceActions } from "app/store/bootresource";
import type { RootState } from "app/store/root/types";
import {
  bootResource as bootResourceFactory,
  bootResourceUbuntuCoreImage as ubuntuCoreImageFactory,
  bootResourceState as bootResourceStateFactory,
  rootState as rootStateFactory,
} from "testing/factories";
import { renderWithBrowserRouter } from "testing/utils";

const mockStore = configureStore<RootState, {}>();

describe("UbuntuCoreImages", () => {
  it("does not render if there is no Ubuntu core image data", () => {
    const state = rootStateFactory({
      bootresource: bootResourceStateFactory({ ubuntuCoreImages: [] }),
    });

    renderWithBrowserRouter(<UbuntuCoreImages />, { state });
    expect(
      screen.queryByText(UbuntuCoreImagesLabels.CoreImages)
    ).not.toBeInTheDocument();
  });

  it("correctly sets initial values based on resources", () => {
    const ubuntuCoreImages = [
      ubuntuCoreImageFactory({
        name: "ubuntu-core/amd64/generic/20",
        title: "Ubuntu Core 20",
      }),
    ];
    const resources = [
      bootResourceFactory({
        name: "ubuntu-core/20",
        arch: "amd64",
        title: "Ubuntu Core 20",
      }), // only this resource is an "Ubuntu core image"
      bootResourceFactory({
        name: "ubuntu/focal",
        arch: "amd64",
        title: "20.04 LTS",
      }),
      bootResourceFactory({
        name: "centos/centos70",
        arch: "amd64",
        title: "CentOS 7",
      }),
    ];
    const state = rootStateFactory({
      bootresource: bootResourceStateFactory({
        resources,
        ubuntuCoreImages,
      }),
    });

    renderWithBrowserRouter(<UbuntuCoreImages />, { state });

    expect(
      screen.getByRole("checkbox", { name: "Ubuntu Core 20" })
    ).toBeChecked();
  });

  it("can dispatch an action to save Ubuntu core images", async () => {
    const ubuntuCoreImages = [
      ubuntuCoreImageFactory({
        name: "ubuntu-core/amd64/generic/20",
        title: "Ubuntu Core 20",
      }),
    ];
    const resources = [
      bootResourceFactory({
        name: "ubuntu-core/20",
        arch: "amd64",
        title: "Ubuntu Core 20",
      }), // only this resource is an "Ubuntu core image"
      bootResourceFactory({
        name: "ubuntu/focal",
        arch: "amd64",
        title: "20.04 LTS",
      }),
      bootResourceFactory({
        name: "centos/centos70",
        arch: "amd64",
        title: "CentOS 7",
      }),
    ];
    const state = rootStateFactory({
      bootresource: bootResourceStateFactory({
        resources,
        ubuntuCoreImages,
      }),
    });
    const store = mockStore(state);
    render(
      <Provider store={store}>
        <MemoryRouter>
          <CompatRouter>
            <UbuntuCoreImages />
          </CompatRouter>
        </MemoryRouter>
      </Provider>
    );

    await userEvent.click(
      screen.getByRole("button", { name: UbuntuCoreImagesLabels.SubmitLabel })
    );

    const expectedAction = bootResourceActions.saveUbuntuCore({
      images: ["ubuntu-core/amd64/generic/20"],
    });
    const actualActions = store.getActions();
    expect(
      actualActions.find((action) => action.type === expectedAction.type)
    ).toStrictEqual(expectedAction);
  });

  it(`does not show a button to stop importing Ubuntu core images if none are
    downloading`, () => {
    const state = rootStateFactory({
      bootresource: bootResourceStateFactory({
        resources: [
          bootResourceFactory({ downloading: true, name: "ubuntu/focal" }),
          bootResourceFactory({ downloading: false, name: "ubuntu-core/20" }),
        ],
        ubuntuCoreImages: [ubuntuCoreImageFactory()],
      }),
    });

    renderWithBrowserRouter(<UbuntuCoreImages />, { state });

    expect(
      screen.queryByRole("button", { name: UbuntuCoreImagesLabels.StopImport })
    ).not.toBeInTheDocument();
  });

  it(`can dispatch an action to stop importing Ubuntu core images if at least
    one is downloading`, async () => {
    const state = rootStateFactory({
      bootresource: bootResourceStateFactory({
        resources: [
          bootResourceFactory({ downloading: true, name: "ubuntu-core/20" }),
        ],
        ubuntuCoreImages: [ubuntuCoreImageFactory()],
      }),
    });
    const store = mockStore(state);
    render(
      <Provider store={store}>
        <MemoryRouter>
          <CompatRouter>
            <UbuntuCoreImages />
          </CompatRouter>
        </MemoryRouter>
      </Provider>
    );
    await userEvent.click(
      screen.getByRole("button", { name: UbuntuCoreImagesLabels.StopImport })
    );

    const expectedAction = bootResourceActions.stopImport();
    const actualActions = store.getActions();
    expect(
      actualActions.find((action) => action.type === expectedAction.type)
    ).toStrictEqual(expectedAction);
  });
});
