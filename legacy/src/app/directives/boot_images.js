/* Copyright 2016-2018 Canonical Ltd.  This software is licensed under the
 * GNU Affero General Public License version 3 (see the file LICENSE).
 *
 * Boot images directive.
 */
import angular from "angular";

import bootImagesTmpl from "../partials/boot-images.html";
import { BootResourceType } from "../enum";

/* @ngInject */
export function maasBootImagesStatus(BootResourcesManager) {
  return {
    restrict: "E",
    scope: {},
    template: [
      '<p class="page-header__status" ',
      'data-ng-if="data.region_import_running">',
      '<span class="u-text--loading">',
      '<i class="p-icon--loading u-animation--spin"></i>',
      "Step 1/2: Region controller importing",
      "</span>",
      "</p>",
      '<p class="page-header__status" ',
      'data-ng-if="!data.region_import_running && ',
      'data.rack_import_running">',
      '<span class="u-text--loading">',
      '<i class="p-icon--loading u-animation--spin"></i>',
      "Step 2/2: Rack controller(s) importing",
      "</span>",
      "</p>",
    ].join(""),
    controller: BootImagesStatusController,
  };

  /* @ngInject */
  function BootImagesStatusController($scope) {
    // This controller doesn't start the polling. The
    // `maasBootImages` controller should be used on the page to
    // start the polling. This just presents a nice status spinner
    // when the polling is enabled.
    $scope.data = BootResourcesManager.getData();
  }
}

