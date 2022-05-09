import type { Controller } from "app/store/controller/types";
import { argPath } from "app/utils";

const urls = {
  controller: {
    index: argPath<{ id: Controller["system_id"] }>("/controller/:id"),
  },
  controllers: {
    index: "/controllers",
  },
};

export default urls;
