# ES-TinyColor

> JavaScript color tooling. An ES2017 port of Brian Grinstead's [TinyColor][1] for Node > v8.0

##### Status

[![npm](https://img.shields.io/npm/v/@thebespokepixel/es-tinycolor.svg?style=flat&logo=npm)](https://www.npmjs.com/package/@thebespokepixel/es-tinycolor "npm") [![Travis](https://img.shields.io/travis/thebespokepixel/es-tinycolor.svg?branch=master&style=flat&logo=travis)](https://travis-ci.org/thebespokepixel/es-tinycolor "Travis") [![David](https://img.shields.io/david/thebespokepixel/es-tinycolor.svg?branch=master&style=flat)](https://david-dm.org/thebespokepixel/es-tinycolor/master "David")  
 [![Code-climate](https://api.codeclimate.com/v1/badges/b2bcb75bd517034aa609/maintainability?style=flat)](https://codeclimate.com/github/thebespokepixel/es-tinycolor/maintainability "Code-climate") [![Coverage](https://api.codeclimate.com/v1/badges/b2bcb75bd517034aa609/test_coverage?style=flat)](https://codeclimate.com/github/thebespokepixel/es-tinycolor/test_coverage "Coverage") [![Snyk](https://img.shields.io/snyk/vulnerabilities/github/thebespokepixel/es-tinycolor.svg?style=flat&logo=npm)](https://snyk.io/test/github/thebespokepixel/es-tinycolor "Snyk")   

##### Developer

[![Greenkeeper](https://badges.greenkeeper.io/thebespokepixel/es-tinycolor.svg)](https://greenkeeper.io/ "Greenkeeper") [![David-developer](https://img.shields.io/david/dev/thebespokepixel/es-tinycolor.svg?branch=master&style=flat)](https://david-dm.org/thebespokepixel/es-tinycolor/master#info=devDependencies "David-developer") [![Rollup](https://img.shields.io/badge/es6-module%3Amjs_%E2%9C%94-64CA39.svg?style=flat&logo=data%3Aimage%2Fsvg%2Bxml%3Bbase64%2CPHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxNCIgaGVpZ2h0PSIxNCIgdmlld0JveD0iMCAwIDE0IDE0Ij4KICA8ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPgogICAgPHBhdGggZmlsbD0iI0ZGMzMzMyIgZD0iTTEwLjkwNDI4MjQsMy4wMDkxMDY4MyBDMTEuMjM4NzA1NSwzLjU4MjgzNzEzIDExLjQyODU3MTQsNC4yNDQ4MzM2MyAxMS40Mjg1NzE0LDQuOTUwOTYzMjIgQzExLjQyODU3MTQsNi40MTc4NjM0IDEwLjYwODY5NTcsNy42OTU2MjE3MiA5LjM5MTgyNzM5LDguMzc2NTMyNCBDOS4zMDU1MjQ2OCw4LjQyNDg2ODY1IDkuMjczMTYxMTYsOC41MzIwNDkwNCA5LjMxODQ3MDA5LDguNjE4MjEzNjYgTDExLjQyODU3MTQsMTMgTDUuMjU4NjgyODEsMTMgTDIuMzM5Nzc3MjMsMTMgQzIuMTUyMTIzNDUsMTMgMiwxMi44NDgyNzU3IDIsMTIuNjUzODA0OCBMMiwxLjM0NjE5NTIyIEMyLDEuMTU0OTk2ODggMi4xNDgzMTU0MywxIDIuMzM5Nzc3MjMsMSBMNy42NjAyMjI3NywxIEM3LjcwMTU0MTQ5LDEgNy43NDExMzc2NCwxLjAwNzM1NTg4IDcuNzc3NzY2NTgsMS4wMjA5MDQyOSBDOS4wNjQ1MzgyOCwxLjE0NDU0MDA0IDEwLjE3MzM4ODQsMS44NTM4NTI5MSAxMC44MjIyOTQ5LDIuODcyNTA0MzggQzEwLjc5OTE5NTMsMi44NDQ4NDgwNiAxMC44NDQ0OTkxLDIuOTQ5MTc0NzYgMTAuOTA0MjgyNCwzLjAwOTEwNjgzIFoiLz4KICAgIDxwYXRoIGZpbGw9IiMwMDAwMDAiIGZpbGwtb3BhY2l0eT0iLjMxIiBkPSJNOC44NTcxNDI4NiwzLjU3MTQyODU3IEw2LjcxNDI4NTcxLDYuNTcxNDI4NTcgTDkuMjg1NzE0MjksNS4yODU3MTQyOSBDOS4yODU3MTQyOSw1LjI4NTcxNDI5IDkuNzE0Mjg1NzEsNC44NTcxNDI4NiA5LjI4NTcxNDI5LDQuNDI4NTcxNDMgQzkuMjg1NzE0MjksNCA4Ljg1NzE0Mjg2LDMuNTcxNDI4NTcgOC44NTcxNDI4NiwzLjU3MTQyODU3IFoiLz4KICAgIDxwYXRoIGZpbGw9IiNGQkIwNDAiIGQ9Ik0yLjg0Njc0NjAzLDEyLjk5NTg0OTUgQzMuMjY0OTIwNjIsMTIuOTk1ODQ5NSAzLjE4NTkzMDM0LDEyLjk0NjM2NjkgMy4zMTYxMTYzOCwxMi44NzM5MDU0IEMzLjYxODE3NTg3LDEyLjcwNTc3OTMgNS42ODk0NDA5OSw4LjcxMjc4NDU5IDcuNzE3NTU0NzYsNi44MjEzNjYwMiBDOS43NDU2Njg1Miw0LjkyOTk0NzQ2IDEwLjAwNDU3NjcsNS41NjA0MjAzMiA4Ljg4NDc5ODk1LDMuNTAyOTc3MjMgQzguODg0Nzk4OTUsMy41MDI5NzcyMyA5Ljc0NzgyNjA5LDUuMTQyMjA2NjUgOS4wMTQyNTMwMiw1LjI2ODMwMTIzIEM4LjQzODE4MjQxLDUuMzY3MDc1MzEgNy4xMTk5MDg0Nyw0LjEyMjk0MjIxIDcuNjExODMzOTMsMy4wMDQ5MDM2OCBDOC4wOTA4MTM5OSwxLjkxNDE4NTY0IDEwLjAxOTY3OTYsMi4xMjAxNDAxMSAxMC45MDY0NCwzLjAwOTEwNjgzIEMxMC44NzgzOTE2LDIuOTYyODcyMTUgMTAuODUwMzQzMiwyLjkxNjYzNzQ4IDEwLjgyMjI5NDksMi44NzI1MDQzOCBDMTAuMzA0NDc4NiwyLjI1MjUzOTQgOS41MDQwMjA5MiwxLjkwMzY3Nzc2IDguNzEwMDM1OTYsMS45MDM2Nzc3NiBDNy4xOTk3Mzg0OCwxLjkwMzY3Nzc2IDYuODIwMDA2NTQsMi40MjY5NzAyMyAzLjkyMDIzNTM3LDcuNjE5OTY0OTcgQzIuMzg3Nzk5MzQsMTAuMzY1NDA2NyAyLjAxMDgzMTkzLDExLjU3MzUwNzkgMi4wMDYyOTA2OSwxMi4xNjk4MTgyIEMyLDEyLjk5NTg0OTUgMi4wMDYyOTA2OSwxMi45OTU4NDk1IDIuODQ2NzQ2MDMsMTIuOTk1ODQ5NSBaIi8%2BCiAgPC9nPgo8L3N2Zz4K)](https://github.com/rollup/rollup/wiki/pkg.module "Rollup")   

##### Help

[![Inch](https://inch-ci.org/github/thebespokepixel/es-tinycolor.svg?branch=master&style=shields)](https://inch-ci.org/github/thebespokepixel/es-tinycolor "Inch") [![Gitter](https://img.shields.io/gitter/room/thebespokepixel/help.svg?style=flat)](https://gitter.im/thebespokepixel/help?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge&utm_content=badge "Gitter")   


## Installation

    npm install @thebespokepixel/es-tinycolor


## Usage

```js
import {tinycolor} from '@thebespokepixel/es-tinycolor'

const color = tinycolor("red")

color.toRgbString() // "rgba(255, 0, 0, 0.5)"
```

Call `tinycolor(input)` or `new tinycolor(input)`, and you will have an object with the following properties.  See Accepted String Input and Accepted Object Input below for more information about what is accepted.

### Accepted String Input

The string parsing is very permissive.  It is meant to make typing a color as input as easy as possible.  All commas, percentages, parenthesis are optional, and most input allow either 0-1, 0%-100%, or 0-n (where n is either 100, 255, or 360 depending on the value).

HSL and HSV both require either 0%-100% or 0-1 for the `S`/`L`/`V` properties.  The `H` (hue) can have values between 0%-100% or 0-360.

RGB input requires either 0-255 or 0%-100%.

If you call `tinycolor.fromRatio`, RGB and Hue input can also accept 0-1.

Here are some examples of string input:

#### Hex, 8-digit (RGBA) Hex

```js
tinycolor("#000");
tinycolor("000");
tinycolor("#369C");
tinycolor("369C");
tinycolor("#f0f0f6");
tinycolor("f0f0f6");
tinycolor("#f0f0f688");
tinycolor("f0f0f688");
```

#### RGB, RGBA

```js
tinycolor("rgb (255, 0, 0)");
tinycolor("rgb 255 0 0");
tinycolor("rgba (255, 0, 0, .5)");
tinycolor({ r: 255, g: 0, b: 0 });
tinycolor.fromRatio({ r: 1, g: 0, b: 0 });
tinycolor.fromRatio({ r: .5, g: .5, b: .5 });
```

#### HSL, HSLA

```js
tinycolor("hsl(0, 100%, 50%)");
tinycolor("hsla(0, 100%, 50%, .5)");
tinycolor("hsl(0, 100%, 50%)");
tinycolor("hsl 0 1.0 0.5");
tinycolor({ h: 0, s: 1, l: .5 });
tinycolor.fromRatio({ h: 1, s: 0, l: 0 });
tinycolor.fromRatio({ h: .5, s: .5, l: .5 });
```

#### HSV, HSVA

```js
tinycolor("hsv(0, 100%, 100%)");
tinycolor("hsva(0, 100%, 100%, .5)");
tinycolor("hsv (0 100% 100%)");
tinycolor("hsv 0 1 1");
tinycolor({ h: 0, s: 100, v: 100 });
tinycolor.fromRatio({ h: 1, s: 0, v: 0 });
tinycolor.fromRatio({ h: .5, s: .5, v: .5 });
```

#### Named

```js
tinycolor("RED");
tinycolor("blanchedalmond");
tinycolor("darkblue");
```

### Accepted Object Input

If you are calling this from code, you may want to use object input.  Here are some examples of the different types of accepted object inputs:

    { r: 255, g: 0, b: 0 }
    { r: 255, g: 0, b: 0, a: .5 }
    { h: 0, s: 100, l: 50 }
    { h: 0, s: 100, v: 100 }


## Methods

### getFormat

Returns the format used to create the tinycolor instance

```js
var color = tinycolor("red");
color.getFormat(); // "name"
color = tinycolor({r:255, g:255, b:255});
color.getFormat(); // "rgb"
```

### getOriginalInput

Returns the input passed into the constructer used to create the tinycolor instance

```js
var color = tinycolor("red");
color.getOriginalInput(); // "red"
color = tinycolor({r:255, g:255, b:255});
color.getOriginalInput(); // "{r: 255, g: 255, b: 255}"
```

### isValid

Return a boolean indicating whether the color was successfully parsed.  Note: if the color is not valid then it will act like `black` when being used with other methods.

```js
var color1 = tinycolor("red");
color1.isValid(); // true
color1.toHexString(); // "#ff0000"

var color2 = tinycolor("not a color");
color2.isValid(); // false
color2.toString(); // "#000000"
```

### getBrightness

Returns the perceived brightness of a color, from `0-255`, as defined by [Web Content Accessibility Guidelines (Version 1.0)](http://www.w3.org/TR/AERT#color-contrast).

```js
var color1 = tinycolor("#fff");
color1.getBrightness(); // 255

var color2 = tinycolor("#000");
color2.getBrightness(); // 0
```

### isLight

Return a boolean indicating whether the color's perceived brightness is light.

```js
var color1 = tinycolor("#fff");
color1.isLight(); // true

var color2 = tinycolor("#000");
color2.isLight(); // false
```

### isDark

Return a boolean indicating whether the color's perceived brightness is dark.

```js
var color1 = tinycolor("#fff");
color1.isDark(); // false

var color2 = tinycolor("#000");
color2.isDark(); // true
```

### getLuminance

Returns the perceived luminance of a color, from `0-1` as defined by [Web Content Accessibility Guidelines (Version 2.0).](http://www.w3.org/TR/2008/REC-WCAG20-20081211/#contrast-ratiodef)

```js
var color1 = tinycolor("#fff");
color1.getLuminance(); // 1

var color2 = tinycolor("#000");
color2.getLuminance(); // 0
```

### getAlpha

Returns the alpha value of a color, from `0-1`.

```js
var color1 = tinycolor("rgba(255, 0, 0, .5)");
color1.getAlpha(); // 0.5

var color2 = tinycolor("rgb(255, 0, 0)");
color2.getAlpha(); // 1

var color3 = tinycolor("transparent");
color3.getAlpha(); // 0
```

### setAlpha

Sets the alpha value on a current color.  Accepted range is in between `0-1`.

```js
var color = tinycolor("red");
color.getAlpha(); // 1
color.setAlpha(.5);
color.getAlpha(); // .5
color.toRgbString(); // "rgba(255, 0, 0, .5)"
```

### String Representations

The following methods will return a property for the `alpha` value, which can be ignored: `toHsv`, `toHsl`, `toRgb`

### toHsv

```js
var color = tinycolor("red");
color.toHsv(); // { h: 0, s: 1, v: 1, a: 1 }
```

### toHsvString

```js
var color = tinycolor("red");
color.toHsvString(); // "hsv(0, 100%, 100%)"
color.setAlpha(0.5);
color.toHsvString(); // "hsva(0, 100%, 100%, 0.5)"
```

### toHsl

```js
var color = tinycolor("red");
color.toHsl(); // { h: 0, s: 1, l: 0.5, a: 1 }
```

### toHslString

```js
var color = tinycolor("red");
color.toHslString(); // "hsl(0, 100%, 50%)"
color.setAlpha(0.5);
color.toHslString(); // "hsla(0, 100%, 50%, 0.5)"
```

### toHex

```js
var color = tinycolor("red");
color.toHex(); // "ff0000"
```

### toHexString

```js
var color = tinycolor("red");
color.toHexString(); // "#ff0000"
```

### toHex8

```js
var color = tinycolor("red");
color.toHex8(); // "ff0000ff"
```

### toHex8String

```js
var color = tinycolor("red");
color.toHex8String(); // "#ff0000ff"
```

### toRgb

```js
var color = tinycolor("red");
color.toRgb(); // { r: 255, g: 0, b: 0, a: 1 }
```

### toRgbString

```js
var color = tinycolor("red");
color.toRgbString(); // "rgb(255, 0, 0)"
color.setAlpha(0.5);
color.toRgbString(); // "rgba(255, 0, 0, 0.5)"
```

### toPercentageRgb

```js
var color = tinycolor("red");
color.toPercentageRgb() // { r: "100%", g: "0%", b: "0%", a: 1 }
```

### toPercentageRgbString

```js
var color = tinycolor("red");
color.toPercentageRgbString(); // "rgb(100%, 0%, 0%)"
color.setAlpha(0.5);
color.toPercentageRgbString(); // "rgba(100%, 0%, 0%, 0.5)"
```

### toName

```js
var color = tinycolor("red");
color.toName(); // "red"
```

### toFilter

    var color = tinycolor("red");
    color.toFilter(); // "progid:DXImageTransform.Microsoft.gradient(startColorstr=#ffff0000,endColorstr=#ffff0000)"

### toString

Print to a string, depending on the input format.  You can also override this by passing one of `"rgb", "prgb", "hex6", "hex3", "hex8", "name", "hsl", "hsv"` into the function.

```js
var color1 = tinycolor("red");
color1.toString(); // "red"
color1.toString("hsv"); // "hsv(0, 100%, 100%)"

var color2 = tinycolor("rgb(255, 0, 0)");
color2.toString(); // "rgb(255, 0, 0)"
color2.setAlpha(.5);
color2.toString(); // "rgba(255, 0, 0, 0.5)"
```

### Color Modification

These methods manipulate the current color, and return it for chaining.  For instance:

```js
tinycolor("red").lighten().desaturate().toHexString() // "#f53d3d"
```

### lighten

`lighten: function(amount = 10) -> TinyColor`.  Lighten the color a given amount, from 0 to 100.  Providing 100 will always return white.

```js
tinycolor("#f00").lighten().toString(); // "#ff3333"
tinycolor("#f00").lighten(100).toString(); // "#ffffff"
```

### brighten

`brighten: function(amount = 10) -> TinyColor`.  Brighten the color a given amount, from 0 to 100.

```js
tinycolor("#f00").brighten().toString(); // "#ff1919"
```

### darken

`darken: function(amount = 10) -> TinyColor`.  Darken the color a given amount, from 0 to 100.  Providing 100 will always return black.

```js
tinycolor("#f00").darken().toString(); // "#cc0000"
tinycolor("#f00").darken(100).toString(); // "#000000"
```

### desaturate

`desaturate: function(amount = 10) -> TinyColor`.  Desaturate the color a given amount, from 0 to 100.  Providing 100 will is the same as calling `greyscale`.

```js
tinycolor("#f00").desaturate().toString(); // "#f20d0d"
tinycolor("#f00").desaturate(100).toString(); // "#808080"
```

### saturate

`saturate: function(amount = 10) -> TinyColor`.  Saturate the color a given amount, from 0 to 100.

```js
tinycolor("hsl(0, 10%, 50%)").saturate().toString(); // "hsl(0, 20%, 50%)"
```

### greyscale

`greyscale: function() -> TinyColor`.  Completely desaturates a color into greyscale.  Same as calling `desaturate(100)`.

```js
tinycolor("#f00").greyscale().toString(); // "#808080"
```

### spin

`spin: function(amount = 0) -> TinyColor`.  Spin the hue a given amount, from -360 to 360.  Calling with 0, 360, or -360 will do nothing (since it sets the hue back to what it was before).

```js
tinycolor("#f00").spin(180).toString(); // "#00ffff"
tinycolor("#f00").spin(-90).toString(); // "#7f00ff"
tinycolor("#f00").spin(90).toString(); // "#80ff00"

// spin(0) and spin(360) do nothing
tinycolor("#f00").spin(0).toString(); // "#ff0000"
tinycolor("#f00").spin(360).toString(); // "#ff0000"
```

### Color Combinations

Combination functions return an array of TinyColor objects unless otherwise noted.

### analogous

`analogous: function(, results = 6, slices = 30) -> array<TinyColor>`.

```js
var colors = tinycolor("#f00").analogous();

colors.map(function(t) { return t.toHexString(); }); // [ "#ff0000", "#ff0066", "#ff0033", "#ff0000", "#ff3300", "#ff6600" ]
```

### monochromatic

`monochromatic: function(, results = 6) -> array<TinyColor>`.

```js
var colors = tinycolor("#f00").monochromatic();

colors.map(function(t) { return t.toHexString(); }); // [ "#ff0000", "#2a0000", "#550000", "#800000", "#aa0000", "#d40000" ]
```

### splitcomplement

`splitcomplement: function() -> array<TinyColor>`.

```js
var colors = tinycolor("#f00").splitcomplement();

colors.map(function(t) { return t.toHexString(); }); // [ "#ff0000", "#ccff00", "#0066ff" ]
```

### triad

`triad: function() -> array<TinyColor>`.

```js
var colors = tinycolor("#f00").triad();

colors.map(function(t) { return t.toHexString(); }); // [ "#ff0000", "#00ff00", "#0000ff" ]
```

### tetrad

`tetrad: function() -> array<TinyColor>`.

```js
var colors = tinycolor("#f00").tetrad();

colors.map(function(t) { return t.toHexString(); }); // [ "#ff0000", "#80ff00", "#00ffff", "#7f00ff" ]
```

### complement

`complement: function() -> TinyColor`.

```js
tinycolor("#f00").complement().toHexString(); // "#00ffff"
```


## Color Utilities

```js
tinycolor.equals(color1, color2)
tinycolor.mix(color1, color2, amount = 50)
```

### random

Returns a random color.

```js
var color = tinycolor.random();
color.toRgb(); // "{r: 145, g: 40, b: 198, a: 1}"
```

### Readability

TinyColor assesses readability based on the [Web Content Accessibility Guidelines (Version 2.0)](http://www.w3.org/TR/2008/REC-WCAG20-20081211/#contrast-ratiodef).

#### readability

`readability: function(TinyColor, TinyColor) -> Object`.
Returns the contrast ratio between two colors.

```js
tinycolor.readability("#000", "#000"); // 1
tinycolor.readability("#000", "#111"); // 1.1121078324840545
tinycolor.readability("#000", "#fff"); // 21
```

Use the values in your own calculations, or use one of the convenience functions below.

#### isReadable

`isReadable: function(TinyColor, TinyColor, Object) -> Boolean`.  Ensure that foreground and background color combinations meet WCAG guidelines. `Object` is optional, defaulting to `{level: "AA",size: "small"}`.  `level` can be `"AA"` or "AAA" and `size` can be `"small"` or `"large"`.

Here are links to read more about the [AA](http://www.w3.org/TR/UNDERSTANDING-WCAG20/visual-audio-contrast-contrast.html) and [AAA](http://www.w3.org/TR/UNDERSTANDING-WCAG20/visual-audio-contrast7.html) requirements.

```js
tinycolor.isReadable("#000", "#111", {}); // false
tinycolor.isReadable("#ff0088", "#5c1a72",{level:"AA",size:"small"}); //false
tinycolor.isReadable("#ff0088", "#5c1a72",{level:"AA",size:"large"}), //true
```

#### mostReadable

`mostReadable: function(TinyColor, [TinyColor, Tinycolor ...], Object) -> Boolean`.
Given a base color and a list of possible foreground or background colors for that base, returns the most readable color.
If none of the colors in the list is readable, `mostReadable` will return the better of black or white if `includeFallbackColors:true`.

```js
tinycolor.mostReadable("#000", ["#f00", "#0f0", "#00f"]).toHexString(); // "#00ff00"
tinycolor.mostReadable(tinycolor.mostReadable("#123", ["#124", "#125"],{includeFallbackColors:false}).toHexString(); // "#112255"
tinycolor.mostReadable(tinycolor.mostReadable("#123", ["#124", "#125"],{includeFallbackColors:true}).toHexString();  // "#ffffff"
tinycolor.mostReadable("#ff0088", ["#2e0c3a"],{includeFallbackColors:true,level:"AAA",size:"large"}).toHexString()   // "#2e0c3a",
tinycolor.mostReadable("#ff0088", ["#2e0c3a"],{includeFallbackColors:true,level:"AAA",size:"small"}).toHexString()   // "#000000",
```

See [index.html](https://github.com/bgrins/TinyColor/blob/master/index.html) in the project for a demo.


## Common operations

### clone

`clone: function() -> TinyColor`.
Instantiate a new TinyColor object with the same color.  Any changes to the new one won't affect the old one.

```js
var color1 = tinycolor("#F00");
var color2 = color1.clone();
color2.setAlpha(.5);

color1.toString(); // "#ff0000"
color2.toString(); // "rgba(255, 0, 0, 0.5)"
```


## Documentation

Full documentation can be found at [https://markgriffiths.github.io/es-tinycolor/][2]

[1]: https://github.com/bgrins/TinyColor

[2]: https://markgriffiths.github.io/es-tinycolor/
