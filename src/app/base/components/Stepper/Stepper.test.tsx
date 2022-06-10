import { shallow } from "enzyme";

import Stepper from "./Stepper";

describe("Stepper", () => {
  it("renders", () => {
    const wrapper = shallow(
      <Stepper
        currentStep="step2"
        items={[
          { step: "step1", title: "Step 1" },
          { step: "step2", title: "Step 2" },
          { step: "step3", title: "Step 3" },
        ]}
      />
    );
    expect(wrapper).toMatchSnapshot();
  });

  it("renders a step as checked if the index of the current step is higher", () => {
    const wrapper = shallow(
      <Stepper
        currentStep="step2"
        items={[
          { step: "step1", title: "Step 1" },
          { step: "step2", title: "Step 2" },
          { step: "step3", title: "Step 3" },
        ]}
      />
    );
    expect(wrapper.find("[aria-checked=true]").at(0).text()).toBe("Step 1");
    expect(wrapper.find("[aria-checked=false]").at(0).text()).toBe("Step 2");
    expect(wrapper.find("[aria-checked=false]").at(1).text()).toBe("Step 3");
  });
});
