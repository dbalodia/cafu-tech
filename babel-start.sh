#!/bin/sh
# Steps for CI

npm version patch

VERSION=$(node -p -e "require('./package.json').version")

git push git@github.com:dbalodia/cafu-tech.git HEAD:develop


export APPNAME=lead-management-service

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

sudo docker build -t $APPNAME .

sudo docker tag $APPNAME $REGISTRY_PATH/$APPNAME
sudo docker tag $APPNAME $REGISTRY_PATH/$VERSIONEDAPPNAME

echo "app name is"
echo $APPNAME

echo "Registry path is"
echo $REGISTRY_PATH

sudo docker push $REGISTRY_PATH/$APPNAME
sudo docker push $REGISTRY_PATH/$VERSIONEDAPPNAME





