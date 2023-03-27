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
				spacingPlugin(opts, atRule, api);
			},
		},
	};
};
module.exports.postcss = true;

const defaults = {
	unit: 0.25,
	start: 0,
	end: 4,
};

function spacingPlugin(opts, atRule, { Rule, Declaration }) {
	// use the params to overwrite the build time config
	const params = Object.fromEntries(parseParams(atRule.params));
	for (const k in params) {
		opts[k] = params[k];
	}
	// set options with defaults
	for (const k in defaults) {
		if (!opts.hasOwnProperty(k)) {
			opts[k] = defaults[k];
		}
	}

	const directions = {
		// placed in order so that they can overwrite correctly
		t: ['top'],
		r: ['right'],
		b: ['bottom'],
		l: ['left'],
		x: ['left', 'right'],
		y: ['top', 'bottom'],
		'': [],
	};

	function multiply(n) {
		let result = n ? (n < 0 ? -opts.unit : opts.unit) : 0;
		n = Math.abs(n);
		for (let i = 1; i < n; i++) {
			result *= 2;
		}
		return result;
	}

	function generate(type, alias, direction, props, multiplier) {
		const postfix = multiplier < 0 ? 'n' + Math.abs(multiplier) : multiplier;
		const rule = new Rule({ selector: `.${alias}${direction}-${postfix}` });
		if (direction === '') {
			rule.append(
				new Declaration({
					prop: type,
					value: multiply(multiplier) + 'rem !important',
				})
			);
		} else {
			props.map((cur) => {
				rule.append(
					new Declaration({
						prop: `${type}-${cur}`,
						value: multiply(multiplier) + 'rem !important',
					})
				);
			});
		}
		atRule.after(rule);
	}

	// generate margins and paddings
	for (let dir in directions) {
		// can start from negative to allow negative margins
		for (let i = opts.start; i <= opts.end; i++) {
			generate('margin', 'm', dir, directions[dir], i);
			// padding cannot be negative
			if (i >= 0) {
				generate('padding', 'p', dir, directions[dir], i);
			}
		}
	}

	// margin auto
	atRule.after(
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
	);
	atRule.after(
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
	);
	atRule.after(
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
	);
	atRule.after(
		new Rule({ selector: `.mt-a` }).append(
			new Declaration({
				prop: 'margin-top',
				value: 'auto !important',
			}),
			new Declaration({
				prop: 'display',
				value: 'block',
			})
		)
	);
	atRule.after(
		new Rule({ selector: `.mb-a` }).append(
			new Declaration({
				prop: 'margin-bottom',
				value: 'auto !important',
			}),
			new Declaration({
				prop: 'display',
				value: 'block',
			})
		)
	);
	atRule.after(
		new Rule({ selector: `.my-a` }).append(
			new Declaration({
				prop: 'margin-top',
				value: 'auto !important',
			}),
			new Declaration({
				prop: 'margin-bottom',
				value: 'auto !important',
			}),
			new Declaration({
				prop: 'display',
				value: 'block',
			})
		)
	);
	atRule.after(
		new Rule({ selector: `.m-a` }).append(
			new Declaration({
				prop: 'margin',
				value: 'auto !important',
			}),
			new Declaration({
				prop: 'display',
				value: 'block',
			})
		)
	);

	// gaps for flexbox and grid
	for (let i = Math.max(0, opts.start); i <= opts.end; i++) {
		generate('gap', 'g', '', null, i);
	}

	atRule.remove();
}

function parseParams(params) {
	return params
		.slice(1, -1)
		.split(/,\s*/)
		.map((arg) => arg.split(/:\s*/));
}

