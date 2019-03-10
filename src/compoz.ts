// Copyright 2018 Myabuy LLC. All rights reserved.
// Use of this source code is governed by a MIT-style license that can be found
// in the LICENSE file.

import "es6-promise"
import "./compoz.scss"

import { CompozFile, ICompozFile } from "./compozfile"
import { Config, IConfig } from "./config"
export { FileState } from "./filestate"
import { FormLink } from "./formlink"
import { FormStyles } from "./formstyles"
import { linkSvc } from "./linkservice"
import { IInputLink, PopupLink } from "./popuplink"

import { read } from "fs"
import svgAttachment = require("./assets/b-attachment.svg")
import svgExpand = require("./assets/b-expand.svg")
import svgLink = require("./assets/b-link.svg")
import svgStyle = require("./assets/b-style.svg")
import svgAdd = require("./assets/ic-add.svg")
import svgSendDisable = require("./assets/ic-send-disable.svg")
import svgSend = require("./assets/ic-send.svg")
import svgDiscard = require("./assets/ic-trash.svg")
const inputHint = "Write something..."
const classInputExpand = "compoz-input-expand"
const classActive = "compoz-b-active"

/**
 * Compoz is a class that handle the compose component.
 */
export class Compoz {
	private id: string
	private cfg: Config = new Config(null)
	private elRoot!: HTMLElement
	private elCompoz = document.createElement("div")

	private elInput = document.createElement("div")
	private elInputHint = document.createElement("span")
	private elExpand = document.createElement("div")

	private elStyleWrapper = document.createElement("div")
	private elFooterWrapper = document.createElement("div")
	private elMenuWrapper = document.createElement("div")
	private elMenuRight = document.createElement("div")
	private elFormWrapper = document.createElement("div")
	private elFiles = document.createElement("div")
	private elAddFiles = document.createElement("div")

	private elInputFile = document.createElement("input")

	private elMenu = document.createElement("div")

	private elBAttachment = document.createElement("span")
	private elBStyle = document.createElement("span")
	private elBSendImg = document.createElement("img")
	private elBLink = document.createElement("span")
	private elBSendBtn = document.createElement("button")
	private elBCancelBtn = document.createElement("button")

	private formLink = new FormLink()
	private formStyles = new FormStyles(this.elInput)
	private popupLink = new PopupLink()

	private files: CompozFile[] = new Array()
	private lastSelection: Selection = window.getSelection()
	private range = new Range()
	private isShowAttachment = false
	private isShowStyle = false
	private isShowInputLink = false
	private isAddButton = false
	private isExpand = false
	private defaultInputMinHeight = "18px"
	private defaultInputMaxHeight = "6em"
	private lastContent = ""

	constructor(id: string, opts: IConfig, files: ICompozFile[]) {
		this.id = id
		this.cfg = new Config(opts)

		this.elCompoz.classList.add("compoz")

		this.createStyleWrapper()

		this.elCompoz.appendChild(this.elStyleWrapper)

		this.createInput()

		this.createFooterWrapper()
		this.elCompoz.appendChild(this.elFooterWrapper)

		this.elFiles.classList.add("compoz-file-list")
		this.elCompoz.appendChild(this.elFiles)

		this.popupLink.onChange = this.onChangeLink
		this.elCompoz.appendChild(this.popupLink.el)

		this.setFiles(files)
		if (this.elInput.innerHTML !== "") {
			this.enableButtonSend()
		}

		this.elRoot = document.getElementById(id)! as HTMLElement
		if (!this.elRoot) {
			return
		}

		this.elRoot.appendChild(this.elCompoz)

		if (this.cfg.height > 0) {
			this.setHeight(this.cfg.height)
		}

		setTimeout(() => {
			if (this.cfg.composeStyle) {
				this.elInput.blur()
				this.elInput.appendChild(this.elInputHint)
				this.createInputHint()
			} else {
				this.onFocus()
			}
		}, 0)

		// Save last selection to elInput
		document.addEventListener("selectionchange", (e: Event) => {
			e.preventDefault()

			const sel = window.getSelection()
			const lastEl = sel.focusNode.parentElement
			const focusNode = sel.focusNode

			if (!this.elInput.contains(sel.focusNode)) {
				return false
			}

			this.lastSelection = sel
			this.range = sel.getRangeAt(0)

			const parentEl = sel.focusNode.parentElement

			if (parentEl && parentEl.nodeName === "A") {
				linkSvc.set(parentEl as HTMLAnchorElement, e, this.range)
				this.popupLink.show()
			} else {
				linkSvc.reset()
				this.popupLink.reset()
			}

			return false
		})
	}

