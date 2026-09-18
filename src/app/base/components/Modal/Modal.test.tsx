import { useEffect } from "react";

import Modal from "./Modal";

import { useModal } from "@/app/base/modal-context";
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

describe("Modal", () => {
  it("doesn't show a modal by default", () => {
    renderWithProviders(<Modal />);

    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });

  it("shows the modal when one is open", () => {
    renderWithProviders(
      <>
        <OpenModalOnMount />
        <Modal />
      </>
    );

    expect(
      screen.getByRole("dialog", { name: "Test modal" })
    ).toBeInTheDocument();
    expect(screen.getByText("Modal content")).toBeInTheDocument();
  });

  it("closes the modal when the close button is clicked", async () => {
    renderWithProviders(
      <>
        <OpenModalOnMount />
        <Modal />
      </>
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

describe("Modal.Skeleton", () => {
  it("renders a skeleton placeholder", () => {
    const { result } = renderWithProviders(<Modal.Skeleton />);

    expect(
      result.container.querySelector(".modal-skeleton")
    ).toBeInTheDocument();
  });
});
