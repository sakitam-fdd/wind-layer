import os
import json
import logging
import numpy as np
import rasterio
from PIL import Image
import mercantile
from mercantile import Tile
from rasterio.plot import reshape_as_image
from rasterio.enums import Resampling
from rasterio.warp import reproject
from src.config.grib import get_json_path, get_raster_path, BASE_DIR, BASE_JSON_DIR, BASE_RASTER_DIR
from src.entity.process import ProcessTable
from src.service.grib import download_data

process_db = ProcessTable()
logger = logging.getLogger(__name__)


def write_image(filename, image):
  # os.makedirs(os.path.dirname(filename), exist_ok=True)
  im = Image.fromarray(image)
  im.save(filename)


def prepare_gray_png_array(bands):
  # Drop extra row in array
  # TODO: Something more elegant like interpolate rows
  bands = bands[:, :-1, :]

  # Convert coverage from 0->360 to -180->180
  # 沿着给定轴滚动数组元素。超出最后位置的元素将会滚动到第一个位置。
  # numpy.roll(a, shift, axis=None)
  shape_len = len(bands.shape)
  bands = np.roll(bands, int(0.5 * bands.shape[shape_len - 1]), shape_len - 1)
  # bands = np.roll(bands, int(0.5 * bands.shape[2]), 2)

  # rescale values from floats to uint8
  for i in range(0, bands.shape[0]):
    bands[i] = (
      255
      * (bands[i] - bands[i].min())
      / (bands[i].max() - bands[i].min())
    )
  idx = 3 - bands.shape[0]
  # Build array in image format
  if idx > 0:
    empty_band = np.zeros((idx, bands.shape[1], bands.shape[2]))

    bands = np.concatenate((bands, empty_band), axis=0)

  bands = bands.astype(np.uint8)

  return bands


"""
获取索引和元信息
"""


def get_band_index(ds, layer_config):
  band_nums = {}
  # count + 1 长度
  for band_num in range(1, ds.count + 1):
    messages = ds.tags(band_num)
    GRIB_ELEMENT = messages["GRIB_ELEMENT"]
    if GRIB_ELEMENT in layer_config:
      band_nums[GRIB_ELEMENT] = {
        'index': band_num,
        'messages': messages
      }
  return band_nums


"""
读取指定的要素数据
"""


def read_data(file_path, params):
  # empty_band = np.zeros((idx, bands.shape[1], bands.shape[2]))

  # bands = np.concatenate((bands, empty_band), axis=0)
  with rasterio.open(file_path) as src:
    band_index = get_band_index(src, params['elementEnum'])

    bounds = src.bounds
    width = src.width
    height = src.height

    data = np.zeros((1, height, width))

    headers = []

    for idx in band_index:
      band_idx = band_index[idx]['index']
      band_messages = band_index[idx]['messages']
      # if idx not in element_config: 考虑内建要素数值处理
      #   continue

      band_data = src.read(band_idx)
      data = np.concatenate((data, band_data.reshape((1, band_data.shape[0], band_data.shape[1]))), axis=0)

      xmin = bounds.left - (bounds.right - bounds.left) / 2
      xmax = bounds.right - (bounds.right - bounds.left) / 2
      extent = [xmin, bounds.bottom, xmax, bounds.top]

      headers.append({
        'nx': width,
        'ny': height,
        'dx': (bounds.right - bounds.left) / width,
        'dy': (bounds.top - bounds.bottom) / height,
        'min': band_data.min(),
        'max': band_data.max(),
        'bounds': bounds,
        'extent': extent,
        # 'extent': [bounds.left, bounds.bottom, bounds.right, bounds.top],
        'value': band_data,
        **band_messages,
      })

    # data = src.read()

    # export_json(data)
    # 数组切片，右侧操作尾部，左侧操作头部
    slicing = data.shape[0] - 1
    data = data[-slicing:, :, :]  # 删除创建的默认空数组

    # bands = prepare_gray_png_array(data)

    # image = reshape_as_image(bands)

    # filename = os.path.join(BASE_DIR, imageName)
    # write_image(filename, image)

    return {
      "data": data,
      "width": width,
      "height": height,
      "headers": headers
    }


"""
转换为json
"""


