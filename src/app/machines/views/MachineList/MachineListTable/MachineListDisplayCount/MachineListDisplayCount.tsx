export const MachineListDisplayCount = ({
  machineCount,
  pageSize,
  currentPage,
}: {
  machineCount: number;
  pageSize: number;
  currentPage: number;
}): JSX.Element => {
  const getCurrentPageDisplayedMachineCount = () => {
    if (!machineCount) {
      return null;
    }

    const totalPages = Math.ceil(machineCount / pageSize);

    if (currentPage === totalPages) {
      return pageSize - (totalPages * pageSize - machineCount);
    } else {
      return pageSize;
    }
  };

  return (
    <strong className="machine-list--display-count">
      Showing {getCurrentPageDisplayedMachineCount()} out of {machineCount}{" "}
      machines
    </strong>
  );
};

export default MachineListDisplayCount;
