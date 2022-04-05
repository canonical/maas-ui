import type { ReactNode } from "react";

import { renderHook } from "@testing-library/react-hooks";
import { Formik } from "formik";
import { Provider } from "react-redux";
import configureStore from "redux-mock-store";

import { useSelectedTags, useUnchangedTags } from "./hooks";

import {
  tag as tagFactory,
  tagState as tagStateFactory,
  rootState as rootStateFactory,
} from "testing/factories";

const mockStore = configureStore();

describe("useSelectedTags", () => {
  it("gets tags that have been added", () => {
    const tags = [tagFactory(), tagFactory(), tagFactory()];
    const state = rootStateFactory({
      tag: tagStateFactory({
        items: tags,
        loading: false,
      }),
    });
    const store = mockStore(state);
    const { result } = renderHook(() => useSelectedTags("added"), {
      wrapper: ({ children }: { children: ReactNode }) => (
        <Provider store={store}>
          <Formik
            initialValues={{ added: [tags[0].id, tags[2].id] }}
            onSubmit={jest.fn()}
          >
            {children}
          </Formik>
        </Provider>
      ),
    });
    expect(result.current).toStrictEqual([tags[0], tags[2]]);
  });

  it("gets tags that have been removed", () => {
    const tags = [tagFactory(), tagFactory(), tagFactory()];
    const state = rootStateFactory({
      tag: tagStateFactory({
        items: tags,
        loading: false,
      }),
    });
    const store = mockStore(state);
    const { result } = renderHook(() => useSelectedTags("removed"), {
      wrapper: ({ children }: { children: ReactNode }) => (
        <Provider store={store}>
          <Formik
            initialValues={{ removed: [tags[0].id, tags[2].id] }}
            onSubmit={jest.fn()}
          >
            {children}
          </Formik>
        </Provider>
      ),
    });
    expect(result.current).toStrictEqual([tags[0], tags[2]]);
  });
});

describe("useUnchangedTags", () => {
  it("gets tags that have been added", () => {
    const tags = [
      tagFactory({ id: 1 }),
      tagFactory({ id: 2 }),
      tagFactory({ id: 3 }),
    ];
    const { result } = renderHook(() => useUnchangedTags(tags), {
      wrapper: ({ children }: { children: ReactNode }) => (
        <Formik
          initialValues={{ added: [tags[0].id], removed: [tags[1].id] }}
          onSubmit={jest.fn()}
        >
          {children}
        </Formik>
      ),
    });
    expect(result.current).toStrictEqual([tags[2]]);
  });
});
