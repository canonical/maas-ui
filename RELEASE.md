# Release Process

## Tracking MAAS core
When MAAS core releases an initial release candidate (e.g. `2.8.0-rc1`), the following should occur:

1. A new branch is created on the `maas-ui` repo to track the new MAAS release (e.g. `2.8`).
2. The major version of `maas-ui` should be incremented on master (e.g. `0.1.2` -> `1.0.0`).
3. Any features in progress not intended for the release, should be removed or disabled on the release branch.
4. Bugfixes should be made on master and backported to release branches where needed.

### Note
No new dependencies (unless in the case of a CVE), or features should land in the release branch once created.

### `maas-ui` to `maas-core` version mapping
Currently `maas-ui` map to `maas-core` versions in the following way:

| maas-ui | maas-core |
|:-------:|:---------:|
| 0.x.x   | 2.7       |
| 1.x.x   | 2.8       |

## Creating a release

### Semver
Please try to adhere to semantic versioning when creating a release. Although release drafter will just increment the patch, you should consider if the release contains new features, in which case the minor version should be incremented. For more details, refer to the [semantic versioning spec](https://semver.org/).

### Process

1. Create a new local branch e.g. release-0.1.2.
2. Run `yarn release [version]` where version is in the form `0.1.2`. This will build a tarball in `ui/dist`, bump the version in `ui/package.json` and create a tag with a 'v' prefix. You will also need to manually bump the version in the root `package.json`.
3. Propose this against the latest release branch (e.g. 2.8) and merge.
4. From the [releases page](https://github.com/canonical-web-and-design/maas-ui/releases), edit the draft release. Feel free to edit this to make the changelog more readable. Also make sure to choose the correct target branch if releasing fixes intended for an older API version.
5. Add the tarball created earlier from `ui/dist` and create the release.
6. Email the MAAS & Design list with the changelog, with the subject "new maas-ui release - [version]", including the hash and tag of the release.
