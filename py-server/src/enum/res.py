from enum import Enum, unique


@unique
class ResStatus(Enum):
  SUCCESS = (200, "success")
  ARGUMENT_EXCEPTION = (400, "参数异常")
  FAIL = (500, "服务器异常")
  NOT_FIND = (404, '不存在')

class ResModel(object):
  def __init__(self, data):
    self.__data = data

  def put(self, key, val):
    self.__data[key] = val
    return self

  def build(self, type, *args):
    if not isinstance(type, ResStatus):
      raise Exception('type类型错误')

    return {
      "code": type.value[0],
      "message": args or type.value[1],
      "data": self.__data,
    }

  def success(self):
    return self.build(ResStatus.SUCCESS)


  def fail(self):
    return self.build(ResStatus.FAIL)


  def argument_exception(self):
    return self.build(ResStatus.ARGUMENT_EXCEPTION)

  def not_find(self, msg):
    return self.build(ResStatus.NOT_FIND, msg)



__all__ = ['ResStatus', 'ResModel']
