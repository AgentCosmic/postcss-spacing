/**
 * Usage:
 * @generate-spacing();
 * cssnano will remove it if it does not have the paranthesis.
 */

module.exports = (opts = {}) => {
	return {
		postcssPlugin: 'postcss-spacing',
		AtRule: {
			'generate-spacing': (atRule, api) => {
				spacingPlugin(opts, atRule, api)
			},
		},
	}
}
module.exports.postcss = true

function spacingPlugin(opts, placeholder, { Rule, Declaration }) {
	const unit = opts.unit || 0.25
	const directions = {
		// placed in order so that they can overwrite correctly
		t: ['top'],
		r: ['right'],
		b: ['bottom'],
		l: ['left'],
		x: ['left', 'right'],
		y: ['top', 'bottom'],
		'': [],
	}

	function multiply(n) {
		let result = n ? (n < 0 ? -unit : unit) : 0
		n = Math.abs(n)
		for (let i = 1; i < n; i++) {
			result *= 2
		}
		return result
	}

	function generate(type, alias, direction, props, multiplier) {
		const postfix = multiplier < 0 ? 'n' + Math.abs(multiplier) : multiplier
		const rule = new Rule({ selector: `.${alias}${direction}-${postfix}` })
		if (direction === '') {
			rule.append(
				new Declaration({
					prop: type,
					value: multiply(multiplier) + 'rem !important',
				})
			)
		} else {
			props.map((cur) => {
				rule.append(
					new Declaration({
						prop: `${type}-${cur}`,
						value: multiply(multiplier) + 'rem !important',
					})
				)
			})
		}
		placeholder.after(rule)
	}

	const start = opts.start || 0
	const end = opts.end || 4
	for (let dir in directions) {
		// can start from negative to allow negative margins
		for (let i = start; i <= end; i++) {
			generate('margin', 'm', dir, directions[dir], i)
			if (i >= 0) {
				generate('padding', 'p', dir, directions[dir], i)
			}
		}
	}
	placeholder.after(
		new Rule({ selector: `.mr-a` }).append(
			new Declaration({
				prop: 'margin-right',
				value: 'auto !important',
			}),
			new Declaration({
				prop: 'display',
				value: 'block',
			})
		)
	)
	placeholder.after(
		new Rule({ selector: `.ml-a` }).append(
			new Declaration({
				prop: 'margin-left',
				value: 'auto !important',
			}),
			new Declaration({
				prop: 'display',
				value: 'block',
			})
		)
	)
	placeholder.after(
		new Rule({ selector: `.mx-a` }).append(
			new Declaration({
				prop: 'margin-left',
				value: 'auto !important',
			}),
			new Declaration({
				prop: 'margin-right',
				value: 'auto !important',
			}),
			new Declaration({
				prop: 'display',
				value: 'block',
			})
		)
	)
	placeholder.remove()
}
