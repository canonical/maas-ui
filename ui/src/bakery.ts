import { Bakery, BakeryStorage } from "@canonical/macaroon-bakery";

import { actions as statusActions } from "app/store/status";
import { store } from "index";

// Initialise Macaroon Bakery singleton
const visit = (error: { Info: { VisitURL: string } }) => {
  const url = error.Info.VisitURL;
  store.dispatch(statusActions.externalLoginURL({ url }));
  window.open(url, "_blank");
};

const bakery = new Bakery({
  storage: new BakeryStorage(localStorage, {}),
  visitPage: visit,
});

export default bakery;
