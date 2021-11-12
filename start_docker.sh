#!/bin/bash

echo "$1"

if [ "$1" == "shell" ]
then
  echo "open shell:"
  path=$(cd "$(dirname "$0")";pwd)
  docker run -it --name cyborg-web-shell --rm -p 8088:8088 -v $path:/beaver-3d -v /var/run/docker.sock:/var/run/docker.sock cyborg/node14 /bin/bash
else
  echo "run npm server:"
  cd docker
  docker-compose up
fi


