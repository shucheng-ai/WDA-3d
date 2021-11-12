# build v2
# bash npm_build.sh 
# build v1
# bash npm_build.sh v1


cd docker

if [ "$1" == "v1" ]
then
  echo "build v1"
  docker-compose -f docker-compose.v1.build.yml up
else
  echo "build v2"
  docker-compose -f docker-compose.build.yml up
fi
