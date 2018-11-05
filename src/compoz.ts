// Copyright 2018 Myabuy LLC. All rights reserved.
// Use of this source code is governed by a MIT-style license that can be found
// in the LICENSE file.

import "./compoz.scss";

import { CompozFile, CompozFileInterface } from "./compozfile";
import { Config, ConfigInterface } from "./config";

export { FileState } from "./filestate";

const svgAttachment = require("./assets/b-attachment.svg");
const svgExpand = require("./assets/b-expand.svg");
const svgOl = require("./assets/b-ol.svg");
const svgSend = require("./assets/ic-send.svg");
const svgSendDisable = require("./assets/ic-send-disable.svg");
const svgStyle = require("./assets/b-style.svg");
const svgUl = require("./assets/b-ul.svg");

const inputHint = "Write something...";
const classInputExpand = "compoz-input-expand";
const classActive = "compoz-b-active";

/**
 * Compoz is a class that handle the compose component.
 */
export class Compoz {
	private id: string;
	private cfg: Config = new Config(null);
	private elRoot!: HTMLElement;
	private elCompoz = document.createElement("div");

	private elInput = document.createElement("div");
	private elInputHint = document.createElement("span");
	private elExpand = document.createElement("div");

	private elMenuWrapper = document.createElement("div");
	private elInputWrapper = document.createElement("div");
	private elFiles = document.createElement("div");

	private elInputFile = document.createElement("input");

	private elMenuLink = document.createElement("div");
	private elInputLink = document.createElement("input");

	private elMenu = document.createElement("div");
	private elStyles = document.createElement("div");
	private elBStyle = document.createElement("a");
	private elBAttachment = document.createElement("a");
	private elBLink = document.createElement("a");

	private elBBold = document.createElement("a");
	private elBItalic = document.createElement("a");
	private elBUnderline = document.createElement("a");
	private elBUL = document.createElement("a");
	private elBOL = document.createElement("a");
	private elBSendImg = document.createElement("img");

	private files: CompozFile[] = new Array();
	private lastSelection: Range | null = null;
	private isShowStyle = false;
	private isShowInputLink = false;
	private isExpand = false;
	private defaultInputMinHeight = "40px";
	private defaultInputMaxHeight = "6em";

	constructor(
		id: string,
		opts: ConfigInterface,
		files: CompozFileInterface[]
	) {
		this.id = id;
		this.cfg = new Config(opts);

		this.elCompoz.classList.add("compoz");

		this.createInput();
		this.elCompoz.appendChild(this.elInput);

		this.createElExpand();
		this.elCompoz.appendChild(this.elExpand);

		this.createMenuWrapper();
		this.elCompoz.appendChild(this.elMenuWrapper);

		this.setFiles(files);
		if (this.elInput.innerHTML !== "") {
			this.enableButtonSend();
		}

		this.elRoot = document.getElementById(id)! as HTMLElement;
		if (this.elRoot) {
			this.elRoot.appendChild(this.elCompoz);
		}
	}

	/**
	 * Get content editable selection range.
	 * Ref: https://stackoverflow.com/a/3316483/3034747.
	 */
	private getSelectionRange(): Range | null {
		if (!window.getSelection) {
			return null;
		}

		const sel = window.getSelection();
		if (sel.getRangeAt && sel.rangeCount) {
			return sel.getRangeAt(0);
		}

		return null;
	}

	/**
	 * Restore content editable selection.
	 * Ref: https://stackoverflow.com/a/3316483/3034747
	 */
	private restoreSelectionRange(range: Range | null) {
		if (!range) {
			return;
		}

		if (window.getSelection) {
			const sel = window.getSelection();
			sel.removeAllRanges();
			sel.addRange(range);
		}
	}

