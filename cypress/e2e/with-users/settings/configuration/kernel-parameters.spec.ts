import { generateMAASURL } from "../../../utils";

const getSaveButton = () => cy.findByRole("button", { name: /Save/i });
const getKernelParamsInput = () =>
  cy.findByLabelText(/Global boot parameters always passed to the kernel/i);

context("Settings Kernel parameters", () => {
  beforeEach(() => {
    cy.login();
    cy.visit(generateMAASURL("/settings/configuration/kernel-parameters"));
  });

  afterEach(() => {
    getKernelParamsInput().clear();
    getSaveButton().click();
    getSaveButton().should("be.disabled");
  });

  it("can update kernel parameters", () => {
    const kernelParams = "sysrq_always_enabled dyndbg='file drivers/usb/*";
    getKernelParamsInput().clear().type(kernelParams);
    getSaveButton().click();
    // make sure the button is disabled after submission
    getSaveButton().should("be.disabled");
    getKernelParamsInput().should("have.value", kernelParams);
    cy.reload();
    // check that it has the same value after reload
    getKernelParamsInput().should("have.value", kernelParams);
  });
});
