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
    officials: [],
    emails: [],
    subject: null,
    body: null,
    add: false,
  }
  const states = ["title", "recipient", "subject", "body"]
  let state = -1
  for (let i = 0; i < lines.length; i++) {
    let line = lines[i]

    // State check
    if (line.length > 0 && line[0] === "#") {
      state++;
      let keywords = line.split(" ")
      if (keywords.length < 2 || keywords[1] != states[state]) {
        throw Error("Unable to parse letter")
      }
      if (line === `# ${states[1]} add`) {
        parsedData.add = true
      }
    } else if (state === 0) {
      parsedData.title = line
    } else if (state === 1) {
      try {
        let recipient = line.substr(2).split(", ")
        parsedData.emails.push(recipient[0])
        parsedData.officials.push(recipient[1])
      } catch (error) {
        throw Error("Unable to parse letter")
      }
    } else if (state === 2) {
      parsedData.subject = line
    } else if (state === 3) {
      if (parsedData.body) {
        parsedData.body += "\n"
      } else {
        parsedData.body = ""
      }
      parsedData.body += line
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