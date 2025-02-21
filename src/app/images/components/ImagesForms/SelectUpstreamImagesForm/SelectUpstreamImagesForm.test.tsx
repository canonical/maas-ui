import { Provider } from "react-redux";
import { MemoryRouter } from "react-router-dom";
import configureStore from "redux-mock-store";

import SelectUpstreamImagesForm from "@/app/images/components/ImagesForms/SelectUpstreamImagesForm/SelectUpstreamImagesForm";
import { bootResourceActions } from "@/app/store/bootresource";
import { BootResourceSourceType } from "@/app/store/bootresource/types";
import type { RootState } from "@/app/store/root/types";
import * as factory from "@/testing/factories";
import {
  userEvent,
  screen,
  render,
  within,
  renderWithBrowserRouter,
} from "@/testing/utils";

const mockStore = configureStore<RootState, {}>();

describe("SelectUpstreamImagesForm", () => {
  it("correctly sets initial values", async () => {
    const ubuntu = factory.bootResourceUbuntu({
      arches: [
        {
          name: "amd64",
          title: "amd64",
          checked: false,
          deleted: false,
        },
        {
          name: "i386",
          title: "i386",
          checked: false,
          deleted: false,
        },
      ],
      releases: [
        {
          name: "xenial",
          title: "16.04 LTS",
          unsupported_arches: [],
          checked: false,
          deleted: false,
        },
      ],
    });
    const otherImages = [
      factory.bootResourceOtherImage({
        name: "centos/amd64/generic/centos70",
        title: "CentOS 7",
      }),
    ];
    const resources = [
      factory.bootResource({
        name: "ubuntu/xenial",
        arch: "amd64",
        title: "16.04 LTS",
      }),
      factory.bootResource({
        name: "ubuntu/xenial",
        arch: "i386",
        title: "16.04 LTS",
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
        ubuntu,
        otherImages,
      }),
    });

    renderWithBrowserRouter(<SelectUpstreamImagesForm />, {
      state,
    });

    await userEvent.click(screen.getByText("Ubuntu"));
    await userEvent.click(screen.getByText("Centos"));

    const rowUbuntu = within(
      screen.getByRole("row", { name: "16.04 LTS" })
    ).getAllByRole("combobox");

    expect(rowUbuntu).toHaveLength(1);
    expect(within(rowUbuntu[0]).getByText("amd64, i386")).toBeInTheDocument();

    const rowOther = within(
      screen.getByRole("row", { name: "centos70" })
    ).getAllByRole("combobox");

    expect(rowOther).toHaveLength(1);
    expect(within(rowOther[0]).getByText("amd64")).toBeInTheDocument();
  });

  it("can dispatch an action to save ubuntu images", async () => {
    const ubuntu = factory.bootResourceUbuntu({
      arches: [
        {
          name: "amd64",
          title: "amd64",
          checked: false,
          deleted: false,
        },
        {
          name: "i386",
          title: "i386",
          checked: false,
          deleted: false,
        },
      ],
      releases: [
        {
          name: "xenial",
          title: "16.04 LTS",
          unsupported_arches: [],
          checked: false,
          deleted: false,
        },
      ],
    });
    const otherImages = [
      factory.bootResourceOtherImage({
        name: "centos/amd64/generic/centos70",
        title: "CentOS 7",
      }),
    ];
    const resources = [
      factory.bootResource({
        name: "ubuntu/xenial",
        arch: "amd64",
        title: "16.04 LTS",
      }),
      factory.bootResource({
        name: "ubuntu/xenial",
        arch: "i386",
        title: "16.04 LTS",
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
        ubuntu,
        otherImages,
      }),
    });
    const store = mockStore(state);
    render(
      <Provider store={store}>
        <MemoryRouter>
          <SelectUpstreamImagesForm />
        </MemoryRouter>
      </Provider>
    );

    await userEvent.click(
      screen.getByRole("button", { name: "Save and sync" })
    );

    const expectedUbuntuAction = bootResourceActions.saveUbuntu({
      osystems: [
        {
          arches: ["amd64", "i386"],
          osystem: "ubuntu",
          release: "xenial",
        },
      ],
      source_type: BootResourceSourceType.MAAS_IO,
    });
    const expectedOtherAction = bootResourceActions.saveOther({
      images: ["centos/amd64/generic/centos70"],
    });
    const actualActions = store.getActions();
    expect(
      actualActions.find((action) => action.type === expectedUbuntuAction.type)
    ).toStrictEqual(expectedUbuntuAction);
    expect(
      actualActions.find((action) => action.type === expectedOtherAction.type)
    ).toStrictEqual(expectedOtherAction);
  });

  it("disables form with a notification if more than one source detected", () => {
    const sources = [
      factory.bootResourceUbuntuSource(),
      factory.bootResourceUbuntuSource(),
    ];
    const state = factory.rootState({
      bootresource: factory.bootResourceState({
        resources: [
          factory.bootResource({ downloading: true, name: "ubuntu/focal" }),
        ],
        ubuntu: {
          arches: [],
          commissioning_series: "focal",
          releases: [],
          sources,
        },
      }),
    });
    renderWithBrowserRouter(<SelectUpstreamImagesForm />, {
      state,
    });

    expect(
      screen.getByText(
        "More than one image source exists. The UI does not support updating synced images when more than one source has been defined. Use the API to adjust your sources."
      )
    ).toBeInTheDocument();

    expect(
      screen.queryByRole("button", { name: "Download" })
    ).not.toBeInTheDocument();
  });
});
