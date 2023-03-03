import { NextFunction, Request, Response } from 'express';
import { QueryItem, DBPool } from '../config/index';
import { PoolConnection } from 'mariadb';

class APIController {
  public queryItem?: QueryItem;
  public index = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    let conn: PoolConnection;
    try {
      conn = await DBPool.getConnection();
      const rows = await conn.query(this.queryItem.query);
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
