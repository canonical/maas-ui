#! /usr/bin/env bash

if [ -f .env.local ]; then
    source .env.local
elif [ -f .env ]; then
    source .env
fi

PERCY_TOKEN=$PERCY_TOKEN PERCY_BRANCH=local percy exec -- cypress run --config integrationFolder=cypress/percy
