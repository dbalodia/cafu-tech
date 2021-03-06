#!/bin/sh
# Steps for CI

npm version patch

VERSION=$(node -p -e "require('./package.json').version")

git push git@github.com:dbalodia/cafu-tech.git HEAD:master


export APPNAME=cafu-tech

export VERSIONEDAPPNAME=$APPNAME:$VERSION

check_and_install_npm_deps(){
    if ! [ -x "$(command -v $1)" ]; then
        echo "$1 not installed, trying to install the latest version globally ====>>"
        sudo npm install --save-dev $1
        echo "$1 installed successfully"
    else
        echo "$1 already installed :-)"
    fi
}

for i in babel-cli babel-preset-es2017 babel-preset-stage-0 babel-plugin-transform-es2015-arrow-functions babel-plugin-transform-es2015-modules-commonjs
    do
        check_and_install_npm_deps $i
    done


sudo npm install --only=prod

sudo rm -rf dist/

sudo npm run build

sudo cp -r node_modules/ dist/node_modules

cd dist/

echo "image building"
sudo docker build -t $APPNAME .

echo "app name is"
echo $APPNAME

echo "running docker container"
#docker run -it --rm --name my-cafu-tech-app $APPNAME
sudo docker run -d -p 3012:3012 -v /home/ubuntu/app/services-configurations/application.yaml:/etc/properties/app/application.yaml -v /home/ubuntu/app/services-configurations/cafu-service.yaml:/etc/properties/service/cafu-service.yaml -v /var/logs/application:/var/log/applogs -e GLOBAL_APP_SETTING_PATH=/etc/properties/app/application.yaml -e SERVICE_APP_SETTING_PATH=/etc/properties/service/cafu-service.yaml -e LOG_FILE_SETTING_PATH=/var/log/applogs/application.logs --restart always --name my-cafu-tech-app $APPNAME



