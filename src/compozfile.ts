// Copyright 2018 Myabuy LLC. All rights reserved.
// Use of this source code is governed by a MIT-style license that can be found
// in the LICENSE file.

import iconDoc = require("./assets/file-doc.png")
import iconImg = require("./assets/file-image.png")
import iconOth = require("./assets/file-others.png")
import iconPdf = require("./assets/file-pdf.png")
import iconPpt = require("./assets/file-ppt.png")
import iconTxt = require("./assets/file-txt.png")
import iconXls = require("./assets/file-xls.png")

import imgStateError = require("./assets/state-error.svg")
import imgStateUploading = require("./assets/state-uploading.gif")

import { FileState } from "./filestate"

const classCompozFile = "compoz-file"
const classDelete = "delete"

export interface ICompozFile {
	raw: File | null
	id: number
	name: string
	size: number
	type: string
}

type DeleteBeforeCb = () => Promise<boolean>
type DeleteAfterCb = () => void

export class CompozFile {
	public id = 0
	public name = ""
	public size = 0
	public type = ""
	public raw: File | null = null
	public el = document.createElement("div")
	public elIcon = document.createElement("img")
	public state!: FileState
	public onDeleteBefore: DeleteBeforeCb
	public onDeleteAfter: DeleteAfterCb

	constructor(
		cfi: ICompozFile,
		onDeleteBefore: DeleteBeforeCb,
		onDeleteAfter: DeleteAfterCb,
	) {
		if (cfi.raw) {
			this.raw = cfi.raw
			this.id = 0
			this.name = cfi.raw.name
			this.size = cfi.raw.size
			this.type = cfi.raw.type
			this.state = FileState.LOCAL
		} else {
			this.id = cfi.id
			this.name = cfi.name
			this.size = cfi.size
			this.type = cfi.type
			this.state = FileState.SUCCESS
		}

		this.onDeleteBefore = onDeleteBefore
		this.onDeleteAfter = onDeleteAfter

		this.el.classList.add(classCompozFile)

		const elDummy = document.createElement("div")
		this.el.appendChild(elDummy)

		this.createElName()
		this.createElIcon()
		this.createElDelete()
	}

	public setState(state: FileState) {
		this.state = state

		switch (state) {
			case FileState.UPLOADING:
				this.elIcon.src = imgStateUploading
				break
			case FileState.SUCCESS:
				this.updateIcon()
				break
			default:
				this.elIcon.src = imgStateError
				break
		}
	}

	private createElName() {
		const elName = document.createElement("div")
		elName.classList.add("name")

		let name = this.name
		const len = name.length
		if (len > 20) {
			elName.title = this.name
			name = name.substring(0, 8) + "..." + name.substring(len - 8, len)
		}

		elName.innerText = name
		this.el.appendChild(elName)
	}

	private createElIcon() {
		this.elIcon.classList.add("icon")
		this.el.appendChild(this.elIcon)
		this.updateIcon()
	}

	private updateIcon() {
		const type = this.type

		if (
			type === "application/msword" ||
			type === "application/vnd.oasis.opendocument.text" ||
			type === "application/vnd.oasis.opendocument.text-master" ||
			type === "application/vnd.oasis.opendocument.text-template" ||
			type === "application/vnd.oasis.opendocument.text-web" ||
			type ===
				"application/vnd.openxmlformats-officedocument.wordprocessingml.document"
		) {
			this.elIcon.src = iconDoc
			return
		}

		if (
			type === "application/vnd.ms-powerpoint" ||
			type === "application/vnd.oasis.opendocument.presentation" ||
			type ===
				"application/vnd.oasis.opendocument.presentation-template" ||
			type ===
				"application/vnd.openxmlformats-officedocument.presentationml.presentation"
		) {
			this.elIcon.src = iconPpt
			return
		}

		if (
			type === "application/vnd.ms-excel" ||
			type === "application/vnd.oasis.opendocument.spreadsheet" ||
			type ===
				"application/vnd.oasis.opendocument.spreadsheet-template" ||
			type ===
				"application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
		) {
			this.elIcon.src = iconPpt
			return
		}

		if (type === "application/pdf") {
			this.elIcon.src = iconPdf
			return
		}

		if (type.substring(0, 5) === "image") {
			this.elIcon.src = iconImg
			return
		}

		if (type.substring(0, 4) === "text") {
			this.elIcon.src = iconTxt
			return
		}

		this.elIcon.src = iconOth
	}

	private createElDelete() {
		const svc = this
		const elDelete = document.createElement("span")

		elDelete.innerText = "X"
		elDelete.classList.add(classDelete)

		elDelete.onclick = e => {
			svc.onDeleteBefore().then((ok: boolean) => {
				if (ok && svc.el.parentNode) {
					svc.el.parentNode.removeChild(this.el)
					svc.onDeleteAfter()
				}
			})
		}

		this.el.appendChild(elDelete)
	}
}
