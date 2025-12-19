import SelectUpstreamImagesForm from "./SelectUpstreamImagesForm";

import { bootResourceActions } from "@/app/store/bootresource";
import { BootResourceSourceType } from "@/app/store/bootresource/types";
import * as factory from "@/testing/factories";
import { imageSourceResolvers } from "@/testing/resolvers/imageSources";
import {
  userEvent,
  screen,
  within,
  renderWithProviders,
  setupMockServer,
  waitForLoading,
} from "@/testing/utils";

const mockServer = setupMockServer(
  imageSourceResolvers.listImageSources.handler()
);

describe("SelectUpstreamImagesForm", () => {
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

  it("correctly sets initial values", async () => {
    renderWithProviders(<SelectUpstreamImagesForm />, {
      state,
    });
    await waitForLoading();
    const rowUbuntu = within(
      screen.getByRole("row", { name: "16.04 LTS", hidden: true })
    ).getAllByRole("combobox", { hidden: true });

    expect(rowUbuntu).toHaveLength(1);
    expect(within(rowUbuntu[0]).getByText("amd64, i386")).toBeInTheDocument();

    const rowOther = within(
      screen.getByRole("row", { name: "centos70", hidden: true })
    ).getAllByRole("combobox", { hidden: true });

    expect(rowOther).toHaveLength(1);
    expect(within(rowOther[0]).getByText("amd64")).toBeInTheDocument();
  });

  it("can dispatch an action to save ubuntu images", async () => {
    const { store } = renderWithProviders(<SelectUpstreamImagesForm />, {
      state,
    });
    await waitForLoading();
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
    ).toMatchObject(expectedUbuntuAction);
    expect(
      actualActions.find((action) => action.type === expectedOtherAction.type)
    ).toStrictEqual(expectedOtherAction);
  });

  it("disables form with a notification if more than one source detected", async () => {
    mockServer.use(
      imageSourceResolvers.listImageSources.handler({
        items: [
          factory.imageSourceFactory.build(),
          factory.imageSourceFactory.build(),
        ],
        total: 2,
      })
    );
    const state = factory.rootState({
      bootresource: factory.bootResourceState({
        resources: [
          factory.bootResource({ downloading: true, name: "ubuntu/focal" }),
        ],
        ubuntu: {
          arches: [],
          commissioning_series: "focal",
          releases: [],
          sources: [], // uses v3
        },
      }),
    });
    renderWithProviders(<SelectUpstreamImagesForm />, {
      state,
    });
    await waitForLoading();
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
