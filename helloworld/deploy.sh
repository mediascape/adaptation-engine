#!/bin/bash
Folder=./adaptation-engine
##### check name of node.js
nodeCommand=node
if [ -f /usr/bin/nodejs ]; then
        nodeCommand=nodejs
fi
#####

if [ ! -d $Folder  ];
then
        echo "Cloning repository..."
        git clone https://github.com/mediascape/WP5/tree/master/Tests/NEC_adaptation_engine/hybrid-adaptation-engine
else
        echo "Checking for updates..."
        cd $Folder
        git pull
        cd ..
fi

###
if [ -d deploy/ ]; then
    if [ -d deploy/node_modules/ ]; then
        mkdir temp/
                mkdir temp/node_modules/
        mv deploy/node_modules/* temp/node_modules/
    fi
        rm -r deploy/
fi

mkdir deploy
mkdir deploy/www

echo "Copy needed files from repository..."
cp -R $Folder/Server/* deploy/
cp -R $Folder/helloworld/* deploy/www/
rm deploy/www/deploy.sh
mkdir deploy/www/js/

cp -R $Folder/API/mediascape deploy/www/js/
cp -R $Folder/API/lib deploy/www/js/
cp -R $Folder/API/images deploy/www/
cp -R $Folder/API/bootstrap deploy/www/

if [ -d temp/node_modules/ ]; then
        mkdir deploy/node_modules/
    mv temp/node_modules/* deploy/node_modules/
    rm -r temp/
fi

cd deploy/
echo "Installing dependencies..."
npm install

## install bower and google web components
cd www/
npm install bower
bower install --save GoogleWebComponents/google-chart
bower install --save GoogleWebComponents/google-map
bower install --save GoogleWebComponents/google-streetview-pano
cd ../


echo "Start the Node.js Server..."
$nodeCommand index.js