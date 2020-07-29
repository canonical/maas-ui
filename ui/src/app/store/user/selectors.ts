import { generateBaseSelectors } from "app/store/utils";
import type { User, UserState } from "app/store/user/types";

const searchFunction = (user: User, term: string) =>
  user.username.includes(term) ||
  user.email.includes(term) ||
  user.last_name.includes(term);

const selectors = generateBaseSelectors<UserState, User, "id">(
  "user",
  "id",
  searchFunction
);

export default selectors;
