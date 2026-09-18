import { useEffect } from "react";

import AppLayout from "@/app/base/components/AppLayout/AppLayout";
import { useModal } from "@/app/base/modal-context";
import { preferencesNavItems } from "@/app/preferences/constants";
import { settingsNavItems } from "@/app/settings/constants";
import * as factory from "@/testing/factories";
import { renderWithProviders, screen, userEvent } from "@/testing/utils";

const ModalContent = (): React.ReactElement => <div>Modal content</div>;

// Opens a real modal via the actual ModalContext, since mockModal always
// returns a null component and can't be used to test the rendered modal.
const OpenModalOnMount = (): null => {
  const { openModal } = useModal();
  useEffect(() => {
    openModal({ component: ModalContent, title: "Test modal" });
    // openModal is recreated on every render (not memoized in
    // ModalContextProvider), so including it here would loop forever.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return null;
};

describe("AppLayout", () => {
  it("shows the secondary navigation for settings", () => {
    renderWithProviders(<AppLayout>content</AppLayout>, {
      state: {
        status: factory.statusState({ authenticated: true, connected: true }),
      },
      initialEntries: ["/settings/configuration/general"],
    });

    expect(
      screen.getByRole("heading", { name: "Settings", level: 2 })
    ).toBeInTheDocument();

    settingsNavItems.forEach((item) => {
      expect(screen.getByText(item.label)).toBeInTheDocument();
    });
  });

  it("shows the secondary navigation for preferences", () => {
    renderWithProviders(<AppLayout>content</AppLayout>, {
      state: {
        status: factory.statusState({ authenticated: true, connected: true }),
      },
      initialEntries: ["/account/prefs/details"],
    });

    expect(
      screen.getByRole("heading", { name: "My preferences", level: 2 })
    ).toBeInTheDocument();

    preferencesNavItems.forEach((item) => {
      expect(screen.getByText(item.label)).toBeInTheDocument();
    });
  });

  it("doesn't show the side nav if not authenticated", () => {
    renderWithProviders(<AppLayout>content</AppLayout>, {
      state: { status: factory.statusState({ connected: true }) },
      initialEntries: ["/account/prefs/details"],
    });

    expect(
      screen.queryByRole("heading", { name: "My preferences", level: 2 })
    ).not.toBeInTheDocument();
  });

  it("doesn't show the side nav if not connected", () => {
    renderWithProviders(<AppLayout>content</AppLayout>, {
      state: { status: factory.statusState({ authenticated: true }) },
      initialEntries: ["/account/prefs/details"],
    });

    expect(
      screen.queryByRole("heading", { name: "My preferences", level: 2 })
    ).not.toBeInTheDocument();
  });

  it("doesn't show a modal by default", () => {
    renderWithProviders(<AppLayout>content</AppLayout>);

    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });

  it("shows the modal when one is open", () => {
    renderWithProviders(
      <AppLayout>
        <OpenModalOnMount />
      </AppLayout>
    );

    expect(
      screen.getByRole("dialog", { name: "Test modal" })
    ).toBeInTheDocument();
    expect(screen.getByText("Modal content")).toBeInTheDocument();
  });

  it("closes the modal when the close button is clicked", async () => {
    renderWithProviders(
      <AppLayout>
        <OpenModalOnMount />
      </AppLayout>
    );

    expect(
      screen.getByRole("dialog", { name: "Test modal" })
    ).toBeInTheDocument();

    await userEvent.click(
      screen.getByRole("button", { name: "Close active modal" })
    );

    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });
});
