import { test, expect } from "@playwright/test";
import docsUrls from "../src/app/base/docsUrls";

const urls = Object.values(docsUrls);

test.describe("loads the page", () => {
  urls.forEach((url) => {
    test(`${url}`, async () => {
      const docsPage = fetch(url);
      const resCode = await docsPage.then((res) => res.status);
      expect(resCode).toBe(200);
    });
  });
});

test.describe("is a direct link", () => {
  urls.forEach((url) => {
    test(`${url}`, async () => {
      const docsPage = fetch(url, { redirect: "manual" });
      const resCode = await docsPage.then((res) => res.status);
      expect(resCode).toBe(200);
    });
  });
});
