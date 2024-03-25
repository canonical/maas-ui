import { Provider } from "react-redux";
import { MemoryRouter } from "react-router-dom";
import { CompatRouter } from "react-router-dom";
import configureStore from "redux-mock-store";

import UbuntuCoreImages, {
  Labels as UbuntuCoreImagesLabels,
} from "./UbuntuCoreImages";

import { bootResourceActions } from "@/app/store/bootresource";
import type { RootState } from "@/app/store/root/types";
import * as factory from "@/testing/factories";
import {
  userEvent,
  screen,
  render,
  renderWithBrowserRouter,
} from "@/testing/utils";

const mockStore = configureStore<RootState, {}>();

describe("UbuntuCoreImages", () => {
  it("does not render if there is no Ubuntu core image data", () => {
    const state = factory.rootState({
      bootresource: factory.bootResourceState({ ubuntuCoreImages: [] }),
    });

    renderWithBrowserRouter(<UbuntuCoreImages />, { state });
    expect(
      screen.queryByText(UbuntuCoreImagesLabels.CoreImages)
    ).not.toBeInTheDocument();
  });

  it("correctly sets initial values based on resources", () => {
    const ubuntuCoreImages = [
      factory.bootResourceUbuntuCoreImage({
        name: "ubuntu-core/amd64/generic/20",
        title: "Ubuntu Core 20",
      }),
    ];
    const resources = [
      factory.bootResource({
        name: "ubuntu-core/20",
        arch: "amd64",
        title: "Ubuntu Core 20",
      }), // only this resource is an "Ubuntu core image"
      factory.bootResource({
        name: "ubuntu/focal",
        arch: "amd64",
        title: "20.04 LTS",
      }),
      factory.bootResource({
        name: "centos/centos70",
        arch: "amd64",
        title: "CentOS 7",
      }),
    ];
    const state = factory.rootState({
      bootresource: factory.bootResourceState({
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
      factory.bootResourceUbuntuCoreImage({
        name: "ubuntu-core/amd64/generic/20",
        title: "Ubuntu Core 20",
      }),
    ];
    const resources = [
      factory.bootResource({
        name: "ubuntu-core/20",
        arch: "amd64",
        title: "Ubuntu Core 20",
      }), // only this resource is an "Ubuntu core image"
      factory.bootResource({
        name: "ubuntu/focal",
        arch: "amd64",
        title: "20.04 LTS",
      }),
      factory.bootResource({
        name: "centos/centos70",
        arch: "amd64",
        title: "CentOS 7",
      }),
    ];
    const state = factory.rootState({
      bootresource: factory.bootResourceState({
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
    const state = factory.rootState({
      bootresource: factory.bootResourceState({
        resources: [
          factory.bootResource({ downloading: true, name: "ubuntu/focal" }),
          factory.bootResource({ downloading: false, name: "ubuntu-core/20" }),
        ],
        ubuntuCoreImages: [factory.bootResourceUbuntuCoreImage()],
      }),
    });

    renderWithBrowserRouter(<UbuntuCoreImages />, { state });

    expect(
      screen.queryByRole("button", { name: UbuntuCoreImagesLabels.StopImport })
    ).not.toBeInTheDocument();
  });

  it("enables 'Stop import' button if images are saving", async () => {
    const state = factory.rootState({
      bootresource: factory.bootResourceState({
        ubuntuCoreImages: [factory.bootResourceUbuntuCoreImage()],
        statuses: factory.bootResourceStatuses({ savingUbuntuCore: true }),
      }),
    });
    renderWithBrowserRouter(<UbuntuCoreImages />, { state });
    const stopImportButton = screen.getByRole("button", {
      name: UbuntuCoreImagesLabels.StopImport,
    });
    expect(stopImportButton).toBeEnabled();
  });

  it(`can dispatch an action to stop importing Ubuntu core images if at least
    one is downloading`, async () => {
    const state = factory.rootState({
      bootresource: factory.bootResourceState({
        resources: [
          factory.bootResource({ downloading: true, name: "ubuntu-core/20" }),
        ],
        ubuntuCoreImages: [factory.bootResourceUbuntuCoreImage()],
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
