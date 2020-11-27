import { shallow } from "enzyme";

import FormikFormButtons from "./FormikFormButtons";

describe("FormikFormButtons ", () => {
  it("renders", () => {
    const wrapper = shallow(<FormikFormButtons submitLabel="Save user" />);
    expect(wrapper).toMatchSnapshot();
  });

  it("can display a cancel button", () => {
    const wrapper = shallow(
      <FormikFormButtons onCancel={jest.fn()} submitLabel="Save user" />
    );
    const button = wrapper.find("Button");
    expect(button.exists()).toBe(true);
    expect(button.children().text()).toBe("Cancel");
  });
});
