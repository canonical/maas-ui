---
name: Build upload failure
about: ''
title: '{{ env.BRANCH_NAME }} build upload failed'
assignees: ''

---

Uploading the build to the assets server has [failed](https://github.com/{{ env.REPO }}/actions/runs/{{ env.RUN_ID }}) for the {{ env.BRANCH_NAME }} branch.
