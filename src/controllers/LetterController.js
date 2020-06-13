import path from "path"
import fs from "fs"

var LetterController = {};

const parseTags = (str) => {
  const match = str.match(/(?<=\[).+?(?=\])/g)
  return match ? match : []
}

// Returns {
//   title: string,
//   subtitle: string,
//   emails: [string],
//   officials: [string],
//   subject: string,
//   body: [string],
//   variables: [string],
//   add: bool,
// }
const parse = (data) => {
  const lines = data.split(/\r?\n/);
  const states = ["title", "subtitle", "recipient", "subject", "body"];
  let state = -1;
  let bodyArr = [];
  let parsedData = {
    title: null,
    subtitle: null,
    officials: [],
    emails: [],
    subject: null,
    body: null,
    tags: [],
    add: false,
  };
  // Read Lines
  for (let i = 0; i < lines.length; i++) {
    let line = lines[i];
    // State check
    if (line.length > 0 && line[0] === "#") {
      state++;
      let keywords = line.split(" ");
      if (keywords.length < 2 || keywords[1] != states[state]) {
        throw Error("Unable to parse letter")
      }
      if (line === `# ${states[2]} add`) {
        parsedData.add = true;
      }
    } else if (state === 0) {
      parsedData.title = line
      parsedData.tags.push(...parseTags(line))
    } else if (state === 1) {
      parsedData.subtitle = line
      parsedData.tags.push(...parseTags(line))
    } else if (state === 2) {
      try {
        let recipient = line.substr(2).split(", ")
        parsedData.emails.push(recipient[0])
        parsedData.officials.push(recipient[1])
      } catch (error) {
        throw Error("Unable to parse letter")
      }
    } else if (state === 3) {
      parsedData.subject = line
      parsedData.tags.push(...parseTags(line))
    } else if (state === 4) {
      bodyArr.push(line)
      parsedData.tags.push(...parseTags(line))
    }
  }
  if (state != states.length-1) {
    throw Error("Unable to parse letter")
  }
  // Add body and variables
  parsedData.body = bodyArr.join("<br/>");
  parsedData.tags = [...new Set(parsedData.tags)];
  // default to use search results if no recipients provided
  if (parsedData.officials.length === 0 || parsedData.emails.length === 0) {
    parsedData.add = true;
  }
  return parsedData;
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
