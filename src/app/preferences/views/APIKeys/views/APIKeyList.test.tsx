import APIKeyList from "./APIKeyList";

import APIKeyDelete from "@/app/preferences/views/APIKeys/components/APIKeyDelete";
import type { RootState } from "@/app/store/root/types";
import * as factory from "@/testing/factories";
import {
  mockModal,
  renderWithProviders,
  screen,
  userEvent,
} from "@/testing/utils";

const { mockOpen: mockOpenModal } = await mockModal();

describe("APIKeyList", () => {
  let state: RootState;

  beforeEach(() => {
    state = factory.rootState({
      token: factory.tokenState({
        loading: false,
        loaded: true,
        items: [
          factory.token({
            id: 1,
            key: "ssh-rsa aabb",
            consumer: { key: "abc", name: "Name" },
          }),
        ],
      }),
    });
  });

  it("renders APIKeyAdd", async () => {
    renderWithProviders(<APIKeyList />, { state });

    await userEvent.click(
      screen.getByRole("button", { name: "Generate MAAS API key" })
    );

    expect(
      screen.getByRole("complementary", { name: "Generate MAAS API key" })
    ).toBeInTheDocument();
  });

  it("renders APIKeyEdit", async () => {
    renderWithProviders(<APIKeyList />, { state });

    await userEvent.click(screen.getByRole("button", { name: "Edit" }));

    expect(
      screen.getByRole("complementary", { name: "Edit API key" })
    ).toBeInTheDocument();
  });

  it("renders APIKeyDelete", async () => {
    renderWithProviders(<APIKeyList />, { state });

    await userEvent.click(screen.getByRole("button", { name: "Delete" }));

    expect(mockOpenModal).toHaveBeenCalledWith(
      expect.objectContaining({
        component: APIKeyDelete,
        title: "Delete API key",
      })
    );
  });
});
