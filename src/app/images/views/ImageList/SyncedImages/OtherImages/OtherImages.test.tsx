import { Provider } from "react-redux";
import { MemoryRouter } from "react-router-dom";
import { CompatRouter } from "react-router-dom";
import configureStore from "redux-mock-store";

import OtherImages, { Labels as OtherImagesLabels } from "./OtherImages";

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

describe("OtherImages", () => {
  it("does not render if there is no other image data", () => {
    const state = factory.rootState({
      bootresource: factory.bootResourceState({ otherImages: [] }),
    });
    renderWithBrowserRouter(<OtherImages />, { state });
    expect(
      screen.queryByText(OtherImagesLabels.OtherImages)
    ).not.toBeInTheDocument();
  });

  it("correctly sets initial values based on resources", () => {
    const otherImages = [
      factory.bootResourceOtherImage({
        name: "centos/amd64/generic/centos70",
        title: "CentOS 7",
      }),
    ];
    const resources = [
      factory.bootResource({
        name: "ubuntu-core/20",
        arch: "amd64",
        title: "Ubuntu Core 20",
      }),
      factory.bootResource({
        name: "ubuntu/focal",
        arch: "amd64",
        title: "20.04 LTS",
      }),
      factory.bootResource({
        name: "centos/centos70",
        arch: "amd64",
        title: "CentOS 7",
      }), // only this resource is an "other image"
    ];
    const state = factory.rootState({
      bootresource: factory.bootResourceState({
        otherImages,
        resources,
      }),
    });
    renderWithBrowserRouter(<OtherImages />, { state });

    expect(screen.getByRole("checkbox", { name: "CentOS 7" })).toBeChecked();
  });

  it("can dispatch an action to save other images", async () => {
    const state = factory.rootState({
      bootresource: factory.bootResourceState({
        otherImages: [factory.bootResourceOtherImage()],
      }),
    });
    const store = mockStore(state);
    render(
      <Provider store={store}>
        <MemoryRouter>
          <CompatRouter>
            <OtherImages />
          </CompatRouter>
        </MemoryRouter>
      </Provider>
    );
    await userEvent.click(screen.getByRole("checkbox", { name: "CentOS 8" }));
    await userEvent.click(
      screen.getByRole("button", { name: OtherImagesLabels.SubmitLabel })
    );

    const expectedAction = bootResourceActions.saveOther({
      images: ["centos/amd64/generic/8"],
    });
    const actualActions = store.getActions();
    expect(
      actualActions.find((action) => action.type === expectedAction.type)
    ).toStrictEqual(expectedAction);
  });

  it(`does not show a button to stop importing other images if none are
    downloading`, () => {
    const state = factory.rootState({
      bootresource: factory.bootResourceState({
        otherImages: [factory.bootResourceOtherImage()],
        resources: [
          factory.bootResource({ downloading: true, name: "ubuntu/focal" }),
          factory.bootResource({ downloading: false, name: "centos/centos70" }),
        ],
      }),
    });
    renderWithBrowserRouter(<OtherImages />, { state });

    expect(
      screen.queryByRole("button", { name: OtherImagesLabels.StopImport })
    ).not.toBeInTheDocument();
  });

  it("enables 'Stop import' button if images are saving", async () => {
    const otherImages = [factory.bootResourceOtherImage()];
    const state = factory.rootState({
      bootresource: factory.bootResourceState({
        otherImages,
        statuses: factory.bootResourceStatuses({ savingOther: true }),
      }),
    });
    renderWithBrowserRouter(<OtherImages />, { state });
    const stopImportButton = screen.getByRole("button", {
      name: OtherImagesLabels.StopImport,
    });
    expect(stopImportButton).toBeEnabled();
  });

  it(`can dispatch an action to stop importing other images if at least one is
    downloading`, async () => {
    const state = factory.rootState({
      bootresource: factory.bootResourceState({
        otherImages: [factory.bootResourceOtherImage()],
        resources: [
          factory.bootResource({ downloading: true, name: "centos/centos70" }),
        ],
      }),
    });
    const store = mockStore(state);
    render(
      <Provider store={store}>
        <MemoryRouter>
          <CompatRouter>
            <OtherImages />
          </CompatRouter>
        </MemoryRouter>
      </Provider>
    );

    await userEvent.click(
      screen.getByRole("button", { name: OtherImagesLabels.StopImport })
    );

    const expectedAction = bootResourceActions.stopImport();
    const actualActions = store.getActions();
    expect(
      actualActions.find((action) => action.type === expectedAction.type)
    ).toStrictEqual(expectedAction);
  });
});
