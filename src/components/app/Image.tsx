import { createEffect, splitProps } from "solid-js";
import type { JSX } from "solid-js/jsx-runtime";

interface Props extends JSX.ImgHTMLAttributes<HTMLImageElement> {}

export default function Image(_props: Props) {
	const [props, rest] = splitProps(_props, ["src"]);

	createEffect(() => {
		console.log(
			"Image component rendering with src:",
			props.src,
			"Full URL:",
			"image://" + props.src,
		);
	});

	return (
		<img
			src={"image://" + props.src}
			onError={(e) => console.error("Image load error:", props.src, e)}
			onLoad={() => console.log("Image loaded successfully:", props.src)}
			{...rest}
		/>
	);
}
