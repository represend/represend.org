# Letter Requirements and Guidelines
All letters MUST have four headers, each denoted by a `#` sign followed by whitespace:
* `# title`
* `# recipients`
* `# subject`
* `# body`

Data should follow underneath each header! Data for `title` and `recipients` are optional, whereas `subject` and `body` are required. The default behavior of the data replaces any search result, except some special functions (see below).  
  
If `title` data is omitted, then the title will default to the city or county.  
if `recipients` data is omitted, then the recipients will default to search recipients.

## Formatting
* `# title` - Single-line
* `# recipients` - Multi-line, in the format `* name@email.com, Title Firstname Lastname`
* `# subject` - Single-line
* `# body` - Multi-line (newline preserved)

## Special Functions
If you include an `add` keyword at the end of `# recipients` such that it looks like `# recipients add`, it will append the list onto the default search recipients. The default behavior replaces search recipients.

## Variable Tags
Variable tags are available to be used for letter population:
* `[location]` - Autofilled to city or county
* `[district]` - User prompted
* `[name]` - User prompted
* `[address]` - User prompted
* `[email]` - User prompted
* `[phone]` - User prompted

## Example
See `example.md` for an example