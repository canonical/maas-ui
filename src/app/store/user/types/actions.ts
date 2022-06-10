import type { User } from "./base";
import type { UserMeta } from "./enum";

export type CreateParams = {
  email: User["email"];
  is_superuser?: User["is_superuser"];
  last_name?: User["last_name"];
  password1: string;
  password2: string;
  username: User["username"];
};

export type UpdateParams = {
  [UserMeta.PK]: User[UserMeta.PK];
  email: User["email"];
  is_superuser?: User["is_superuser"];
  last_name?: User["last_name"];
  username: User["username"];
};
