import { Client } from "@googlemaps/google-maps-services-js";

const client = new Client({});

var LocateController = {};

LocateController.locate = (latlng) => {
  return new Promise((resolve, reject) => {
    if (!latlng) {
      reject({message: "Invalid Coordinates"})
    }
    client.reverseGeocode({
      params: {
        latlng: latlng,
        key: process.env.GOOGLE_GEOCODING_API_KEY,
      },
      timeout: 1000,
    })
    .then((response) => {
      resolve({address: response.data.results[0].formatted_address});
    })
    .catch((error) => {
      if (error.response) {
        reject({message: error.response.data.error_message});
      } else {
        reject({message: "Unable to process request."});
      }
    });
  });
};

export default LocateController;