import QueryController from "../../controllers/QueryController"

const query = async (req, res) => {
  if (req.method==="POST") {
    return new Promise((resolve) => {
      QueryController.query(req.body.address)
      .then((response) => {
        res.setHeader("Content-Type", "application/json");
        res.status(200).send(JSON.stringify(response));
        resolve();
      })
      .catch((error) => {
        res.setHeader("Content-Type", "application/json");
        res.status(500).send(JSON.stringify(error))
        resolve();
      });
    });
  } else {
    res.status(400).send("Not Found")
  }
}

export default query