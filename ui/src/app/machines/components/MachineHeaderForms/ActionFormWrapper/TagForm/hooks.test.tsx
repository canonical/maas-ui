import type { ReactNode } from "react";

import { renderHook } from "@testing-library/react-hooks";
import { Formik } from "formik";
import { Provider } from "react-redux";
import configureStore from "redux-mock-store";

import { useSelectedTags } from "./hooks";

import {
  tag as tagFactory,
  tagState as tagStateFactory,
  rootState as rootStateFactory,
} from "testing/factories";

const mockStore = configureStore();

it("gets and sets active tag", () => {
  const tags = [tagFactory(), tagFactory(), tagFactory()];
  const state = rootStateFactory({
    tag: tagStateFactory({
      items: tags,
      loading: false,
    }),
  });
  const store = mockStore(state);
  const { result } = renderHook(() => useSelectedTags(), {
    wrapper: ({ children }: { children: ReactNode }) => (
      <Provider store={store}>
        <Formik
          initialValues={{ tags: [tags[0].id, tags[2].id] }}
          onSubmit={jest.fn()}
        >
          {children}
        </Formik>
      </Provider>
    ),
  });
  expect(result.current).toStrictEqual([tags[0], tags[2]]);
});