	onFocus() {
		this.elInput.focus()
	}

	moveCursorAtTheEnd() {
		const el = this.elInput.lastChild
		let range
		let sel
		if (document.createRange && el !== null) {
			range = document.createRange()
			range.selectNodeContents(el)
			range.collapse(false)
			sel = window.getSelection()
			sel.removeAllRanges()
			sel.addRange(range)
		}
	}

	isEmpty(): boolean {
		let v = this.elInput.textContent || ""
		v = v.trim()
		return v === inputHint || v === ""
	}

	setContentHTML(c: string) {
		this.elInput.innerHTML = c
	}

	getContentHTML(): string {
		if (this.isEmpty()) {
			return ""
		}

		return this.elInput.innerHTML
	}

	showInitAttachment() {
		this.showAttachment()
		this.createAddFileButton()
	}

	setFiles(files: ICompozFile[]) {
		this.elFiles.innerHTML = ""
		this.files = new Array()

		if (!files) {
			return
		}

		for (const file of files) {
			this.addCompozFile(file)
		}
	}

	getFiles(): CompozFile[] {
		return this.files
	}

	reset() {
		this.elInput.innerHTML = ""
		this.elFiles.innerHTML = ""
		this.files = new Array()
	}

	resizeInput(w: number, h: number) {
		if (w && w > 0) {
			this.elInput.style.width = w + "px"
			this.elInput.style.maxWidth = w + "px"
		}
		if (h && h > 0) {
			this.elInput.style.height = h + "px"
			this.elInput.style.maxHeight = h + "px"
		}
	}

	setHeight(h: number) {
		this.cfg.height = h
		const menuWrapperHeight = this.elMenuWrapper.offsetHeight
		const styleWrapperHeight = this.elStyleWrapper.offsetHeight
		const fileWrapperHeight = this.elFiles.offsetHeight
		const heightTotal =
			h - (menuWrapperHeight + styleWrapperHeight + fileWrapperHeight)
		this.elInput.style.height = heightTotal + "px"
		this.elInput.style.maxHeight = heightTotal + "px"
	}

	resetInputHeight() {
		this.elInput.style.minHeight = this.defaultInputMinHeight
		this.elInput.style.maxHeight = this.defaultInputMaxHeight
		this.elInput.style.height = "auto"
		this.cfg.height = 0
	}

	showButtonExpand() {
		this.elExpand.style.display = "block"
	}

	hideButtonExpand() {
		this.elExpand.style.display = "none"
	}

	enableButtonSend() {
		this.elBSendBtn.style.backgroundColor = "#fd8c2e"
		this.elBSendImg.src = svgSend
	}

	disableButtonSend() {
		this.elBSendBtn.style.backgroundColor = "#cccccc"
		this.elBSendImg.src = svgSendDisable
	}

	/**
	 * Restore content editable selection.
	 * Ref: https://stackoverflow.com/a/3316483/3034747
	 */
	private restoreSelectionRange(range: Range) {
		const sel = window.getSelection()
		sel.removeAllRanges()
		sel.addRange(range)
	}

