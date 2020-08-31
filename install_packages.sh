#!/bin/bash

CURR_DIR=`pwd`
APP_DIRS=`ls -1 */package.json | xargs dirname`

for app in `echo $APP_DIRS`
do
  echo "Install packages for $app..."
  cd $CURR_DIR
  cd $app
  npm install

  if [ $? -ne 0 ]; then
    echo "Something went wrong while installing packages for $app!"
    exit 1
  fi

  echo "Packages for $app installed successfully."
  echo ""
done

exit 0