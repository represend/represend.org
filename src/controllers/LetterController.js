import path from "path"
import fs from "fs"

import keyset from "../../data/generated/keyset.json"

var LetterController = {
  standardLetterPath: path.join("data", "generated", "standard", "letter.json"),
  keyset: new Set(keyset)
};

// Try API to see id format: https://developers.google.com/civic-information/docs/v2/representatives/representativeInfoByAddress
// Example Ids: 
// "ocd-division/country:us/state:il/place:chicago"
// "ocd-division/country:us/state:il/county:cook", 
const buildLetterPath = (divisionIDs) => {
  let letterPath = ""
  // Filter place and county
  for (let i = 0; i < divisionIDs.length; i++) {
    let id = divisionIDs[i]
    let pathComponents = ["data", "generated"]
    let idComponents = id.split("/")
    if (idComponents.length === 4) {
      // Country
      pathComponents.push(idComponents[1].split(":")[1])
      // State
      pathComponents.push(idComponents[2].split(":")[1])
      // Place or County
      pathComponents.push(...idComponents[3].split(":"))
      // Overwrite or not
      pathComponents[pathComponents.length-1] = `${pathComponents[pathComponents.length-1]}.json`
      if (!letterPath || pathComponents[2] === "place") {
        letterPath = path.join(...pathComponents)
      } 
    }
  }
  return letterPath
}

LetterController.query = (divisionIDs) => {
  return new Promise((resolve, reject) => {
    let letterPath = buildLetterPath(divisionIDs)
    if (!letterPath || !LetterController.keyset.has(letterPath)) {
      letterPath = LetterController.standardLetterPath
    }
    fs.readFile(path.join(process.cwd(), letterPath), "utf-8", (error, data) => {
      if (error) {
        reject({ message: error.message })
      }
      resolve(JSON.parse(data))
    })
  });
}

export default LetterController;
