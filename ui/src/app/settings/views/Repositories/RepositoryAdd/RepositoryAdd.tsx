import { useParams } from "react-router";

import RepositoryForm from "../RepositoryForm";

export const RepositoryAdd = (): JSX.Element => {
  const { type } = useParams<{ type: "ppa" | "repository" }>();
  return <RepositoryForm type={type} />;
};

export default RepositoryAdd;
