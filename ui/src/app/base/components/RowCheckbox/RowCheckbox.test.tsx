import { shallow } from "enzyme";

import RowCheckbox from "./RowCheckbox";

describe("RowCheckbox", () => {
  it("renders", () => {
    const wrapper = shallow(
      <RowCheckbox items={[]} item={null} handleRowCheckbox={jest.fn()} />
    );
    expect(wrapper).toMatchSnapshot();
  });

  it("can show a label", () => {
    const wrapper = shallow(
      <RowCheckbox
        items={[]}
        label="Check row"
        item={null}
        handleRowCheckbox={jest.fn()}
      />
    );
    expect(wrapper.prop("label")).toBe("Check row");
  });

  it("can check if it should be selected via a function", () => {
    const wrapper = shallow(
      <RowCheckbox
        checkSelected={() => true}
        items={[]}
        label="Check row"
        item={null}
        handleRowCheckbox={jest.fn()}
      />
    );
    expect(wrapper.prop("checked")).toBe(true);
  });
});
