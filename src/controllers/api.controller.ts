import { NextFunction, Request, Response } from 'express';
import { QueryItem, DBPool } from '../config/index';
import { PoolConnection } from 'mariadb';
import { getPlaceHolders, hasSql, replaceString } from '@/utils/util';
import { logger } from '@/utils/logger';

class APIController {
  mappingRequestData(query: string, queryData: any): string {
    // data mapping
    const paramKeys = getPlaceHolders(query);

    if (paramKeys.length > 0) {
      const valueObj = {};

      let paramKey: string, reqData: any;
      for (let i = 0; i < paramKeys.length; i++) {
        paramKey = paramKeys[i];
        reqData = queryData[paramKey];
        if (reqData !== undefined && reqData !== null) {
          valueObj[paramKey] = reqData;
        }
      }

      console.log(queryData, valueObj, paramKeys);

      // make final query
      return replaceString(query, valueObj);
    } else {
      return query;
    }
  }

  public queryItem?: QueryItem;
  public index = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    let conn: PoolConnection;

    if (!this.queryItem || !this.queryItem.query) {
      res.writeHead(500, {
        'Content-Type': 'application/json',
      });
      res.end(
        JSON.stringify({
          message: 'Query item empty',
        }),
      );
      res.end('Query item empty');
      return;
    }

    let sql = this.queryItem.query;

    sql = this.mappingRequestData(sql, req.query);
    // check sql injection
    if (hasSql(sql)) {
      logger.info(`SQL inject detect with final query data, ${sql}, ${this.queryItem.query}, ${this.queryItem.endPoint}`);
      res.writeHead(400, {
        'Content-Type': 'application/json',
      });
      res.end(
        JSON.stringify({
          message: 'SQL inject data detected.',
        }),
      );
      return;
    }

    try {
      conn = await DBPool.getConnection();
      const rows = await conn.query(sql);
      res.writeHead(200, {
        'Content-Type': 'application/json',
      });
      res.end(
        JSON.stringify({
          rows,
        }),
      );
    } catch (error) {
      next(error);
    } finally {
      if (conn) {
        conn.release();
      }
    }
  };
}

export default APIController;
