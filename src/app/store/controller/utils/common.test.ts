import {
  isControllerDetails,
  isRack,
  isRegionAndRack,
  isRegion,
} from "./common";

import { NodeType } from "app/store/types/node";
import {
  controller as controllerFactory,
  controllerDetails as controllerDetailsFactory,
} from "testing/factories";

describe("isControllerDetails", () => {
  it("identifies controller details", () => {
    const controllerDetails = controllerDetailsFactory();
    expect(isControllerDetails(controllerDetails)).toBe(true);
  });

  it("handles base controller", () => {
    const baseController = controllerFactory();
    expect(isControllerDetails(baseController)).toBe(false);
  });

  it("handles no controller", () => {
    expect(isControllerDetails()).toBe(false);
  });

  it("handles null", () => {
    expect(isControllerDetails(null)).toBe(false);
  });
});

describe("isRack", () => {
  it("identifies rack controller", () => {
    const rackController = controllerFactory({
      node_type: NodeType.RACK_CONTROLLER,
    });
    const regionController = controllerFactory({
      node_type: NodeType.REGION_CONTROLLER,
    });
    const regionAndRackController = controllerFactory({
      node_type: NodeType.REGION_AND_RACK_CONTROLLER,
    });
    expect(isRack(rackController)).toBe(true);
    expect(isRack(regionController)).toBe(false);
    expect(isRack(regionAndRackController)).toBe(false);
  });

  it("handles null and undefined cases", () => {
    expect(isRack(null)).toBe(false);
    expect(isRack()).toBe(false);
  });
});

describe("isRegion", () => {
  it("identifies region controller", () => {
    const rackController = controllerFactory({
      node_type: NodeType.RACK_CONTROLLER,
    });
    const regionController = controllerFactory({
      node_type: NodeType.REGION_CONTROLLER,
    });
    const regionAndRackController = controllerFactory({
      node_type: NodeType.REGION_AND_RACK_CONTROLLER,
    });
    expect(isRegion(rackController)).toBe(false);
    expect(isRegion(regionController)).toBe(true);
    expect(isRegion(regionAndRackController)).toBe(false);
  });

  it("handles null and undefined cases", () => {
    expect(isRegion(null)).toBe(false);
    expect(isRegion()).toBe(false);
  });
});

describe("isRegionAndRack", () => {
  it("identifies region+rack controller", () => {
    const rackController = controllerFactory({
      node_type: NodeType.RACK_CONTROLLER,
    });
    const regionController = controllerFactory({
      node_type: NodeType.REGION_CONTROLLER,
    });
    const regionAndRackController = controllerFactory({
      node_type: NodeType.REGION_AND_RACK_CONTROLLER,
    });
    expect(isRegionAndRack(rackController)).toBe(false);
    expect(isRegionAndRack(regionController)).toBe(false);
    expect(isRegionAndRack(regionAndRackController)).toBe(true);
  });

  it("handles null and undefined cases", () => {
    expect(isRegionAndRack(null)).toBe(false);
    expect(isRegionAndRack()).toBe(false);
  });
});