def format_to_json(headers, params):
  data = []

  for header in headers:
    band = header['value']
    bands = band[:-1, :]
    shape_len = len(bands.shape)
    # Convert coverage from 0->360 to -180->180
    # 沿着给定轴滚动数组元素。超出最后位置的元素将会滚动到第一个位置。
    # numpy.roll(a, shift, axis=None)
    bands = np.roll(bands, int(0.5 * bands.shape[shape_len - 1]), shape_len - 1)
    if 'value' in header:
      header.pop('value')
    extent = []
    if 'bounds' in header:
      bounds = header['bounds']
      # 'extent': [bounds.left, bounds.bottom, bounds.right, bounds.top],
      xmin = bounds.left - (bounds.right - bounds.left) / 2
      xmax = bounds.right - (bounds.right - bounds.left) / 2
      extent = [xmin, bounds.bottom, xmax, bounds.top]
      header.pop('bounds')
    data.append({
      'header': {
        'la1': extent[3],
        'la2': extent[1],
        'lo1': extent[0],
        'lo2': extent[2],
        'extent': extent,
        **header,
      },
      'data': bands.flatten().tolist()
    })

  if 'write_json' in params and params['write_json'] == True and 'json_file' in params and params['json_file']:
    # file_path = f"{date}/{gfs_time}/{res}/{forecasts_time}/"

    file = get_json_path(params['json_file'], f"{params['file_name']}.json")
    file_path = file.get('path')
    if file.get('exist') == True:
      # return file
      logger.info('json文件已存在')
    else:
      json_file_path = os.path.join(params['json_file'], f"{params['file_name']}.json")
      with open(file_path, 'w') as f:
        json.dump(data, f)
        process_db.add_json(
          params['date'],
          params['gfsTime'],
          params['res'],
          params['forecastsTime'],
          params['bbox'],
          params['level'],
          params['variables'],
          ','.join(params['extent']),
          params['file_name'],
          json_file_path,
        )
  return data


"""
转换为多通道png
"""
def rp(data, params):
  width = 1024
  height = 1024

  try:
    west, south, east, north = mercantile.bounds(0, 0, 0)
    left, bottom, right, top = mercantile.xy_bounds(0, 0, 0)
    dst_transform = rasterio.transform.from_bounds(
      left, bottom, right, top, height, width)

    src_transform = rasterio.transform.from_bounds(
      west, south, east, north, data.shape[2], data.shape[1])

    dst = np.zeros((2, height, width), np.float64)
    reproject(data,
              dst,
              src_transform=src_transform,
              src_crs='EPSG:4326',
              dst_transform=dst_transform,
              dst_crs='EPSG:3857',
              resampling=Resampling.nearest,
              num_threads=2)

    bands = prepare_gray_png_array(dst)
    image = reshape_as_image(bands)
    file = get_raster_path(params['raster_file'], f"{params['file_name_mc']}.png")
    file_path = file.get('path')
    if file.get('exist') == True:
      # return file
      logger.info('栅格文件已存在')
    else:
      write_image(file_path, image)
  except Exception as e:
    return e

def format_to_png(data, headers, params):
  try:
    dec_data = []
    raster_file_path = os.path.join(params['raster_file'], f"{params['file_name']}.png")
    for header in headers:
      dec_data.append({
        'header': header,
        'data': raster_file_path
      })

    rp(data, params)

    bands = prepare_gray_png_array(data)
    image = reshape_as_image(bands)
    file = get_raster_path(params['raster_file'], f"{params['file_name']}.png")
    file_path = file.get('path')
    if file.get('exist') == True:
      # return file
      logger.info('栅格文件已存在')
    else:
      write_image(file_path, image)
      json_file_path = file_path.replace('.png', '.json')
      with open(json_file_path, 'w') as f:
        json.dump(dec_data, f)
      # process_db.add_raster(
      #   params['date'],
      #   params['gfsTime'],
      #   params['res'],
      #   params['forecastsTime'],
      #   params['bbox'],
      #   params['level'],
      #   params['variables'],
      #   ','.join(params['extent']),
      #   params['file_name'],
      #   raster_file_path,
      # )

    return dec_data
  except Exception as e:
    return e


def process_data(params):
  try:
    col = check_grib_exit(params)
    # grib 文件下载过
    if col is not None and col['file_path']:
      path = os.path.join(BASE_DIR, col['file_path'])
      data = read_data(path, {
        'elementEnum': [
          'UGRD',
          'VGRD'
        ]
      })
      file_path = f"{params['date']}/{params['gfsTime']}/{params['res']}/{params['forecastsTime']}/"
      params.__setitem__('write_json', True)
      params.__setitem__('json_file', file_path)
      params.__setitem__('raster_file', file_path)
      json = []
      raster = {}
      if data is not None and data['headers']:
        json = format_to_json(data['headers'], params)
      if data is not None and 'data' in data:
        raster = format_to_png(data['data'], data['headers'], params)
      return {
        'json': json,
        'raster': raster
      }

    return {
      'json': False,
      'raster': False
    }
  except Exception as e:
    return e