	private createInput() {
		this.elInput.contentEditable = "true";
		this.elInput.classList.add("compoz-input");

		this.createInputHint();
		this.elInput.innerHTML = "";
		this.elInput.appendChild(this.elInputHint);

		if (this.cfg.composeStyle) {
			this.elInput.classList.add(this.cfg.composeStyle);
		}

		this.elInput.innerHTML = this.cfg.contentHTML;
		this.resetInputHeight();

		this.elInput.onfocus = e => {
			if (this.isEmpty()) {
				this.elInput.innerHTML = "";
			}
		};

		this.elInput.onblur = () => {
			if (this.isEmpty()) {
				this.elInput.innerHTML = "";
				this.elInput.appendChild(this.elInputHint);
			}

			if (this.cfg.onBlur) {
				this.cfg.onBlur();
			}
		};

		this.elInput.onkeyup = () => {
			const contentHTML = this.getContentHTML();
			if (contentHTML === "") {
				this.disableButtonSend();
			} else {
				this.enableButtonSend();
			}
			if (this.cfg.onContentChange) {
				this.cfg.onContentChange(contentHTML);
			}
		};

		// Save last selection to elInput
		document.addEventListener("selectionchange", () => {
			const selectLocation = window.getSelection().focusNode
				.parentElement;
			// limiting the select element to the compoz inputElement
			if (selectLocation === this.elInput) {
				this.lastSelection = this.getSelectionRange();
			}
		});

		this.elInput.addEventListener("paste", (e: ClipboardEvent) => {
			// Stop data actually being pasted into div.
			e.stopPropagation();
			e.preventDefault();

			// Get pasted data via clipboard API.
			const pastedText = document.createTextNode(
				e.clipboardData.getData("Text")
			);

			const range = this.getSelectionRange();
			if (!range) {
				this.elInput.appendChild(pastedText);
				return;
			}

			range.deleteContents();
			range.insertNode(pastedText);
		});
	}

	private createInputHint() {
		this.elInputHint.innerText = "Write something...";
		this.elInputHint.classList.add("hint");
	}

	private createElExpand() {
		this.elExpand.classList.add("compoz-button-expand");

		const button = document.createElement("img");
		button.src = svgExpand;

		this.elExpand.appendChild(button);

		if (this.cfg.hideExpand) {
			this.elExpand.style.display = "none";
			return;
		}

		this.elExpand.onclick = e => {
			if (!this.isExpand) {
				if (this.cfg.onExpand) {
					this.elInput.classList.add(classInputExpand);
					this.cfg.onExpand();
					this.isExpand = true;
				}
			} else {
				if (this.cfg.onUnexpand) {
					this.elInput.classList.remove(classInputExpand);
					this.cfg.onUnexpand();
					this.resetInputHeight();
					this.isExpand = false;
				}
			}
		};
	}

	private createMenuWrapper() {
		this.elMenuWrapper.classList.add("compoz-menu-wrapper");

		this.elInputWrapper.classList.add("compoz-input-wrapper");
		this.elMenuWrapper.appendChild(this.elInputWrapper);

		this.elFiles.classList.add("compoz-file-list");
		this.elMenuWrapper.appendChild(this.elFiles);

		this.createInputLink();
		this.createMenuStyles();

		this.createMenu();
		this.elMenuWrapper.appendChild(this.elMenu);

		this.createInputFile();
		this.elMenuWrapper.appendChild(this.elInputFile);

		if (this.cfg.height) {
			this.resizeInput(0, this.cfg.height);
		}
	}

	private createInputLink() {
		this.elMenuLink.classList.add("compoz-input-link");
		this.elMenuLink.appendChild(this.elInputLink);

		const elBInsertLink = document.createElement("button");
		elBInsertLink.innerHTML = "Insert";
		this.elMenuLink.appendChild(elBInsertLink);

		elBInsertLink.onclick = e => {
			const val = this.elInputLink.value;
			this.restoreSelectionRange(this.lastSelection);
			document.execCommand("createLink", false, val);

			this.elInput.focus();
			this.hideInputLink();
		};
	}

	private createMenuStyles() {
		this.elStyles.classList.add("compoz-styles");

		this.createBBold();
		this.elStyles.appendChild(this.elBBold);

		this.createBItalic();
		this.elStyles.appendChild(this.elBItalic);

		this.createBUnderline();
		this.elStyles.appendChild(this.elBUnderline);

		this.createBUL();
		this.elStyles.appendChild(this.elBUL);

		this.createBOL();
		this.elStyles.appendChild(this.elBOL);
	}

	private addFile(f: File): CompozFile | null {
		const cfi = {
			raw: f,
			id: 0,
			name: f.name,
			size: f.size,
			type: f.type
		};

		return this.addCompozFile(cfi);
	}

	private addCompozFile(cfi: CompozFileInterface): CompozFile | null {
		const svc = this;

		if (cfi.size > this.cfg.fileMaxSize) {
			return null;
		}

		const cf = new CompozFile(
			cfi,
			() => {
				return svc.onFileDeleted(cf);
			},
			() => {
				this.setHeight(this.cfg.height);
			}
		);

		this.files.push(cf);
		this.elFiles.appendChild(cf.el);
		this.setHeight(this.cfg.height);
		return cf;
	}

