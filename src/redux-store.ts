import { configureStore, getDefaultMiddleware } from "@reduxjs/toolkit";
import { createBrowserHistory } from "history";
import { createReduxHistoryContext } from "redux-first-history";
import createSagaMiddleware from "redux-saga";

import createRootReducer from "./root-reducer";
import rootSaga from "./root-saga";
import WebSocketClient from "./websocket-client";

const { createReduxHistory, routerMiddleware, routerReducer } =
  createReduxHistoryContext({
    history: createBrowserHistory({
      basename: `${import.meta.env.REACT_APP_BASENAME}${
        import.meta.env.REACT_APP_REACT_BASENAME
      }`,
    }),
  });

const reducer = createRootReducer(routerReducer);

const sagaMiddleware = createSagaMiddleware();
const checkMiddleware = import.meta.env.REACT_APP_CHECK_MIDDLEWARE === "true";
const middleware = [
  ...getDefaultMiddleware({
    thunk: false,
    immutableCheck: checkMiddleware,
    serializableCheck: checkMiddleware,
  }),
  sagaMiddleware,
  routerMiddleware,
];

export const store = configureStore({
  reducer,
  middleware,
  devTools: import.meta.env.NODE_ENV !== "production",
});

export const history = createReduxHistory(store);

const websocketClient = new WebSocketClient();

sagaMiddleware.run(rootSaga, websocketClient);
