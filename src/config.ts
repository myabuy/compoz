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
}

export class Config {
	public subject = ""
	public participants = ""
	public avatarURL = ""
	public contentHTML = ""
	public fileMaxSize = 26214400
	public height = 0
	public hideAttachment = false
	public hideDiscard = false
	public hideExpand = false
	public hideSave = false
	public hideSend = false
	public composeStyle = ""

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
	}

	public onBlur(): void {
		return
	}
	public onContentChange(contentHTML: string): void {
		return
	}
	public onExpand(): void {
		return
	}
	public onUnexpand(): void {
		return
	}
	public onFileDeletedBefore(f: CompozFile): Promise<boolean> {
		return Promise.resolve(false)
	}
	public onDiscard(): void {
		return
	}
	public onSend(): void {
		return
	}
}
