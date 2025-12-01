import { onCleanup, onMount, splitProps } from "solid-js";
import type { JSX } from "solid-js/jsx-runtime";
import videojs from "video.js";
import "video.js/dist/video-js.css";
import type Player from "video.js/dist/types/player";
import { logger } from "~/utils";

interface Props extends JSX.VideoHTMLAttributes<HTMLVideoElement> {
	fluid?: boolean;
	player?: Player;
	synchronize?: string[];
}

interface VideoSyncMessage {
	event: "play" | "pause" | "ended" | "volumechange";
	sender: string;
	recipients: string[];
	volume?: number;
	muted?: boolean;
}

export default function Video(_props: Props) {
	const [props, rest] = splitProps(_props, [
		"src",
		"id",
		"fluid",
		"muted",
		"player",
		"synchronize",
	]);
	let player: Player;
	let channel: BroadcastChannel | undefined;
	// Flag to prevent infinite sync loops
	let isSyncingFromRemote = false;

	onMount(() => {
		if (props.id && !props.player) {
			player = videojs(props.id, {
				fluid: props.fluid,
				aspectRatio: "16:9",
			});
		} else if (props.player) {
			player = props.player;
		}

		player.ready(() => {
			player.play();
		});

		if (props.synchronize && props.synchronize.length) {
			channel = new BroadcastChannel("sync-video-playback");

			const onPlay = () => {
				if (isSyncingFromRemote) return;
				logger.info("HANDLING PLAY SYNCHRONIZATION");
				channel?.postMessage({
					event: "play",
					sender: props.id,
					recipients: props.synchronize,
				} as VideoSyncMessage);
			};

			const onPause = () => {
				if (isSyncingFromRemote) return;
				logger.info("HANDLING PAUSE SYNCHRONIZATION");
				channel?.postMessage({
					event: "pause",
					sender: props.id,
					recipients: props.synchronize,
				} as VideoSyncMessage);
			};

			const onEnded = () => {
				if (isSyncingFromRemote) return;
				logger.info("HANDLING ENDED SYNCHRONIZATION");
				channel?.postMessage({
					event: "ended",
					sender: props.id,
					recipients: props.synchronize,
				} as VideoSyncMessage);
			};

			const onVolumeChange = () => {
				if (isSyncingFromRemote) return;
				logger.info("HANDLING VOLUME SYNCHRONIZATION");
				channel?.postMessage({
					event: "volumechange",
					sender: props.id,
					recipients: props.synchronize,
					volume: player.volume(),
					muted: player.muted(),
				} as VideoSyncMessage);
			};

			player.on("play", onPlay);
			player.on("pause", onPause);
			player.on("ended", onEnded);
			player.on("volumechange", onVolumeChange);

			const onMessage = (message: MessageEvent) => {
				const syncData = message.data as VideoSyncMessage;
				console.log("Video sync received: ", syncData, message);

				if (
					syncData.sender !== props.id &&
					syncData.recipients.includes(props.id!)
				) {
					isSyncingFromRemote = true;
					logger.info([syncData.event, player, player.pause, player.play]);

					switch (syncData.event) {
						case "pause":
							player.pause();
							break;

						case "play":
							player.play();
							break;

						case "ended":
							player.pause();
							if (player.duration()) {
								player.currentTime(player.duration());
							}
							break;

						case "volumechange":
							if (typeof syncData.volume === "number") {
								player.volume(syncData.volume);
							}
							if (typeof syncData.muted === "boolean") {
								player.muted(syncData.muted);
							}
							break;
					}

					setTimeout(() => {
						isSyncingFromRemote = false;
					}, 100);
				}
			};

			channel.addEventListener("message", onMessage);
		}
	});

	onCleanup(() => {
		if (channel) {
			channel.close();
		}
		logger.info(["Player: ", "Disposing Player"]);
		if (player && !player.isDisposed()) player.dispose();
	});

	return (
		<div data-vjs-player>
			<video
				id={props.id}
				class="video-js vjs-crater"
				src={"video://" + props.src}
				muted={typeof props.muted === "boolean" ? props.muted : true}
				{...rest}
			>
				{/* <source src={"video://" + props.src} /> */}
			</video>
		</div>
	);
}
