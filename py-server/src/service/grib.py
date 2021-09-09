import os
import requests
from requests import HTTPError

from src.config.grib import get_download_url, get_file_path
from src.entity.grib import GribTable

table_db = GribTable()


def download_data(date, gfs_time, res, forecasts_time, bbox, level, variables, fileprefix):
  config = get_download_url(date, gfs_time, res, forecasts_time, bbox, level, variables)

  if not fileprefix:
    fileprefix = ""
  else:
    fileprefix = f"{fileprefix}"

  filepath = f"{date}/{gfs_time}/{res}/{forecasts_time}/"

  file = get_file_path(filepath, f"{fileprefix}.grib")

  dir_path = os.path.join(filepath, f"{fileprefix}.grib")

  filename = file.get('path')

  # 如果文件存在并且文件大小大于0则不再下载
  if file.get('exist') == True:
    return dir_path
  else:
    try:
      r = requests.get(config.get('GFS_URL'))
      r.raise_for_status()
      with open(filename, "wb") as f:
        f.write(r.content)
        table_db.add(date, gfs_time, res, forecasts_time, bbox, level, variables, fileprefix, dir_path)

      return {
        'data': dir_path,
        'code': r.status_code,
        'message': 'success',
      }
    except HTTPError as e:
      # raise HTTPError("Something went wrong with the data download.") from e
      return {
        'code': e.response.status_code,
        'message': e.args[0],
      }


if __name__ == '__main__':
  download_data(
    '20220927',
    '12',
    '0p25',
    'f000',
    'leftlon=0&rightlon=360&toplat=90&bottomlat=-90',
    # 'lev_80_m_above_ground=on',
    'lev_10_m_above_ground=on',
    'var_UGRD=on&var_VGRD=on',
    # 'var_TMP=on',
    'uv'
  )

  print('success')
