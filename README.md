# ramanujan 2020

This app is the example of microservices and is originally developed for the book [*The Tao of Microservices*](http://bit.ly/rmtaomicro). 

I cloned the original source code from the following commit:

https://github.com/senecajs/ramanujan/commit/69e61a90ada50d1f20999dc7e3af2e5c4737e02c


## Todo

I'd like to customize this app to my personal preferences as follow:

* separate package.json ->Done
* make it work with node 14 ->Done
* replace packages deprecated or not maintained anymore
* make it work on k8s
* make it work with skaffold
* rewrite it in typescript
* add some more descriptions to README.md if possible

I hope that I can learn about microservices by doing things I mentioned above.


## Getting Started

### Prerequisites

* Node.js 14

### Run Services

Make sure that you are using Node.js 14.

```
$ node -v
```


Clone this repository.

```
$ git clone https://github.com/Pick1a1username/ramanujan-2020.git
```


Install packages.

```
$ cd ramanujan-2020
$ ./install_packages.sh 
```


Start services.

```
$ ./start
```


Check that all services has started.


Example)
```
$ ps -ef | grep node | egrep '[0-9] node'   
(username) 30141 29378  4 22:38 pts/1    00:00:02 node base.js base0 39000 127.0.0.1 127.0.0.1:39000,127.0.0.1:39001
(username) 30150 29378  4 22:38 pts/1    00:00:03 node base.js base1 39001 127.0.0.1 127.0.0.1:39000,127.0.0.1:39001
(username) 30158 29378  3 22:38 pts/1    00:00:02 node front.js 127.0.0.1 127.0.0.1:39000,127.0.0.1:39001
(username) 30166 29378  7 22:38 pts/1    00:00:05 node api-service.js 0 127.0.0.1 127.0.0.1:39000,127.0.0.1:39001
(username) 30174 29378  4 22:38 pts/1    00:00:02 node post-service.js 127.0.0.1 127.0.0.1:39000,127.0.0.1:39001
(username) 30183 29378  4 22:38 pts/1    00:00:02 node entry-store-service.js 127.0.0.1 127.0.0.1:39000,127.0.0.1:39001
(username) 30191 29378  5 22:38 pts/1    00:00:03 node entry-cache-service.js 127.0.0.1 127.0.0.1:39000,127.0.0.1:39001
(username) 30199 29378  4 22:38 pts/1    00:00:03 node repl-service.js 10001 127.0.0.1 127.0.0.1 127.0.0.1:39000,127.0.0.1:39001
(username) 30218 29378  9 22:38 pts/1    00:00:05 node mine-service.js 0 127.0.0.1 127.0.0.1:39000,127.0.0.1:39001
(username) 30244 29378  9 22:38 pts/1    00:00:05 node home-service.js 0 127.0.0.1 127.0.0.1:39000,127.0.0.1:39001
(username) 30252 29378  9 22:38 pts/1    00:00:05 node search-service.js 0 127.0.0.1 127.0.0.1:39000,127.0.0.1:39001
(username) 30260 29378  7 22:38 pts/1    00:00:04 node index-service.js 127.0.0.1 127.0.0.1:39000,127.0.0.1:39001
(username) 30272 29378  5 22:38 pts/1    00:00:03 node follow-service.js 127.0.0.1 127.0.0.1:39000,127.0.0.1:39001
(username) 30280 29378  8 22:38 pts/1    00:00:04 node fanout-service.js 127.0.0.1 127.0.0.1:39000,127.0.0.1:39001
(username) 30289 29378  5 22:38 pts/1    00:00:03 node timeline-service.js 0 127.0.0.1 127.0.0.1:39000,127.0.0.1:39001
(username) 30298 29378  5 22:38 pts/1    00:00:03 node timeline-service.js 1 127.0.0.1 127.0.0.1:39000,127.0.0.1:39001
(username) 30306 29378  5 22:38 pts/1    00:00:03 node timeline-shard-service.js 127.0.0.1 127.0.0.1:39000,127.0.0.1:39001
(username) 30316 29378  7 22:38 pts/1    00:00:03 node reserve-service.js 127.0.0.1 127.0.0.1:39000,127.0.0.1:39001
$ 
```

If there are services not being started, start it manually(refer to `start.sh`).


If you want to stop services, just kill the processes.

Example)
```
$ ps -ef | grep node | egrep '[0-9] node'| awk '{ print $2 }' | xargs kill
```


## License

Copyright (c) Richard Rodger, Pick1a1username and other contributors 2015-2020, Licensed under [MIT](/LICENSE).
