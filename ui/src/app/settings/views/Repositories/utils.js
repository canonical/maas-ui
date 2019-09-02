export const getRepoDisplayName = repo => {
  if (repo.default && repo.name === "main_archive") {
    return "Ubuntu archive";
  } else if (repo.default && repo.name === "ports_archive") {
    return "Ubuntu extra architectures";
  }
  return repo.name;
};
