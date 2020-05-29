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
from src.config.grib import get_json_path, get_raster_path
from src.entity.process import ProcessTable

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
  bands = np.roll(bands, int(0.5 * bands.shape[2]), 2)

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

      headers.append({
        'nx': width,
        'ny': height,
        'dx': (bounds.right - bounds.left) / width,
        'dy': (bounds.top - bounds.bottom) / height,
        'bounds': bounds,
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
    bands = np.roll(bands, int(0.5 * bands.shape[shape_len]), shape_len)
    if header.has_key('value'):
      header = header.pop('value')
    extent = []
    if header.has_key('bounds'):
      # 'extent': [bounds.left, bounds.bottom, bounds.right, bounds.top],
      xmin = header.bounds.left - (header.bounds.right - header.bounds.left) / 2
      xmax = header.bounds.right - (header.bounds.right - header.bounds.left) / 2
      extent = [xmin, header.bounds.bottom, xmax, header.bounds.top]
      header = header.pop('bounds')
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

  if params['write_json'] == True and params['json_file']:
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
          params['extent'],
          params['file_name'],
          json_file_path,
        )
  return data


"""
转换为多通道png
"""


def format_to_png(data, params):
  try:
    bands = prepare_gray_png_array(data)
    image = reshape_as_image(bands)
    file = get_raster_path(params['raster_file'], f"{params['file_name']}.png")
    file_path = file.get('path')
    if file.get('exist') == True:
      # return file
      logger.info('栅格文件已存在')
    else:
      raster_file_path = os.path.join(params['raster_file'], f"{params['file_name']}.png")
      write_image(file_path, image)
      process_db.add_raster(
          params['date'],
          params['gfsTime'],
          params['res'],
          params['forecastsTime'],
          params['bbox'],
          params['level'],
          params['variables'],
          params['extent'],
          params['file_name'],
          raster_file_path,
        )
  except Exception as e:
    return e


def process_data(path, file_name, process_type=['json', 'raster']):
  try:
    data = read_data(path, {
      'elementEnum': [
        'UGRD',
        'VGRD'
      ]
    })
    if data is not None and data['headers']:
      json = format_to_json(data['headers'], {})
    elif data is not None and data['data']:
      raster = format_to_png(data['data'], {})
  except Exception as e:
    return e


if __name__ == '__main__':
  try:
    OUTPUT = os.path.abspath(os.path.join(os.getcwd(), '../../static/data/20200529/00/1p00/f000/var_ugrd-var_vgrd.grib'))
    # read_data(OUTPUT, '2020052518_1p00_uv.png')
    # gfd_to_tile(OUTPUT)
    read_data(OUTPUT, {
      'elementEnum': [
        'UGRD',
        'VGRD'
      ]
    })
    a = np.zeros((1, 2, 2))
    np.concatenate((a, np.zeros((1, 2, 2))), axis=0)
    print(a)
  except Exception as ex:
    print(ex)
