export const formatHostType = (type: string): string => {
  switch (type) {
    case "lxd":
      return "LXD";
    case "virsh":
      return "Virsh";
    default:
      return type;
  }
};
