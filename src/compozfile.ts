// Copyright 2018 Myabuy LLC. All rights reserved.
// Use of this source code is governed by a MIT-style license that can be found
// in the LICENSE file.

import iconDoc from "./assets/file-doc.png"
import iconImg from "./assets/file-image.png"
import iconOth from "./assets/file-others.png"
import iconPdf from "./assets/file-pdf.png"
import iconPpt from "./assets/file-ppt.png"
import iconTxt from "./assets/file-txt.png"
import iconXls from "./assets/file-xls.png"

import { FileState } from "./filestate.ts"

const classCompozFile = "compoz-file"
const classDelete = "delete"

export class CompozFile {

	public file: File
	public el: HTMLElement
	public state: FileState
	private onDelete: Function

	constructor(file: File, onDelete: Function) {
		this.file = file
		this.onDelete = onDelete
		this.el = document.createElement("div")
		this.el.classList.add(classCompozFile)

		var elDummy = document.createElement("div")
		this.el.appendChild(elDummy)

		this.createElName()
		this.createElIcon()
		this.createElDelete()
	}

	private createElName() {
		let elName = document.createElement("span")
		elName.classList.add("name")

		let name = this.file.name
		let len = name.length
		if (len > 20) {
			elName.title = this.file.name
			name = name.substring(0, 8) + "..."+ name.substring(len-8, len)
		}

		elName.innerText = name
		this.el.appendChild(elName)
	}

	private createElIcon() {
		let type = this.file.type
		let elIcon = document.createElement("img")
		elIcon.classList.add("icon")

		if (type === "application/msword"
		||  type === "application/vnd.oasis.opendocument.text"
		||  type === "application/vnd.oasis.opendocument.text-master"
		||  type === "application/vnd.oasis.opendocument.text-template"
		||  type === "application/vnd.oasis.opendocument.text-web"
		||  type === "application/vnd.openxmlformats-officedocument.wordprocessingml.document") {
			elIcon.src = iconDoc
			this.el.appendChild(elIcon)
			return
		}

		if (type === "application/vnd.ms-powerpoint"
		||  type === "application/vnd.oasis.opendocument.presentation"
		||  type === "application/vnd.oasis.opendocument.presentation-template"
		||  type === "application/vnd.openxmlformats-officedocument.presentationml.presentation"
		) {
			elIcon.src = iconPpt
			this.el.appendChild(elIcon)
			return
		}

		if (type === "application/vnd.ms-excel"
		||  type === "application/vnd.oasis.opendocument.spreadsheet"
		||  type === "application/vnd.oasis.opendocument.spreadsheet-template"
		||  type === "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
		) {
			elIcon.src = iconPpt
			this.el.appendChild(elIcon)
			return
		}

		if (type === "application/pdf") {
			elIcon.src = iconPdf
			this.el.appendChild(elIcon)
			return
		}

		if (type.substring(0, 5) === "image") {
			elIcon.src = iconImg
			this.el.appendChild(elIcon)
			return
		}

		if (type.substring(0, 4) === "text") {
			elIcon.src = iconTxt
			this.el.appendChild(elIcon)
			return
		}

		elIcon.src = iconOth
		this.el.appendChild(elIcon)
	}

	private createElDelete() {
		let elDelete = document.createElement("span")

		elDelete.innerText = "X"
		elDelete.classList.add(classDelete)

		elDelete.onclick = (e) => {
			this.el.parentNode.removeChild(this.el)
			this.onDelete()
		}

		this.el.appendChild(elDelete)
	}
}

// vim: set ts=4 sw=4 noexpandtab:
