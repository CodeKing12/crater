import { defineConfig } from "@pandacss/dev";
import {
	breakpoints,
	keyframes,
	tokens,
	semanticTokens,
	recipes,
	slotRecipes,
	textStyles,
	layerStyles,
	animationStyles,
	cssVarsRoot,
	globalCss,
} from "~/theme";
import {
	defaultPalette,
	neutralPalette,
	defaultSupportingPalette,
	defaultAbsenteePalette,
	PREVIEW_INDEX_WIDTH,
} from "~/utils/constants";

// Color palettes to generate
const palettes = [
	defaultPalette,
	neutralPalette,
	defaultSupportingPalette,
	defaultAbsenteePalette,
];

// Color scales (numeric)
const colorScales = [
	"50",
	"100",
	"200",
	"300",
	"400",
	"500",
	"600",
	"700",
	"800",
	"900",
	"950",
];

// Semantic color tokens
const semanticColorTokens = [
	"subtle",
	"muted",
	"emphasized",
	"inverted",
	"panel",
	"error",
	"warning",
	"success",
	"info",
	"contrast",
	"fg",
	"solid",
	"focusRing",
];

// Generate colorPalette.* values for all scales and semantic tokens
const colorPaletteValues = [
	...colorScales.map((scale) => `colorPalette.${scale}`),
	...semanticColorTokens.map((token) => `colorPalette.${token}`),
];

// Generate actual palette.scale values (e.g., "purple.400", "neutral.500")
const paletteColorValues = palettes.flatMap((palette) => [
	...colorScales.map((scale) => `${palette}.${scale}`),
	...semanticColorTokens.map((token) => `${palette}.${token}`),
]);

export default defineConfig({
	preflight: true,
	include: ["./src/**/*.{js,jsx,ts,tsx}"],
	exclude: ["./src/backend"],
	cssVarRoot: cssVarsRoot,
	globalCss,
	theme: {
		breakpoints,
		keyframes,
		tokens,
		semanticTokens,
		recipes,
		slotRecipes,
		textStyles,
		layerStyles,
		animationStyles,
	},
	staticCss: {
		css: [
			{
				properties: {
					colorPalette: palettes,
					width: [PREVIEW_INDEX_WIDTH],
					height: [PREVIEW_INDEX_WIDTH],
					margin: [PREVIEW_INDEX_WIDTH],
					padding: [PREVIEW_INDEX_WIDTH],
					paddingLeft: [PREVIEW_INDEX_WIDTH],
				},
			},
			{
				properties: {
					color: [...colorPaletteValues, ...paletteColorValues],
					backgroundColor: [...colorPaletteValues, ...paletteColorValues],
					borderColor: [...colorPaletteValues, ...paletteColorValues],
					outlineColor: [...colorPaletteValues, ...paletteColorValues],
					fill: [...colorPaletteValues, ...paletteColorValues],
					stroke: [...colorPaletteValues, ...paletteColorValues],
					ringColor: [...colorPaletteValues, ...paletteColorValues],
				},
			},
		],
	},
	jsxFramework: "solid",
	outdir: "styled-system",
});
