create table gribs(
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT,
  create_time DATE,
  update_time DATE,
  data_time DATE,
  level VARCHAR(20) NOT NULL,
  extent VARCHAR(20) NOT NULL,
  product VARCHAR(20) NOT NULL,
  u_grib BLOB,
  v_grib BLOB,
  parsed_json JSON
);


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
      ) VALUES (
        '2020032200_1p00',
        '202003220000',
        'lev_10_m_above_ground',
        '[0, -90, 360, 90]',
        '1p00',
        '',
        '',
        '202003220000',
        '202003220000'
      )
