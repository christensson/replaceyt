# YouTrack Text Replacer App

![replaceyt icon](./public/replaceyt-icon.svg)

YouTrack app to automatically replace text in ticket description on ticket save events. Replacements
supports simple text substitution as well as pattern based using standard javascript regular
expressions. Capture groups are supported in the replacement as well.

Some supported use-cases:

- Replace some abbreviation is replaced with it's full form.
- Make links of commonly used IDs if links URLs are structured and includes ID.

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
where text replacements for all projects where app is enabled are applied.

The global configuration supports configuring multiple replacements, each having the following
properties:

- Regex (or string) to search for and replace.

- If the "pattern" to search for is a regex or a plain string. Controled using small toggle-button
  right to the pattern input.

- Replacement text. The replacement supports both multiple lines and if the "pattern" is a regex,
  capture groups may be referenced using `$1`, `$2`, etc.

- *Enabled*: If replacement is enabled or not. Note that it's useful to not enable the replacement
  until fully tested.

- *Ignore code blocks*: If code blocks should be ignored, i.e. that no content within markdown code
  blocks should be replaced using the replacement.

- *Ignore links*: If links should be ignored, i.e. that no content within markdown links should be
  replaced using the replacement.

- *Ignore inline code*: If inline code should be ignored, i.e. that no content within markdown inline
  code should be replaced using the replacement.

To create a new replacement simply click *Add replacement* on the end of the replacement list. To
remove a replacement, click the small trash icon in the top right of each replacement.

Note that changes to any replacements need to be saved using the *Save* button.

#### Test replacements before deployment

The configuration page has an input test text to the right of the replacements. Use this to input
some test text. When the *Test replacements* button is pressed, then the replacements are tested on
that text in order to test how they work without updating any tickets.