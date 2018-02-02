// Copyright 2018 Myabuy LLC. All rights reserved.
// Use of this source code is governed by a MIT-style license that can be found
// in the LICENSE file.

import { CompozFile } from "./compozfile.ts"

import "./compoz.scss"

import svgAttachment from "./assets/attachment.svg"
import svgStyle from "./assets/style.svg"
import svgSend from "./assets/send.svg"
import svgUl from "./assets/ul.svg"
import svgOl from "./assets/ol.svg"

const inputHint = "Write something..."
const classRoot = "compoz"
const classInput = "input"
const classInputLink = "input-link"
const classInputFile = "input-file"
const classFileList = "file-list"
const classMenu = "menu"
const classStyles = "styles"
const classBAttachment = "attachment"
const classButtonStyle = "style"
const classBLink = "link"
const classBSend = "send"
const classActive = "active"

const keyEnter = 13;

const inputHintTmpl = `<span class="hint">${inputHint}</span>`
const compozTmpl = `
	<div class="${classRoot}">
		<div class="${classInput}">
		</div>
		<div class="${classFileList}">
		</div>
		<div class="${classInputLink}">
			<span class="label">Link</span>
			<input></input>
			<button>
				Insert
			</button>
		</div>
		<div class="${classStyles}">
			<a href="#" class="button bold">B</a>
			<a href="#" class="button italic">I</a>
			<a href="#" class="button underline">U</a>
			<a href="#" class="button ul">
				<img src="${svgUl}" />
			</a>
			<a href="#" class="button ol">
				<img src="${svgOl}" />
			</a>
		</div>
		<div class="${classMenu}">
			<a href="#" class="button ${classBAttachment}">
				<img src="${svgAttachment}" />
			</a>
			<a href="#" class="button ${classButtonStyle}">
				<img src="${svgStyle}" />
			</a>
			<a href="#" class="button ${classBLink}">Link</a>
			<a href="#" class="button ${classBSend}">
				<img src="${svgSend}" />
			</a>
		</div>

		<input
			class="hidden ${classInputFile}"
			type="file"
			name="file"
			multiple
		>
	</div>
`

export interface Config {
	onSend: Function
	fileMaxSize: number
}

export class Compoz {
	private id: string
	private link: string
	private cfg: Config
	private elRoot: HTMLElement
	private elInput: HTMLElement
	private elMenuLink: HTMLElement
	private elInputLink: HTMLInputElement
	private elInputFile: HTMLInputElement
	private elFileList: HTMLElement
	private elBInsertLink: HTMLElement
	private elMenu: HTMLElement
	private elStyles: HTMLElement
	private elBAttachment: HTMLAnchorElement
	private elBLink: HTMLAnchorElement
	private elBStyle: HTMLAnchorElement
	private elBSend: HTMLAnchorElement
	private elBBold: HTMLAnchorElement
	private elBItalic: HTMLAnchorElement
	private elBUnderline: HTMLAnchorElement
	private elBUL: HTMLAnchorElement
	private elBOL: HTMLAnchorElement
	private fileList: CompozFile[] = new Array()

	constructor(id: string, opts: Config) {
		this.id = id
		this.cfg = opts

		this.elRoot = document.getElementById(id)

		this.elRoot.innerHTML = compozTmpl

		let sel = "#"+ this.id
		this.initInput(sel)
		this.initFileList(sel)
		this.initInputLink(sel)
		this.initMenuStyles(sel)
		this.initMenu(sel)
		this.initInputFile(sel)
	}

	public isEmpty(): boolean {
		let v = this.elInput.textContent.trim()

		return (v === inputHint || v === "")
	}

	private initInput(sel: string) {
		sel += " div."+ classInput
		this.elInput = document.querySelector(sel)
		this.elInput.contentEditable = "true"
		this.elInput.innerHTML = inputHintTmpl

		this.elInput.onfocus = (e) => {
			if (this.isEmpty()) {
				this.elInput.innerHTML = ""
			}
		}

		this.elInput.onblur = () => {
			if (this.isEmpty()) {
				this.elInput.innerHTML = inputHintTmpl
			}
		}
	}

	private initFileList(sel: string) {
		sel += " div."+ classFileList

		this.elFileList = document.querySelector(sel)
	}

	private initInputLink(sel: string) {
		sel += " div."+ classInputLink
		this.elMenuLink = document.querySelector(sel)
		this.elMenuLink.style.display = "none";

		let selInput = sel +" input"
		this.elInputLink = document.querySelector(selInput)

		let selButton = sel +" button"
		this.elBInsertLink = document.querySelector(selButton)

		this.elBInsertLink.onclick = (e) => {
			let val = this.elInputLink.value

			document.execCommand("createLink", false, val)

			this.elInput.focus();
			this.hideInputLink()
		}
	}

