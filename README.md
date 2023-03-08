SCLAB MySQL Connector
=====================

# Introduction
This connector provides functionality for retrieving data using MySQL in SCLAB Studio.

## Features
- Connect to MySQL with connection pool
- MQTT message publish using SQL Query with interval
- Create REST API endpoint with SQL Query
- JWT for HTTP authorization
- Processing of result data into JSON format

By adding a query in the format of "QUERY_1=mqtt;query;topic;interval ms" to the .env file, SQL is automatically executed to connect and retrieve data from SCLAB.

Two methods are supported: MQTT and API, each with a different variable format:

## mqtt method format:
QUERY_#=mqtt;SQL Query;topic;interval MS

## api method format:
QUERY_#=api;SQL Query;Endpoint URL

# usage

## clone source
~~~bash
$ git clone https://github.com/sclab-io/sclab-mysql-connector
~~~

## create JWT key file for API
~~~bash
$ mkdir jwt
$ ssh-keygen -t rsa -b 4096 -m PEM -f ./jwt/jwtRS256.key
# empty passphrase - just press enter
$ openssl rsa -in ./jwt/jwtRS256.key -pubout -outform PEM -out ./jwt/jwtRS256.key.pub
~~~

## create .env.production.local
~~~bash
$ vi .env.production.local

# MySQL Connection
MYSQL_HOST=host
MYSQL_USER=user
MYSQL_PASSWORD=password
MYSQL_DATABASE=databaseName
MYSQL_POOL_SIZE=5

# SCLAB IoT
# MQTT_TOPIC=yourtopic/
# MQTT_HOST=yourhost
# MQTT_CLIENT_ID=your-client-id/1
# MQTT_ID=your-id
# MQTT_PASSWORD=your-password

# QUERY_#=mqtt;query;topic;interval ms
# QUERY_#=api;query;endPoint
QUERY_1=api;SELECT ROUND( RAND() * 100 ) AS value, NOW() AS datetime;/api/1
QUERY_2=api;SELECT ROUND( RAND() * 1000 ) AS value, NOW() AS datetime;/api/2
# QUERY_3=mqtt;SELECT ROUND( RAND() * 100 ) AS value, NOW() AS datetime;test0;1000
# QUERY_4=mqtt;SELECT ROUND( RAND() * 1000 ) AS value, NOW() AS datetime;test1;5000

# PORT
PORT=3000

# TOKEN
SECRET_KEY=secretKey
JWT_PRIVATE_KEY_PATH=./jwt/jwtRS256.key
JWT_PUBLIC_KEY_PATH=./jwt/jwtRS256.key.pub

# LOG
LOG_FORMAT=combined
LOG_DIR=../logs

# CORS
ORIGIN=your.domain.com
CREDENTIALS=true
~~~

## start
~~~bash
# docker compose
$ ./run.sh

# nodejs
$ npm run start

# pm2
$ npm run deploy:prod
~~~

## stop
~~~bash
# docker compose
$ ./stop.sh

# pm2
$ ./node_modules/pm2/bin/pm2 stop 0
~~~

## logs
~~~bash
$ ./logs.sh
~~~

## access API end point
To access the API, you need to include authorization information in the Request Header in the following format:

~~~
authorization: yourkey
~~~

You can find your key information through the logs.

# Build source
## install nodejs
~~~bash
curl -sL https://rpm.nodesource.com/setup_14.x | sudo bash -
sudo yum install nodejs
~~~

## build source
~~~bash
$ npm install
$ npm run build
~~~