	private createInput() {
		const wrapper = document.createElement("div")

		if (this.cfg.composeStyle) {
			wrapper.classList.add("compoz-input-compose")
		} else {
			wrapper.classList.add("compoz-input-wrapper")
			this.resetInputHeight()
		}

		this.createElExpand()
		wrapper.appendChild(this.elExpand)

		wrapper.appendChild(this.elInput)
		this.elCompoz.appendChild(wrapper)

		this.elInput.contentEditable = "true"
		this.elInput.classList.add("compoz-input")

		this.createInputHint()
		this.elInput.innerHTML = ""
		this.elInput.appendChild(this.elInputHint)

		if (this.cfg.composeStyle) {
			this.elInput.classList.add(this.cfg.composeStyle)
		}

		this.elInput.innerHTML = this.cfg.contentHTML

		this.elInput.onfocus = e => {
			if (this.isEmpty()) {
				this.elInput.innerHTML = ""
			}
		}

		this.elInput.onblur = () => {
			if (this.isEmpty()) {
				this.elInput.innerHTML = ""
				this.elInput.appendChild(this.elInputHint)
			}

			if (this.cfg.onBlur) {
				this.cfg.onBlur()
			}
		}

		this.elInput.onkeyup = () => {
			const contentHTML = this.getContentHTML()
			if (contentHTML === "") {
				this.disableButtonSend()
			} else {
				this.enableButtonSend()
			}
			if (this.cfg.onContentChange) {
				if (contentHTML === this.lastContent) {
					return
				}
				this.lastContent = contentHTML
				this.cfg.onContentChange(contentHTML)
			}
		}
		this.elInput.addEventListener("paste", (e: ClipboardEvent) => {
			// Stop data actually being pasted into div.
			e.stopPropagation()
			e.preventDefault()

			// Get pasted data via clipboard API.
			const text = e.clipboardData.getData("Text")
			const pastedText = document.createTextNode(text)

			const sel = window.getSelection()
			if (!sel) {
				this.elInput.appendChild(pastedText)
				return
			}

			if (sel.getRangeAt && sel.rangeCount) {
				let range = sel.getRangeAt(0)
				range.deleteContents()

				const el = document.createElement("div")
				el.innerHTML = text.replace(/\n/g, "<br>")
				const frag = document.createDocumentFragment()
				let node = el.firstChild
				let lastNode
				while (node) {
					lastNode = frag.appendChild(node)
					node = el.firstChild
				}
				range.insertNode(frag)

				if (lastNode) {
					range = range.cloneRange()
					range.setStartAfter(lastNode)
					range.collapse(true)
					sel.removeAllRanges()
					sel.addRange(range)
				}
			}
		})
	}

	private createInputHint() {
		this.elInputHint.innerText = "Write something..."
		this.elInputHint.classList.add("hint")
	}

	private createElExpand() {
		this.elExpand.classList.add("compoz-button-expand")

		const button = document.createElement("img")
		button.src = svgExpand

		this.elExpand.appendChild(button)

		if (this.cfg.hideExpand) {
			this.elExpand.style.display = "none"
			return
		}

		this.elExpand.onclick = e => {
			if (!this.isExpand) {
				if (this.cfg.onExpand) {
					this.elInput.classList.add(classInputExpand)
					this.cfg.onExpand()
					this.isExpand = true
				}
			} else {
				if (this.cfg.onUnexpand) {
					this.elInput.classList.remove(classInputExpand)
					this.cfg.onUnexpand()
					this.resetInputHeight()
					this.isExpand = false
				}
			}
		}
	}

	private createStyleWrapper() {
		this.elStyleWrapper.classList.add("compoz-style-wrapper")
		if (this.cfg.composeStyle) {
			this.elStyleWrapper.classList.add("compoz-style-compose")
		}
	}

	private createFooterWrapper() {
		if (this.cfg.composeStyle) {
			this.elFooterWrapper.classList.add("compoz-footer-compose")
		}
		if (!this.cfg.hideDiscard && !this.cfg.isMessageDetail) {
			this.createButtonDiscard(this.elFooterWrapper)
		}
		this.createMenuWrapper()
		this.elFooterWrapper.appendChild(this.elMenuWrapper)
	}

	private createMenuRight(parent: HTMLElement) {
		this.elMenuRight.classList.add("right-side")

		if (this.cfg.isMessageDetail) {
			this.createButtonDiscard(this.elMenuRight)
		}
		this.createButtonSend(this.elMenuRight)

		parent.appendChild(this.elMenuRight)
	}
	private createMenuWrapper() {
		this.elMenuWrapper.classList.add("compoz-menu-wrapper")

		if (this.cfg.composeStyle) {
			this.elMenuWrapper.classList.add("compoz-menu-compose")
		}

		this.createFormWrapper()
		this.elMenuWrapper.appendChild(this.elFormWrapper)

		this.createMenu()
		this.elMenuWrapper.appendChild(this.elMenu)

		this.createInputFile()
		this.elMenuWrapper.appendChild(this.elInputFile)
	}

	private createFormWrapper() {
		this.elFormWrapper.classList.add("compoz-form-wrapper")

		this.formLink.onInsert = this.onFormLinkUpdate
	}

	private onFormLinkUpdate = (text: string, link: string) => {
		if (this.range.collapsed) {
			if (this.isEmpty()) {
				this.elInput.innerHTML = ""
			}
			linkSvc.insert(text, link)
			this.enableButtonSend()
		} else {
			this.restoreSelectionRange(this.range)
			linkSvc.upsert(text, link)
		}
		this.moveCursorAtTheEnd()
		this.hideFormLink()
	}

