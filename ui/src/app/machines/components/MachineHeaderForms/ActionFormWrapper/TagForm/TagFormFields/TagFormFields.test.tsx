import { render } from "@testing-library/react";
import { Formik } from "formik";
import { Provider } from "react-redux";
import { MemoryRouter } from "react-router-dom";
import configureStore from "redux-mock-store";

import TagFormFields from "./TagFormFields";

import type { Props as TagFieldProps } from "app/base/components/TagField/TagField";
import {
  tag as tagFactory,
  rootState as rootStateFactory,
  tagState as tagStateFactory,
} from "testing/factories";

const mockStore = configureStore();
const mockTagField = jest.fn();
jest.mock("app/base/components/TagField", () => (props: TagFieldProps) => {
  mockTagField(props);
  return null;
});

afterEach(() => {
  jest.restoreAllMocks();
});

it("passes the selected tag objects", () => {
  const tags = [tagFactory(), tagFactory(), tagFactory()];
  const state = rootStateFactory({
    tag: tagStateFactory({
      items: tags,
      loading: false,
    }),
  });
  const store = mockStore(state);
  render(
    <Provider store={store}>
      <MemoryRouter>
        <Formik
          initialValues={{ tags: [tags[0].id, tags[2].id] }}
          onSubmit={jest.fn()}
        >
          <TagFormFields machines={[]} />
        </Formik>
      </MemoryRouter>
    </Provider>
  );
  expect(mockTagField).toHaveBeenCalledWith(
    expect.objectContaining({
      externalSelectedTags: [tags[0], tags[2]],
      tags: [
        { id: tags[0].id, name: tags[0].name },
        { id: tags[1].id, name: tags[1].name },
        { id: tags[2].id, name: tags[2].name },
      ],
    })
  );
});
