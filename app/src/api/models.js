import { Request, RequestPOST } from './base';

// const DATA_API = '/api/data.json?';
const DATA_API_V1 = '/api/event/file/download?';
const DATA_API_V2 = '/api/project/fixtures?';

const getData = (uri, data) => {
  let DATA_API = data === 'v1' ? DATA_API_V1 : DATA_API_V2;
  let promise = new Promise(function(resolve) {
    let url = uri ? `${DATA_API}${uri}` : DATA_API;
    let response = Request(url, data);
    response.then((res) => {
      resolve(res.data);
    });
  });
  return promise;
};

export { getData };
