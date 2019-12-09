# Release Process

1. Create a new branch e.g. release-0.1.2.
2. Run `yarn release [version]` where version is in the form `0.1.2`. This will build a tarball in `ui/dist`, bump the version in package.json and create a tag with a 'v' prefix.
3. Propose and merge branch.
4. From the [releases page](https://github.com/canonical-web-and-design/maas-ui/releases), edit the draft release. Feel free to edit this to make the changelog more readable.
5. Add the tarball created earlier from `ui/dist` and create the release.
6. Email the MAAS & Design list with the changelog, with the subject "new maas-ui release - [version]", including the hash and tag of the release.
