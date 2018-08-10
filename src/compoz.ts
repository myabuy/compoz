// Copyright 2018 Myabuy LLC. All rights reserved.
// Use of this source code is governed by a MIT-style license that can be found
// in the LICENSE file.

import "./compoz.scss";

import { CompozFile, CompozFileInterface } from "./compozfile";
import { Config, ConfigInterface } from "./config";
import { Utils } from "./utils";

export { FileState } from "./filestate";

const svgAttachment = require("./assets/b-attachment.svg");
const svgExpand = require("./assets/b-expand.svg");
const svgOl = require("./assets/b-ol.svg");
const svgSend = require("./assets/ic-send.svg");
const svgSendDisable = require("./assets/ic-send-disable.svg");
const svgStyle = require("./assets/b-style.svg");
const svgUl = require("./assets/b-ul.svg");

const inputHint = "Write something...";
const classRoot = "compoz";
const classExpand = "compoz-expand";
const classInput = "compoz-input";
const classMenuWrapper = "compoz-menu-wrapper";
const classWrapper = "compoz-input-wrapper";
const classInputLink = "compoz-input-link";
const classInputFile = "compoz-input-file";
const classFileList = "compoz-file-list";
const classMenu = "compoz-menu";
const classStyles = "compoz-styles";
const classBAttachment = "compoz-b-attach";
const classBStyle = "compoz-b-style";
const classBLink = "compoz-b-link";
const classBSend = "compoz-b-send";
const classActive = "compoz-b-active";

const keyEnter = 13;

const inputHintTmpl = `<span class="hint">${inputHint}</span>`;
const compozTmpl = `
  <div class="${classRoot}">
    <div class="${classInput}">
    </div>
    <div class="${classExpand}">
      <img src="${svgExpand}"/>
    </div>
	<div class="${classMenuWrapper}">
		<div class="${classWrapper}">
		</div>

      <div class="${classMenu}">
        <a href="#" class="button ${classBStyle}">
          <img src="${svgStyle}" />
        </a>

        <a href="#" class="button ${classBAttachment}">
          <img src="${svgAttachment}" />
        </a>
        <a href="#" class="button ${classBLink}">Link</a>
      </div>

      <div class="${classFileList}">
      </div>

      <input
        class="hidden ${classInputFile}"
        type="file"
        name="file"
        multiple
      >
    </div>
  </div>
`;

/**
 * Compoz is a class that handle the compose component.
 */
export class Compoz {
	private id!: string;
	private link!: string;
	private cfg: Config = new Config(null);
	private elRoot!: HTMLElement;
	private elInput!: HTMLElement;
	private elExpand!: HTMLElement;
	private elMenuWrapper!: HTMLElement;
	private elInputWrapper!: HTMLElement;
	private elMenuLink!: HTMLElement;
	private elInputLink!: HTMLInputElement;
	private elInputFile!: HTMLInputElement;
	private elFiles!: HTMLElement;
	private elBInsertLink!: HTMLElement;
	private elMenu!: HTMLElement;
	private elStyles!: HTMLElement;
	private elBAttachment!: HTMLAnchorElement;
	private elBLink!: HTMLAnchorElement;
	private elBStyle!: HTMLAnchorElement;
	private elBBold!: HTMLAnchorElement;
	private elBItalic!: HTMLAnchorElement;
	private elBUnderline!: HTMLAnchorElement;
	private elBUL!: HTMLAnchorElement;
	private elBOL!: HTMLAnchorElement;
	private files: CompozFile[] = new Array();
	private lastSelection: Range | null = null;
	private elBSendImg!: HTMLImageElement;
	private isShowStyle = false;
	private isShowInputLink = false;
	constructor(
		id: string,
		opts: ConfigInterface,
		files: CompozFileInterface[]
	) {
		this.id = id;
		this.cfg = new Config(opts);

		this.elRoot = document.getElementById(id)! as HTMLElement;
		if (this.elRoot) {
			this.elRoot.innerHTML = compozTmpl;
		}

		const sel = "#" + this.id;
		this.initInput(sel);
		this.initElExpand(sel);
		this.initMenuWrapper(sel);

		this.setFiles(files);
		if (this.elInput.innerHTML !== "") {
			this.enableButtonSend();
		}
	}

	isEmpty(): boolean {
		let v = this.elInput.textContent || "";
		v = v.trim();
		return v === inputHint || v === "";
	}

