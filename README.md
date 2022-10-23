# kodeine for Visual Studio Code

Write Kustom formulas in VS Code!  
Get it from the [VS Code Marketplace](https://marketplace.visualstudio.com/items?itemName=tored.kodeine).

**DISCLAIMER:**  
**THIS EXTENSION IS NOT AN OFFICIAL KUSTOM PRODUCT! DO NOT ASK THE KUSTOM DEVELOPER QUESTIONS ABOUT THIS EXTENSION!**

*Long text warning - if you are on GitHub, use the menu button to the left of README.md above to access a table of contents.*

## Features

- Syntax highlighting for kode.
- Live formula evaluation.
- Live evaluation steps (for debugging).
- Informative error and warning messages in the problems tab, highlighting the exact position of the problem.
- Basic text global support (read more below).
- Snippets:
    - `fl` - basic `fl()` call
    - Special character `tc(utf)` snippets:
        - `!`, `$`, `%`, `&`, `(`, `)`, `*`, `+`, `-`, `/`, `<`, `=`, `>`, `^`, `|`, `~`, `"`, `,`  
        Prefix a special character with a backslash (`\`) to get the `tc(utf)` snippet for it (ex. `\$`).
        - `\n` - new line character
        - `\ ` - space


## Limitations

- Currently implemented:
    - All operators: `+`, `-`, `*`, `/`, `^`, `%`, `=`, `!=`, `<`, `>`, `<=`, `>=`, `~=`, `|`, `&`
    - Functions:  
    `ce()`, `cm()`, `df()`, `dp()`, `fl()`, `gv()`, `if()`, `mu()`, `tc()`, `tf()`
        - `df(Z)` and any other timezone related stuff is not implemented (yet).
        - `df()` has two vscode settings related to it (read more below).
    - Other functions are not implemented (yet).
- Globals are not saved after VS Code is closed.
- Currently in alpha, meaning the code might not be stable and you might find bugs.  
Also, There are many features that would be cool to have but aren't implemented (yet).
- The parsing & evaluation engine was written without access to the original source code and is not a 1:1 port. I am aware of some inconsistencies, but there might well be others I am not aware of.  
I (obviously) recommend testing your formula in Kustom before releasing it in a preset.
    - `ce()` results can be off by 1 or 2, the reason seems to be some float handling differences between Java and JavaScript (hard to confirm though).
    - Floating point numbers in general don't work the same as in Kustom if you venture anywhere outside of the most basic use cases. If you want to know why, play around with them a bit in Kustom itself.



## Using the extension


### Getting started

The extension registers a language called `kode` in VS Code.
To use kodeine features, you need a file with its language set to `kode`.

**H O W**  

- Create a file with a `.kode` extension. This will automatically set its language to `kode`.

**OR**

- Create a file and manually set its language to `kode` in one of three  ways:
    1. Click the *"Select a language"* link that appears after a new file is created,
    2. Hit `Ctrl + Shift + P` to open the Command Palette. Type `Change Language Mode`, hit `Enter`, type `kode`, hit `Enter` again.
    3. Click on `Plain Text` on the status bar, in the bottom right corner. A language list will appear - type `kode` and hit `Enter`.

When you set a file's language is set to `kode`, you should see syntax highlighting and have access to snippets.

### Viewing live formula evaluation results

Opening a file with its language set to `kode` should automatically bring up an output channel showing live evaluation results. You can always bring that output channel up easily using a command:

1. Hit `Ctrl + Shift + P` to open the Command Palette.
2. Type `Show formula` - a command called `Show formula result window` will come up. Hit `Enter`.

### Viewing live formula evaluation steps (debugging formulas)

When a file with its language set to `kode` is active:

1. Hit `Ctrl + Shift + P` to open the Command Palette. 
2. Type `Show evaluation steps` - a command called `Show formula evaluation steps beside active editor` will come up. Hit `Enter`. 

The evaluation steps will automatically refresh every time you edit your formula.

### Using globals

#### Adding a global:

When a file with its language set to `kode` is active:

1. Hit `Ctrl + Shift + P` to open the Command Palette. 
2. Type `Add Global` - a command called `Add a text global from active document` will come up. Hit `Enter`.
3. Enter a name for the global in the window that pops up and hit `Enter` again. 
    + If an error message pops up, read it and fix your name accordingly (or type `!` after the name to override the warning).

#### Viewing globals:

The extension adds a view to your Explorer tab, called "Global List". Clicking on globals on the list brings up the document that global is linked with.  
You can also easily delete individual globals or clear all globals using buttons on the list.


#### Removing a global:

If you don't want to use the Global List GUI, You can also delete a global using a command:

1. Hit `Ctrl + Shift + P` to open the Command Palette.
2. Type `Remove global` - a command called `Remove a global` will come up. Hit `Enter`.
3. Select the global to be removed from the list that pops up and hit `Enter` again.


### Viewing the Formula Evaluation Tree

The extension adds a view to your Run and Debug tab, called "Formula Evaluation Tree". This view shows what objects the kodeine parser created from your formula text and what each element of your formula returned along the way.


### Settings

kodeine contributes two settings to vscode:
- `kodeine.clockMode` (`auto`, `12h` or `24h`)  
Equivalent to a Kustom setting. Affects `df(h)`, `df(k)` and `df(a)`.
- `kodeine.firstDayOfTheWeek` (one of `mon`, `tue`, `wed`, `thu`, `fri`, `sat`, `sun`)  
Equivalend to a Kustom setting. Affects `df(e)`.


### Tips & Tricks

- Use [scrcpy](https://github.com/Genymobile/scrcpy) to mirror your phone screen to your computer. `scrcpy` also supports clipboard mirroring, which makes transferring your formulas between vscode and your phone easy.
- Until functions like `wi(icon)` are implemented, you can instead create globals like `gv(wi_icon)` to debug your formulas for different values.
- Don't be afraid to add newlines, tabs and spaces to your formulas!  
Whitespace between `$` is ignored during evaluation, but will be preserved in the evaluation steps window. It can help a ton with making your formula more readable and easier to debug.
- Check out [vscode tips and tricks](https://github.com/microsoft/vscode-tips-and-tricks/blob/master/README.md) as well!


## What is Kustom and what are formulas?

Kustom is a family of Android apps dedicated to customizing your homescreen by providing a WYSIWYG editor.  
Most properties in that editor can be set to a formula, meaning they can dynamically update based on current time, device status and more.

**DISCLAIMER ONCE AGAIN:**  
**THIS EXTENSION IS NOT AN OFFICIAL KUSTOM PRODUCT! DO NOT ASK THE KUSTOM DEVELOPER QUESTIONS ABOUT THIS EXTENSION!**

#### Visit the Kustom homepage (official docs, FAQs etc.)

- [kustom.rocks](https://kustom.rocks/)

#### Get Kustom apps from the Play Store

- [KLWP - Kustom Live Wallpaper Maker](https://play.google.com/store/apps/details?id=org.kustom.wallpaper)
- [KWGT - Kustom Widget Maker](https://play.google.com/store/apps/details?id=org.kustom.widget)

#### Learn more

- [Kode basics guide](https://docs.google.com/document/d/1Uv3UkTWrSWKEuVVZR0wDYYNrplR99GoRLO0p5m3n6aM/edit)
- [Kustom Subreddit](https://www.reddit.com/r/kustom)
- [Kustom Discord server](https://discord.gg/XhDkh3SFNt) (contains useful resources and helpful people)


## Contact the developer

Have any questions about the extension? Spotted a bug? It crashed? You like it a lot?
- Preferred method: [kodeine Discord server](https://discord.gg/ZPvjV7sxEP)
- But you can also email me: [thetored@gmail.com](mailto:thetored@gmail.com)

## Using the engine in your own project

If you would like to use the engine I built in your own project, contact me! I'm pretty new to js modules, node packages and all that stuff, so I don't know the best way to distribute the engine separately from the extension, but if you need it, I'm more than happy to help.

## License

kodeine is available under the MIT license. See the LICENSE file for more info.
