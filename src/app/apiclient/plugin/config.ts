import type { Plugin } from "@hey-api/openapi-ts";

import { handler } from "./plugin";
import type { Config } from "./types";

export const defaultConfig: Plugin.Config<Config> = {
    _dependencies: ["@hey-api/typescript", "@hey-api/sdk"],
    _handler: handler,
    _handlerLegacy: () => {},
    name: "custom-name-plugin",
};

export const defineConfig: Plugin.DefineConfig<Config> = (config) => ({
    ...defaultConfig,
    ...config,
});
