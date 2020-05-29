from enum import Enum


"""
格点数据header元信息
"""
class GribHeader(Enum):
  xmin = 'la1'  # x 最小值
  ymin = 'la2'  # y 最小值
  xmax = 'lo1'  # x 最大值
  ymax = 'la1'  # y 最大值
  nx = 'nx'  # 列数
  ny = 'ny'  # 行数
  dx = 'dx'  # x 方向间隔
  dy = 'dy'  # y 方向间隔
  unit = 'GRIB_UNIT'  # 要素单位
  refTime = 'refTime'  # 当前时间
  forecastTime = 'forecastTime'  # 预测时间
  surface = 'surface'  # 层级
  parameterNumber = 'parameterNumber'  #
  parameterCategory = 'parameterCategory'


# grib 数据字段枚举
class Grib(Enum):
  TT = 'TT'



class ELEMENT_ENUM(Enum):
  UGRD = 'UGRD'
  VGRD = 'VGRD'
  TMP = 'TMP'