/* @ngInject */
export function maasBootImages(
  $timeout,
  BootResourcesManager,
  UsersManager,
  ManagerHelperService
) {
  return {
    restrict: "E",
    scope: {
      design: "=?",
    },
    template: bootImagesTmpl,
    controller: BootImagesController,
  };

  /* @ngInject */
  function BootImagesController($scope) {
    const DEFAULT_RELEASE = "bionic";
    const DEFAULT_ARCH = "amd64";

    $scope.loading = true;
    $scope.saving = false;
    $scope.saved = false;
    $scope.selectedUbuntuRelease = "";
    $scope.stopping = false;
    $scope.design = $scope.design || "page";
    $scope.bootResources = BootResourcesManager.getData();
    $scope.ubuntuImages = [];
    $scope.source = {
      isNew: false,
      tooMany: false,
      showingAdvanced: false,
      connecting: false,
      errorMessage: "",
      source_type: "maas.io",
      url: "",
      keyring_filename: "",
      keyring_data: "",
      releases: [],
      arches: [],
      osystems: [],
      selections: {
        changed: false,
        releases: [],
        arches: [],
        osystems: [],
      },
    };
    $scope.ubuntuCoreImages = [];
    $scope.ubuntu_core = {
      changed: false,
      images: [],
    };
    $scope.otherImages = [];
    $scope.other = {
      changed: false,
      images: [],
    };
    $scope.generatedImages = [];
    $scope.customImages = [];
    $scope.ubuntuDeleteId = null;
    $scope.removingImage = null;

    // Return true if the authenticated user is super user.
    $scope.isSuperUser = function () {
      return UsersManager.isSuperUser();
    };

    // Return the overall title icon.
    $scope.getTitleIcon = function () {
      if ($scope.bootResources.resources.length === 0) {
        return "p-icon--success-muted";
      } else {
        return "p-icon--success";
      }
    };

    // Return true if the mirror path section should be shown.
    $scope.showMirrorPath = function () {
      if ($scope.source.source_type === "custom") {
        return true;
      } else {
        return false;
      }
    };

    // Return true if the advanced options are shown.
    $scope.isShowingAdvancedOptions = function () {
      return $scope.source.showingAdvanced;
    };

    // Toggle showing the advanced options.
    $scope.toggleAdvancedOptions = function () {
      $scope.source.showingAdvanced = !$scope.source.showingAdvanced;
    };

    // Return true if both keyring options are set.
    $scope.bothKeyringOptionsSet = function () {
      return (
        $scope.source.keyring_filename.length > 0 &&
        $scope.source.keyring_data.length > 0
      );
    };

    // Return true when the connect button for the mirror path
    // should be shown.
    $scope.showConnectButton = function () {
      return $scope.source.isNew;
    };

    // Called when the source radio changed.
    $scope.sourceChanged = function () {
      var currentSources = $scope.bootResources.ubuntu.sources;
      if (currentSources.length === 0) {
        $scope.source.isNew = true;
      } else {
        var prevNew = $scope.source.isNew;
        $scope.source.isNew =
          $scope.source.source_type !== currentSources[0].source_type;
        if ($scope.source.source_type === "custom") {
          $scope.source.isNew =
            $scope.source.isNew || $scope.source.url !== currentSources[0].url;
        }
        if (prevNew && !$scope.source.isNew) {
          // No longer a new source set url and keyring to
          // original.
          $scope.source.url = currentSources[0].url;
          $scope.source.keyring_filename = currentSources[0].keyring_filename;
          $scope.source.keyring_data = currentSources[0].keyring_data;
        }
        $scope.source.releases = [];
        $scope.source.arches = [];
        $scope.source.osystems = [];
        $scope.source.selections = {
          changed: false,
          releases: [],
          arches: [],
          osystems: [],
        };
      }
      $scope.updateSource();
      $scope.regenerateUbuntuImages();

      // When the source is new and its maas.io automatically
      // fetch the source information.
      if ($scope.source.isNew && $scope.source.source_type === "maas.io") {
        $scope.connect();
      }
    };

    // Return true when the connect button should be disabled.
    $scope.isConnectButtonDisabled = function () {
      if ($scope.source.source_type === "maas.io") {
        return false;
      } else {
        return (
          $scope.bothKeyringOptionsSet() ||
          $scope.source.url.length === 0 ||
          $scope.source.connecting
        );
      }
    };

    // Return the source parameters.
    $scope.getSourceParams = function () {
      if ($scope.source.source_type === "maas.io") {
        return {
          source_type: "maas.io",
        };
      } else {
        return {
          source_type: $scope.source.source_type,
          url: $scope.source.url,
          keyring_filename: $scope.source.keyring_filename,
          keyring_data: $scope.source.keyring_data,
        };
      }
    };

    // Select the default images that should be selected. Current
    // defaults are '18.04 LTS' and 'amd64'.
    $scope.selectDefaults = () => {
      const source = $scope.source;
      if (
        source.releases.some((release) => release.name === DEFAULT_RELEASE) &&
        source.arches.some((arch) => arch.name === DEFAULT_ARCH)
      ) {
        $scope.source.selections.osystems = [
          {
            osystem: "ubuntu",
            release: DEFAULT_RELEASE,
            arches: [DEFAULT_ARCH],
          },
        ];
      }
    };

    // Convert resources data returned from BootResource manager into osystem
    // objects that can be used in the save_ubuntu websocket handler.
    $scope.convertResourcesToOSystems = (resources) => {
      if (!resources) {
        return [];
      }
      return resources.reduce((osystems, resource) => {
        const split = resource.name.split("/");
        const osName = split[0];
        const osRelease = split[1];
        if (resource.rtype === BootResourceType.DOWNLOADED) {
          if (osystems.some((osystem) => osystem.release === osRelease)) {
            return osystems.map((osystem) =>
              osystem.release === osRelease
                ? {
                    osystem: osName,
                    release: osRelease,
                    arches: [...osystem.arches, resource.arch],
                  }
                : osystem
            );
          }
          return [
            ...osystems,
            {
              osystem: osName,
              release: osRelease,
              arches: [resource.arch],
            },
          ];
        }
        return osystems;
      }, []);
    };

    // Connected to the simplestreams endpoint. This only gets the
    // information from the endpoint it does not save it into the
    // database.
    $scope.connect = function () {
      if ($scope.isConnectButtonDisabled()) {
        return;
      }

      var source = $scope.getSourceParams();
      $scope.source.connecting = true;
      $scope.source.releases = [];
      $scope.source.arches = [];
      $scope.source.osystems = [];
      $scope.source.selections.changed = true;
      $scope.source.selections.releases = [];
      $scope.source.selections.arches = [];
      $scope.source.selections.osystems = [];
      $scope.regenerateUbuntuImages();
      BootResourcesManager.fetch(source).then(
        function (data) {
          $scope.source.connecting = false;
          data = angular.fromJson(data);
          $scope.source.releases = data.releases;
          $scope.source.arches = data.arches;
          $scope.source.osystems = $scope.convertResourcesToOSystems(
            $scope.bootResources.resources
          );
          $scope.selectDefaults();
          $scope.regenerateUbuntuImages();
        },
        function (error) {
          $scope.source.connecting = false;
          $scope.source.errorMessage = error;
        }
      );
    };

    // Return true if the connect block should be shown.
    $scope.showConnectBlock = function () {
      return (
        $scope.source.tooMany ||
        ($scope.source.isNew && !$scope.showSelections())
      );
    };

    // Return true if the release and architecture selection
    // should be shown.
    $scope.showSelections = function () {
      return (
        $scope.source.releases.length > 0 && $scope.source.arches.length > 0
      );
    };

    // Return the Ubuntu LTS releases.
    $scope.getUbuntuLTSReleases = function () {
      var releases = $scope.bootResources.ubuntu.releases;
      if ($scope.source.isNew) {
        releases = $scope.source.releases;
      }
      var filtered = [];
      angular.forEach(releases, function (release) {
        if (!release.deleted && release.title.indexOf("LTS") !== -1) {
          filtered.push(release);
        }
      });
      return filtered;
    };

    // Return the Ubuntu non-LTS releases.
    $scope.getUbuntuNonLTSReleases = function () {
      var releases = $scope.bootResources.ubuntu.releases;
      if ($scope.source.isNew) {
        releases = $scope.source.releases;
      }
      var filtered = [];
      angular.forEach(releases, function (release) {
        if (!release.deleted && release.title.indexOf("LTS") === -1) {
          filtered.push(release);
        }
      });
      return filtered;
    };

    // Return the available architectures.
    $scope.getArchitectures = function () {
      var arches = $scope.bootResources.ubuntu.arches;
      if ($scope.source.isNew) {
        arches = $scope.source.arches;
      }
      var filtered = [];
      angular.forEach(arches, function (arch) {
        if (!arch.deleted) {
          filtered.push(arch);
        }
      });
      return filtered;
    };

    // Return true if the release/architecture combination is selected.
    $scope.isOSSelected = (release, archName) => {
      const osystem = $scope.source.selections.osystems.find(
        (osystem) => osystem.release === release
      );
      return osystem && osystem.arches && osystem.arches.includes(archName);
    };

    const getNewSelectedOSs = (releaseName, archName) => {
      const selectedOSs = $scope.source.selections.osystems;
      const releaseInSelected = selectedOSs.find(
        (osystem) => osystem.release === releaseName
      );
      if (!releaseInSelected) {
        // If the release is not in selected, add it to selections with the arch.
        return [
          ...selectedOSs,
          { osystem: "ubuntu", release: releaseName, arches: [archName] },
        ];
      }
      if (!releaseInSelected.arches.includes(archName)) {
        // If release is in selected, but not arch, add the arch to the arches
        // array.
        return selectedOSs.map((osystem) =>
          osystem.release === releaseName
            ? {
                osystem: "ubuntu",
                release: releaseName,
                arches: [...osystem.arches, archName],
              }
            : osystem
        );
      }
      if (releaseInSelected.arches.length === 1) {
        // If release/arch is already selected and it's the last arch,
        // remove OS from selections.
        return selectedOSs.filter((osystem) => osystem.release !== releaseName);
      }
      // If release/arch is already selected and there is more than one
      // arch selected for release, remove arch from arches array.
      return selectedOSs.map((osystem) =>
        osystem.release === releaseName
          ? {
              osystem: "ubuntu",
              release: releaseName,
              arches: osystem.arches.filter((a) => a !== archName),
            }
          : osystem
      );
    };

    // Toggle the selection of the release/architecture combination.
    $scope.toggleSelectedOS = (releaseName, archName) => {
      $scope.source.selections.osystems = getNewSelectedOSs(
        releaseName,
        archName
      );
      $scope.source.selections.changed = true;
      $scope.regenerateUbuntuImages();
    };

    // Returns whether given release/arch combination is unsupported.
    $scope.unsupportedArch = (releaseName, archName) => {
      const release = $scope.source.releases.find(
        (release) => release.name === releaseName
      );
      return (
        release &&
        release.unsupported_arches &&
        release.unsupported_arches.includes(archName)
      );
    };

    // Return true if the images table should be shown.
    $scope.showImagesTable = function () {
      if ($scope.ubuntuImages.length > 0) {
        return true;
      } else {
        // Show the images table source has
        // releases and architectures.
        return (
          $scope.source.arches.length > 0 && $scope.source.releases.length > 0
        );
      }
    };

    // Regenerates the Ubuntu images list for the directive.
    $scope.regenerateUbuntuImages = function () {
      var getResource = function () {
        return null;
      };
      var resources = $scope.bootResources.resources.filter(function (
        resource
      ) {
        var name_split = resource.name.split("/");
        var resource_os = name_split[0];
        return resource.rtype === 0 && resource_os === "ubuntu";
      });
      if (!$scope.source.isNew) {
        getResource = function (release, arch) {
          var i;
          for (i = 0; i < resources.length; i++) {
            // Only care about Ubuntu images.
            var resource = resources[i];
            var name_split = resource.name.split("/");
            var resource_release = name_split[1];
            if (resource_release === release && resource.arch === arch) {
              resources.splice(i, 1);
              return resource;
            }
          }
          return null;
        };
      }

      // Create the images based on the selections.
      $scope.ubuntuImages.length = 0;
      $scope.source.selections.osystems.forEach((osystem) => {
        const release = $scope.source.releases.find(
          (release) => release.name === osystem.release
        );
        osystem.arches.forEach((archName) => {
          const arch = $scope.source.arches.find(
            (arch) => arch.name === archName
          );
          const image = {
            icon: "p-icon--status-queued",
            title: release.title,
            arch: arch.title,
            size: "-",
            status: "Selected for download",
            beingDeleted: false,
            name: release.name,
          };
          const resource = getResource(release.name, arch.name);
          if (angular.isObject(resource)) {
            image.resourceId = resource.id;
            image.icon = "p-icon--status-" + resource.icon;
            image.size = resource.size;
            image.status = resource.status;
            if (resource.downloading) {
              image.icon += " u-animation--pulse";
            }
          }
          $scope.ubuntuImages.push(image);
        });
      });

      // If not a new source and images remain in resources, then
      // those are set to be deleted.
      if (!$scope.source.isNew) {
        angular.forEach(resources, function (resource) {
          var name_split = resource.name.split("/");
          var image = {
            icon: "p-icon--status-failed",
            title: resource.title,
            arch: resource.arch,
            size: resource.size,
            status: "Will be deleted",
            beingDeleted: true,
            name: name_split[1],
          };
          $scope.ubuntuImages.push(image);
        });
      }
    };

    // Regenerates the Ubuntu Core images list for the directive.
    $scope.regenerateUbuntuCoreImages = function () {
      var isUbuntuCore = function (resource) {
        var name_split = resource.name.split("/");
        var resource_os = name_split[0];
        return resource.rtype === 0 && resource_os === "ubuntu-core";
      };
      var resources = $scope.bootResources.resources.filter(isUbuntuCore);
      var getResource = function (release, arch) {
        var i;
        for (i = 0; i < resources.length; i++) {
          // Only care about other images. Removing custom,
          // bootloaders, and Ubuntu images.
          var resource = resources[i];
          var name_split = resource.name.split("/");
          var resource_release = name_split[1];
          if (resource_release === release && resource.arch === arch) {
            resources.splice(i, 1);
            return resource;
          }
        }
        return null;
      };

      // Create the images based on the selections.
      $scope.ubuntuCoreImages.length = 0;
      angular.forEach($scope.ubuntu_core.images, function (ubuntuCoreImage) {
        if (ubuntuCoreImage.checked) {
          var name_split = ubuntuCoreImage.name.split("/");
          var image = {
            icon: "p-icon--status-queued",
            title: ubuntuCoreImage.title,
            arch: name_split[1],
            size: "-",
            status: "Selected for download",
            beingDeleted: false,
          };
          var resource = getResource(name_split[3], name_split[1]);
          if (angular.isObject(resource)) {
            image.icon = "p-icon--status-" + resource.icon;
            image.size = resource.size;
            image.status = resource.status;
            if (resource.downloading) {
              image.icon += " u-animation--pulse";
            }
          }
          $scope.ubuntuCoreImages.push(image);
        }
      });

      // If not a new source and images remain in resources, then
      // those are set to be deleted.
      angular.forEach(resources, function (resource) {
        var image = {
          icon: "p-icon--status-failed",
          title: resource.title,
          arch: resource.arch,
          size: resource.size,
          status: "Will be deleted",
          beingDeleted: true,
        };
        $scope.ubuntuCoreImages.push(image);
      });
    };

    // Regenerates the other images list for the directive.
    $scope.regenerateOtherImages = function () {
      var isOther = function (resource) {
        var name_split = resource.name.split("/");
        var resource_os = name_split[0];
        return (
          resource.rtype === 0 &&
          resource_os !== "ubuntu" &&
          resource_os !== "ubuntu-core" &&
          resource_os !== "custom"
        );
      };
      var resources = $scope.bootResources.resources.filter(isOther);
      var getResource = function (release, arch) {
        var i;
        for (i = 0; i < resources.length; i++) {
          // Only care about other images. Removing custom,
          // bootloaders, and Ubuntu images.
          var resource = resources[i];
          var name_split = resource.name.split("/");
          var resource_release = name_split[1];
          if (resource_release === release && resource.arch === arch) {
            resources.splice(i, 1);
            return resource;
          }
        }
        return null;
      };

      // Create the images based on the selections.
      $scope.otherImages.length = 0;
      angular.forEach($scope.other.images, function (otherImage) {
        if (otherImage.checked) {
          var name_split = otherImage.name.split("/");
          var image = {
            icon: "p-icon--status-queued",
            title: otherImage.title,
            arch: name_split[1],
            size: "-",
            status: "Selected for download",
            beingDeleted: false,
          };
          var resource = getResource(name_split[3], name_split[1]);
          if (angular.isObject(resource)) {
            image.icon = "p-icon--status-" + resource.icon;
            image.size = resource.size;
            image.status = resource.status;
            if (resource.downloading) {
              image.icon += " u-animation--pulse";
            }
          }
          $scope.otherImages.push(image);
        }
      });

      // If not a new source and images remain in resources, then
      // those are set to be deleted.
      angular.forEach(resources, function (resource) {
        var image = {
          icon: "p-icon--status-failed",
          title: resource.title,
          arch: resource.arch,
          size: resource.size,
          status: "Will be deleted",
          beingDeleted: true,
        };
        $scope.otherImages.push(image);
      });
    };

    // Helper for basic image generation.
    $scope._regenerateImages = function (rtype, images) {
      // Create the generated images list.
      images.length = 0;
      angular.forEach($scope.bootResources.resources, function (resource) {
        if (resource.rtype === rtype) {
          var image = {
            icon: "p-icon--status-" + resource.icon,
            title: resource.title,
            arch: resource.arch,
            image_id: resource.id,
            size: resource.size,
            status: resource.status,
          };
          if (resource.downloading) {
            image.icon += " u-animation--pulse";
          }
          images.push(image);
        }
      });
    };

    // Regenerates the generated images list for the directive.
    $scope.regenerateGeneratedImages = function () {
      $scope._regenerateImages(1, $scope.generatedImages);
    };

    // Regenerates the custom images list for the directive.
    $scope.regenerateCustomImages = function () {
      $scope._regenerateImages(2, $scope.customImages);
    };

    // Returns true if at least one LTS is selected.
    $scope.ltsIsSelected = function () {
      var i;
      for (i = 0; i < $scope.ubuntuImages.length; i++) {
        // Must have LTS in the title and not being deleted.
        if (
          !$scope.ubuntuImages[i].beingDeleted &&
          $scope.ubuntuImages[i].title.indexOf("LTS") >= 0
        ) {
          // Must be greater than Ubuntu series 14.
          var series = parseInt($scope.ubuntuImages[i].title.split(".")[0], 10);
          if (series >= 14) {
            return true;
          }
        }
      }
      return false;
    };

    // Returns true if the commission series is selected
    $scope.commissioningSeriesSelected = function () {
      var i;
      for (i = 0; i < $scope.ubuntuImages.length; i++) {
        if (
          !$scope.ubuntuImages[i].beingDeleted &&
          $scope.ubuntuImages[i].name ===
            $scope.bootResources.ubuntu.commissioning_series
        ) {
          return true;
        }
      }
      return false;
    };

    // Return if we are asking about deleting this image.
    $scope.isShowingDeleteConfirm = function (image) {
      return image === $scope.removingImage;
    };

    // Mark the image for deletion.
    $scope.quickRemove = function (image) {
      $scope.removingImage = image;
    };

    // Cancel image deletion.
    $scope.cancelRemove = function () {
      $scope.removingImage = null;
    };

    // Mark the image for deletion.
    $scope.confirmRemove = function (image) {
      if (image === $scope.removingImage) {
        BootResourcesManager.deleteImage({ id: image.image_id });
      }
      $scope.cancelRemove();
    };

    // Return true if the stop import button should be shown.
    $scope.showStopImportButton = function () {
      return $scope.bootResources.region_import_running;
    };

    // Return true if should show save selection button, this
    // doesn't mean it can actually be clicked.
    $scope.showSaveSelection = function () {
      return $scope.showImagesTable();
    };

    // Return true if can save the current selection.
    $scope.canSaveSelection = function () {
      var commissioning_series_being_deleted = false;
      var commissioning_series_arches = 0;
      var i;
      for (i = 0; i < $scope.ubuntuImages.length; i++) {
        if (
          $scope.ubuntuImages[i].name ===
          $scope.bootResources.ubuntu.commissioning_series
        ) {
          commissioning_series_arches++;
        }
      }
      // Only prevent the current commissioning series from
      // being deleted if it isn't the commissioning series isn't
      // available on another architecture.. If the current
      // commissioning series isn't currently selected another
      // LTS may be choosen, downloaded, and configured as the
      // commissioning series.
      for (i = 0; i < $scope.ubuntuImages.length; i++) {
        if (
          $scope.ubuntuImages[i].beingDeleted &&
          $scope.ubuntuImages[i].name ===
            $scope.bootResources.ubuntu.commissioning_series &&
          commissioning_series_arches === 1
        ) {
          commissioning_series_being_deleted = true;
          break;
        }
      }
      return (
        !commissioning_series_being_deleted &&
        !$scope.saving &&
        !$scope.stopping &&
        $scope.ltsIsSelected()
      );
    };

    // Return the text for the save selection button.
    $scope.getSaveSelectionText = function () {
      if ($scope.saving) {
        return "Saving...";
      } else if ($scope.saved) {
        return "Selection updated";
      } else {
        return "Update selection";
      }
    };

    // Return true if can stop current import.
    $scope.canStopImport = function () {
      return !$scope.saving && !$scope.stopping;
    };

    // Return the text for the stop import button.
    $scope.getStopImportText = function () {
      if ($scope.stopping) {
        return "Stopping...";
      } else {
        return "Stop import";
      }
    };

    // Called to stop the import.
    $scope.stopImport = function () {
      if (!$scope.canStopImport()) {
        return;
      }

      $scope.stopping = true;
      BootResourcesManager.stopImport().then(function () {
        $scope.stopping = false;
      });
    };

    // Save the selections into boot selections.
    $scope.saveSelection = function () {
      if (!$scope.canSaveSelection()) {
        return;
      }

      var params = $scope.getSourceParams();
      params.osystems = $scope.source.selections.osystems;
      $scope.saving = true;
      BootResourcesManager.saveUbuntu(params).then(function () {
        $scope.saving = false;
        $scope.source.isNew = false;
        $scope.source.selections.changed = false;
        $scope.savedTimeout();
        $scope.updateSource();
      });
    };

    $scope.savedTimeout = function () {
      $scope.saved = true;
      $timeout(() => ($scope.saved = false), 3000);
    };

    // Re-create an array with the new objects using the old
    // selected array.
    $scope.getNewSelections = function (newObjs, oldSelections) {
      var newSelections = [];
      angular.forEach(newObjs, function (obj) {
        angular.forEach(oldSelections, function (selection) {
          if (obj.name === selection.name) {
            newSelections.push(obj);
          }
        });
      });
      return newSelections;
    };

    // Update the source information.
    $scope.updateSource = function () {
      // Do not update if the source is new.
      if ($scope.source.isNew) {
        return;
      }

      var source_len = $scope.bootResources.ubuntu.sources.length;
      if (source_len === 0) {
        $scope.source.isNew = true;
        $scope.source.source_type = "custom";
        $scope.source.errorMessage = "Currently no source exists.";
      } else if (source_len === 1) {
        var source = $scope.bootResources.ubuntu.sources[0];
        $scope.source.source_type = source.source_type;
        if (source.source_type === "maas.io") {
          $scope.source.url = "";
          $scope.source.keyring_filename = "";
          $scope.source.keyring_data = "";
        } else {
          $scope.source.url = source.url;
          $scope.source.keyring_filename = source.keyring_filename;
          $scope.source.keyring_data = source.keyring_data;
        }
        $scope.source.releases = $scope.bootResources.ubuntu.releases;
        $scope.source.arches = $scope.bootResources.ubuntu.arches;
        $scope.source.osystems = $scope.convertResourcesToOSystems(
          $scope.bootResources.resources
        );
        if (!$scope.source.selections.changed) {
          // User didn't make a change update to the
          // current selections server side.
          $scope.source.selections.osystems = $scope.source.osystems.filter(
            (os) => os.osystem === "ubuntu"
          );
          $scope.source.selections.releases = $scope.source.releases.filter(
            function (obj) {
              return obj.checked;
            }
          );
          $scope.source.selections.arches = $scope.source.arches.filter(
            function (obj) {
              return obj.checked;
            }
          );
        } else {
          // Update the objects to be the new objects, with
          // the same selections.
          $scope.source.selections.releases = $scope.getNewSelections(
            $scope.source.releases,
            $scope.source.selections.releases
          );
          $scope.source.selections.arches = $scope.getNewSelections(
            $scope.source.arches,
            $scope.source.selections.arches
          );
        }
        $scope.regenerateUbuntuImages();
      } else {
        // Having more than one source prevents modification
        // of the sources.
        $scope.source.tooMany = true;
        $scope.source.releases = $scope.bootResources.ubuntu.releases;
        $scope.source.arches = $scope.bootResources.ubuntu.arches;
        $scope.source.selections.releases = $scope.source.releases.filter(
          function (obj) {
            return obj.checked;
          }
        );
        $scope.source.selections.arches = $scope.source.arches.filter(function (
          obj
        ) {
          return obj.checked;
        });
        $scope.source.errorMessage =
          "More than one image source exists. UI does not " +
          "support modification of sources when more than " +
          "one has been defined. Used the API to adjust " +
          "your sources.";
        $scope.regenerateUbuntuImages();
      }
    };

    // Toggle the selection of Ubuntu Core images.
    $scope.toggleUbuntuCoreSelection = function (image) {
      $scope.ubuntu_core.changed = true;
      image.checked = !image.checked;
      $scope.regenerateUbuntuCoreImages();
    };

    // Save the Ubuntu Core image selections into boot selections.
    $scope.saveUbuntuCoreSelection = function () {
      var params = {
        images: $scope.ubuntu_core.images
          .filter(function (image) {
            return image.checked;
          })
          .map(function (image) {
            return image.name;
          }),
      };
      $scope.saving = true;
      BootResourcesManager.saveUbuntuCore(params).then(function () {
        $scope.saving = false;
      });
    };

    // Toggle the selection of other images.
    $scope.toggleOtherSelection = function (image) {
      $scope.other.changed = true;
      image.checked = !image.checked;
      $scope.regenerateOtherImages();
    };

    // Save the other image selections into boot selections.
    $scope.saveOtherSelection = function () {
      var params = {
        images: $scope.other.images
          .filter(function (image) {
            return image.checked;
          })
          .map(function (image) {
            return image.name;
          }),
      };
      $scope.saving = true;
      BootResourcesManager.saveOther(params).then(function () {
        $scope.saving = false;
      });
    };

    // Return True if the Ubuntu image can be removed.
    $scope.canBeRemoved = function (image) {
      // Image must have a resourceId to be able to be removed.
      if (!angular.isNumber(image.resourceId)) {
        return false;
      }

      // If the release or architecture is set to deleted
      // then this image can be deleted.
      var i;
      var releases = $scope.bootResources.ubuntu.releases;
      var arches = $scope.bootResources.ubuntu.arches;
      for (i = 0; i < releases.length; i++) {
        var release = releases[i];
        if (release.deleted && image.title === release.title) {
          return true;
        }
      }
      for (i = 0; i < arches.length; i++) {
        var arch = arches[i];
        if (arch.deleted && image.arch === arch.name) {
          return true;
        }
      }
      return false;
    };

    // Deletes the give image.
    $scope.deleteImage = function (image) {
      if (angular.isObject(image)) {
        $scope.ubuntuDeleteId = image.resourceId;
      } else {
        $scope.ubuntuDeleteId = null;
      }
    };

    // Deletes the give image.
    $scope.confirmDeleteImage = function () {
      // Delete the image by its resourceId.
      BootResourcesManager.deleteImage({ id: $scope.ubuntuDeleteId });
      $scope.ubuntuDeleteId = null;
    };

    // Start polling now that the directive is viewable and ensure
    // the UserManager is loaded.
    var ready = 2;
    BootResourcesManager.startPolling().then(function () {
      ready -= 1;
      if (ready === 0) {
        $scope.loading = false;
      }
    });
    ManagerHelperService.loadManager($scope, UsersManager).then(function () {
      ready -= 1;
      if (ready === 0) {
        $scope.loading = false;
      }
    });

    // Update the source information with the ubuntu source
    // information changes.
    $scope.$watch("bootResources.ubuntu", function () {
      if (!angular.isObject($scope.bootResources.ubuntu)) {
        return;
      }
      $scope.updateSource();
    });

    // Regenerate the images array when the resources change.
    $scope.$watch("bootResources.resources", function () {
      if (!angular.isArray($scope.bootResources.resources)) {
        return;
      }
      $scope.regenerateUbuntuImages();
      $scope.regenerateUbuntuCoreImages();
      $scope.regenerateOtherImages();
      $scope.regenerateGeneratedImages();
      $scope.regenerateCustomImages();
    });

    $scope.$watch("bootResources.ubuntu_core_images", function () {
      var images = $scope.bootResources.ubuntu_core_images;
      if (!angular.isArray(images)) {
        return;
      }
      if (!$scope.ubuntu_core.changed) {
        $scope.ubuntu_core.images = images;
      }
      $scope.regenerateUbuntuCoreImages();
    });

    $scope.$watch("bootResources.other_images", function () {
      if (!angular.isArray($scope.bootResources.other_images)) {
        return;
      }
      if (!$scope.other.changed) {
        $scope.other.images = $scope.bootResources.other_images;
      }
      $scope.regenerateOtherImages();
    });

    // Stop polling when the directive is destroyed.
    $scope.$on("$destroy", function () {
      BootResourcesManager.stopPolling();
    });
  }
}