	private addFile(f: File): CompozFile | null {
		const cfi = {
			id: 0,
			name: f.name,
			raw: f,
			size: f.size,
			type: f.type,
		}

		return this.addCompozFile(cfi)
	}

	private addCompozFile(cfi: ICompozFile): CompozFile | null {
		const svc = this

		if (cfi.size > this.cfg.fileMaxSize) {
			this.cfg.onFileSizeRejected()
			return null
		}

		const cf = new CompozFile(
			cfi,
			(): Promise<boolean> => {
				return svc.onFileDeleted(cf)
			},
			() => {
				this.setHeight(this.cfg.height)
				svc.cfg.onChangeHeight()
			},
		)

		this.files.push(cf)
		this.elFiles.appendChild(cf.el)
		this.setHeight(this.cfg.height)
		this.cfg.onAddFile()
		this.cfg.onChangeHeight()
		return cf
	}

	private createInputFile() {
		this.elInputFile.classList.add("hidden")
		this.elInputFile.classList.add("compoz-input-file")
		this.elInputFile.name = "file"
		this.elInputFile.type = "file"
		this.elInputFile.multiple = true

		this.elInputFile.onchange = () => {
			if (!this.elInputFile.value) {
				return
			}

			if (!this.elInputFile.files) {
				return
			}
			//tslint:disable
			for (let x = 0; x < this.elInputFile.files.length; x++) {
				const f = this.elInputFile.files[x]
				this.addFile(f)
			}
		}
	}

	private createAddFileButton() {
		const elDummy = document.createElement("div")
		const img = document.createElement("img")
		const span = document.createElement("span")

		img.classList.add("img-add")
		img.src = svgAdd
		span.classList.add("span-add")
		span.innerHTML = "ADD FILE"
		this.elAddFiles.classList.add("compoz-file")
		elDummy.appendChild(img)
		elDummy.appendChild(span)
		if (!this.isAddButton) {
			this.elAddFiles.appendChild(elDummy)
			this.isAddButton = true
		}

		this.elFiles.insertBefore(this.elAddFiles, this.elFiles.childNodes[0])
		this.elAddFiles.onclick = e => {
			this.elInputFile.click()
			this.onFocus()
		}
	}

	private createMenu() {
		this.elMenu.classList.add("compoz-menu")

		this.createButtonStyle(this.elMenu)
		this.createButtonAttachment(this.elMenu)
		this.createButtonLink(this.elMenu)
		this.createMenuRight(this.elMenu)
	}

	private createButtonAttachment(parent: HTMLElement) {
		this.elBAttachment.classList.add("button")
		this.elBAttachment.classList.add("compoz-b-attachment")

		const img = document.createElement("img")
		img.src = svgAttachment
		this.elBAttachment.appendChild(img)

		parent.appendChild(this.elBAttachment)

		if (this.cfg.hideAttachment) {
			this.elBAttachment.style.display = "none"
			return
		}

		this.elBAttachment.onclick = e => {
			if (!this.isShowAttachment) {
				this.showInitAttachment()
			} else {
				this.hideAttachment()
			}
			this.setHeight(this.cfg.height)
			this.cfg.onChangeHeight()
		}
	}

	private createButtonStyle(parent: HTMLElement) {
		this.elBStyle.classList.add("button")
		this.elBStyle.classList.add("compoz-b-style")

		const elImg = document.createElement("img")
		elImg.src = svgStyle
		this.elBStyle.appendChild(elImg)

		parent.appendChild(this.elBStyle)

		this.elBStyle.onclick = e => {
			if (!this.isShowStyle) {
				this.showStyles()
			} else {
				this.hideStyles()
			}
		}
	}

	private createButtonLink(parent: HTMLElement) {
		this.elBLink.classList.add("button")
		this.elBLink.classList.add("compoz-b-link")

		const img = document.createElement("img")
		img.src = svgLink
		this.elBLink.appendChild(img)

		parent.appendChild(this.elBLink)

		this.elBLink.onmousedown = () => {
			if (this.isShowInputLink) {
				this.hideFormLink()
			} else {
				this.showFormLink()
			}
			return false
		}
	}

