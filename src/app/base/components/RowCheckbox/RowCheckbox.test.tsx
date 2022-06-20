import { shallow } from "enzyme";

import RowCheckbox from "./RowCheckbox";

describe("RowCheckbox", () => {
  it("renders", () => {
    const wrapper = shallow(
      <RowCheckbox handleRowCheckbox={jest.fn()} item={null} items={[]} />
    );
    expect(wrapper).toMatchSnapshot();
  });

  it("can show a label", () => {
    const wrapper = shallow(
      <RowCheckbox
        handleRowCheckbox={jest.fn()}
        item={null}
        items={[]}
        label="Check row"
      />
    );
    expect(wrapper.prop("label")).toBe("Check row");
  });

  it("can check if it should be selected via a function", () => {
    const wrapper = shallow(
      <RowCheckbox
        checkSelected={() => true}
        handleRowCheckbox={jest.fn()}
        item={null}
        items={[]}
        label="Check row"
      />
    );
    expect(wrapper.prop("checked")).toBe(true);
  });
});
