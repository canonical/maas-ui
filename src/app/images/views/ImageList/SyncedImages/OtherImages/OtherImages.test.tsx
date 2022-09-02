import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";
import { CompatRouter } from "react-router-dom-v5-compat";
import configureStore from "redux-mock-store";

import OtherImages, { Labels as OtherImagesLabels } from "./OtherImages";

import { actions as bootResourceActions } from "app/store/bootresource";
import type { RootState } from "app/store/root/types";
import {
  bootResource as bootResourceFactory,
  bootResourceOtherImage as otherImageFactory,
  bootResourceState as bootResourceStateFactory,
  rootState as rootStateFactory,
} from "testing/factories";
import { renderWithBrowserRouter, renderWithMockStore } from "testing/utils";

const mockStore = configureStore<RootState, {}>();

describe("OtherImages", () => {
  it("does not render if there is no other image data", () => {
    const state = rootStateFactory({
      bootresource: bootResourceStateFactory({ otherImages: [] }),
    });
    renderWithBrowserRouter(<OtherImages />, { wrapperProps: { state } });
    expect(
      screen.queryByText(OtherImagesLabels.OtherImages)
    ).not.toBeInTheDocument();
  });

  it("correctly sets initial values based on resources", () => {
    const otherImages = [
      otherImageFactory({
        name: "centos/amd64/generic/centos70",
        title: "CentOS 7",
      }),
    ];
    const resources = [
      bootResourceFactory({
        name: "ubuntu-core/20",
        arch: "amd64",
        title: "Ubuntu Core 20",
      }),
      bootResourceFactory({
        name: "ubuntu/focal",
        arch: "amd64",
        title: "20.04 LTS",
      }),
      bootResourceFactory({
        name: "centos/centos70",
        arch: "amd64",
        title: "CentOS 7",
      }), // only this resource is an "other image"
    ];
    const state = rootStateFactory({
      bootresource: bootResourceStateFactory({
        otherImages,
        resources,
      }),
    });
    renderWithBrowserRouter(<OtherImages />, { wrapperProps: { state } });

    expect(screen.getByRole("checkbox", { name: "CentOS 7" })).toBeChecked();
  });

  it("can dispatch an action to save other images", async () => {
    const state = rootStateFactory({
      bootresource: bootResourceStateFactory({
        otherImages: [otherImageFactory()],
      }),
    });
    const store = mockStore(state);
    renderWithMockStore(
      <MemoryRouter>
        <CompatRouter>
          <OtherImages />
        </CompatRouter>
      </MemoryRouter>,
      { store }
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
    const state = rootStateFactory({
      bootresource: bootResourceStateFactory({
        otherImages: [otherImageFactory()],
        resources: [
          bootResourceFactory({ downloading: true, name: "ubuntu/focal" }),
          bootResourceFactory({ downloading: false, name: "centos/centos70" }),
        ],
      }),
    });
    renderWithBrowserRouter(<OtherImages />, { wrapperProps: { state } });

    expect(
      screen.queryByRole("button", { name: OtherImagesLabels.StopImport })
    ).not.toBeInTheDocument();
  });

  it(`can dispatch an action to stop importing other images if at least one is
    downloading`, async () => {
    const state = rootStateFactory({
      bootresource: bootResourceStateFactory({
        otherImages: [otherImageFactory()],
        resources: [
          bootResourceFactory({ downloading: true, name: "centos/centos70" }),
        ],
      }),
    });
    const store = mockStore(state);
    renderWithMockStore(
      <MemoryRouter>
        <CompatRouter>
          <OtherImages />
        </CompatRouter>
      </MemoryRouter>,
      { store }
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
