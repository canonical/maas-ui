import { mount, shallow } from "enzyme";

import TableConfirm from "./TableConfirm";

describe("TableConfirm", () => {
  it("renders", () => {
    const wrapper = shallow(
      <TableConfirm
        confirmLabel="save"
        finished={false}
        inProgress={false}
        message="Are you sure"
        onClose={jest.fn()}
        onConfirm={jest.fn()}
      />
    );
    expect(wrapper).toMatchSnapshot();
  });

  it("can confirm", () => {
    const onConfirm = jest.fn();
    const wrapper = shallow(
      <TableConfirm
        confirmLabel="save"
        finished={false}
        inProgress={false}
        message="Are you sure"
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
      <TableConfirm
        confirmLabel="save"
        finished={false}
        inProgress={false}
        message="Are you sure"
        onClose={onClose}
        onConfirm={jest.fn()}
      />
    );
    wrapper.find("Button").simulate("click");
    expect(onClose).toHaveBeenCalled();
  });

  it("closes when it has finished", () => {
    const onClose = jest.fn();
    const wrapper = mount(
      <TableConfirm
        confirmLabel="save"
        finished={false}
        inProgress={false}
        message="Are you sure"
        onClose={onClose}
        onConfirm={jest.fn()}
      />
    );
    wrapper.find("ActionButton").simulate("click");
    expect(onClose).not.toHaveBeenCalled();
    wrapper.setProps({ finished: true });
    wrapper.update();
    expect(onClose).toHaveBeenCalled();
  });

  it("runs onSuccess function when it has finished", () => {
    const onSuccess = jest.fn();
    const wrapper = mount(
      <TableConfirm
        confirmLabel="save"
        finished={false}
        inProgress={false}
        message="Are you sure"
        onClose={jest.fn()}
        onConfirm={jest.fn()}
        onSuccess={onSuccess}
      />
    );
    wrapper.find("ActionButton").simulate("click");
    expect(onSuccess).not.toHaveBeenCalled();
    wrapper.setProps({ finished: true });
    wrapper.update();
    expect(onSuccess).toHaveBeenCalled();
  });

  it("can display an error", () => {
    const onClose = jest.fn();
    const wrapper = mount(
      <TableConfirm
        confirmLabel="save"
        errors="It didn't work"
        finished={false}
        inProgress={false}
        message="Are you sure"
        onClose={onClose}
        onConfirm={jest.fn()}
      />
    );
    expect(wrapper.find("Notification").text()).toBe("Error:It didn't work");
  });

  it("can display an error for a field", () => {
    const onClose = jest.fn();
    const wrapper = mount(
      <TableConfirm
        confirmLabel="save"
        errors={{ delete: ["It didn't work"] }}
        errorKey="delete"
        finished={false}
        inProgress={false}
        message="Are you sure"
        onClose={onClose}
        onConfirm={jest.fn()}
      />
    );
    expect(wrapper.find("Notification").text()).toBe("Error:It didn't work");
  });
});
