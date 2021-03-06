# PostCSS Spacing

Generate spacing utilities classes with margins and paddings. The classes are named using the format
`{property}{sides}-{size}`.

Where property is one of:

- `m` - for classes that set `margin`
- `p` - for classes that set `padding`

Where sides is one of:

- `t` - for classes that set `margin-top` or `padding-top`
- `b` - for classes that set `margin-bottom` or `padding-bottom`
- `l` - for classes that set `margin-left` or `padding-left`
- `r` - for classes that set `margin-right` or `padding-right`
- `x` - for classes that set both `*-left` and `*-right`
- `y` - for classes that set both `*-top` and `*-bottom`
- blank - for classes that set a `margin` or `padding` on all 4 sides of the element

The size increases exponentially:

- `auto` - for classes that set the `margin` to `auto`
- `0` - for classes that eliminate the `margin` or `padding` by setting it to `0`
- `1` - for classes that set the `margin` or `padding` to unit * `0.25`
- `2` - for classes that set the `margin` or `padding` to unit * `0.5`
- `3` - for classes that set the `margin` or `padding` to unit * `1`
- `4` - for classes that set the `margin` or `padding` to unit * `2`

And so on.

You can also use negative margins by prending `n` to the size such as `ml-n2`.

## Usage

Install plugin.

```
npm i -D @daltontan/postcss-spacing
```

Add to you PostCSS config:

```
module.exports = {
	plugins: [
		require('@daltontan/postcss-spacing'),
	]
}
```

Add to your CSS file:

```
@generate-spacing();
```

The argument is important because cssnano will remove it if it does not have an argument.

## Options

### unit

Default: 0.25

The base unit that will be used to calculate sizes for every subsequent increase in spacing. 

### start

Default: 0

The unit size to start from. Set to negative number to generate negative margins.

### end

Default: 4

The highest unit size to generate. Increasing this will generate more classes with exponentially increasing size.
