import { useParams } from "react-router";

import RepositoryForm from "../RepositoryForm";

export const RepositoryAdd = (): React.ReactElement => {
  const { type } = useParams<{ type?: "ppa" | "repository" }>();
  if (!type) {
    return <>A repository type must be provided.</>;
  }
  return <RepositoryForm type={type} />;
};

export default RepositoryAdd;
