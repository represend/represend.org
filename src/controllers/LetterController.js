import path from "path"
import fs from "fs"

var LetterController = {};

// Returns {
//   title: string,
//   recepients: [{email: string, name: string}],
//   subject: string,
//   body: [string],
// }
const parse = (data) => {
  const lines = data.split(/\r?\n/);
  let parsedData = {
    title: null,
    recipients: [],
    subject: null,
    body: [],
  }
  const states = ["title", "recipient", "subject", "body"]
  let state = -1
  for (let i = 0; i < lines.length; i++) {
    let line = lines[i]

    // State check
    if (line.length > 0 && line[0] === "#") {
      state++;
      if (line != `# ${states[state]}`) {
        throw Error("Unable to parse letter")
      }
    } else if (state === 0) {
      parsedData.title = line
    } else if (state === 1) {
      let recipient = line.substr(2)
      parsedData.recipients.push(recipient.split(", "))
    } else if (state === 2) {
      parsedData.subject = line
    } else if (state === 3) {
      console.log(line)
      parsedData.body.push(line)
    }
  }
  if (state != 3) {
    throw Error("Unable to parse letter")
  }
  return parsedData
}

LetterController.query = (divisionIDs) => {
  return new Promise((resolve, reject) => {
    // return the standard letter for now before customizing
    // can use process.cwd in prod???? we will see??
    fs.readFile(path.resolve(process.cwd(), "data/standard/letter.md"), "utf-8", (error, data) => {
      if (error) {
        reject(error)
      }
      try {
        const parsedData = parse(data)
        resolve(parsedData)
      } catch (error) {
        reject({ message: error.message })
      }
    });
  });
}

export default LetterController;