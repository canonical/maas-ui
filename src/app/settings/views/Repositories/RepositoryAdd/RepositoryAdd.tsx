import { useParams } from "react-router-dom";

import RepositoryForm from "../RepositoryForm";

export const RepositoryAdd = (): JSX.Element => {
  const { type } = useParams<{ type?: "ppa" | "repository" }>();
  if (!type) {
    return <>A repository type must be provided.</>;
  }
  return <RepositoryForm type={type} />;
};

export default RepositoryAdd;
