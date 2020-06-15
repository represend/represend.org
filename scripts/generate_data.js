const path = require("path")
const fs = require("fs");

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

function generateData(inPath, outDir, outFile) {
  buildLetter(inPath)
  .then((data) => {
    // Make folder
    fs.mkdir(outDir, { recursive: true }, (err) => {
      if (err) throw err;
      let outPath = path.join(outDir, outFile)
      // Write to json
      fs.writeFile(path.join(outDir, outFile), JSON.stringify(data), (err) => {
        if (err) throw err;
        console.log(`Saved data for: ${outPath}`)
      });
    });
  })
  .catch((err) => {
    throw new Error(err.message)
  })
}

function traverseFiles(dir, ignore) {
  let filePaths = []
  fs.readdirSync(dir).forEach(file => {
    let fullPath = path.join(dir, file);
    if (fs.lstatSync(fullPath).isDirectory()) {
      filePaths.push(...traverseFiles(fullPath, ignore));
    } else {
      if (!ignore.includes(file)) {
        let inPath = path.join(dir, file)
        let outDir = dir.replace("src", "generated")
        let outFile = file.split(".")[0] + ".json"
        let outPath = path.join(outDir, outFile)
        console.log(`Generating data for: ${inPath}`)
        generateData(inPath, outDir, outFile)
        filePaths.push(outPath)
      }
    }   
  })
  return filePaths
}

const ignore = ["README.md"]

// Generate data
const files = traverseFiles("data/src", ignore)

// Generate keyset
console.log("Generating keyset")
fs.writeFile("data/generated/keyset.json", JSON.stringify(files), (err) => {
  if (err) {
    console.log(`Error in saving keyset: ${err.message}`)
    throw err
  }
  console.log("Saved keyset")
});