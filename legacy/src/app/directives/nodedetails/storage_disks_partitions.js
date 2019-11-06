import disksPartitionsTmpl from "../../partials/nodedetails/storage/disks-partitions.html";

const storageDisksPartitions = () => ({
  restrict: "E",
  template: disksPartitionsTmpl,
  link: scope => {
    scope.BASENAME = process.env.BASENAME;
    scope.REACT_BASENAME = process.env.REACT_BASENAME;
  }
});

export default storageDisksPartitions;
