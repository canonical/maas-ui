import { shallow } from "enzyme";

import TableDeleteConfirm from "./TableDeleteConfirm";

describe("TableDeleteConfirm", () => {
  it("renders", () => {
    const wrapper = shallow(
      <TableDeleteConfirm
        modelName="Cobba"
        modelType="user"
        onCancel={jest.fn()}
        onConfirm={jest.fn()}
      />
    );
    expect(wrapper).toMatchSnapshot();
  });
});
