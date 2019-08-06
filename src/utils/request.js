import fetch from 'dva/fetch'

/**
 *
 * @param {object} response
 * 检查返回的response的status是否是正常状态2xx 如果是的话返回response 如果返回错误的话解析返回体中的statusText 并且返回错误
 */
function checkStatus(response) {
  if (response.status >= 200 && response.status < 300) {
    return response
  }

  const error = new Error(response.statusText)
  error.response = response
  throw error
}

/**
 * Requests a URL, returning a promise.
 *
 * @param  {string} url       The URL we want to request
 * @param  {object} [options] The options we want to pass to "fetch"
 * @return {object}           An object containing either "data" or "err"
 */
export default async function request(url, options) {
  const response = await fetch(url, options);

  checkStatus(response);

  const data = await response.json();

  const ret = {
    data,
    headers: {},
  };
  //如果返回头里面有'x-total-count'字段的话 在返回的ret中添加字段对应的数据
  if (response.headers.get('x-total-count')) {
    ret.headers['x-total-count'] = response.headers.get('x-total-count');
  }

  return ret;
}
