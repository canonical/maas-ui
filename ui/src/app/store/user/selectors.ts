import { UserMeta } from "app/store/user/types";
import type { User, UserState } from "app/store/user/types";
import { generateBaseSelectors } from "app/store/utils";

const searchFunction = (user: User, term: string) =>
  user.username.includes(term) ||
  user.email.includes(term) ||
  user.last_name.includes(term);

const selectors = generateBaseSelectors<UserState, User, UserMeta.PK>(
  UserMeta.MODEL,
  UserMeta.PK,
  searchFunction
);

export default selectors;
