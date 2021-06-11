import { shallow } from "enzyme";

import TableDeleteConfirm from "./TableDeleteConfirm";

describe("TableDeleteConfirm", () => {
  it("renders", () => {
    const wrapper = shallow(
      <TableDeleteConfirm
        deleted={false}
        deleting={false}
        modelName="Cobba"
        modelType="user"
        onClose={jest.fn()}
        onConfirm={jest.fn()}
      />
    );
    expect(wrapper).toMatchSnapshot();
  });
});
