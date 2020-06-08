import { google } from "googleapis"

const civicinfo = google.civicinfo({
  version: "v2",
  auth: process.env.GOOGLE_CIVIC_API_KEY,
});

var QueryController = {};

QueryController.query = (address, levels=[], roles=[]) => {
  return new Promise((resolve, reject) => {
    if (!address) {
      reject({message: "Invalid Address"})
    }
    civicinfo.representatives.representativeInfoByAddress({
      address: address,
      includeOffices: true,
      levels: levels,
      roles: roles,
    })
    .then((response) => {
      resolve({data: response.data})
    })
    .catch((error) => {
      if (error.errors) {
        reject({message: error.errors[0].message});
      } else {
        reject({message: "Unable to process request."});
      }
    });
  })
};

export default QueryController;