	private createButtonDiscard(parent: HTMLElement) {
		const button = document.createElement("div")
		if (this.cfg.isMessageDetail) {
			this.elBCancelBtn.innerHTML = "Cancel"
			this.elBCancelBtn.classList.add("button")
			this.elBCancelBtn.classList.add("compoz-b-send")
			button.appendChild(this.elBCancelBtn)
		} else {
			button.classList.add("compoz-button-discard")
			const img = document.createElement("img")
			img.src = svgDiscard
			button.appendChild(img)
		}

		parent.appendChild(button)

		if (this.cfg.hideDiscard) {
			return
		}

		button.onclick = e => {
			if (this.cfg.onDiscard) {
				this.cfg.onDiscard()
			}
		}
	}

	private createButtonSend(elParent: HTMLElement) {
		const elBSend = document.createElement("div")

		if (this.cfg.composeStyle) {
			this.elBSendBtn.innerHTML = "Send"
			this.elBSendBtn.classList.add("button")
			this.elBSendBtn.classList.add("compoz-b-send")
			elBSend.appendChild(this.elBSendBtn)
		} else if (this.cfg.isMessageDetail) {
			this.elBSendBtn.innerHTML = "Save"
			this.elBSendBtn.classList.add("button")
			this.elBSendBtn.classList.add("right-side")
			this.elBSendBtn.classList.add("compoz-b-send")
			elBSend.appendChild(this.elBSendBtn)
		} else {
			elBSend.classList.add("button")
			elBSend.classList.add("right-side")

			this.elBSendImg.src = svgSendDisable
			elBSend.appendChild(this.elBSendImg)
		}

		elParent.appendChild(elBSend)

		if (this.cfg.hideSend) {
			elBSend.style.display = "none"
			return
		}

		elBSend.onclick = e => {
			if (this.getContentHTML() !== "") {
				if (this.cfg.onSend) {
					if (!this.cfg.composeStyle) {
						this.resetInputHeight()
					}
					this.cfg.onSend()
					this.disableButtonSend()
					this.hideAttachment()
				}
			}
		}
	}

	private showAttachment() {
		this.isShowAttachment = true
		this.elBAttachment.classList.add(classActive)
		this.elFiles.style.display = "flex"
		this.setHeight(this.cfg.height)
		this.cfg.onChangeHeight()
	}

	private hideAttachment() {
		this.isShowAttachment = false
		this.elBAttachment.classList.remove(classActive)
		this.elFiles.style.display = "none"
		this.setHeight(this.cfg.height)
		this.cfg.onChangeHeight()
	}

	private showStyles() {
		this.isShowStyle = true
		this.elBStyle.classList.add(classActive)
		this.elStyleWrapper.style.display = "block"
		this.elStyleWrapper.appendChild(this.formStyles.el)
		this.setHeight(this.cfg.height)
		this.cfg.onChangeHeight()
	}

	private hideStyles() {
		this.isShowStyle = false
		this.elBStyle.classList.remove(classActive)
		this.elStyleWrapper.style.display = "none"
		this.elStyleWrapper.removeChild(this.formStyles.el)
		this.setHeight(this.cfg.height)
		this.cfg.onChangeHeight()
	}

	private showFormLink = () => {
		linkSvc.setFromRange(this.lastSelection, this.range)
		this.formLink.setInput(linkSvc.state, linkSvc.text, linkSvc.url)

		this.isShowInputLink = true
		this.elBLink.classList.add(classActive)
		this.elFormWrapper.appendChild(this.formLink.el)

		this.setHeight(this.cfg.height)
		this.cfg.onChangeHeight()
	}

	private hideFormLink() {
		this.isShowInputLink = false
		this.elBLink.classList.remove(classActive)
		this.elFormWrapper.removeChild(this.formLink.el)

		this.setHeight(this.cfg.height)
		this.cfg.onChangeHeight()
	}

	private onChangeLink = () => {
		this.range.selectNode(linkSvc.el)
		this.showFormLink()
		this.formLink.setInput(linkSvc.state, linkSvc.text, linkSvc.url)
	}

	private onFileDeleted(cf: CompozFile): Promise<boolean> {
		return new Promise(resolve => {
			for (let x = 0; x < this.files.length; x++) {
				if (this.files[x].name !== cf.name) {
					continue
				}
				if (this.files[x].size !== cf.size) {
					continue
				}

				if (!this.cfg.onFileDeletedBefore) {
					this.files.splice(x, 1)
					return resolve(true)
				}

				return this.cfg
					.onFileDeletedBefore(this.files[x])
					.then((ok: boolean) => {
						if (ok) {
							this.files.splice(x, 1)
						}
						return resolve(ok)
					})
			}
			return resolve(false)
		})
	}
}
