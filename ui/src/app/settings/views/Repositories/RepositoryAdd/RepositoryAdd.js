import { useParams } from "react-router";

import RepositoryForm from "../RepositoryForm";

export const RepositoryAdd = () => {
  const { type } = useParams();
  return <RepositoryForm type={type} />;
};

export default RepositoryAdd;