	private createInputFile() {
		this.elInputFile.classList.add("hidden");
		this.elInputFile.classList.add("compoz-input-file");
		this.elInputFile.name = "file";
		this.elInputFile.type = "file";
		this.elInputFile.multiple = true;

		this.elInputFile.onchange = () => {
			if (!this.elInputFile.value) {
				return;
			}

			this.elBSendImg.src = svgSendDisable;
			if (!this.elInputFile.files) {
				return;
			}

			for (let x = 0; x < this.elInputFile.files.length; x++) {
				const f = this.elInputFile.files[x];
				this.addFile(f);
			}
		};
	}

	private createBBold() {
		this.elBBold.href = "#";
		this.elBBold.classList.add("button");
		this.elBBold.classList.add("bold");
		this.elBBold.innerHTML = "B";

		this.elBBold.onclick = e => {
			document.execCommand("bold", false, null);
			this.elInput.focus();
		};
	}

	private createBItalic() {
		this.elBItalic.href = "#";
		this.elBItalic.classList.add("button");
		this.elBItalic.classList.add("italic");
		this.elBItalic.innerHTML = "I";

		this.elBItalic.onclick = e => {
			document.execCommand("italic", false, null);
			this.elInput.focus();
		};
	}

	private createBUnderline() {
		this.elBUnderline.href = "#";
		this.elBUnderline.classList.add("button");
		this.elBUnderline.classList.add("underline");
		this.elBUnderline.innerHTML = "U";

		this.elBUnderline.onclick = e => {
			document.execCommand("underline", false, null);
			this.elInput.focus();
		};
	}

	private createBUL() {
		this.elBUL.href = "#";
		this.elBUL.classList.add("button");
		this.elBUL.classList.add("ul");

		const elBULImg = document.createElement("img");
		elBULImg.src = svgUl;
		this.elBUL.appendChild(elBULImg);

		this.elBUL.onclick = e => {
			document.execCommand("insertUnorderedList", false, null);
			this.elInput.focus();
		};
	}

	private createBOL() {
		this.elBOL.href = "#";
		this.elBOL.classList.add("button");
		this.elBOL.classList.add("ol");

		const elBOLImg = document.createElement("img");
		elBOLImg.src = svgOl;
		this.elBOL.appendChild(elBOLImg);

		this.elBOL.onclick = e => {
			document.execCommand("insertOrderedList", false, null);
			this.elInput.focus();
		};
	}

	private createMenu() {
		this.elMenu.classList.add("compoz-menu");

		this.createBStyle();
		this.elMenu.appendChild(this.elBStyle);

		this.createBAttachment();
		this.elMenu.appendChild(this.elBAttachment);

		this.createBLink();
		this.elMenu.appendChild(this.elBLink);

		this.createRightMenu(this.elMenu);
	}

	private createBAttachment() {
		this.elBAttachment.classList.add("button");
		this.elBAttachment.classList.add("compoz-b-attachment");

		const elImg = document.createElement("img");
		elImg.src = svgAttachment;
		this.elBAttachment.appendChild(elImg);

		if (this.cfg.hideAttachment) {
			this.elBAttachment.style.display = "none";
			return;
		}

		this.elBAttachment.onclick = e => {
			this.elInputFile.click();
		};
	}

	private createBStyle() {
		this.elBStyle.classList.add("button");
		this.elBStyle.classList.add("compoz-b-style");

		const elImg = document.createElement("img");
		elImg.src = svgStyle;
		this.elBStyle.appendChild(elImg);

		this.elBStyle.onclick = e => {
			if (!this.isShowStyle) {
				if (this.isShowInputLink) {
					this.hideInputLink();
					this.showStyles();
				} else {
					this.showStyles();
				}
			} else {
				this.hideStyles();
			}
		};
	}

	private createBLink() {
		this.elBLink.classList.add("button");
		this.elBLink.classList.add("compoz-b-link");
		this.elBLink.innerText = "Link";

		this.elBLink.onclick = e => {
			if (this.isShowInputLink) {
				this.hideInputLink();
			} else {
				if (this.isShowStyle) {
					this.hideStyles();
					this.showInputLink();
				} else {
					this.showInputLink();
				}
			}
		};
	}

	private createRightMenu(elParent: HTMLElement) {
		const elRightMenu = document.createElement("span");
		elRightMenu.classList.add("right");

		elParent.appendChild(elRightMenu);

		this.createButtonDiscard(elRightMenu);
		this.createButtonSend(elRightMenu);
	}

