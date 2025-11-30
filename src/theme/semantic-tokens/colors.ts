import { defineSemanticTokens } from "@pandacss/dev";

export const semanticColors = defineSemanticTokens.colors({
	bg: {
		DEFAULT: {
			value: { base: "{colors.white}", _dark: "{colors.black}" },
		},
		subtle: {
			value: { base: "{colors.gray.50}", _dark: "{colors.gray.950}" },
		},
		muted: {
			value: { base: "{colors.gray.100}", _dark: "{colors.gray.900}" },
		},
		emphasized: {
			value: { base: "{colors.gray.200}", _dark: "{colors.gray.800}" },
		},
		inverted: {
			value: { base: "{colors.black}", _dark: "{colors.white}" },
		},
		panel: {
			value: { base: "{colors.white}", _dark: "{colors.gray.950}" },
		},
		error: {
			value: { base: "{colors.red.50}", _dark: "{colors.red.950}" },
		},
		warning: {
			value: { base: "{colors.orange.50}", _dark: "{colors.orange.950}" },
		},
		success: {
			value: { base: "{colors.green.50}", _dark: "{colors.green.950}" },
		},
		info: {
			value: { base: "{colors.blue.50}", _dark: "{colors.blue.950}" },
		},
	},
	fg: {
		DEFAULT: {
			value: { base: "{colors.black}", _dark: "{colors.gray.50}" },
		},
		muted: {
			value: { base: "{colors.gray.600}", _dark: "{colors.gray.400}" },
		},
		subtle: {
			value: { base: "{colors.gray.400}", _dark: "{colors.gray.500}" },
		},
		inverted: {
			value: { base: "{colors.gray.50}", _dark: "{colors.black}" },
		},
		error: {
			value: { base: "{colors.red.500}", _dark: "{colors.red.400}" },
		},
		warning: {
			value: { base: "{colors.orange.600}", _dark: "{colors.orange.300}" },
		},
		success: {
			value: { base: "{colors.green.600}", _dark: "{colors.green.300}" },
		},
		info: {
			value: { base: "{colors.blue.600}", _dark: "{colors.blue.300}" },
		},
	},
	border: {
		DEFAULT: {
			value: { base: "{colors.gray.200}", _dark: "{colors.gray.800}" },
		},
		muted: {
			value: { base: "{colors.gray.100}", _dark: "{colors.gray.900}" },
		},
		subtle: {
			value: { base: "{colors.gray.50}", _dark: "{colors.gray.950}" },
		},
		emphasized: {
			value: { base: "{colors.gray.300}", _dark: "{colors.gray.700}" },
		},
		inverted: {
			value: { base: "{colors.gray.800}", _dark: "{colors.gray.200}" },
		},
		error: {
			value: { base: "{colors.red.500}", _dark: "{colors.red.400}" },
		},
		warning: {
			value: { base: "{colors.orange.500}", _dark: "{colors.orange.400}" },
		},
		success: {
			value: { base: "{colors.green.500}", _dark: "{colors.green.400}" },
		},
		info: {
			value: { base: "{colors.blue.500}", _dark: "{colors.blue.400}" },
		},
	},

	gray: {
		contrast: {
			value: { base: "{colors.white}", _dark: "{colors.black}" },
		},
		fg: {
			value: { base: "{colors.gray.800}", _dark: "{colors.gray.200}" },
		},
		subtle: {
			value: { base: "{colors.gray.100}", _dark: "{colors.gray.900}" },
		},
		muted: {
			value: { base: "{colors.gray.200}", _dark: "{colors.gray.800}" },
		},
		emphasized: {
			value: { base: "{colors.gray.300}", _dark: "{colors.gray.700}" },
		},
		solid: {
			value: { base: "{colors.gray.900}", _dark: "{colors.white}" },
		},
		focusRing: {
			value: { base: "{colors.gray.400}", _dark: "{colors.gray.400}" },
		},
	},

	// Brand color semantic tokens (Radix Green accent #227617)
	brand: {
		contrast: {
			value: { base: "#fff", _dark: "#fff" },
		},
		fg: {
			value: { base: "{colors.brand.950}", _dark: "{colors.brandDark.950}" },
		},
		subtle: {
			value: { base: "{colors.brand.100}", _dark: "{colors.brandDark.100}" },
		},
		muted: {
			value: { base: "{colors.brand.200}", _dark: "{colors.brandDark.200}" },
		},
		emphasized: {
			value: { base: "{colors.brand.300}", _dark: "{colors.brandDark.300}" },
		},
		solid: {
			value: { base: "{colors.brand.800}", _dark: "{colors.brandDark.800}" },
		},
		focusRing: {
			value: { base: "{colors.brand.700}", _dark: "{colors.brandDark.700}" },
		},
		// Add numeric scales with dark mode support
		50: {
			value: { base: "{colors.brand.50}", _dark: "{colors.brandDark.50}" },
		},
		100: {
			value: { base: "{colors.brand.100}", _dark: "{colors.brandDark.100}" },
		},
		200: {
			value: { base: "{colors.brand.200}", _dark: "{colors.brandDark.200}" },
		},
		300: {
			value: { base: "{colors.brand.300}", _dark: "{colors.brandDark.300}" },
		},
		400: {
			value: { base: "{colors.brand.400}", _dark: "{colors.brandDark.400}" },
		},
		500: {
			value: { base: "{colors.brand.500}", _dark: "{colors.brandDark.500}" },
		},
		600: {
			value: { base: "{colors.brand.600}", _dark: "{colors.brandDark.600}" },
		},
		700: {
			value: { base: "{colors.brand.700}", _dark: "{colors.brandDark.700}" },
		},
		800: {
			value: { base: "{colors.brand.800}", _dark: "{colors.brandDark.800}" },
		},
		900: {
			value: { base: "{colors.brand.900}", _dark: "{colors.brandDark.900}" },
		},
		950: {
			value: { base: "{colors.brand.950}", _dark: "{colors.brandDark.950}" },
		},
	},

	// Neutral color semantic tokens (Radix warm gray)
	neutral: {
		contrast: {
			value: { base: "#FFFFFF", _dark: "#FFFFFF" },
		},
		fg: {
			value: {
				base: "{colors.neutral.950}",
				_dark: "{colors.neutralDark.950}",
			},
		},
		subtle: {
			value: {
				base: "{colors.neutral.100}",
				_dark: "{colors.neutralDark.100}",
			},
		},
		muted: {
			value: {
				base: "{colors.neutral.200}",
				_dark: "{colors.neutralDark.200}",
			},
		},
		emphasized: {
			value: {
				base: "{colors.neutral.300}",
				_dark: "{colors.neutralDark.300}",
			},
		},
		solid: {
			value: {
				base: "{colors.neutral.800}",
				_dark: "{colors.neutralDark.800}",
			},
		},
		focusRing: {
			value: {
				base: "{colors.neutral.700}",
				_dark: "{colors.neutralDark.700}",
			},
		},
		// Add numeric scales with dark mode support
		50: {
			value: { base: "{colors.neutral.50}", _dark: "{colors.neutralDark.50}" },
		},
		100: {
			value: {
				base: "{colors.neutral.100}",
				_dark: "{colors.neutralDark.100}",
			},
		},
		200: {
			value: {
				base: "{colors.neutral.200}",
				_dark: "{colors.neutralDark.200}",
			},
		},
		300: {
			value: {
				base: "{colors.neutral.300}",
				_dark: "{colors.neutralDark.300}",
			},
		},
		400: {
			value: {
				base: "{colors.neutral.400}",
				_dark: "{colors.neutralDark.400}",
			},
		},
		500: {
			value: {
				base: "{colors.neutral.500}",
				_dark: "{colors.neutralDark.500}",
			},
		},
		600: {
			value: {
				base: "{colors.neutral.600}",
				_dark: "{colors.neutralDark.600}",
			},
		},
		700: {
			value: {
				base: "{colors.neutral.700}",
				_dark: "{colors.neutralDark.700}",
			},
		},
		800: {
			value: {
				base: "{colors.neutral.800}",
				_dark: "{colors.neutralDark.800}",
			},
		},
		900: {
			value: {
				base: "{colors.neutral.900}",
				_dark: "{colors.neutralDark.900}",
			},
		},
		950: {
			value: {
				base: "{colors.neutral.950}",
				_dark: "{colors.neutralDark.950}",
			},
		},
	},

	red: {
		contrast: {
			value: { base: "white", _dark: "white" },
		},
		fg: {
			value: { base: "{colors.red.700}", _dark: "{colors.red.300}" },
		},
		subtle: {
			value: { base: "{colors.red.100}", _dark: "{colors.red.900}" },
		},
		muted: {
			value: { base: "{colors.red.200}", _dark: "{colors.red.800}" },
		},
		emphasized: {
			value: { base: "{colors.red.300}", _dark: "{colors.red.700}" },
		},
		solid: {
			value: { base: "{colors.red.600}", _dark: "{colors.red.600}" },
		},
		focusRing: {
			value: { base: "{colors.red.500}", _dark: "{colors.red.500}" },
		},
	},

	orange: {
		contrast: {
			value: { base: "white", _dark: "black" },
		},
		fg: {
			value: { base: "{colors.orange.700}", _dark: "{colors.orange.300}" },
		},
		subtle: {
			value: { base: "{colors.orange.100}", _dark: "{colors.orange.900}" },
		},
		muted: {
			value: { base: "{colors.orange.200}", _dark: "{colors.orange.800}" },
		},
		emphasized: {
			value: { base: "{colors.orange.300}", _dark: "{colors.orange.700}" },
		},
		solid: {
			value: { base: "{colors.orange.600}", _dark: "{colors.orange.500}" },
		},
		focusRing: {
			value: { base: "{colors.orange.500}", _dark: "{colors.orange.500}" },
		},
	},

	green: {
		contrast: {
			value: { base: "white", _dark: "white" },
		},
		fg: {
			value: { base: "{colors.green.700}", _dark: "{colors.green.300}" },
		},
		subtle: {
			value: { base: "{colors.green.100}", _dark: "{colors.green.900}" },
		},
		muted: {
			value: { base: "{colors.green.200}", _dark: "{colors.green.800}" },
		},
		emphasized: {
			value: { base: "{colors.green.300}", _dark: "{colors.green.700}" },
		},
		solid: {
			value: { base: "{colors.green.600}", _dark: "{colors.green.600}" },
		},
		focusRing: {
			value: { base: "{colors.green.500}", _dark: "{colors.green.500}" },
		},
	},

	blue: {
		contrast: {
			value: { base: "white", _dark: "white" },
		},
		fg: {
			value: { base: "{colors.blue.700}", _dark: "{colors.blue.300}" },
		},
		subtle: {
			value: { base: "{colors.blue.100}", _dark: "{colors.blue.900}" },
		},
		muted: {
			value: { base: "{colors.blue.200}", _dark: "{colors.blue.800}" },
		},
		emphasized: {
			value: { base: "{colors.blue.300}", _dark: "{colors.blue.700}" },
		},
		solid: {
			value: { base: "{colors.blue.600}", _dark: "{colors.blue.600}" },
		},
		focusRing: {
			value: { base: "{colors.blue.500}", _dark: "{colors.blue.500}" },
		},
	},

	yellow: {
		contrast: {
			value: { base: "black", _dark: "black" },
		},
		fg: {
			value: { base: "{colors.yellow.800}", _dark: "{colors.yellow.300}" },
		},
		subtle: {
			value: { base: "{colors.yellow.100}", _dark: "{colors.yellow.900}" },
		},
		muted: {
			value: { base: "{colors.yellow.200}", _dark: "{colors.yellow.800}" },
		},
		emphasized: {
			value: { base: "{colors.yellow.300}", _dark: "{colors.yellow.700}" },
		},
		solid: {
			value: { base: "{colors.yellow.300}", _dark: "{colors.yellow.300}" },
		},
		focusRing: {
			value: { base: "{colors.yellow.500}", _dark: "{colors.yellow.500}" },
		},
	},

	teal: {
		contrast: {
			value: { base: "white", _dark: "white" },
		},
		fg: {
			value: { base: "{colors.teal.700}", _dark: "{colors.teal.300}" },
		},
		subtle: {
			value: { base: "{colors.teal.100}", _dark: "{colors.teal.900}" },
		},
		muted: {
			value: { base: "{colors.teal.200}", _dark: "{colors.teal.800}" },
		},
		emphasized: {
			value: { base: "{colors.teal.300}", _dark: "{colors.teal.700}" },
		},
		solid: {
			value: { base: "{colors.teal.600}", _dark: "{colors.teal.600}" },
		},
		focusRing: {
			value: { base: "{colors.teal.500}", _dark: "{colors.teal.500}" },
		},
	},

	purple: {
		contrast: {
			value: { base: "white", _dark: "white" },
		},
		fg: {
			value: { base: "{colors.purple.700}", _dark: "{colors.purple.300}" },
		},
		subtle: {
			value: { base: "{colors.purple.100}", _dark: "{colors.purple.900}" },
		},
		muted: {
			value: { base: "{colors.purple.200}", _dark: "{colors.purple.800}" },
		},
		emphasized: {
			value: { base: "{colors.purple.300}", _dark: "{colors.purple.700}" },
		},
		solid: {
			value: { base: "{colors.purple.600}", _dark: "{colors.purple.600}" },
		},
		focusRing: {
			value: { base: "{colors.purple.500}", _dark: "{colors.purple.500}" },
		},
	},

	pink: {
		contrast: {
			value: { base: "white", _dark: "white" },
		},
		fg: {
			value: { base: "{colors.pink.700}", _dark: "{colors.pink.300}" },
		},
		subtle: {
			value: { base: "{colors.pink.100}", _dark: "{colors.pink.900}" },
		},
		muted: {
			value: { base: "{colors.pink.200}", _dark: "{colors.pink.800}" },
		},
		emphasized: {
			value: { base: "{colors.pink.300}", _dark: "{colors.pink.700}" },
		},
		solid: {
			value: { base: "{colors.pink.600}", _dark: "{colors.pink.600}" },
		},
		focusRing: {
			value: { base: "{colors.pink.500}", _dark: "{colors.pink.500}" },
		},
	},

	cyan: {
		contrast: {
			value: { base: "white", _dark: "white" },
		},
		fg: {
			value: { base: "{colors.cyan.700}", _dark: "{colors.cyan.300}" },
		},
		subtle: {
			value: { base: "{colors.cyan.100}", _dark: "{colors.cyan.900}" },
		},
		muted: {
			value: { base: "{colors.cyan.200}", _dark: "{colors.cyan.800}" },
		},
		emphasized: {
			value: { base: "{colors.cyan.300}", _dark: "{colors.cyan.700}" },
		},
		solid: {
			value: { base: "{colors.cyan.600}", _dark: "{colors.cyan.600}" },
		},
		focusRing: {
			value: { base: "{colors.cyan.500}", _dark: "{colors.cyan.500}" },
		},
	},
});
