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

export const getVMHostCount = (
  kvmCount: number,
  selectedKVMCount: number
): string => {
  const kvmCountString = `${kvmCount} VM host${kvmCount === 1 ? "" : "s"}`;
  if (selectedKVMCount > 0) {
    if (kvmCount === selectedKVMCount) {
      return "All VM hosts selected";
    }
    return `${selectedKVMCount} of ${kvmCountString} selected`;
  }
  return `${kvmCountString} available`;
};
