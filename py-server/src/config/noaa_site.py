import os

GFS_DATE = "20200312"  # 数据时间
GFS_TIME = "18"  # 起报时间 00, 06, 12, 18
RES = "0p25"  # 数据分辨率 0p25: 0.25, 0p50:0.5 or 1p00:1
BBOX = "leftlon=0&rightlon=360&toplat=90&bottomlat=-90"  # 数据范围
LEVEL = "lev_10_m_above_ground=on"  # 数据层次
VARIABLES = "var_UGRD=on&var_VGRD=on"  # 要素
GFS_URL = "https://nomads.ncep.noaa.gov/cgi-bin/" \
          "filter_gfs_${RES}.pl?file=gfs.t${GFS_TIME}z.pgrb2" \
          ".${RES}.f000&${LEVEL}&${VARIABLES}&${BBOX}&dir=%2Fgfs" \
          ".${GFS_DATE}%2F${GFS_TIME}"

OUTPUT_BASE_DIR = os.getcwd()
OUTPUT_DIR = '/static/data'

def get_noaa_config(date, gfs_time, res, bbox, level, variables):
  gfs_date = date or GFS_DATE
  gfs_time = gfs_time or GFS_TIME
  res = res or RES
  bbox = bbox or BBOX
  level = level or LEVEL
  variables = variables or VARIABLES
  gfs_url = GFS_URL\
    .replace("${RES}", res)\
    .replace("${BBOX}", bbox)\
    .replace("${GFS_TIME}", gfs_time)\
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



def get_grib_filepath(name):
  baePath = os.path.join(OUTPUT_BASE_DIR, OUTPUT_DIR)
  path = os.path.join(os.path.join(OUTPUT_BASE_DIR, OUTPUT_DIR), name)
  if os.path.exists(baePath):
    print('basedir exist')
  else:
    os.mkdir(OUTPUT_DIR)

  if os.path.exists(path) and os.path.getsize(path):
    return {
      "exist": True,
      "path": path,
    }
  else:
    return {
      "exist": False,
      "path": path,
    }
