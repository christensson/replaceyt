# YouTrack Text Replacer App

![replaceyt icon](./public/replaceyt-icon.svg)

YouTrack app to automatically replace text in ticket or article descriptions automatically on save.
Replacements supports simple text substitution as well as pattern-based using standard javascript
regular expressions. Capture groups are supported in the replacement as well.

Some supported use-cases:

- Make links of entities referenced by a structured ID if available using a URL containing ID.
- Insert templated content instead of a placeholder word.
- Replace some abbreviation with it's full form.

See [example replacements](#example-replacements) section below for more inspiration.

![Honored YouTrack App Creator Badge](https://api.accredible.com/v1/frontend/credential_website_embed_image/badge/168044274)

## Roadmap

- Project level replacement configuration.

## Installation and Setup

### Local install

```
npm install
npm run build
```

### Upload to specific youtrack instance

```
npm run upload -- --host <YOUTRACK_URL> --token <YOUTRACK_TOKEN>
```

### Configuration

App is configurable globally under *Administration* -> *Integrations* -> *Text Replacer Config*
where text replacements for tickets and/or articles are configured.

The activated replacements are applied for all projects where the app and its bundled workflows are
active. If text replacements are not wanted for a specific project, simply don't activate the app in
that project.

The global configuration supports configuring multiple replacements, each having the following
properties:

- **Name** the name of the replacement.
  
- **Regex** (or **string**) to find for and replace.

  - If the "pattern" to search for is a regex or a plain string is controled using the small
    toggle-button right to the pattern input.

- **Replace with** is the text to replace the matched string/pattern with. The replacement supports
  both multiple lines and if the "pattern" is a regex, capture groups may be referenced using `$1`,
  `$2`, etc.

- **Active** controls if the replacement is enabled or not. Note that it's useful to not enable the
  replacement until fully tested.

Advanced settings:

- **Ignore code blocks**: If markdown code blocks should be ignored for the replacements, i.e. that
  no content within markdown code blocks should be replaced.

- **Ignore links**: If content within markdown links should be ignored, i.e. that no content within
  markdown links should be replaced.

- **Ignore inline code**: If inline code should be ignored by the replacement, i.e. that no content
  within markdown inline code should be replaced.

To create a new replacement click *Add replacement* in the end of the replacement list. To remove a
replacement, click the small trash icon in the top right of each replacement.

Note that changes to any replacements need to be saved using the *Save* button.

#### Example replacements

*Use case:* Replace github style issues of format `Username/Repository#ID` with link to it on
github.com.

* Regex: `((\w+/\w+)#(\d+))`
* Replace with: `[$1](https://github.com/$2/issues/$3)`

*Use case:* My tickets references external requirements having a structured ID of format
`REQ-<number>`, and these can be found using an URL containing that ID.

* Regex: `(REQ-(\d+))`
* Replace with: `[$1](https://myrequirements.company.com/requirement/$1)`

*Use case:* My tickets references an external document by a short abbreviation known by everyone
working with the tickets. I want to replace that with a link to the real document.

* String: `DEV-WOW-DOC`
* Replace with: `[DEV-WOW-DOC](https://mydocs.company.com/url/to/doc)`

*Use case:* I have a "definition of done" list that I want to include in some tickets.

* String: `DOD-LIST`
* Replace with:
  ```
  The following needs to be done before completion:
  - [ ] Write design documentation.
  - [ ] Implement code.
  - [ ] Implement unit-tests for code.
  ```

#### Test replacements before deployment

The configuration page has an input test text to the right of the replacements. Use this to input
some test text. When the *Test replacements* button is pressed, all replacements (regardless of if
active) are tested on that text in order to test how they work without updating any tickets or
articles.

Note that a warning is shown if applying the replacement a second time results in a different
content. In this case the one of the replacements might be recursive which might lead to unexpected
behavior.