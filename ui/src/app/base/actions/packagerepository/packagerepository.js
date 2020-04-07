import { createStandardActions } from "app/utils/redux";

const packagerepository = createStandardActions("packagerepository");

packagerepository.fetch = () => ({
  type: "FETCH_PACKAGEREPOSITORY",
  meta: {
    model: "packagerepository",
    method: "list",
  },
});

export default packagerepository;
