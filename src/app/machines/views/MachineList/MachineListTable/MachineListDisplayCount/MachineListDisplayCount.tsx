export const getCurrentPageDisplayedMachineCount = (
  machineCount: number | null,
  pageSize: number,
  currentPage: number
): number => {
  if (!machineCount) {
    return 0;
  }

  const totalPages = Math.ceil(machineCount / pageSize);

  if (currentPage === totalPages) {
    return pageSize - (totalPages * pageSize - machineCount);
  } else {
    return pageSize;
  }
};

export const MachineListDisplayCount = ({
  machineCount,
  pageSize,
  currentPage,
}: {
  machineCount: number;
  pageSize: number;
  currentPage: number;
}): JSX.Element => {
  return (
    <strong className="machine-list--display-count">
      Showing{" "}
      {getCurrentPageDisplayedMachineCount(machineCount, pageSize, currentPage)}{" "}
      out of {machineCount} machines
    </strong>
  );
};

export default MachineListDisplayCount;
