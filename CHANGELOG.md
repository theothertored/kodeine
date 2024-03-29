# Changelog

## [0.1.1-alpha](https://github.com/theothertored/kodeine/releases/tag/v0.1.0-alpha) - 2022-10-24

Improved reevaluation, local variables!

### Added

+ New implementations:
    + `ce(contrast)` implementation.
    + `lv()` implementation
+ Formula evaluation improvements:
    + Formulas now reevaluate on document save.
    + New command: `kodeine.reevaluateLastFormula`. Bound to `F5` by default in `kode` documents.
    + Parsed formulas are now cached, so reevaluation should be ever so slightly faster.
    + Evaluating a document that backs a global will now reevaluate all open evaluation steps documents.

### Fixed

- Syntax highlighting:
    - Opening parentheses after dollar signs (`$(`) should no longer be wrongly marked as unquoted strings.
    - Numeric literals should no longer be wrongly marked as unquoted strings.
    - Function names should no longer be wrongly marked as unquoted strings.
- `fl()` 
    - Errors thrown when parsing and evaluating the loop body formula string are no longer misatrributed to the increment formula.
- `ce()`: 
    - Color parsing is no longer more tolerant of invalid characters than Kustom.
    - Attempting to parse an invalid color now produces a warning.
    - Modes requiring an amount argument (`ce(alpha)`, `ce(sat)`, `ce(lum)`) now default to 100 instead of 0 when an amount argument is not given.

### Changed

- The code has received even more documentation comments.
- Documentation comments now use color instead of colour. Sorry, Brits!


### About local variables (`lv()`)

*This section has also been added to the readme.*

Because local variables (`lv()`) are not fully realized in Kustom at the time of writing, they have been implemented based on intentions stated by the developer, instead of the current, buggy implementation:

- `lv([name], [value])` - sets the value of a local variable named `[name]` to `[value]`
- `lv([name])` or `#name` or `"#name"` - gets the value of a local variable named `[name]`
- Local variables transfer into `fl()` and back out of body and increment forumlas.
    - `lv(a, @) + fl(0,0,0, "#a") => @`  
    (if locals didn't transfer into `fl()`, this would return `#a` instead)  
    - `fl(0,0,0, "lv(a, @)") + #a => @`  
    (if locals didn't transfer out of `fl()`, this would return `#a` instead)
- Local variables for a parent formula are directly used when evaluating globals.  
    - For example:  
    Create `gv(global)` and have it access a local variable named `a`:  
    `$#a$`  
    This will return `#a` in its own results, because the local variable was never set before being accessed.  
    Now, let's create another formula, where we set `lv(a)` and then access the value of `gv(global)`:  
    `$lv(a, @) + gv(global)$ => @`  
    If parent formula locals weren't used when evaluating globals, this would return `#a` instead.
    - This behavior is, at the time of writing, pure speculation - `lv()` throws an error when used in a text global in Kustom. If a future update implements this in a different way, or it is confirmed to not be a feature by the developer, it might be changed or removed. For now, I think this is how it should work.  
    - SIDENOTE:  
    This implementation allows you to turn text globals into functions - use `lv([argument])` or `#argument` in the global, and then, before calling `gv([function])`, set argument values using `lv([argument], [value])`.


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