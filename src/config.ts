// Copyright 2018 Myabuy LLC. All rights reserved.
// Use of this source code is governed by a MIT-style license that can be found
// in the LICENSE file.

import { CompozFile } from "./compozfile"

/**
 * IConfig define an object to configure the compose component.
 */
export interface IConfig {
	subject: string
	participants: string
	avatarURL: string
	contentHTML: string
	fileMaxSize: number
	height: number
	hideAttachment: boolean
	hideDiscard: boolean
	hideExpand: boolean
	hideSave: boolean
	hideSend: boolean
	composeStyle: string
	onBlur: () => void
	onContentChange: (contentHTML: string) => void
	onFileDeletedBefore: (f: CompozFile) => Promise<boolean>
	onExpand: () => void | null
	onUnexpand: () => void | null
	onDiscard: () => void | null
	onSend: () => void | null
	onChangeHeight: () => void | null
}

export class Config {
	subject = ""
	participants = ""
	avatarURL = ""
	contentHTML = ""
	fileMaxSize = 26214400
	height = 0
	hideAttachment = false
	hideDiscard = false
	hideExpand = false
	hideSave = false
	hideSend = false
	composeStyle = ""

	constructor(cfg: IConfig | null) {
		if (!cfg) {
			return
		}

		this.contentHTML = cfg.contentHTML ? cfg.contentHTML : ""

		if (cfg.fileMaxSize && cfg.fileMaxSize > 0) {
			this.fileMaxSize = cfg.fileMaxSize
		}
		if (cfg.height && cfg.height > 0) {
			this.height = cfg.height
		}

		this.hideAttachment = cfg.hideAttachment
		this.hideDiscard = cfg.hideDiscard
		this.hideExpand = cfg.hideExpand
		this.hideSave = cfg.hideSave
		this.hideSend = cfg.hideSend
		this.composeStyle = cfg.composeStyle
		this.onBlur = cfg.onBlur
		this.onContentChange = cfg.onContentChange
		this.onExpand = cfg.onExpand
		this.onUnexpand = cfg.onUnexpand
		this.onFileDeletedBefore = cfg.onFileDeletedBefore
		this.onDiscard = cfg.onDiscard
		this.onSend = cfg.onSend
		this.onChangeHeight = cfg.onChangeHeight
	}

	onBlur(): void {
		return
	}
	onContentChange(contentHTML: string): void {
		return
	}
	onExpand(): void {
		return
	}
	onUnexpand(): void {
		return
	}
	onFileDeletedBefore(f: CompozFile): Promise<boolean> {
		return Promise.resolve(false)
	}
	onDiscard(): void {
		return
	}
	onSend(): void {
		return
	}
	onChangeHeight(): void {
		return
	}
}
