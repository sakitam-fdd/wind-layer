import os

GFS_DATE = "20200312"  # 数据时间
GFS_TIME = "18"  # 起报时间 00, 06, 12, 18
RES = "0p25"  # 数据分辨率 0p25: 0.25, 0p50:0.5 or 1p00:1
BBOX = "leftlon=0&rightlon=360&toplat=90&bottomlat=-90"  # 数据范围
LEVEL = "lev_10_m_above_ground=on"  # 数据层次
VARIABLES = "var_UGRD=on&var_VGRD=on&var_TMP=on"  # 要素
GRIB_DES = "pgrb2"  # 文件说明 默认为pgrb2 0.5分辨率的为pgrb2full
FORECASTS_TIME = "f000"
GFS_URL = "https://nomads.ncep.noaa.gov/cgi-bin/" \
          "filter_gfs_${RES}.pl?file=gfs.t${GFS_TIME}z.${GRIB_DES}" \
          ".${RES}.${FORECASTS_TIME}&${LEVEL}&${VARIABLES}&${BBOX}&dir=%2Fgfs" \
          ".${GFS_DATE}%2F${GFS_TIME}%2Fatmos"

GRS_PAGE = "https://nomads.ncep.noaa.gov/cgi-bin/" \
          "filter_gfs_${RES}.pl?dir=%2Fgfs" \
          ".${GFS_DATE}%2F${GFS_TIME}"

OUTPUT_BASE_DIR = os.getcwd()
OUTPUT_DIR = 'static/data'
OUTPUT_JSON_DIR = 'static/json'
OUTPUT_RASTER_DIR = 'static/raster'
BASE_DIR = os.path.abspath(os.path.join(OUTPUT_BASE_DIR, OUTPUT_DIR))
BASE_JSON_DIR = os.path.abspath(os.path.join(OUTPUT_BASE_DIR, OUTPUT_JSON_DIR))
BASE_RASTER_DIR = os.path.abspath(os.path.join(OUTPUT_BASE_DIR, OUTPUT_RASTER_DIR))


def get_download_url(date, gfs_time, res, forecasts_time, bbox, level, variables):
  gfs_date = date or GFS_DATE
  gfs_time = gfs_time or GFS_TIME
  res = res or RES
  forecasts_time = forecasts_time or FORECASTS_TIME
  bbox = bbox or BBOX
  level = level or LEVEL
  variables = variables or VARIABLES

  grib_des = GRIB_DES

  if res == "0p50":
    grib_des = 'pgrb2full'

  gfs_url = GFS_URL\
    .replace("${RES}", res)\
    .replace("${FORECASTS_TIME}", forecasts_time)\
    .replace("${BBOX}", bbox)\
    .replace("${GFS_TIME}", gfs_time)\
    .replace("${GRIB_DES}", grib_des)\
    .replace("${GFS_DATE}", gfs_date)\
    .replace("${LEVEL}", level)\
    .replace("${VARIABLES}", variables)

  return {
    'GFS_DATE': gfs_date,
    'GFS_TIME': gfs_time,
    'RES': res,
    'BBOX': bbox,
    'LEVEL': level,
    'VARIABLES': variables,
    'GFS_URL': gfs_url,
  }


def get_page_url(date, gfs_time, res):
  gfs_date = date or GFS_DATE
  gfs_time = gfs_time or GFS_TIME
  res = res or RES

  page_url = GRS_PAGE \
    .replace("${RES}", res) \
    .replace("${GFS_TIME}", gfs_time) \
    .replace("${GFS_DATE}", gfs_date)

  return page_url


def get_file_path(file_path, name):
  basePath = os.path.abspath(os.path.join(OUTPUT_BASE_DIR, OUTPUT_DIR))
  path = os.path.join(basePath, file_path)
  full_path = os.path.join(path, name)
  if os.path.exists(path):
    print('basedir exist')
  else:
    os.makedirs(path)

  if os.path.exists(full_path) and os.path.getsize(full_path):

    return {
      "exist": True,
      "path": full_path,
    }
  else:
    return {
      "exist": False,
      "path": full_path,
    }


def get_json_path(file_path, name):
  path = os.path.join(BASE_JSON_DIR, file_path)
  full_path = os.path.join(path, name)
  if os.path.exists(path):
    print('basedir exist')
  else:
    os.makedirs(path)

  if os.path.exists(full_path) and os.path.getsize(full_path):

    return {
      "exist": True,
      "path": full_path,
    }
  else:
    return {
      "exist": False,
      "path": full_path,
    }


def get_raster_path(file_path, name):
  path = os.path.join(BASE_RASTER_DIR, file_path)
  full_path = os.path.join(path, name)
  if os.path.exists(path):
    print('basedir exist')
  else:
    os.makedirs(path)

  if os.path.exists(full_path) and os.path.getsize(full_path):

    return {
      "exist": True,
      "path": full_path,
    }
  else:
    return {
      "exist": False,
      "path": full_path,
    }
