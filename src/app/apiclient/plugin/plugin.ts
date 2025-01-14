import type { Plugin, IR } from "@hey-api/openapi-ts";

import type { Config } from "./types";

export const handler: Plugin.Handler<Config> = ({ context }) => {
  context.subscribe("before", () => {
    if (!context.ir.paths) {
      return;
    }
    const paths: IR.PathsObject = context.ir.paths;
    Object.keys(paths).forEach((path: string) => {
      const pathMethods: IR.PathItemObject =
        paths[path as keyof IR.PathsObject];

      Object.keys(pathMethods).forEach((method: string) => {
        const methodData: IR.OperationObject = pathMethods[
          method as keyof IR.PathItemObject
        ] as IR.OperationObject;

        methodData.id = methodData.id.split("Maas")[0];
      });
    });
  });
};
