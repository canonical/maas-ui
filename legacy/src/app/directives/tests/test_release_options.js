/* Copyright 2016 Canonical Ltd.  This software is licensed under the
 * GNU Affero General Public License version 3 (see the file LICENSE).
 *
 * Unit tests for release options directive.
 */

import MockWebSocket from "testing/websocket";

describe("maasReleaseOptions", function() {
  // Load the MAAS module.
  beforeEach(angular.mock.module("MAAS"));

  // Preload the $templateCache with empty contents. We only test the
  // controller of the directive, not the template.
  var $templateCache;
  beforeEach(inject(function($injector) {
    $templateCache = $injector.get("$templateCache");
    $templateCache.put("static/partials/directives/release-options.html?v=undefined", "");
  }));

  // Load the required managers.
  beforeEach(inject(function($injector) {
    // Mock buildSocket so an actual connection is not made.
    let RegionConnection = $injector.get("RegionConnection");
    let webSocket = new MockWebSocket();
    spyOn(RegionConnection, "buildSocket").and.returnValue(webSocket);
  }));

  // Create a new scope before each test.
  var $scope;
  beforeEach(inject(function($rootScope) {
    $scope = $rootScope.$new();
  }));

  // Return the compiled directive with the items from the scope.
  function compileDirective(obj) {
    if (angular.isUndefined(obj)) {
      obj = "";
    }
    var directive;
    var html = [
      "<div>",
      '<maas-release-options local-options="localOptions">',
      '</maas-release-options>',
      "</div>"
    ].join("");

    // Compile the directive.
    inject(function($compile) {
      directive = $compile(html)($scope);
    });

    // Perform the digest cycle to finish the compile.
    $scope.$digest();
    return directive.find("maas-release-options");
  }

  it("sets initial variables", () => {
    const directive = compileDirective();
    const scope = directive.isolateScope();
    expect(scope.loading).toBe(true);
    expect(scope.localOptions).toStrictEqual({
      enableDiskErasing: false,
      quickErase: false,
      secureErase: false
    });
  });

  describe("onEraseChange", () => {
    it(`sets all options to false if localOptions.enableDiskErasing
      is false`, () => {
        const directive = compileDirective();
        const scope = directive.isolateScope();
        scope.globalOptions = {
          enableDiskErasing: false,
          quickErase: true,
          secureErase: true
        }
        scope.localOptions = {
          enableDiskErasing: false,
          quickErase: true,
          secureErase: true
        };
        scope.onEraseChange();
        expect(scope.localOptions).toStrictEqual({
          enableDiskErasing: false,
          quickErase: false,
          secureErase: false
        });
      });

    it(`sets options to global defaults if localOptions.enableDiskErasing
      is true`, () => {
        const directive = compileDirective();
        const scope = directive.isolateScope();
        scope.globalOptions = {
          enableDiskErasing: false,
          quickErase: true,
          secureErase: true
        }
        scope.localOptions = {
          enableDiskErasing: true,
          quickErase: false,
          secureErase: false
        };
        scope.onEraseChange();
        expect(scope.localOptions).toStrictEqual({
          enableDiskErasing: true,
          quickErase: true,
          secureErase: true
        });
      });
  });
});
