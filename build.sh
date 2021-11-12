## $1 v1老版本  v2新版本
## $2 cn en  指定docker依赖源版本

echo "building web-3d"
echo "$1"

## 这里 新版本不需要再次build_docker的原因是 此docker和新版本WDA一样，可以共用一个，所以省略了。
if [ "$1" == "v1" ]
then
  bash build_docker.sh "$2"
fi
bash npm_install.sh
bash npm_build.sh $1

