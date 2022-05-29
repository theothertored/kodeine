# Changelog

## [0.1.0-alpha](https://github.com/theothertored/kodeine/releases/tag/v0.1.0-alpha) - 2022-05-29

Debug your kustom formulas!

### Added

+ New vscode command:
    + `Show formula evaluation steps beside active editor`:  
    Opens a window to the side of your active editor, showing your formula being evaluated step-by-step for debugging. This window will automatically refresh as you make changes to your formula.
+ `tc(utf)` snippets for more special characters:  
`!`, `$`, `%`, `&`, `(`, `)`, `*`, `+`, `-`, `/`, `<`, `=`, `>`, `^`, `|`, `~`  
Prefix a special character with a backslash (`\`) to get the `tc(utf)` snippet for it (ex. `\$`).
+ Implemented functions:
    + `df()` - date format (uses settings, see below)
    + `dp()` - date parser
    + `tf()` - timespan format
    + `cm()` - color maker
    + `ce()` - color editor
+ New vscode settings:
    + `kodeine.firstDayOfTheWeek` - for `df(e)`
    + `kodeine.clockMode` - for `df(h)`, `df(k)` and `df(a)`
+ The evaluation tree view now shows the evaluation result for each element of the formula.
+ Improved name validation when adding globals (thanks, Erik!).
+ Parser now throws an error when using a two-letter unquoted string that collides with a function name (ex. `gv(bi)` - `bi()` is a function. Kustom throws `err: null`).

### Fixed

- Whitespace tokens are now properly preserved into evaluable sources.
- Syntax higlighting:
    - Now works properly for multiline strings.
    - Now works properly for unquoted strings with spaces.
- Integers are now clamped as if they were 32 bit signed integers, which might be considered a bug, but this is how Kustom does it.
- Made string to number parsing less aggressive, to fix instances like `tc(lpad, 5, 4, 0)` returning `5` instead of `0005`.


### Changed

- Extension code has been refactored into service classes.
- Lots of documentation comments have been added.
- The engine now uses the [internal module pattern](https://medium.com/visual-development/how-to-fix-nasty-circular-dependency-issues-once-and-for-all-in-javascript-typescript-a04c987cf0de) to get rid of circular dependency issues.


## [0.0.2-alpha](https://github.com/theothertored/kodeine/releases/tag/v0.0.2-alpha) - 2022-05-09

The first published version of kodeine.

- Syntax highlighting for kode
- Live formula evaluation
    - All operators: `+`, `-`, `*`, `/`, `^`, `%`, `=`, `!=`, `<`, `>`, `<=`, `>=`, `~=`, `|`, `&`
    - Functions: `if()`, `mu()`, `tc()`, `gv()`, `fl()`
    - Other functions are not (yet) implemented.
- Informative error and warning messages in the problems tab, highlighting the exact position of the problem
- Basic text global support
- Snippets:
    - `fl` (basic `fl()` call)
    - `\n` (`tc(utf, 0a)`, returns a new line character)
    - `\"` (`tc(utf, 22)`, returns a quotation mark)
    - `\ ` (`tc(utf, 20)`, returns a space)
    - `\,` (`tc(utf, 2c)`, returns a comma)