	private createButtonDiscard(elParent: HTMLElement) {
		const b = document.createElement("button");
		b.classList.add("button");
		b.classList.add("compoz-b-discard");
		b.innerText = "Discard";

		if (this.cfg.hideDiscard) {
			return;
		}

		elParent.appendChild(b);

		b.onclick = e => {
			if (this.cfg.onDiscard) {
				this.cfg.onDiscard();
			}
		};
	}

	private createButtonSend(elParent: HTMLElement) {
		const elBSend = document.createElement("a");
		elBSend.href = "#";
		elBSend.title = "Send";
		elBSend.classList.add("button");
		elBSend.classList.add("compoz-b-send");

		this.elBSendImg.src = svgSendDisable;
		elBSend.appendChild(this.elBSendImg);

		elParent.appendChild(elBSend);

		if (this.cfg.hideSend) {
			elBSend.style.display = "none";
			return;
		}

		elBSend.onclick = e => {
			if (this.cfg.onSend) {
				this.cfg.onSend();
			}
		};
	}

	private showStyles() {
		this.isShowStyle = true;
		this.elBStyle.classList.add(classActive);
		this.elInputWrapper.appendChild(this.elStyles);
		this.setHeight(this.cfg.height);
	}

	private hideStyles() {
		this.isShowStyle = false;
		this.elBStyle.classList.remove(classActive);
		this.elInputWrapper.removeChild(this.elStyles);
		this.setHeight(this.cfg.height);
	}

	private showInputLink() {
		this.isShowInputLink = true;
		this.elBLink.classList.add(classActive);
		this.elInputWrapper.appendChild(this.elMenuLink);
		this.elInputLink.focus();
		this.setHeight(this.cfg.height);
	}

	private hideInputLink() {
		this.isShowInputLink = false;
		this.elBLink.classList.remove(classActive);
		this.elInputWrapper.removeChild(this.elMenuLink);
		this.setHeight(this.cfg.height);
	}

	private onFileDeleted(cf: CompozFile): Promise<boolean> {
		return new Promise(resolve => {
			for (let x = 0; x < this.files.length; x++) {
				if (this.files[x].name !== cf.name) {
					continue;
				}
				if (this.files[x].size !== cf.size) {
					continue;
				}

				if (!this.cfg.onFileDeletedBefore) {
					this.files.splice(x, 1);
					return resolve(true);
				}

				return this.cfg
					.onFileDeletedBefore(this.files[x])
					.then((ok: boolean) => {
						if (ok) {
							this.files.splice(x, 1);
						}
						return resolve(ok);
					});
			}
			return resolve(false);
		});
	}

	isEmpty(): boolean {
		let v = this.elInput.textContent || "";
		v = v.trim();
		return v === inputHint || v === "";
	}

	setContentHTML(c: string) {
		this.elInput.innerHTML = c;
	}

	getContentHTML(): string {
		if (this.isEmpty()) {
			return "";
		}

		return this.elInput.innerHTML;
	}

	setFiles(files: CompozFileInterface[]) {
		this.elFiles.innerHTML = "";
		this.files = new Array();

		if (!files) {
			return;
		}

		for (let x = 0; x < files.length; x++) {
			this.addCompozFile(files[x]);
		}
	}

	getFiles(): CompozFile[] {
		return this.files;
	}

	reset() {
		this.elInput.innerHTML = "";
		this.elFiles.innerHTML = "";
		this.files = new Array();
	}

	resizeInput(w: number, h: number) {
		if (w && w > 0) {
			this.elInput.style.width = w + "px";
			this.elInput.style.maxWidth = w + "px";
		}
		if (h && h > 0) {
			this.elInput.style.height = h + "px";
			this.elInput.style.maxHeight = h + "px";
		}
	}

	setHeight(h: number) {
		this.cfg.height = h;
		const menuWrapperHeight = this.elMenuWrapper.offsetHeight;
		this.elInput.style.height = h - menuWrapperHeight + "px";
		this.elInput.style.maxHeight = h - menuWrapperHeight + "px";
	}

	resetInputHeight() {
		this.elInput.style.minHeight = this.defaultInputMinHeight;
		this.elInput.style.maxHeight = this.defaultInputMaxHeight;
		this.elInput.style.height = "auto";
	}

	showButtonExpand() {
		this.elExpand.style.display = "block";
	}

	hideButtonExpand() {
		this.elExpand.style.display = "none";
	}

	enableButtonSend() {
		this.elBSendImg.src = svgSend;
	}

	disableButtonSend() {
		this.elBSendImg.src = svgSendDisable;
	}
}
