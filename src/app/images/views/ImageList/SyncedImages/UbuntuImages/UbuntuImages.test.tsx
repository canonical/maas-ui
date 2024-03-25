import { Provider } from "react-redux";
import { MemoryRouter } from "react-router-dom";
import { CompatRouter } from "react-router-dom";
import configureStore from "redux-mock-store";

import UbuntuImages, { Labels as UbuntuImagesLabels } from "./UbuntuImages";

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

describe("UbuntuImages", () => {
  it("correctly sets initial values based on resources", () => {
    const source = factory.bootResourceUbuntuSource();
    const ubuntu = factory.bootResourceUbuntu({
      arches: [
        factory.bootResourceUbuntuArch({ name: "amd64" }),
        factory.bootResourceUbuntuArch({ name: "i386" }),
      ],
      releases: [
        factory.bootResourceUbuntuRelease({ name: "xenial" }),
        factory.bootResourceUbuntuRelease({ name: "bionic" }),
      ],
    });
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
        name: "ubuntu/xenial",
        arch: "s390x",
        title: "16.04 LTS",
      }), // source does not know this arch
      factory.bootResource({
        name: "ubuntu/bionic",
        arch: "amd64",
        title: "18.04 LTS",
      }),
      factory.bootResource({
        name: "ubuntu/focal",
        arch: "amd64",
        title: "20.04 LTS",
      }), // source does not know this release
      factory.bootResource({
        name: "centos/centos70",
        arch: "amd64",
        title: "CentOS 7",
      }), // only Ubuntu resources are relevant
    ];
    const state = factory.rootState({
      bootresource: factory.bootResourceState({
        resources,
        ubuntu,
      }),
    });

    renderWithBrowserRouter(<UbuntuImages sources={[source]} />, {
      state,
    });

    const row_18_04_LTS = screen.getByRole("row", { name: "18.04 LTS" });
    const rows_16_04_LTS = screen.getAllByRole("row", { name: "16.04 LTS" });
    expect(
      within(row_18_04_LTS).getByText("Waiting for rack controller(s) to sync")
    ).toBeInTheDocument();

    expect(
      within(rows_16_04_LTS[0]).getByText(
        "Waiting for rack controller(s) to sync"
      )
    ).toBeInTheDocument();

    expect(
      within(rows_16_04_LTS[1]).getByText(
        "Waiting for rack controller(s) to sync"
      )
    ).toBeInTheDocument();
  });

  it("can dispatch an action to save ubuntu images", async () => {
    const source = factory.bootResourceUbuntuSource();
    const ubuntu = factory.bootResourceUbuntu({
      arches: [
        factory.bootResourceUbuntuArch({ name: "amd64" }),
        factory.bootResourceUbuntuArch({ name: "i386" }),
      ],
      releases: [
        factory.bootResourceUbuntuRelease({ name: "xenial" }),
        factory.bootResourceUbuntuRelease({ name: "bionic" }),
      ],
    });
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
        name: "ubuntu/bionic",
        arch: "amd64",
        title: "18.04 LTS",
      }),
    ];
    const state = factory.rootState({
      bootresource: factory.bootResourceState({
        resources,
        ubuntu,
      }),
    });
    const store = mockStore(state);
    render(
      <Provider store={store}>
        <MemoryRouter>
          <CompatRouter>
            <UbuntuImages sources={[source]} />
          </CompatRouter>
        </MemoryRouter>
      </Provider>
    );

    await userEvent.click(
      screen.getByRole("button", { name: UbuntuImagesLabels.SubmitLabel })
    );

    const expectedAction = bootResourceActions.saveUbuntu({
      keyring_data: "aabbccdd",
      keyring_filename: "/usr/share/keyrings/ubuntu-cloudimage-keyring.gpg",
      osystems: [
        {
          arches: ["amd64", "i386"],
          osystem: "ubuntu",
          release: "xenial",
        },
        {
          arches: ["amd64"],
          osystem: "ubuntu",
          release: "bionic",
        },
      ],
      source_type: BootResourceSourceType.MAAS_IO,
      url: "http://images.maas.io/ephemeral-v3/stable/",
    });
    const actualActions = store.getActions();
    expect(
      actualActions.find((action) => action.type === expectedAction.type)
    ).toStrictEqual(expectedAction);
  });

  it(`does not show a button to stop importing ubuntu images if none are
    downloading`, () => {
    const source = factory.bootResourceUbuntuSource();
    const state = factory.rootState({
      bootresource: factory.bootResourceState({
        resources: [
          factory.bootResource({ downloading: false, name: "ubuntu/focal" }),
          factory.bootResource({ downloading: true, name: "centos/centos70" }),
        ],
        ubuntu: factory.bootResourceUbuntu(),
      }),
    });
    renderWithBrowserRouter(<UbuntuImages sources={[source]} />, {
      state,
    });

    expect(
      screen.queryByRole("button", { name: UbuntuImagesLabels.StopImport })
    ).not.toBeInTheDocument();
  });

  it(`can dispatch an action to stop importing ubuntu images if at least one is
    downloading`, async () => {
    const source = factory.bootResourceUbuntuSource();
    const state = factory.rootState({
      bootresource: factory.bootResourceState({
        resources: [
          factory.bootResource({ downloading: true, name: "ubuntu/focal" }),
        ],
        ubuntu: factory.bootResourceUbuntu(),
      }),
    });
    const store = mockStore(state);
    render(
      <Provider store={store}>
        <MemoryRouter>
          <CompatRouter>
            <UbuntuImages sources={[source]} />
          </CompatRouter>
        </MemoryRouter>
      </Provider>
    );
    await userEvent.click(
      screen.getByRole("button", { name: UbuntuImagesLabels.StopImport })
    );

    const expectedAction = bootResourceActions.stopImport();
    const actualActions = store.getActions();
    expect(
      actualActions.find((action) => action.type === expectedAction.type)
    ).toStrictEqual(expectedAction);
  });

  it("enables 'Stop import' button if images are saving", async () => {
    const source = factory.bootResourceUbuntuSource();
    const state = factory.rootState({
      bootresource: factory.bootResourceState({
        resources: [
          factory.bootResource({ downloading: true, name: "ubuntu/focal" }),
        ],
        ubuntu: factory.bootResourceUbuntu(),
        statuses: factory.bootResourceStatuses({ savingUbuntu: true }),
      }),
    });
    renderWithBrowserRouter(<UbuntuImages sources={[source]} />, { state });
    const stopImportButton = screen.getByRole("button", {
      name: UbuntuImagesLabels.StopImport,
    });
    expect(stopImportButton).toBeEnabled();
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
        ubuntu: factory.bootResourceUbuntu(),
      }),
    });
    renderWithBrowserRouter(<UbuntuImages sources={sources} />, {
      state,
    });

    expect(
      screen.getByText(UbuntuImagesLabels.MultipleSourceNotification)
    ).toBeInTheDocument();

    expect(
      screen.queryByRole("button", { name: UbuntuImagesLabels.SubmitLabel })
    ).not.toBeInTheDocument();
  });
});
