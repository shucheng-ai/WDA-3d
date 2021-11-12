#!/bin/bash

if [ "$1" == "en" ]
then
  echo "build en docker:"
  docker build -f Dockerfile.en -t cyborg/node14:0.0 . --no-cache
else
  echo "build cn docker:"
  docker build -f Dockerfile.cn -t cyborg/node14:0.0 . --no-cache
fi

docker tag cyborg/node14:0.0 cyborg/node14:latest
echo "build docker ok!"
