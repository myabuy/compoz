// Copyright 2018 Myabuy LLC. All rights reserved.
// Use of this source code is governed by a MIT-style license that can be found
// in the LICENSE file.

import iconImg = require("./assets/file-image.png")
import iconOth = require("./assets/file-others.png")
import iconDoc = require("./assets/ic_doc.svg")
import iconPdf = require("./assets/ic_pdf.svg")
import iconPpt = require("./assets/ic_ppt.svg")
import iconTxt = require("./assets/ic_txt.svg")
import iconXls = require("./assets/ic_xls.svg")

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
	id = 0
	name = ""
	size = 0
	type = ""
	raw: File | null = null
	el = document.createElement("div")
	elIcon = document.createElement("img")
	state!: FileState
	onDeleteBefore: DeleteBeforeCb
	onDeleteAfter: DeleteAfterCb

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

	setState(state: FileState) {
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
		this.el.appendChild(this.elIcon)
		this.updateIcon()
	}

	private updateIcon() {
		const type = this.type.split("/")

		if (type[0] === "image") {
			this.elIcon.classList.add("img-icon")
			this.imageIcon()
			return
		}

		this.elIcon.classList.add("icon")

		if (type[0] === "text") {
			this.elIcon.src = iconTxt
			return
		}

		if (
			type[1] === "msword" ||
			type[1] === "vnd.oasis.opendocument.text" ||
			type[1] === "vnd.oasis.opendocument.text-master" ||
			type[1] === "vnd.oasis.opendocument.text-template" ||
			type[1] === "vnd.oasis.opendocument.text-web" ||
			type[1] ===
				"vnd.openxmlformats-officedocument.wordprocessingml.document"
		) {
			this.elIcon.src = iconDoc
			return
		}

		if (
			type[1] === "vnd.ms-powerpoint" ||
			type[1] === "vnd.oasis.opendocument.presentation" ||
			type[1] === "vnd.oasis.opendocument.presentation-template" ||
			type[1] ===
				"vnd.openxmlformats-officedocument.presentationml.presentation"
		) {
			this.elIcon.src = iconPpt
			return
		}

		if (
			type[1] === "vnd.ms-excel" ||
			type[1] === "vnd.oasis.opendocument.spreadsheet" ||
			type[1] === "vnd.oasis.opendocument.spreadsheet-template" ||
			type[1] === "vnd.openxmlformats-officedocument.spreadsheetml.sheet"
		) {
			this.elIcon.src = iconXls
			return
		}

		if (type[1] === "pdf") {
			this.elIcon.src = iconPdf
			return
		}

		this.elIcon.src = iconOth
	}

	private imageIcon() {
		const file = this.raw
		const urlImg = window.URL.createObjectURL(file)
		this.elIcon.src = urlImg
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
