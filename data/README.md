# Letter Requirements and Guidelines
All letters MUST have four headers, each denoted by a `#` sign followed by whitespace:
* `# title`
* `# subtitle`
* `# recipients`
* `# subject`
* `# body`

Data should follow underneath each header! Data for `title`, `subtitle`, `recipients` are optional, whereas `subject` and `body` are required. The default behavior of the data replaces any search result, except some special functions (see below).  
  
If `title` data is omitted, then the title will default to the city or county if it is the primary division result.
If `subtitle` data is omitted, then the title will default to the county if it is the secondary division result.
if `recipients` data is omitted, then the recipients will default to search recipients.

## Formatting
* `# title` - Single-line
* `# subtitle` - Single-line
* `# recipients` - Multi-line, in the format `* name@email.com, Title Firstname Lastname`
* `# subject` - Single-line
* `# body` - Multi-line (newline preserved)

## Special Functions
If you include an `add` keyword at the end of `# recipients` such that it looks like `# recipients add`, it will append the list onto the default search recipients. The default behavior replaces search recipients.

## Tags
Tags are case-sensitive keywords that allow you to populate with data pulled from civic searches or prompt users to fill in before sending.
There are three types: Predefined, Required, and Custom. All three can be used in any of the sections except `recipients`.

### Predefined Tags
Predefined variable tags are available to be used for letter autofill without user input:
* `[Location]`

### Required Tags
These variable tags are user-prompted and MUST be included in the body of letter:
* `[District]`
* `[Name]`
* `[Email]`
* `[Phone Number]`

### Custom Tags
You can specify any number of custom variable tags, which will prompt users to fill in before sending. Do not use any of the same names as predefined or required tags!
Here are some suggestions:
* `[Address]`
* `[Neighborhood]`

## Example
See `example.md` for an example