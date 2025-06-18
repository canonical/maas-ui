import { http, HttpResponse } from "msw";

import { packageRepository as packageRepositoryFactory } from "../factories";
import { BASE_URL } from "../utils";

import type {
  ListPackageRepositoriesError,
  ListPackageRepositoriesResponse,
} from "@/app/apiclient";

const mockPackageRepositories: ListPackageRepositoriesResponse = {
  items: [
    packageRepositoryFactory(),
    packageRepositoryFactory(),
    packageRepositoryFactory(),
  ],
  total: 3,
};

const mockPackageRepositoriesError: ListPackageRepositoriesError = {
  code: 500,
  message: "Internal Server Error",
  kind: "Error", // This will always be 'Error' for every error response
};

const packageRepositoriesResolvers = {
  listPackageRepositories: {
    resolved: false,
    handler: (
      data: ListPackageRepositoriesResponse = mockPackageRepositories
    ) =>
      http.get(`${BASE_URL}MAAS/a/v3/package_repositories`, () => {
        packageRepositoriesResolvers.listPackageRepositories.resolved = true;
        return HttpResponse.json(data);
      }),
    error: (
      error: ListPackageRepositoriesError = mockPackageRepositoriesError
    ) =>
      http.get(`${BASE_URL}MAAS/a/v3/package_repositories`, () => {
        packageRepositoriesResolvers.listPackageRepositories.resolved = true;
        return HttpResponse.json(error, { status: error.code });
      }),
  },
};

export { packageRepositoriesResolvers, mockPackageRepositories };
