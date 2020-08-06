const userDataUpload = () => ({
  link: ($scope, element) => {
    element.on("change", () => {
      const files = element[0].files;
      const reader = new FileReader();

      reader.onload = function (e) {
        const text = e.target.result;
        $scope.$parent.deployOptions.userData = text;
        $scope.$parent.$apply();
      };

      reader.readAsText(files[0]);
    });
  },
});

export default userDataUpload;
