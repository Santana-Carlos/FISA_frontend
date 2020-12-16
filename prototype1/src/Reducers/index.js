import userReducer from "./User";
import passReducer from "./Pass";
import rolReducer from "./Rol";
import tokenReducer from "./Token";
import logReducer from "./Logged";
import { combineReducers } from "redux";
import { persistReducer } from "redux-persist";
import session from "redux-persist/es/storage/session";

const persistConfig = {
  key: "root",
  storage: session,
  whitelist: ["user", "pass", "token", "isLog", "rol"],
};

const allReducer = combineReducers({
  user: userReducer,
  pass: passReducer,
  rol: rolReducer,
  token: tokenReducer,
  isLog: logReducer,
});

export default persistReducer(persistConfig, allReducer);