"""
检查grib文件是否下载过，若未下载过执行下载任务
"""


def check_grib_exit(params):
  try:
    cols = process_db.query_grib(
      params['date'],
      params['gfsTime'],
      params['res'],
      params['forecastsTime'],
      params['bbox'],
      params['level'],
      params['variables'],
      params['file_name']
    )

    if cols and len(cols) > 0:
      col = cols[0]
      if col['file_path']:
        return col
      else:
        print('重新下载')
        res = download_data(params['date'], params['gfsTime'], params['res'], params['forecastsTime'], params['bbox'],
                      params['level'], params['variables'], params['file_name'])
        if 'code' in res and res['code'] != 200:
          return res
        else:
          return check_grib_exit(params)
    else:
      print('执行下载任务')
      res = download_data(params['date'], params['gfsTime'], params['res'], params['forecastsTime'], params['bbox'],
                    params['level'], params['variables'], params['file_name'])
      if 'code' in res and res['code'] != 200:
        return res
      else:
        return check_grib_exit(params)
  except Exception as e:
    return e


def process_json(params):
  try:
    grib_col = check_grib_exit(params)

    if grib_col is not None and grib_col['file_path']:
      cols = process_db.query_process(
        params['date'],
        params['gfsTime'],
        params['res'],
        params['forecastsTime'],
        params['bbox'],
        params['level'],
        params['variables'],
        params['file_name']
      )

      data = []

      # 此处表明grib文件已经下载过
      if cols and len(cols) > 0:
        col = cols[0]
        # 当存在json路径，表明已经处理过，直接读取数据返回
        if 'json_file_path' in col and col['json_file_path']:
          path = os.path.join(BASE_JSON_DIR, col['json_file_path'])
          with open(path) as json_file:
            data = json.load(json_file)
        else:
          format_data = process_data(params)
          if 'json' in format_data and format_data['json']:
            data = format_data['json']
          else:
            data = '解析失败'
      else:
        format_data = process_data(params)
        if 'json' in format_data and format_data['json']:
          data = format_data['json']
        else:
          data = '解析失败'
      return data
    elif grib_col is not None and 'code' in grib_col:
      logger.info('任务出错')
      if 'message' in grib_col and grib_col['message']:
        return grib_col['message']
      else:
        return "处理出错"
    else:
      return "内部处理出错"
  except Exception as e:
    return e


def process_raster(params):
  try:
    grib_col = check_grib_exit(params)

    if grib_col is not None and grib_col['file_path']:
      cols = process_db.query_process(
        params['date'],
        params['gfsTime'],
        params['res'],
        params['forecastsTime'],
        params['bbox'],
        params['level'],
        params['variables'],
        params['file_name']
      )

      data = []

      # 此处表明grib文件已经下载过
      if cols and len(cols) > 0:
        col = cols[0]
        # 当存在json路径，表明已经处理过，直接读取数据返回
        if 'raster_file_path' in col and col['raster_file_path']:
          path = os.path.join(BASE_RASTER_DIR, col['raster_file_path'])
          path = path.replace('.png', '.json')
          with open(path) as json_file:
            data = json.load(json_file)
        else:
          format_data = process_data(params)
          if 'raster' in format_data and format_data['raster']:
            data = format_data['raster']
          else:
            data = '解析失败'
      else:
        format_data = process_data(params)
        if 'raster' in format_data and format_data['raster']:
          data = format_data['raster']
        else:
          data = '解析失败'
      return data
    elif grib_col is not None and 'code' in grib_col:
      logger.info('任务出错')
      if 'message' in grib_col and grib_col['message']:
        return grib_col['message']
      else:
        return "处理出错"
    else:
      return "内部处理出错"

  except Exception as e:
    return e


if __name__ == '__main__':
  try:
    OUTPUT = os.path.abspath(
      os.path.join(os.getcwd(), './static/data/20220927/12/0p25/f000/uv.grib'))
    # read_data(OUTPUT, '2020052518_1p00_uv.png')
    # gfd_to_tile(OUTPUT)
    data = read_data(OUTPUT, {
      'elementEnum': [
        'UGRD',
        'VGRD'
      ]
    })
    params = {}
    params.__setitem__('raster_file', './static/raster')
    params.__setitem__('file_name', 'uv')
    params.__setitem__('file_name_mc', 'uv-mc')
    format_to_png(data['data'], data['headers'], params)
    a = np.zeros((1, 2, 2))
    np.concatenate((a, np.zeros((1, 2, 2))), axis=0)
    print(a)
  except Exception as ex:
    print(ex)
