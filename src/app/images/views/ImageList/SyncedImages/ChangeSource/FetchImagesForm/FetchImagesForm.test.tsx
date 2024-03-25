import * as reactComponentHooks from "@canonical/react-components/dist/hooks";
import { Provider } from "react-redux";
import { MemoryRouter } from "react-router-dom";
import { CompatRouter } from "react-router-dom";
import configureStore from "redux-mock-store";

import FetchImagesForm, {
  Labels as FetchImagesFormLabels,
} from "./FetchImagesForm";
import { Labels as FetchImagesFormFieldsLabels } from "./FetchImagesFormFields/FetchImagesFormFields";

import { bootResourceActions } from "@/app/store/bootresource";
import { BootResourceSourceType } from "@/app/store/bootresource/types";
import type { RootState } from "@/app/store/root/types";
import * as factory from "@/testing/factories";
import { userEvent, screen, render, waitFor } from "@/testing/utils";

const mockStore = configureStore<RootState, {}>();

vi.mock("@canonical/react-components/dist/hooks", () => ({
  useId: vi.fn(),
  usePrevious: vi.fn(),
}));

describe("FetchImagesForm", () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  afterAll(() => {
    vi.restoreAllMocks();
  });

  it("can dispatch an action to fetch images", async () => {
    const state = factory.rootState();
    const store = mockStore(state);
    render(
      <Provider store={store}>
        <MemoryRouter>
          <CompatRouter>
            <FetchImagesForm closeForm={vi.fn()} setSource={vi.fn()} />
          </CompatRouter>
        </MemoryRouter>
      </Provider>
    );

    await userEvent.click(
      screen.getByRole("radio", { name: FetchImagesFormFieldsLabels.Custom })
    );

    await userEvent.click(
      screen.getByRole("button", {
        name: FetchImagesFormFieldsLabels.ShowAdvanced,
      })
    );

    await userEvent.type(
      screen.getByRole("textbox", { name: FetchImagesFormFieldsLabels.Url }),
      "http://www.example.com/"
    );
    await userEvent.type(
      screen.getByRole("textbox", {
        name: FetchImagesFormFieldsLabels.KeyringFilename,
      }),
      "/path/to/file"
    );
    await userEvent.type(
      screen.getByRole("textbox", {
        name: FetchImagesFormFieldsLabels.KeyringData,
      }),
      "data"
    );

    await userEvent.click(
      screen.getByRole("button", { name: FetchImagesFormLabels.SubmitLabel })
    );

    const actualActions = store.getActions();
    const expectedAction = bootResourceActions.fetch({
      keyring_data: "data",
      keyring_filename: "/path/to/file",
      source_type: BootResourceSourceType.CUSTOM,
      url: "http://www.example.com/",
    });
    expect(
      actualActions.find(
        (actualAction) => actualAction.type === expectedAction.type
      )
    ).toStrictEqual(expectedAction);
  });

  it("sets source if images successfuly fetched", async () => {
    // Mock the transition from "saving" to "saved"
    vi.spyOn(reactComponentHooks, "usePrevious")
      .mockReturnValueOnce(false)
      .mockReturnValue(true);
    const setSource = vi.fn();
    const state = factory.rootState({
      bootresource: factory.bootResourceState({
        eventErrors: [],
        statuses: factory.bootResourceStatuses({ fetching: false }),
      }),
    });
    const store = mockStore(state);
    const Proxy = () => (
      <Provider store={store}>
        <MemoryRouter>
          <CompatRouter>
            <FetchImagesForm closeForm={vi.fn()} setSource={setSource} />
          </CompatRouter>
        </MemoryRouter>
      </Provider>
    );
    const { rerender } = render(<Proxy />);

    await userEvent.click(
      screen.getByRole("button", { name: FetchImagesFormLabels.SubmitLabel })
    );

    // Force the component to rerender to simulate the saved value changing.
    rerender(<Proxy />);

    await waitFor(() => expect(setSource).toHaveBeenCalled());
  });
});
