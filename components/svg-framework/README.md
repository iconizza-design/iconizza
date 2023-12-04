# What is Iconizza?

Iconizza is the most versatile icon framework.

-   Unified icon framework that can be used with any icon library.
-   Out of the box includes 150+ icon sets with more than 200,000 icons.
-   Embed icons in HTML with SVG framework or components for front-end frameworks.
-   Embed icons in designs with plug-ins for Figma, Sketch and Adobe XD.
-   Add icon search to your applications with Iconizza Icon Finder.

For more information visit [https://iconizza.design/](https://iconizza.design/).

# Iconizza SVG framework

There are many fonts and SVG sets available, but they all have one thing in common: using any font or SVG set limits you to icons that are included in that set and forces browsers to load entire font or icons set. That limits developers to one or two fonts or icon sets.

Iconizza uses a new innovative approach to loading icons. Unlike fonts and SVG frameworks, Iconizza only loads icons that are used on the page instead of loading entire fonts. How is it done? By serving icons dynamically from publicly available JSON API (you can make a copy of script and API if you prefer to keep everything on your servers).

Iconizza SVG framework is designed to be as easy to use as possible.

Add this line to your page to load Iconizza SVG framework (you can add it to `<head>` section of the page or before `</body>`):

```html
<script src="https://code.iconizza.design/3/0.0.0/iconizza.min.js"></script>
```

or

```html
<script src="https://cdn.jsdelivr.net/npm/@iconizza/iconizza@0.0.0/dist/iconizza.min.js"></script>
```

or, if you are building a project with something like WebPack or Rollup, you can include the script by installing `@iconizza/iconizza` as a dependency and importing it in your project:

```js
import Iconizza from '@iconizza/iconizza'
```

To add any icon, write something like this:

```html
<span class="iconizza" data-icon="eva:people-outline"></span>
```

&nbsp;&nbsp;&nbsp; ![Sample](https://iconizza.design/assets/images/eva-people-outline.svg)

or this:

```html
<span class="iconizza-inline" data-icon="fa-solid:home"></span>
<a href="#">Return home!</a>
```

&nbsp;&nbsp;&nbsp; ![Screenshot](https://iconizza.design/assets/images/inline-sample.png)

That is it. Change `data-icon` value to the name of the icon you want to use. There are over 200,000 premade icons to choose from, including FontAwesome, Material Design Icons, Tabler Icons, Box Icons, Unicons, Bootstrap Icons and even several emoji sets.

Do you want to make your own icon sets? Everything you need is [available on GitHub](https://github.com/iconizza): tools for creating custom icon sets, Iconizza API application and documentation to help you.

## Web component

SVG framework was designed a while ago, when browsers had poor support for web components.

However, this is no longer an issue. All modern browsers support web components.

A newer replacement for SVG framework is available: [Iconizza Icon web component](https://iconizza.design/docs/iconizza-icon/). Consider switching to it.

## Full documentation

Below is a shortened version of documentation.

Full documentation is available on [Iconizza website](https://iconizza.design/docs/):

-   [SVG framework documentation](https://iconizza.design/docs/icon-components/svg-framework/).
-   [Iconizza API documentation](https://iconizza.design/docs/api/).
-   [Iconizza Tools documentation](https://iconizza.design/docs/libraries/tools/).

## How does it work?

The syntax is similar to icon fonts. Instead of inserting `SVG` in the document, you write a placeholder element, such `SPAN` or `I`.

Iconizza SVG framework finds those placeholders and uses the following logic to parse them:

1. Retrieves icon name from `data-icon` attribute.
2. Checks if icon exists. If not, it sends a request to Iconizza API to retrieve icon data.
3. Replaces placeholder element with `SVG`.

This is done in a fraction of a second. Iconizza SVG framework watches DOM for changes, so whenever you add new placeholders, it immediately replaces them with `SVG`, making it easy to use with dynamic content, such as AJAX forms.

## Offline usage

SVG framework is designed to be used with Iconizza API, loading icon data on demand instead of bundling it.

If you want to use icons without Iconizza API, [there are many other options available](https://iconizza.design/docs/usage/).

## Attributes

There are optional attributes to customise icon appearance.

### Vertical alignment

Code examples above use different class names: the first example uses "iconizza", the second example uses "iconizza-inline".

What is the difference?

-   "iconizza" renders icon as is, so it behaves like an image.
-   "iconizza-inline" renders adds vertical alignment to the icon, making it behave like text (inline mode).

Usually, icon fonts do not render like normal images, they render like text. Text is aligned slightly below the baseline.

Visual example to show the difference between inline and block modes:

&nbsp;&nbsp;&nbsp; ![Inline icon](https://iconizza.design/assets/images/inline.png)

Why is the inline mode needed?

-   To easily align icons within the text, such as emojis.
-   To make the transition from outdated icon fonts to SVG easier.

Use "iconizza" for decorations, use "iconizza-inline" if you want the icon to behave like an icon font.

#### data-inline attribute

In addition to using "iconizza-inline" class, you can toggle inline mode with the `data-inline` attribute.

Set value to "true" to force inline mode, set value to "false" to use block mode.

Different ways to use block mode:

```html
<span class="iconizza" data-icon="eva:people-outline"></span>
<span class="iconizza" data-icon="eva:people-outline" data-inline="false"></span>
```

Different ways to use inline mode:

```html
<span class="iconizza-inline" data-icon="eva:people-outline"></span>
<span class="iconizza" data-icon="eva:people-outline" data-inline="true"></span>
<span
	class="iconizza"
	data-icon="eva:people-outline"
	style="vertical-align: -0.125em"
></span>
```

## Iconizza API

When you use an icon font, each visitor loads an entire font, even if your page only uses a few icons. This is a major downside of using icon fonts. That limits developers to one or two fonts or icon sets.

Unlike icon fonts, Iconizza SVG framework does not load the entire icon set. Unlike fonts and SVG frameworks, Iconizza only loads icons that are used on the current page instead of loading entire icon sets. How is it done? By serving icons dynamically from publicly available JSON API.

### Custom API

Relying on a third party service is often not an option. Many companies and developers prefer to keep everything on their own servers to have full control.

Iconizza API and icon sets are all [available on GitHub](https://github.com/iconizza), making it easy to host API on your own server.

For more details see [Iconizza API documentation](https://iconizza.design/docs/api/).

You can also create custom Iconizza API to serve your own icons. For more details see [hosting custom icons in Iconizza documentation](https://iconizza.design/docs/api/hosting.html).

## Color

There are 2 types of icons: monotone and coloured.

-   Monotone icons are icons that use only 1 colour and you can change that colour. Most icon sets fall into this category: FontAwesome, Unicons, Material Design Icons, etc.
-   Coloured icons are icons that use the preset palette. Most emoji icons fall into this category: Noto Emoji, Emoji One, etc. You cannot change the palette for those icons.

Monotone icons use font colour, just like glyph fonts. To change colour, you can do this:

```html
<span class="iconizza icon-bell" data-icon="vaadin-bell"></span>
```

and add this to CSS:

```css
.icon-bell {
	color: #f80;
}
.icon-bell:hover {
	color: #f00;
}
```

Sample:

&nbsp;&nbsp;&nbsp; ![Sample](https://iconizza.design/samples/icon-color.png)

## Dimensions

By default all icons are scaled to 1em height. To control icon height use font-size:

```html
<span class="iconizza icon-clipboard" data-icon="emojione-clipboard"></span>
```

and add this to css:

```css
.icon-clipboard {
	font-size: 32px;
}
```

Sample:

&nbsp;&nbsp;&nbsp; ![Sample](https://iconizza.design/samples/icon-size.png)

you might also need to set line-height:

```css
.icon-clipboard {
	font-size: 32px;
	line-height: 1em;
}
```

You can also set custom dimensions using `data-width` and `data-height` attributes:

```html
<span
	data-icon="twemoji-ice-cream"
	data-width="32"
	data-height="32"
	class="iconizza"
></span>
```

Sample:

&nbsp;&nbsp;&nbsp; ![Sample](https://iconizza.design/samples/icon-size2.png)

## Transformations

You can rotate and flip icon by adding `data-flip` and `data-rotate` attributes:

```html
<span
	data-icon="twemoji-helicopter"
	class="iconizza"
	data-flip="horizontal"
></span>
<span data-icon="twemoji-helicopter" class="iconizza" data-rotate="90deg"></span>
```

Possible values for `data-flip`: horizontal, vertical.
Possible values for `data-rotate`: 90deg, 180deg, 270deg.

If you use both flip and rotation, the icon is flipped first, then rotated.

To use custom transformations use CSS transform rule.

```html
<span data-icon="twemoji-helicopter" class="iconizza icon-helicopter"></span>
```

```css
.icon-helicopter {
	transform: 45deg;
}
```

Samples:

&nbsp;&nbsp;&nbsp; ![Sample](https://iconizza.design/samples/icon-transform.png)

## Available icons

There are over 200,000 icons to choose from.

General collections (monotone icons):

-   [Material Symbols](https://icon-sets.iconizza.design/material-symbols/) (7000+ icons)
-   [Material Design Icons](https://icon-sets.iconizza.design/mdi/) (5000+ icons)
-   [Unicons](https://icon-sets.iconizza.design/uil/) (1000+ icons)
-   [Jam Icons](https://icon-sets.iconizza.design/jam/) (900 icons)
-   [IonIcons](https://icon-sets.iconizza.design/ion/) (1200+ icons)
-   [FontAwesome 6](https://icon-sets.iconizza.design/fa6-solid/) (2000+ icons)
-   [Bootstrap Icons](https://icon-sets.iconizza.design/bi/) (500+ icons)
-   [IcoMoon Free](https://icon-sets.iconizza.design/icomoon-free/) (400+ icons)
-   [Dashicons](https://icon-sets.iconizza.design/dashicons/) (300 icons)

and many others.

Emoji collections (mostly colored icons):

-   [Emoji One](https://icon-sets.iconizza.design/emojione/) (1800+ colored version 2 icons, 1400+ monotone version 2 icons, 1200+ version 1 icons)
-   [OpenMoji](https://icon-sets.iconizza.design/openmoji/) (3500+ icons)
-   [Noto Emoji](https://icon-sets.iconizza.design/noto/) (2000+ icons for version 2, 2000+ icons for version 1)
-   [Twitter Emoji](https://icon-sets.iconizza.design/twemoji/) (2000+ icons)
-   [Firefox OS Emoji](https://icon-sets.iconizza.design/fxemoji/) (1000+ icons)

Also, there are several thematic collections, such as weather icons, map icons, etc.

You can use browse or search available icons on the Iconizza website: https://icon-sets.iconizza.design/

Click an icon to get HTML code.

## Browser support

Iconizza SVG framework supports all modern browsers.

## License

This package is licensed under MIT license.

`SPDX-License-Identifier: MIT`

Previous versions of this package were dual-licensed under Apache 2.0 and GPL 2.0 licence, which was messy and confusing. This was later changed to MIT for simplicity.

This license does not apply to icons. Icons are released under different licenses, see each icon set for details.
Icons available by default are all licensed under some kind of open-source or free license.

© 2019-PRESENT Dennis Ollhoff
