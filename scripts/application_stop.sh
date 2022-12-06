#!/bin/bash
#Stopping existing node servers
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.34.0/install.sh | bash
. ~/.nvm/nvm.sh
nvm install node
nvm install 16
nvm use 16
npm install pm2@latest -g

echo "Stopping any existing node servers"

pm2 stop FBServer  || :
pm2 delete FBServer  || :
pkill node
