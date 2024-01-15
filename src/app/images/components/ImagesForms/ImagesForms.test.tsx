import configureStore from "redux-mock-store";

import ImagesForms from "./ImagesForms";

import { ImageSidePanelViews } from "@/app/images/constants";
import type { ImageSidePanelContent } from "@/app/images/types";
import { ConfigNames } from "@/app/store/config/types";
import type { RootState } from "@/app/store/root/types";
import {
  bootResourceState as bootResourceStateFactory,
  bootResource as resourceFactory,
  config as configFactory,
  configState as configStateFactory,
  rootState as rootStateFactory,
} from "@/testing/factories";
import { renderWithBrowserRouter, screen } from "@/testing/utils";

const mockStore = configureStore<RootState>();
let state: RootState;

beforeEach(() => {
  state = rootStateFactory({
    bootresource: bootResourceStateFactory({
      resources: [
        resourceFactory({
          arch: "amd64",
          complete: true,
          name: "ubuntu/focal",
          title: "20.04 LTS",
        }),
      ],
    }),
    config: configStateFactory({
      items: [
        configFactory({
          name: ConfigNames.COMMISSIONING_DISTRO_SERIES,
          value: "focal",
        }),
      ],
    }),
  });
});

it("renders a form when appropriate sidepanel view is provided", () => {
  const store = mockStore(state);
  const sidePanelContent: ImageSidePanelContent = {
    view: ImageSidePanelViews.CHANGE_SOURCE,
    extras: { hasSources: false },
  };
  renderWithBrowserRouter(
    <ImagesForms
      setSidePanelContent={vi.fn()}
      sidePanelContent={sidePanelContent}
    />,
    { store }
  );

  expect(
    screen.getByRole("form", { name: "Choose source" })
  ).toBeInTheDocument();
});
