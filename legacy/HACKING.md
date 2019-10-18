# Running
1. Copy .env to .env.local and edit the variables to point to your MAAS.
2. run `yarn start`
3. In another tab, login to MAAS using the old maas login.
4. Copy the csrf token (cookie) from your other tab into the current csrf token on the tab running the legacy client. (this is only necessary until we proxy between legacy-ui and maas-ui).