	private initMenuStyles(sel: string) {
		sel += " div."+ classStyles
		this.elStyles = document.querySelector(sel)
		this.elStyles.style.display = "none";

		this.initBBold(sel)
		this.initBItalic(sel)
		this.initBUnderline(sel)
		this.initBUL(sel)
		this.initBOL(sel)
	}

	private initInputFile(sel: string) {
		sel += " input."+ classInputFile

		this.elInputFile = document.querySelector(sel)
		this.elInputFile.onchange = () => {
			if (!this.elInputFile.value) {
				return
			}

			for (let x = 0; x < this.elInputFile.files.length; x++) {
				let f = this.elInputFile.files[x]

				if (f.size <= this.cfg.fileMaxSize) {
				let cf = new CompozFile(f, () => {
						this.onFileDeleted(f)
					})
					this.fileList.push(cf)
					this.elFileList.appendChild(cf.el)
				}
			}
		}
	}

	private initBBold(sel: string) {
		sel += " a.bold"
		this.elBBold = document.querySelector(sel)
		this.elBBold.onclick = (e) => {
			document.execCommand("bold", false, null)
			this.elInput.focus()
		}
	}

	private initBItalic(sel: string) {
		sel += " a.italic"
		this.elBItalic = document.querySelector(sel)
		this.elBItalic.onclick = (e) => {
			document.execCommand("italic", false, null)
			this.elInput.focus()
		}
	}

	private initBUnderline(sel: string) {
		sel += " a.underline"
		this.elBUnderline = document.querySelector(sel)
		this.elBUnderline.onclick = (e) => {
			document.execCommand("underline", false, null)
			this.elInput.focus()
		}
	}

	private initBUL(sel: string) {
		sel += " a.ul"
		this.elBUL = document.querySelector(sel)
		this.elBUL.onclick = (e) => {
			document.execCommand("insertUnorderedList", false, null)
			this.elInput.focus()
		}
	}

	private initBOL(sel: string) {
		sel += " a.ol"
		this.elBOL = document.querySelector(sel)
		this.elBOL.onclick = (e) => {
			document.execCommand("insertOrderedList", false, null)
			this.elInput.focus()
		}
	}

	private initMenu(sel: string) {
		sel += " div."+ classMenu
		this.elMenu = document.querySelector(sel)

		this.initBAttachment(sel)
		this.initBStyle(sel)
		this.initBLink(sel)
		this.initBSend(sel)
	}

	private initBAttachment(sel: string) {
		sel += " a."+ classBAttachment
		this.elBAttachment = document.querySelector(sel)
		this.elBAttachment.onclick = (e) => {
			this.elInputFile.click()
		}
	}

	private initBStyle(sel: string) {
		sel += " a."+ classButtonStyle

		this.elBStyle = document.querySelector(sel)
		this.elBStyle.onclick = (e) => {
			if (this.elStyles.style.display === "none") {
				this.hideInputLink()
				this.showStyles()
			} else {
				this.hideStyles()
			}
		}
	}

	private initBLink(sel: string) {
		sel += " a."+ classBLink

		this.elBLink = document.querySelector(sel)
		this.elBLink.onclick = (e) => {
			if (this.elMenuLink.style.display === "none") {
				this.hideStyles();
				this.showInputLink()
			} else {
				this.hideInputLink()
			}

		}
	}

	private initBSend(sel: string) {
		sel += " a."+ classBSend
		this.elBSend = document.querySelector(sel)
		this.elBSend.onclick = (e) => {
			this.cfg.onSend()
		}
	}

	private showStyles() {
		this.elStyles.style.display = "block"
		this.elBStyle.classList.add(classActive)
	}

	private hideStyles() {
		this.elBStyle.classList.remove(classActive)
		this.elStyles.style.display = "none"
	}

	private showInputLink() {
		this.elMenuLink.style.display = "block"
		this.elInputLink.focus()
		this.elBLink.classList.add(classActive)
	}

	private hideInputLink() {
		this.elMenuLink.style.display = "none"
		this.elBLink.classList.remove(classActive)
	}

	private onFileDeleted(f: File) {
		for (let x = 0; x < this.fileList.length; x++) {
			if (this.fileList[x].file.name === f.name) {
				this.fileList.splice(x, 1)
				return
			}
		}
	}

	public getContent() {
		if (this.isEmpty()) {
			return ""
		}

		return this.elInput.innerHTML
	}

	public getFiles() {
		let files: File[] = new Array()

		for (let x = 0; x < this.fileList.length; x++) {
			files.push(this.fileList[x].file)
		}

		return files
	}
}

// vim: set ts=4 sw=4 noexpandtab:
