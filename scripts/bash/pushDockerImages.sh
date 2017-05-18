#!/bin/bash

if [ "$BRANCH" = "master" ] || [ "$BRANCH" = "rc" ] ; then
  docker build -f ./scripts/docker/Dockerfile -t heschoon/$REPO_NAME:$BRANCH.$(($BUILD_NUMBER % 20)) .
  docker push heschoon/$REPO_NAME:$BRANCH.$(($BUILD_NUMBER % 20))
  docker tag -f heschoon/$REPO_NAME:$BRANCH.$(($BUILD_NUMBER % 20)) heschoon/$REPO_NAME:$BRANCH.latest
  docker push heschoon/$REPO_NAME:$BRANCH.latest
else
  echo "no image push"
fi
