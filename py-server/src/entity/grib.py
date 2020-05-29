from datetime import datetime, timedelta
from src.model.sqlite import DBPoll
from src.utils.common import str_to_int


class GribTable():
  # db_name
  db = DBPoll('main')

  def __init__(self):
    self.db.create_table("""
    CREATE TABLE IF NOT EXISTS ${tableName} (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      date_time DATE,
      gfs_date DATE,
      gfs_time DATE,
      res VARCHAR(20) NOT NULL,
      forecasts_time VARCHAR(20) NOT NULL,
      level VARCHAR(20) NOT NULL,
      bbox VARCHAR(100) NOT NULL,
      variables VARCHAR(100) NOT NULL,
      file_name VARCHAR(100) NOT NULL,
      file_path VARCHAR(100) NOT NULL,
      create_time DATETIME DEFAULT (datetime(CURRENT_TIMESTAMP,'localtime')),
      update_time DATETIME DEFAULT (datetime('now','localtime')),
      UNIQUE(date_time, gfs_date, gfs_time, res, forecasts_time, level, bbox, variables)
    )
    """, 'grib')

  def add(self, date, gfs_time, res, forecasts_time, bbox, level, variables, fileprefix, file_path):
    f_time = str_to_int(forecasts_time)
    date_time = datetime.strptime(date + gfs_time, '%Y%m%d%H%M')
    date_time += timedelta(hours=f_time)
    return self.db.execute_statement(f"""
    INSERT OR IGNORE INTO grib (
      date_time,
      gfs_date,
      gfs_time,
      res,
      forecasts_time,
      level,
      bbox,
      variables,
      file_name,
      file_path
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    """, (
      date_time,
      date,
      gfs_time,
      res,
      forecasts_time,
      level,
      bbox,
      variables,
      fileprefix,
      file_path
    ))

  def remove(self, date, gfs_time, res, forecasts_time, bbox, level, variables):
    self.db.execute_statement(f"""
        DELETE FROM grib WHERE
          gfs_date = {date}
          AND gfs_time = {gfs_time}
          AND res = {res}
          AND forecasts_time = {forecasts_time}
          AND level = {level}
          AND bbox = {bbox}
          AND variables = {variables}
        """)
    return ''
