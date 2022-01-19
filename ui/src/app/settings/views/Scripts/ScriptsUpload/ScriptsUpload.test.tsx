import { mount } from "enzyme";
import { act } from "react-dom/test-utils";
import type { FileWithPath } from "react-dropzone";
import { Provider } from "react-redux";
import { MemoryRouter, Route, useLocation } from "react-router-dom";
import type { Dispatch } from "redux";
import configureStore from "redux-mock-store";

import ScriptsUpload from "./ScriptsUpload";
import * as readScript from "./readScript";
import type { ReadScriptResponse } from "./readScript";

import type { RootState } from "app/store/root/types";
import { ScriptType } from "app/store/script/types";
import {
  scriptState as scriptStateFactory,
  rootState as rootStateFactory,
} from "testing/factories";

const mockStore = configureStore();

jest.mock("./readScript");

const createFile = (
  name: string,
  size: number,
  type: string,
  contents = ""
) => {
  const file = new File([contents], name, { type });
  Reflect.defineProperty(file, "size", {
    get() {
      return size;
    },
  });
  return file;
};

describe("ScriptsUpload", () => {
  let state: RootState;

  beforeEach(() => {
    state = rootStateFactory({
      script: scriptStateFactory({
        loaded: true,
      }),
    });
  });

  it("accepts files of any mimetype", async () => {
    const store = mockStore(state);

    const files = [createFile("foo.sh", 2000, "")];

    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter initialEntries={[{ pathname: "/" }]}>
          <ScriptsUpload type="testing" />
        </MemoryRouter>
      </Provider>
    );

    await act(async () => {
      wrapper.find("input").simulate("change", {
        target: { files },
        preventDefault: jest.fn(),
        persist: jest.fn(),
      });
    });

    expect(wrapper.text()).toContain("foo.sh (2000 bytes) ready for upload");
  });

  it("displays an error if a file larger than 2MB is uploaded", async () => {
    const store = mockStore(state);
    const files = [createFile("foo.sh", 3000000, "text/script")];

    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter initialEntries={[{ pathname: "/" }]}>
          <ScriptsUpload type="testing" />
        </MemoryRouter>
      </Provider>
    );

    await act(async () => {
      wrapper.find("input").simulate("change", {
        target: { files },
        preventDefault: jest.fn(),
        persist: jest.fn(),
      });
    });

    expect(store.getActions()[0]["payload"]["message"]).toEqual(
      "foo.sh: File is larger than 2000000 bytes"
    );
  });

  it("displays a single error if multiple files are uploaded", async () => {
    const store = mockStore(state);
    const files = [
      createFile("foo.sh", 1000, "text/script"),
      createFile("bar.sh", 1000, "text/script"),
    ];

    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter initialEntries={[{ pathname: "/" }]}>
          <ScriptsUpload type="testing" />
        </MemoryRouter>
      </Provider>
    );

    await act(async () => {
      wrapper.find("input").simulate("change", {
        target: { files },
        preventDefault: jest.fn(),
        persist: jest.fn(),
      });
    });

    expect(store.getActions()[0]["payload"]["message"]).toEqual(
      "Only a single file may be uploaded."
    );
    expect(store.getActions().length).toBe(1);
  });

  it("dispatches uploadScript without a name if script has metadata", async () => {
    const store = mockStore(state);
    const contents = "# --- Start MAAS 1.0 script metadata ---";
    jest
      .spyOn(readScript, "readScript")
      .mockImplementation(
        (
          _name: FileWithPath,
          _script: Dispatch,
          callback: (script: ReadScriptResponse | null) => void
        ) => {
          callback({
            name: "foo",
            script: contents,
            hasMetadata: true,
          });
        }
      );
    const files = [createFile("foo.sh", 1000, "text/script", contents)];

    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter initialEntries={[{ pathname: "/" }]}>
          <ScriptsUpload type="testing" />
        </MemoryRouter>
      </Provider>
    );

    await act(async () => {
      wrapper.find("input").simulate("change", {
        target: { files },
        preventDefault: jest.fn(),
        persist: jest.fn(),
      });
    });

    await act(async () => {
      wrapper.find("Form").simulate("submit");
    });

    expect(store.getActions()).toEqual([
      { type: "script/cleanup" },
      {
        payload: { contents, type: ScriptType.TESTING },
        type: "script/upload",
      },
    ]);
  });

  it("dispatches uploadScript with a name if script has no metadata", async () => {
    const store = mockStore(state);
    const contents = "#!/bin/bash\necho 'foo';\n";
    jest
      .spyOn(readScript, "readScript")
      .mockImplementation(
        (
          _name: FileWithPath,
          _script: Dispatch,
          callback: (script: ReadScriptResponse | null) => void
        ) => {
          callback({
            name: "foo",
            script: contents,
            hasMetadata: false,
          });
        }
      );
    const files = [createFile("foo.sh", 1000, "text/script", contents)];

    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter initialEntries={[{ pathname: "/" }]}>
          <ScriptsUpload type="testing" />
        </MemoryRouter>
      </Provider>
    );

    await act(async () => {
      wrapper.find("input").simulate("change", {
        target: { files },
        preventDefault: jest.fn(),
        persist: jest.fn(),
      });
    });

    await act(async () => {
      wrapper.find("Form").simulate("submit");
    });

    expect(store.getActions()).toEqual([
      { type: "script/cleanup" },
      {
        payload: { contents, type: ScriptType.TESTING, name: "foo" },
        type: "script/upload",
      },
    ]);
  });

  it("can cancel and return to the commissioning list", () => {
    let location = { pathname: "" };
    const FetchRoute = () => {
      location = useLocation();
      return null;
    };
    const store = mockStore(state);
    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter
          initialEntries={[
            { pathname: "/settings/scripts/commissioning/upload" },
          ]}
        >
          <ScriptsUpload type="commissioning" />
          <Route path="*" render={() => <FetchRoute />} />
        </MemoryRouter>
      </Provider>
    );
    wrapper.find('[data-testid="cancel-action"] button').simulate("click");
    expect(location?.pathname).toBe("/settings/scripts/commissioning");
  });

  it("can cancel and return to the testing list", () => {
    let location = { pathname: "" };
    const FetchRoute = () => {
      location = useLocation();
      return null;
    };
    const store = mockStore(state);
    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter
          initialEntries={[{ pathname: "/settings/scripts/testing/upload" }]}
        >
          <ScriptsUpload type="testing" />
          <Route path="*" render={() => <FetchRoute />} />
        </MemoryRouter>
      </Provider>
    );
    wrapper.find('[data-testid="cancel-action"] button').simulate("click");
    expect(location.pathname).toBe("/settings/scripts/testing");
  });
});
