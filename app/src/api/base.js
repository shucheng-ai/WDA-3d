import axios from 'axios';

let timeout = 1000 * 60 * 2; // 60*2秒超时

const ERROR_MSG = {
  1: 'Upload timeout. Please check you network and try again.\n', // 上传失败，网速过慢
  2: 'Server not responding, try again later.\n', // 服务器超时 === 504
};

const baseRequests = async (api, data, method, config) => {
  method = method ? method : 'get';
  let now = new Date();
  const promise = new Promise(function(resolve, reject) {
    let axios_config = {
      method: method,
      url: api,
      timeout: timeout,
      data: data,
    };
    if (config) {
      axios_config.config = config;
    }
    console.log(`${api} start at ${now}`);
    axios(axios_config).then(
      (res) => {
        console.log(`${api} end at ${new Date()}`);
        console.log(`=====${api} running ${new Date() - now}=====`);
        resolve(res);
      },
      (e) => {
        console.warn(`${api} request fail.`);
        console.warn(e);
        reject({ status: -1, err_msg: ERROR_MSG });
      }
    );
  });
  return promise;
};

const Request = function(api, data) {
  return baseRequests(api, data, 'get');
};

const RequestPOST = function(api, data) {
  return baseRequests(api, data, 'post');
};

const RequestPUT = function(api, data) {
  return baseRequests(api, data, 'put');
};

const RequestDELETE = function(api, data) {
  return baseRequests(api, data, 'delete');
};

const RequestUPLOAD = (api, data, config) => {
  return baseRequests(api, data, 'post', config);
};

export { Request, RequestPOST, RequestPUT, RequestDELETE, RequestUPLOAD };
export default baseRequests;
