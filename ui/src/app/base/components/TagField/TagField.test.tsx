import { mount } from "enzyme";
import { Formik } from "formik";

import TagField from "./TagField";

describe("FormikField", () => {
  it("sorts the tags by name", () => {
    const wrapper = mount(
      <Formik initialValues={{ tags: null }} onSubmit={jest.fn()}>
        <TagField
          name="wombatTags"
          tags={[
            {
              name: "wallaby",
            },
            {
              name: "koala",
            },
          ]}
        />
      </Formik>
    );
    expect(wrapper.find("FormikField").prop("tags")).toStrictEqual([
      {
        name: "koala",
      },
      {
        name: "wallaby",
      },
    ]);
  });
});
