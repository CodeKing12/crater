/**
 * NDI Sender Service
 * 
 * NOTE: The grandiose library (v0.0.4) does NOT fully support sending video frames.
 * The send functionality is only a placeholder/test for audio.
 * 
 * To properly implement NDI sending, you would need to:
 * 1. Use a different NDI library that supports sending (like a custom N-API binding)
 * 2. Use the official NDI SDK directly with a custom native module
 * 3. Use an external tool like OBS with NDI plugin
 * 
 * This file is kept as a placeholder for future implementation.
 */

import type { BrowserWindow } from "electron";
import logger from "../logger.js";

export interface NDISenderConfig {
	name: string;
	frameRate: number;
	width: number;
	height: number;
}

export interface NDISenderStatus {
	isStreaming: boolean;
	name: string;
	frameRate: number;
	resolution: { width: number; height: number };
	framesSent: number;
	errors: number;
	error?: string;
}

const DEFAULT_CONFIG: NDISenderConfig = {
	name: "Crater Bible Projection",
	frameRate: 30,
	width: 1920,
	height: 1080,
};

class NDISender {
	private config: NDISenderConfig = DEFAULT_CONFIG;
	private isStreaming = false;

	/**
	 * Check if the CPU supports NDI
	 * Note: grandiose doesn't fully support sending, so this returns false
	 */
	isSupportedCPU(): boolean {
		// Return false since sending is not supported
		return false;
	}

	/**
	 * Get the NDI SDK version
	 */
	getVersion(): string {
		return "NDI Send not supported - grandiose only supports receiving";
	}

	/**
	 * Start the NDI sender - NOT SUPPORTED
	 */
	async start(
		_window: BrowserWindow,
		config: Partial<NDISenderConfig> = {},
	): Promise<boolean> {
		this.config = { ...DEFAULT_CONFIG, ...config };
		
		logger.error("NDI sending is not supported by grandiose library", {
			message: "The grandiose npm package only supports receiving NDI streams, not sending.",
			suggestion: "Consider using OBS Studio with NDI plugin, or implement a custom NDI sender using the official NDI SDK."
		});

		return false;
	}

	/**
	 * Stop the NDI sender
	 */
	stop(): void {
		this.isStreaming = false;
		logger.debug("NDI sender stop called (was not running - sending not supported)");
	}

	/**
	 * Update the sender configuration
	 */
	async updateConfig(config: Partial<NDISenderConfig>): Promise<boolean> {
		this.config = { ...this.config, ...config };
		return true;
	}

	/**
	 * Get the current status of the NDI sender
	 */
	getStatus(): NDISenderStatus {
		return {
			isStreaming: false,
			name: this.config.name,
			frameRate: this.config.frameRate,
			resolution: {
				width: this.config.width,
				height: this.config.height,
			},
			framesSent: 0,
			errors: 0,
			error: "NDI sending is not supported by the grandiose library. It only supports receiving NDI streams."
		};
	}
}

// Singleton instance
export const ndiSender = new NDISender();

export default ndiSender;
