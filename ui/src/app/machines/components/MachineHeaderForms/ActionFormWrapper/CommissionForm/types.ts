import type { ScriptInput } from "app/store/machine/types/actions";
import type { Script } from "app/store/script/types";

export type CommissionFormValues = {
  enableSSH: boolean;
  skipBMCConfig: boolean;
  skipNetworking: boolean;
  skipStorage: boolean;
  updateFirmware: boolean;
  configureHBA: boolean;
  commissioningScripts: Script[];
  testingScripts: Script[];
  scriptInputs: ScriptInput;
};

export type FormattedScript = Script & {
  displayName: string;
};
