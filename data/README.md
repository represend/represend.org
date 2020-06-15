# Custom Letters
Custom letters are supported for each search location result. 

## Instructions for Adding
1. Go to 
[Google Civic Information API](https://developers.google.com/civic-information/docs/v2/representatives/representativeInfoByAddress?apix_params=%7B%22levels%22%3A%5B%22administrativeArea2%22%2C%22locality%22%2C%22regional%22%2C%22subLocality1%22%2C%22subLocality2%22%5D%7D)
and enter your address. 
2. The response body will include a section called `"divisions"`, and the inner keys will be labeled with long division identification strings such as `"ocd-division/country:us/state:wa/place:seattle"` or `"ocd-division/country:us/state:wa/county:king"`. Find the strings that end in either `place:x` or `county:x` and you'll be able to use it to locate the folder you need to write your custom letter in. If both strings show up, choose `place:x` as it takes precedence in our ranking. 
3. Once you have your string `"ocd-division/country:us/state:wa/place:seattle"`, you'll want to find the matching folder under `data` given the respective country, state, and place/county. If I were to write a custom letter for Seattle in this example, I would create a new file called `seattle.md` under `data/src/us/wa/place`. The final path would look like `data/src/us/wa/place/seattle.md`.
4. After creating the file, run `yarn gen` to generate the associated json files. This must always be run after any changes or additions.
4. Test if it shows up in your local when you perform a search for the area. If you would like it to show up for the place/county counterpart, you can add a duplicate as well.
5. Congrats! The your letter is now part of the search results.

Tip: You can copy-paste `src/example/letter.md` or `src/standard/letter.md` as a boilerplate letter to start you off.

## Requirements and Guidelines
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

You can prompt the user to enter their own subject line and body by replacing the entire subject or body with a tag such as:
* `[Subject Line]`
* `[Email Body]`

## Example
See `src/example/letter.md` for an example.