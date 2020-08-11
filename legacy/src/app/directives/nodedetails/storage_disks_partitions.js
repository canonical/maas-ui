import { BASENAME, REACT_BASENAME } from "@maas-ui/maas-ui-shared";
import disksPartitionsTmpl from "../../partials/nodedetails/storage/disks-partitions.html";

const storageDisksPartitions = () => ({
  restrict: "E",
  template: disksPartitionsTmpl,
  link: (scope) => {
    scope.BASENAME = BASENAME;
    scope.REACT_BASENAME = REACT_BASENAME;
  },
});

export default storageDisksPartitions;
