import { Bakery, BakeryStorage } from "@canonical/macaroon-bakery";

import { store } from "index";
import { status as statusActions } from "app/base/actions";

// Initialise Macaroon Bakery singleton
const visit = (error) => {
  const url = error.Info.VisitURL;
  store.dispatch(statusActions.externalLoginURL({ url }));
  window.open(url, "_blank");
};

const bakery = new Bakery({
  storage: new BakeryStorage(localStorage, {}),
  visitPage: visit,
});

export default bakery;
