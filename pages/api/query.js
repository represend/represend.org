import { google } from "googleapis"

const query = async (req, res) => {
  if (req.method==="POST") {
    return new Promise((resolve) => {
      res.status(200).send('test send')
      resolve('test')
    });
  } else {
    res.status(400).send("Not Found")
  }
}

export default query