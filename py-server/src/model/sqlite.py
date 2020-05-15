import os
import time
import json
import zlib
import logging
import sqlite3

logger = logging.getLogger(__name__)

OUTPUT_BASE_DIR = os.getcwd()
OUTPUT_DIR = '../../static/data'


class DBPoll():

  def __init__(self):
    self.db_path = '../../static/db/grib.db'
    self.connect = self.connect_db()

  def connect_db(self):
    connect = sqlite3.connect(self.db_path)
    # con = sqlite3.connect(':memory') # 内存数据库
    return connect

  def get_cursor(self):
    cursor = self.connect.cursor()
    return cursor

  # 不要存大json
  # DROP TABLE IF EXISTS TableName
  def create_table(self, tableName):
    cursor = self.get_cursor()
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS ${tableName}(
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT,
      create_time DATE,
      update_time DATE,
      data_time DATE,
      level VARCHAR(20) NOT NULL,
      extent VARCHAR(100) NOT NULL,
      product VARCHAR(20) NOT NULL,
      u_grib BLOB,
      v_grib BLOB,
      parsed_json BLOB
    )
    """.replace('${tableName}', tableName))

    cursor.close()

    self.connect.commit()

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
