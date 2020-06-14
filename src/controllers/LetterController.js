import path from "path"
import fs from "fs"

var LetterController = {
  standardLetterPath: "data/standard/letter.md"
};

const buildLetter = (path) => {
  return new Promise((resolve, reject) => {
    fs.readFile(path, "utf-8", (error, data) => {
      if (error) {
        reject(error)
      }
      try {
        const letter = parseLetter(data)
        resolve(letter)
      } catch (error) {
        reject({ message: error.message })
      }
    });
  });
}

const parseLetter = (data) => {
  const parseTags = (str) => {
    const match = str.match(/(?<=\[).+?(?=\])/g);
    return match ? match : [];
  }

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
  parsedData.body = bodyArr.join("\n");
  parsedData.tags = [...new Set(parsedData.tags)];
  // default to use search results if no recipients provided
  if (parsedData.officials.length === 0 || parsedData.emails.length === 0) {
    parsedData.add = true;
  }
  return parsedData;
}

// Try API to see id format: https://developers.google.com/civic-information/docs/v2/representatives/representativeInfoByAddress
// Example Ids: 
// "ocd-division/country:us/state:il/place:chicago"
// "ocd-division/country:us/state:il/county:cook", 
const buildLetterPath = (divisionIDs) => {
  let letterPath = ""
  // Filter place and county
  for (let i = 0; i < divisionIDs.length; i++) {
    let id = divisionIDs[i]
    let pathComponents = []
    let idComponents = id.split("/")
    if (idComponents.length === 4) {
      // Country
      pathComponents.push(idComponents[1].split(":")[1])
      // State
      pathComponents.push(idComponents[2].split(":")[1])
      // Place or County
      pathComponents.push(...idComponents[3].split(":"))
      // Overwrite or not
      pathComponents[3] = `${pathComponents[3]}.md`
      if (!letterPath || pathComponents[2] === "place") {
        letterPath = pathComponents.join("/")
      } 
    }
  }
  return letterPath
}

LetterController.query = (divisionIDs) => {
  return new Promise((resolve, reject) => {
    let letterPath = buildLetterPath(divisionIDs)
    if (!letterPath) {
      letterPath = LetterController.standardLetterPath
    }
    fs.access(path.resolve(process.cwd(), letterPath), fs.constants.F_OK | fs.constants.R_OK, (error) => {
      if (error) {
        letterPath = LetterController.standardLetterPath
      }
      buildLetter(path.resolve(process.cwd(), letterPath))
      .then((data) => {
        resolve(data)
      })
      .catch((error) => {
        reject({ message : error.message })
      })
    });
  });
}

export default LetterController;
