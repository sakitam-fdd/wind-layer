import re
from flask import abort

"""
检查参数，如果标识为必传且参数不存在，则直接返回400
如果为非必填参数且设置了默认值，那么将默认值赋值到参数中
"""


def check_fields(enum, params, abortAction):
  params = params.to_dict()
  for e in enum:
    if e['required'] == True:
      if e['value'] in params:
        key = e['value']
      elif abortAction == True:
        abort(400)
    else:
      if e['value'] not in params and e['default']:
        params.__setitem__(e['value'], e['default'])
  return params


"""
提取字符串中的数字
"""
def str_to_int(str):
  num = ''
  nums = re.findall(r"\d+\.?\d*", str)
  # map(lambda str: str.lower(), nums)
  for item in nums:
    num += item
  return int(num)
