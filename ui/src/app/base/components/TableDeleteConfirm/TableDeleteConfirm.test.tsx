import { mount, shallow } from "enzyme";

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

  it("can confirm", () => {
    const onConfirm = jest.fn();
    const wrapper = shallow(
      <TableDeleteConfirm
        deleted={false}
        deleting={false}
        modelName="Cobba"
        modelType="user"
        onClose={jest.fn()}
        onConfirm={onConfirm}
      />
    );
    wrapper.find("ActionButton").simulate("click");
    expect(onConfirm).toHaveBeenCalled();
  });

  it("can cancel", () => {
    const onClose = jest.fn();
    const wrapper = shallow(
      <TableDeleteConfirm
        deleted={false}
        deleting={false}
        modelName="Cobba"
        modelType="user"
        onClose={onClose}
        onConfirm={jest.fn()}
      />
    );
    wrapper.find("Button").simulate("click");
    expect(onClose).toHaveBeenCalled();
  });

  it("closes when it has finished deleting", () => {
    const onClose = jest.fn();
    const wrapper = mount(
      <TableDeleteConfirm
        deleted={false}
        deleting={false}
        modelName="Cobba"
        modelType="user"
        onClose={onClose}
        onConfirm={jest.fn()}
      />
    );
    wrapper.find("ActionButton").simulate("click");
    expect(onClose).not.toHaveBeenCalled();
    wrapper.setProps({ deleted: true });
    wrapper.update();
    expect(onClose).toHaveBeenCalled();
  });
});
