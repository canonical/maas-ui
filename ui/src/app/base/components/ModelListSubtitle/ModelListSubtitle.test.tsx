import { mount } from "enzyme";

import ModelListSubtitle from "./ModelListSubtitle";

describe("ModelListSubtitle", () => {
  it("correctly displays when one model is available and none selected", () => {
    const wrapper = mount(
      <ModelListSubtitle available={1} modelName="machine" />
    );
    expect(wrapper.find('[data-testid="subtitle-string"]').text()).toBe(
      "1 machine available"
    );
  });

  it("correctly displays when more than one model is available and none selected", () => {
    const wrapper = mount(
      <ModelListSubtitle available={2} modelName="machine" />
    );
    expect(wrapper.find('[data-testid="subtitle-string"]').text()).toBe(
      "2 machines available"
    );
  });

  it("correctly displays when no models are available", () => {
    const wrapper = mount(
      <ModelListSubtitle available={0} modelName="machine" />
    );
    expect(wrapper.find('[data-testid="subtitle-string"]').text()).toBe(
      "No machines available"
    );
  });

  it("correctly displays when all models are selected", () => {
    const wrapper = mount(
      <ModelListSubtitle available={2} modelName="machine" selected={2} />
    );
    expect(wrapper.find('[data-testid="subtitle-string"]').text()).toBe(
      "All machines selected"
    );
  });

  it("correctly displays when some models are selected", () => {
    const wrapper = mount(
      <ModelListSubtitle available={2} modelName="machine" selected={1} />
    );
    expect(wrapper.find('[data-testid="subtitle-string"]').text()).toBe(
      "1 of 2 machines selected"
    );
  });

  it("can render a filter button when some models are selected", () => {
    const filterSelected = jest.fn();
    const wrapper = mount(
      <ModelListSubtitle
        available={2}
        filterSelected={filterSelected}
        modelName="machine"
        selected={1}
      />
    );
    expect(wrapper.find('[data-testid="subtitle-string"]').exists()).toBe(
      false
    );
    wrapper.find("Button[data-testid='filter-selected']").simulate("click");
    expect(filterSelected).toHaveBeenCalled();
  });
});
