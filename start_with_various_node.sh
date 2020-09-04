#!/bin/bash

HOST="127.0.0.1"
BASES="127.0.0.1:39000,127.0.0.1:39001"
OPTS=""
EXEC_DIR=`pwd`
CURR_NODE_VER=`node -v | sed s/^v//g`

# for demos use OPTS = '--seneca.options.debug.undead=true --seneca.options.plugin.mesh.sneeze.silent=1'

# Change Node's version
function change_node_ver() {
  local ver=$1
  nvm use $ver

  if [ $? -ne 0 ]; then
    echo "Something went wrong while installing packages for $app!"
    exit 1
  fi

  echo "Node has changed to $ver."
}


# Run an app
function run_app() {
  local app_dir=`dirname $1`
  local app_file=`basename $1`
  # https://www.unix.com/shell-programming-and-scripting/273869-how-can-i-remove-first-column-awk.html
  local args=`echo "$@" | awk '{ print $1="" }1' | tail -1 | sed -E 's/^\s//g'`

  echo "Run $app_dir..."

  cd $app_dir
  nohup node $app_file $args > $EXEC_DIR/$app_dir.log  &

  if [ $? -ne 0 ]; then
    echo "Something went wrong while trying to run $app!"
    exit 1
  fi

  cd $EXEC_DIR
}

# Run apps with Node 4
function node4() {
  change_node_ver 4

  run_app front/front.js $HOST $BASES $OPTS
  sleep 1
  run_app api/api-service.js 0 $HOST $BASES $OPTS
  sleep 1
  run_app repl/repl-service.js 10001 $HOST $HOST $BASES $OPTS
  sleep 1
  run_app mine/mine-service.js 0 $HOST $BASES $OPTS
  sleep 1
  run_app home/home-service.js 0 $HOST $BASES $OPTS
  sleep 1
  run_app search/search-service.js 0 $HOST $BASES $OPTS
  sleep 1
  run_app index/index-service.js $HOST $BASES $OPTS
  sleep 1
  run_app follow/follow-service.js $HOST $BASES $OPTS
  sleep 1
  run_app timeline/timeline-service.js 0 $HOST $BASES $OPTS
  sleep 1
  run_app timeline/timeline-service.js 1 $HOST $BASES $OPTS
  sleep 1
  run_app timeline/timeline-shard-service.js $HOST $BASES $OPTS
  sleep 1
  run_app reserve/reserve-service.js $HOST $BASES $OPTS
  sleep 1


  # monitor.js is supposed not to be executed?
  # sleep 1
  # cd monitor
  # node monitor.js &
  # cd $EXEC_DIR
}



# Run apps with Node 12
function node12() {
  change_node_ver 12

  run_app base/base.js base0 39000 $HOST $BASES $OPTS
  sleep 1
  run_app base/base.js base1 39001 $HOST $BASES $OPTS
  sleep 1
  run_app post/post-service.js $HOST $BASES $OPTS
  sleep 1
  run_app entry-store/entry-store-service.js $HOST $BASES $OPTS
  sleep 1
  run_app entry-cache/entry-cache-service.js $HOST $BASES $OPTS
  sleep 1
  run_app fanout/fanout-service.js $HOST $BASES $OPTS
  sleep 1
}


# main function
function main() {

  # To use configuration for nvm...
  source ~/.bashrc

  node4
  node12

  change_node_ver $CURR_NODE_VER
  exit 0
}


main