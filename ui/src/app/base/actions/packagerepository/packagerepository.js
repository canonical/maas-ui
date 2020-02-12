import { createStandardActions } from "app/utils/redux";

const packagerepository = createStandardActions("packagerepository");

packagerepository.fetch = () => ({
  type: "FETCH_PACKAGEREPOSITORY",
  payload: {
    params: { limit: 50 }
  },
  meta: {
    model: "packagerepository",
    method: "list"
  }
});

export default packagerepository;
