export type Choice = [string, string];

export type PowerField = {
  choices: Choice[];
  default: number | string;
  field_type: "choice" | "mac_address" | "password" | "string";
  label: string;
  name: string;
  required: boolean;
  scope: "bmc" | "node";
};

export type PowerType = {
  chassis: boolean;
  defaults?: {
    cores: number;
    memory: number;
    storage: number;
  };
  description: string;
  driver_type: "pod" | "power";
  fields: PowerField[];
  missing_packages: string[];
  name: string;
  queryable: boolean;
};
