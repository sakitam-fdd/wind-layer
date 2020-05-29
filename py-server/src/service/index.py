import requests
from bs4 import BeautifulSoup
from src.enum.index import noaa_site_label

def get_gfs_params(url):
  params_dict = {}
  html_doc = requests.get(url, headers = {
    'Content-Type': 'text/html;charset=UTF-8'
  })
  soup = BeautifulSoup(html_doc.text, 'html.parser')
  for page in soup.find_all('p'):
    font = page.find('font')
    if font is not None:
      content = font.get_text().strip().lower()
      # 层次信息
      if content == noaa_site_label.SURFACES.value:
        surfaces_def = []
        inputs = page.find_all('input', recursive=False)
        if len(inputs) > 0:
          for input in inputs:
            name = input.attrs['name']
            surfaces_def.append(name)
        params_dict.update(surfaces_def=surfaces_def)
      # 要素信息
      elif content == noaa_site_label.VARIABLES.value:
        variables_def = []
        inputs = page.find_all('input', recursive=False)
        if len(inputs) > 0:
          for input in inputs:
            name = input.attrs['name']
            variables_def.append(name)

        params_dict.update(variables_def=variables_def)
      elif content == noaa_site_label.DIRECTORY.value:
        params_dict.update(date_str=font.nextSibling)
      # file
      elif page.find('select'):
        options_def = []
        select = page.find('select')
        options = select.find_all('option', recursive=False)
        if len(options) > 0:
          for option in options:
            name = option.attrs['value']
            options_def.append(name)

        params_dict.update(options_def=options_def)

  return params_dict


if __name__ == '__main__':
  get_gfs_params('https://nomads.ncep.noaa.gov/cgi-bin/filter_gfs_0p25.pl?dir=%2Fgfs.20200527%2F00')
