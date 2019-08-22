import React from "react";

import { useParams } from "app/base/hooks";
import RepositoryForm from "../RepositoryForm";

export const RepositoryAdd = () => {
  const { type } = useParams();
  return <RepositoryForm type={type} />;
};

export default RepositoryAdd;
