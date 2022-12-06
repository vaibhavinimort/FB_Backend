#!/bin/bash
#Stopping existing node servers
echo "Stopping any existing node servers"
pkill node
pm2 save
pm2 stop FBServer  || :
pm2 delete FBServer  || :