	private initInput(sel: string) {
		sel += " div." + classInput;
		this.elInput = document.querySelector(sel)! as HTMLInputElement;
		this.elInput.contentEditable = "true";
		this.elInput.innerHTML = inputHintTmpl;

		this.elInput.innerHTML = this.cfg.contentHTML;

		this.elInput.onfocus = e => {
			if (this.isEmpty()) {
				this.elInput.innerHTML = "";
			}
		};

		this.elInput.onblur = () => {
			if (this.isEmpty()) {
				this.elInput.innerHTML = inputHintTmpl;
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
				this.lastSelection = Utils.saveSelection();
			}
		});
	}

	private initElExpand(sel: string) {
		sel += " div." + classExpand;

		this.elExpand = document.querySelector(sel)! as HTMLElement;

		if (this.cfg.hideExpand) {
			this.elExpand.style.display = "none";
			return;
		}

		this.elExpand.onclick = e => {
			if (this.cfg.onExpand) {
				this.cfg.onExpand();
			}
		};
	}

	private initMenuWrapper(sel: string) {
		sel += " div." + classMenuWrapper;
		this.elMenuWrapper = document.querySelector(sel)! as HTMLElement;

		this.initWrapper(sel);
		this.initFileList(sel);
		this.initInputLink(sel);
		this.initMenuStyles(sel);
		this.initMenu(sel);
		this.initInputFile(sel);

		if (this.cfg.height) {
			this.resizeInput(0, this.cfg.height);
		}
	}

	private initWrapper(sel: string) {
		sel += " div." + classWrapper;

		this.elInputWrapper = document.querySelector(sel)! as HTMLElement;
	}
	private initFileList(sel: string) {
		sel += " div." + classFileList;

		this.elFiles = document.querySelector(sel)! as HTMLElement;
	}

	private initInputLink(sel: string) {
		this.elMenuLink = document.createElement("div");
		this.elMenuLink.classList.add(classInputLink);
		this.elInputLink = document.createElement("input");
		this.elMenuLink.appendChild(this.elInputLink);
		this.elBInsertLink = document.createElement("button");
		this.elBInsertLink.innerHTML = "Insert";
		this.elMenuLink.appendChild(this.elBInsertLink);

		this.elBInsertLink.onclick = e => {
			const val = this.elInputLink.value;
			Utils.restoreSelection(this.lastSelection);
			document.execCommand("createLink", false, val);

			this.elInput.focus();
			this.hideInputLink();
		};
	}

	private initMenuStyles(sel: string) {
		this.elStyles = document.createElement("div");
		this.elStyles.classList.add(classStyles);

		this.initBBold(sel);
		this.initBItalic(sel);
		this.initBUnderline(sel);
		this.initBUL(sel);
		this.initBOL(sel);
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

	private initInputFile(sel: string) {
		sel += " input." + classInputFile;

		this.elInputFile = document.querySelector(sel)! as HTMLInputElement;

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

	private initBBold(sel: string) {
		this.elBBold = document.createElement("a");
		this.elBBold.href = "#";
		this.elBBold.classList.add("button");
		this.elBBold.classList.add("bold");
		this.elBBold.innerHTML = "B";
		this.elStyles.appendChild(this.elBBold);

		this.elBBold.onclick = e => {
			document.execCommand("bold", false, null);
			this.elInput.focus();
		};
	}

	private initBItalic(sel: string) {
		this.elBItalic = document.createElement("a");
		this.elBItalic.href = "#";
		this.elBItalic.classList.add("button");
		this.elBItalic.classList.add("italic");
		this.elBItalic.innerHTML = "I";
		this.elStyles.appendChild(this.elBItalic);

		this.elBItalic.onclick = e => {
			document.execCommand("italic", false, null);
			this.elInput.focus();
		};
	}

	private initBUnderline(sel: string) {
		this.elBUnderline = document.createElement("a");
		this.elBUnderline.href = "#";
		this.elBUnderline.classList.add("button");
		this.elBUnderline.classList.add("underline");
		this.elBUnderline.innerHTML = "U";
		this.elStyles.appendChild(this.elBUnderline);

		this.elBUnderline.onclick = e => {
			document.execCommand("underline", false, null);
			this.elInput.focus();
		};
	}

	private initBUL(sel: string) {
		this.elBUL = document.createElement("a");
		this.elBUL.href = "#";
		this.elBUL.classList.add("button");
		this.elBUL.classList.add("ul");
		const elBULImg = document.createElement("img");
		elBULImg.src = svgUl;
		this.elBUL.appendChild(elBULImg);
		this.elStyles.appendChild(this.elBUL);
		this.elBUL.onclick = e => {
			document.execCommand("insertUnorderedList", false, null);
			this.elInput.focus();
		};
	}

	private initBOL(sel: string) {
		this.elBOL = document.createElement("a");
		this.elBOL.href = "#";
		this.elBOL.classList.add("button");
		this.elBOL.classList.add("ol");
		const elBOLImg = document.createElement("img");
		elBOLImg.src = svgOl;
		this.elBOL.appendChild(elBOLImg);
		this.elStyles.appendChild(this.elBOL);
		this.elBOL.onclick = e => {
			document.execCommand("insertOrderedList", false, null);
			this.elInput.focus();
		};
	}

	private initMenu(sel: string) {
		sel += " div." + classMenu;

		this.elMenu = document.querySelector(sel)! as HTMLElement;

		this.initBAttachment(sel);
		this.initBStyle(sel);
		this.initBLink(sel);

		this.initRightMenu(this.elMenu);
	}

	private initBAttachment(sel: string) {
		sel += " a." + classBAttachment;
		this.elBAttachment = document.querySelector(sel)! as HTMLAnchorElement;

		if (this.cfg.hideAttachment) {
			this.elBAttachment.style.display = "none";
			return;
		}

		this.elBAttachment.onclick = e => {
			this.elInputFile.click();
		};
	}

	private initBStyle(sel: string) {
		sel += " a." + classBStyle;

		this.elBStyle = document.querySelector(sel)! as HTMLAnchorElement;

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

	private initBLink(sel: string) {
		sel += " a." + classBLink;

		this.elBLink = document.querySelector(sel)! as HTMLAnchorElement;

		this.elBLink.onclick = e => {
			if (!this.isShowInputLink) {
				if (this.isShowStyle) {
					this.hideStyles();
					this.showInputLink();
				} else {
					this.showInputLink();
				}
			} else {
				this.hideInputLink();
			}
		};
	}

	private initRightMenu(elParent: HTMLElement) {
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
		elBSend.classList.add(classBSend);

		this.elBSendImg = document.createElement("img");
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
			if (!this.cfg.onFileDeletedBefore) {
				return resolve(false);
			}

			for (let x = 0; x < this.files.length; x++) {
				if (this.files[x].name !== cf.name) {
					continue;
				}
				if (this.files[x].size !== cf.size) {
					continue;
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
