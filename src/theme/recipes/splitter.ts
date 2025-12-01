import { splitterAnatomy } from "../anatomy";
import { defineSlotRecipe } from "@pandacss/dev";

export const splitterSlotRecipe = defineSlotRecipe({
	className: "splitter",
	slots: splitterAnatomy.keys(),
	base: {
		root: {
			display: "flex",
			width: "full",
			height: "full",
			gap: "0",
			position: "relative",
		},
		panel: {
			overflow: "hidden",
		},
		resizeTrigger: {
			display: "flex",
			alignItems: "center",
			justifyContent: "center",
			outline: "none",
			background: "transparent",
			transition: "background 0.15s ease",
			zIndex: 10,
			_horizontal: {
				cursor: "col-resize",
				width: "6px",
				minWidth: "6px",
				marginLeft: "-3px",
				marginRight: "-3px",
				flexDirection: "column",
				"&:hover, &:focus-visible, &[data-focus]": {
					background: "brand.700/60",
				},
				"&:active, &[data-active]": {
					background: "brand.600",
				},
			},
			_vertical: {
				cursor: "row-resize",
				height: "6px",
				minHeight: "6px",
				marginTop: "-3px",
				marginBottom: "-3px",
				flexDirection: "row",
				"&:hover, &:focus-visible, &[data-focus]": {
					background: "brand.700/60",
				},
				"&:active, &[data-active]": {
					background: "brand.600",
				},
			},
			_disabled: {
				cursor: "default",
				opacity: 0.5,
			},
		},
	},
	variants: {
		variant: {
			default: {},
			subtle: {
				resizeTrigger: {
					_horizontal: {
						width: "4px",
						minWidth: "4px",
						marginLeft: "-2px",
						marginRight: "-2px",
					},
					_vertical: {
						height: "4px",
						minHeight: "4px",
						marginTop: "-2px",
						marginBottom: "-2px",
					},
				},
			},
		},
	},
	defaultVariants: {
		variant: "default",
	},
});
