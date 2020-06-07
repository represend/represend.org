import { Client } from "@googlemaps/google-maps-services-js";

const client = new Client({});

const locate = async (req, res) => {
  if (req.method==="POST") {
    return new Promise((resolve) => {
      client.reverseGeocode({
        params: {
          latlng: req.body.latlng,
          key: process.env.GOOGLE_GEOCODING_API_KEY,
        },
        timeout: 1000,
      })
      .then((response) => {
        res.setHeader("Content-Type", "application/json");
        res.status(200).send(JSON.stringify({address: response.data.results[0].formatted_address}));
        resolve();
      })
      .catch((error) => {
        res.setHeader("Content-Type", "application/json");
        if (error.response) {
          res.status(500).send(JSON.stringify({status: error.response.data.status, message: error.response.data.error_message}));
        } else {
          res.status(500).send(JSON.stringify({message: 'Unable to process request.'}))
        }
        resolve();
      });
    })
  } else {
    res.status(400).send("Not Found");
  }
}

export default locate