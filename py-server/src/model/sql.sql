CREATE TABLE IF NOT EXISTS gribs(
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


INSERT INTO gribs (
    level
) SELECT
	'2018032016204085',
	'2431503022',
	'wanghan',
	'470',
	NULL,
	'2018-03-20 16:22:05',
	'0',
	'1300000',
	'1',
	'26',
	'20180320162241705',
	NULL,
	NULL
FROM
	DUAL
WHERE
	NOT EXISTS (
		SELECT
			batchno,
			payproid,
			idserial,
			payamt
		FROM
			pay_namelist
		WHERE
		batchno = '2018032016204085'
		AND payproid = '470'
		AND idserial = '161'
		AND payamt = '1300000'
	)
