import { config } from 'dotenv';
import mariadb from 'mariadb';

config({ path: `.env.${process.env.NODE_ENV || 'development'}.local` });

export const CREDENTIALS = process.env.CREDENTIALS === 'true';
export const {
  NODE_ENV,
  PORT,
  SECRET_KEY,
  JWT_PRIVATE_KEY_PATH,
  JWT_PUBLIC_KEY_PATH,
  LOG_FORMAT,
  LOG_DIR,
  ORIGIN,
  MYSQL_HOST,
  MYSQL_USER,
  MYSQL_PASSWORD,
  MYSQL_DATABASE,
  MYSQL_POOL_SIZE,
  MYSQL_ALLOW_PUBLIC_KEY_RETRIEVAL,
  MYSQL_SSL,
  INTERVAL_MS,
  MQTT_TOPIC,
  MQTT_HOST,
  MQTT_CLIENT_ID,
  MQTT_ID,
  MQTT_PASSWORD,
  SQL_INJECTION,
} = process.env;

export interface QueryItem {
  type: string;
  query: string;
  topic?: string;
  interval?: number;
  endPoint?: string;
}

export const QueryItems: QueryItem[] = [];
export const QueryType: { API: string; MQTT: string } = { API: 'api', MQTT: 'mqtt' };
Object.keys(process.env).forEach(function (key) {
  if (!key.startsWith('QUERY_')) {
    return;
  }

  const queryInfo: Array<string> = process.env[key].split(';');
  const queryType: string = queryInfo[0].toLocaleLowerCase();
  let queryItem: QueryItem;
  switch (queryType) {
    case QueryType.MQTT: {
      queryItem = {
        type: queryType,
        query: queryInfo[1],
        topic: queryInfo[2],
        interval: parseInt(queryInfo[3]),
      };
      break;
    }

    case QueryType.API: {
      queryItem = {
        type: queryType,
        query: queryInfo[1],
        endPoint: queryInfo[2],
      };
      break;
    }
  }

  QueryItems.push(queryItem);
});

// BigInt bug fix to string
BigInt.prototype['toJSON'] = function () {
  if (this > Number.MAX_SAFE_INTEGER) {
    return this.toString();
  }
  return parseInt(this.toString(), 10);
};

export const DBPool = mariadb.createPool({
  host: MYSQL_HOST,
  user: MYSQL_USER,
  password: MYSQL_PASSWORD,
  database: MYSQL_DATABASE,
  connectionLimit: parseInt(MYSQL_POOL_SIZE, 10),
  allowPublicKeyRetrieval: MYSQL_ALLOW_PUBLIC_KEY_RETRIEVAL === 'true',
  ssl: (MYSQL_SSL && JSON.parse(MYSQL_SSL)) || false,
});
