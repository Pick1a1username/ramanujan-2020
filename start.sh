HOST="127.0.0.1"
BASES="127.0.0.1:39000,127.0.0.1:39001"
OPTS=""
EXEC_DIR=`pwd`

# for demos use OPTS = '--seneca.options.debug.undead=true --seneca.options.plugin.mesh.sneeze.silent=1'


cd base
node base.js base0 39000 $HOST $BASES $OPTS &
cd $EXEC_DIR
sleep 1
cd base
node base.js base1 39001 $HOST $BASES $OPTS &
cd $EXEC_DIR
sleep 1
cd front
node front.js $HOST $BASES $OPTS &
cd $EXEC_DIR
sleep 1
cd api
node api-service.js 0 $HOST $BASES $OPTS &
cd $EXEC_DIR
sleep 1
node post/post-service.js $HOST $BASES $OPTS &
sleep 1
cd entry-store
node entry-store-service.js $HOST $BASES $OPTS &
cd $EXEC_DIR
sleep 1
cd entry-cache
node entry-cache-service.js $HOST $BASES $OPTS &
cd $EXEC_DIR
sleep 1
node repl/repl-service.js 10001 $HOST $HOST $BASES $OPTS &
sleep 1
node mine/mine-service.js 0 $HOST $BASES $OPTS &
sleep 1
cd home
node home-service.js 0 $HOST $BASES $OPTS &
cd $EXEC_DIR
sleep 1
node search/search-service.js 0 $HOST $BASES $OPTS &
sleep 1
node index/index-service.js $HOST $BASES $OPTS &
sleep 1
cd follow
node follow-service.js $HOST $BASES $OPTS &
cd $EXEC_DIR
sleep 1
cd fanout
node fanout-service.js $HOST $BASES $OPTS &
cd $EXEC_DIR
sleep 1
node timeline/timeline-service.js 0 $HOST $BASES $OPTS &
sleep 1
node timeline/timeline-service.js 1 $HOST $BASES $OPTS &
sleep 1
node timeline/timeline-shard-service.js $HOST $BASES $OPTS &
sleep 1
node reserve/reserve-service.js $HOST $BASES $OPTS &





