import configureStore from "redux-mock-store";

import DeleteRepository from "./DeleteRepository";

import type { RootState } from "@/app/store/root/types";
import * as factory from "@/testing/factories";
import { screen, renderWithProviders, userEvent } from "@/testing/utils";

const mockStore = configureStore();

describe("RepositoryDelete", () => {
  let state: RootState;

  beforeEach(() => {
    state = factory.rootState({
      packagerepository: factory.packageRepositoryState({
        loaded: true,
        items: [
          factory.packageRepository({
            id: 1,
            name: "main_archive",
            url: "http://archive.ubuntu.com/ubuntu",
            default: true,
            enabled: true,
          }),
        ],
      }),
    });
  });

  it("renders", async () => {
    renderWithProviders(<DeleteRepository id={1} />);

    expect(
      screen.getByRole("form", { name: "Confirm repository deletion" })
    ).toBeInTheDocument();
  });

  it("can delete a repository", async () => {
    const store = mockStore(state);

    renderWithProviders(<DeleteRepository id={1} />, { store });

    await userEvent.click(screen.getByRole("button", { name: "Delete" }));

    expect(store.getActions()[0]).toEqual({
      type: "packagerepository/delete",
      payload: {
        params: {
          id: 1,
        },
      },
      meta: {
        model: "packagerepository",
        method: "delete",
      },
    });
  });
});
