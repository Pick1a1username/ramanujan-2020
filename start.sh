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
cd post
node post-service.js $HOST $BASES $OPTS &
cd $EXEC_DIR
sleep 1
cd entry-store
node entry-store-service.js $HOST $BASES $OPTS &
cd $EXEC_DIR
sleep 1
cd entry-cache
node entry-cache-service.js $HOST $BASES $OPTS &
cd $EXEC_DIR
sleep 1
cd repl
node repl-service.js 10001 $HOST $HOST $BASES $OPTS &
cd $EXEC_DIR
sleep 1
cd mine
node mine-service.js 0 $HOST $BASES $OPTS &
cd $EXEC_DIR
sleep 1
cd home
node home-service.js 0 $HOST $BASES $OPTS &
cd $EXEC_DIR
sleep 1
cd search
node search-service.js 0 $HOST $BASES $OPTS &
cd $EXEC_DIR
sleep 1
cd index
node index-service.js $HOST $BASES $OPTS &
cd $EXEC_DIR
sleep 1
cd follow
node follow-service.js $HOST $BASES $OPTS &
cd $EXEC_DIR
sleep 1
cd fanout
node fanout-service.js $HOST $BASES $OPTS &
cd $EXEC_DIR
sleep 1
cd timeline
node timeline-service.js 0 $HOST $BASES $OPTS &
cd $EXEC_DIR
sleep 1
cd timeline
node timeline-service.js 1 $HOST $BASES $OPTS &
cd $EXEC_DIR
sleep 1
cd timeline
node timeline-shard-service.js $HOST $BASES $OPTS &
cd $EXEC_DIR
sleep 1
cd reserve
node reserve-service.js $HOST $BASES $OPTS &
cd $EXEC_DIR
# monitor.js is supposed not to be executed?
# sleep 1
# cd monitor
# node monitor.js &
# cd $EXEC_DIR





