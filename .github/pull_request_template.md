## Done

- Itemised list of what was changed by this PR.

## QA

### MAAS deployment

To run this branch you will need access to one of the following MAAS deployments:

- [Karura](/HACKING.md#karura)
- [Bolla](/HACKING.md#bolla)
- [A development MAAS](/HACKING.md#development-deployment)
- [A local snap MAAS](/HACKING.md#snap-deployment) (this will not usually have machines)

### Running the branch

You can run this branch by:

- Serving with [dotrun](/HACKING.md#maas-ui-development-setup)
- [Building in a development MAAS](/HACKING.md#running-maas-ui-from-a-development-maas)

### QA steps

- Steps for QA.

## Fixes

Fixes: # .

## Launchpad issue

Related Launchpad maas issue in the form `lp#number`.

## Backports

In general, please propose fixes against *master* rather than release branches (e.g. 2.7), unless the fix is only applicable for that specific release. Please apply backport labels to the PR (e.g. "Backport 2.7") for the appropriate releases to target.

