import os
import time
import json
import zlib
import logging
import sqlite3

logger = logging.getLogger(__name__)

OUTPUT_BASE_DIR = os.getcwd()
STATIC_DIR = 'static'
BASE_DIR = os.path.abspath(os.path.join(OUTPUT_BASE_DIR, STATIC_DIR))


class DBPoll():
  def __init__(self, db_name):
    self.db_name = db_name
    self.db_path = os.path.join(BASE_DIR, 'db/{db_name}.db'.format(db_name=db_name))
    self.connect = self.connect_db()

  def connect_db(self):
    connect = sqlite3.connect(self.db_path, check_same_thread=False)
    # con = sqlite3.connect(':memory') # 内存数据库
    return connect

  def get_cursor(self):
    cursor = self.connect.cursor()
    return cursor

  # 不要存大json
  # DROP TABLE IF EXISTS TableName
  def create_table(self, sql_string, tableName):
    cursor = self.get_cursor()
    cursor.execute(sql_string.replace('${tableName}', tableName))

    self.connect.commit()
    cursor.close()

  def execute_statement(self, sql_string, kwargs):
    start = time.time()
    cursor = self.get_cursor()
    try:
      cursor.execute(sql_string, kwargs)
      # cursor.execute('SELECT * FROM grib WHERE id = ?', ('3'))
      # values = cursor.fetchall()
      logger.debug("select: %s" % (time.time() - start))
      self.connect.commit()
    except Exception as e:
      return e
    finally:
      rows = cursor.fetchall()
      description = cursor.description
      res = []
      if len(rows) > 0:
        for row in rows:
          data = {}
          for index, des in enumerate(description):
            key = des[0]
            data.__setitem__(key, row[index])

          res.append(data)
      cursor.close()
      return res

  def append_grib_data(self):
    start = time.time()
    ufp = open("../../static/data/2020032200_1p00_u.grib", 'rb')  # 注意这里一定要使用rb，读出二进制文件，否则有读不全等问题
    vfp = open("../../static/data/2020032200_1p00_v.grib", 'rb')
    jsonfp = open("../../static/data/uv.json", 'rb')
    json_content = jsonfp.read()
    file_content = json_content.decode('utf-8')
    utfgrid = json.loads(file_content)

    compressed = zlib.compress(json.dumps(utfgrid).encode())
    u_grib = ufp.read()
    v_grib = vfp.read()

    ufp.close()
    vfp.close()

    cursor = self.get_cursor()
    cursor.execute("""
      insert into gribs(
        name,
        data_time,
        level,
        extent,
        product,
        u_grib,
        v_grib,
        parsed_json,
        create_time,
        update_time
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    """, (
      '2020032200_1p00',
      '202003220000',
      'lev_10_m_above_ground',
      '[0, -90, 360, 90]',
      '1p00',
      sqlite3.Binary(u_grib),
      sqlite3.Binary(v_grib),
      sqlite3.Binary(compressed),
      # json.dumps(utfgrid),
      '202003220000',
      '202003220000'
    ))

    cursor.close()

    self.connect.commit()

    logger.debug("select: %s" % (time.time() - start))


if __name__ == '__main__':
  db = DBPoll()

  # db.create_table()

  db.append_grib_data()
