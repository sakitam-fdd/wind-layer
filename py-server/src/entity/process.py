from datetime import datetime, timedelta
from src.model.sqlite import DBPoll
from src.utils.common import str_to_int


class ProcessTable():
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
      extent VARCHAR(20) NOT NULL,
      file_name VARCHAR(100) NOT NULL,
      json_file_path VARCHAR(100) NOT NULL,
      raster_file_path VARCHAR(100) NOT NULL,
      create_time DATETIME DEFAULT (datetime(CURRENT_TIMESTAMP,'localtime')),
      update_time DATETIME DEFAULT (datetime('now','localtime')),
      UNIQUE(date_time, gfs_date, gfs_time, res, forecasts_time, level, bbox, variables, json_file_path, raster_file_path)
    )
    """, 'process')


  def query_grib(self, date, gfs_time, res, forecasts_time, bbox, level, variables, file_name):
    f_time = str_to_int(forecasts_time)
    date_time = datetime.strptime(date + gfs_time, '%Y%m%d%H%M')
    date_time += timedelta(hours=f_time)

    data = self.db.execute_statement(f"""
      SELECT * FROM grib WHERE
        date_time = ?
        AND gfs_date = ?
        AND gfs_time = ?
        AND res = ?
        AND forecasts_time = ?
        AND bbox = ?
        AND level = ?
        AND variables = ?
        AND file_name = ?
      """, (
      str(date_time),
      str_to_int(date),
      str_to_int(gfs_time),
      res,
      forecasts_time,
      bbox,
      level,
      variables,
      file_name
    ))

    return data


  def query_process(self, date, gfs_time, res, forecasts_time, bbox, level, variables, file_name):
    f_time = str_to_int(forecasts_time)
    date_time = datetime.strptime(date + gfs_time, '%Y%m%d%H%M')
    date_time += timedelta(hours=f_time)

    data = self.db.execute_statement(f"""
      SELECT * FROM process WHERE
        date_time = ?
        AND gfs_date = ?
        AND gfs_time = ?
        AND res = ?
        AND forecasts_time = ?
        AND bbox = ?
        AND level = ?
        AND variables = ?
        AND file_name = ?
      """, (
      str(date_time),
      str_to_int(date),
      str_to_int(gfs_time),
      res,
      forecasts_time,
      bbox,
      level,
      variables,
      file_name
    ))

    return data


  def add_json(self, date, gfs_time, res, forecasts_time, bbox, level, variables, extent, file_name, json_file_path):
    f_time = str_to_int(forecasts_time)
    date_time = datetime.strptime(date + gfs_time, '%Y%m%d%H%M')
    date_time += timedelta(hours=f_time)

    columns = self.query_process(date, gfs_time, res, forecasts_time, bbox, level, variables, file_name)

    if columns:
      return self.db.execute_statement(f"""
        UPDATE process SET
          json_file_path = ?
          WHERE date_time = ?
          AND gfs_date = ?
          AND gfs_time = ?
          AND res = ?
          AND forecasts_time = ?
          AND level = ?
          AND bbox = ?
          AND variables = ?
          AND extent = ?
          AND file_name = ?
        """, (
        json_file_path,
        date_time,
        date,
        gfs_time,
        res,
        forecasts_time,
        level,
        bbox,
        variables,
        extent,
        file_name
      )
    )
    else:
      return self.db.execute_statement(f"""
      INSERT OR IGNORE INTO process (
        date_time,
        gfs_date,
        gfs_time,
        res,
        forecasts_time,
        level,
        bbox,
        variables,
        file_name,
        extent,
        json_file_path,
        raster_file_path
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      """, (
        date_time,
        date,
        gfs_time,
        res,
        forecasts_time,
        level,
        bbox,
        variables,
        file_name,
        extent,
        json_file_path,
        ''
      ))

  def add_raster(self, date, gfs_time, res, forecasts_time, bbox, level, variables, extent, file_name, raster_file_path):
    f_time = str_to_int(forecasts_time)
    date_time = datetime.strptime(date + gfs_time, '%Y%m%d%H%M')
    date_time += timedelta(hours=f_time)

    columns = self.query_process(date, gfs_time, res, forecasts_time, bbox, level, variables, file_name)

    if columns and len(columns) > 0:
      return self.db.execute_statement(f"""
        UPDATE process SET
          raster_file_path = ?
          WHERE date_time = ?
          AND gfs_date = ?
          AND gfs_time = ?
          AND res = ?
          AND forecasts_time = ?
          AND level = ?
          AND bbox = ?
          AND variables = ?
          AND extent = ?
          AND file_name = ?
        """, (
        raster_file_path,
        date_time,
        date,
        gfs_time,
        res,
        forecasts_time,
        level,
        bbox,
        variables,
        extent,
        file_name,
      ))
    else:
      return self.db.execute_statement(f"""
      INSERT OR IGNORE INTO process (
        date_time,
        gfs_date,
        gfs_time,
        res,
        forecasts_time,
        level,
        bbox,
        variables,
        file_name,
        extent,
        json_file_path,
        raster_file_path
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      """, (
        date_time,
        date,
        gfs_time,
        res,
        forecasts_time,
        level,
        bbox,
        variables,
        file_name,
        extent,
        '',
        raster_file_path,
      ))

  def remove(self, date, gfs_time, res, forecasts_time, bbox, level, variables, json_file_path, raster_file_path):
    self.db.execute_statement(f"""
        DELETE FROM process WHERE
          gfs_date = {date}
          AND gfs_time = {gfs_time}
          AND res = {res}
          AND forecasts_time = {forecasts_time}
          AND level = {level}
          AND bbox = {bbox}
          AND variables = {variables}
          AND json_file_path = {json_file_path}
          AND raster_file_path = {raster_file_path}
        """)
    return ''
