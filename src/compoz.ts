// Copyright 2018 Myabuy LLC. All rights reserved.
// Use of this source code is governed by a MIT-style license that can be found
// in the LICENSE file.

import './compoz.scss';

import {CompozFile, CompozFileInterface} from './compozfile';
import {Config, ConfigInterface} from './config';

export {FileState} from './filestate';

const svgAttachment = require('./assets/b-attachment.svg');
const svgExpand = require('./assets/b-expand.svg');
const svgOl = require('./assets/b-ol.svg');
const svgSend = require('./assets/b-send.svg');
const svgStyle = require('./assets/b-style.svg');
const svgUl = require('./assets/b-ul.svg');

const inputHint = 'Write something...';
const classRoot = 'compoz';
const classExpand = 'compoz-expand';
const classInput = 'compoz-input';
const classMenuWrapper = 'compoz-menu-wrapper';
const classInputLink = 'compoz-input-link';
const classInputFile = 'compoz-input-file';
const classFileList = 'compoz-file-list';
const classMenu = 'compoz-menu';
const classStyles = 'compoz-styles';
const classBAttachment = 'compoz-b-attachment';
const classBStyle = 'compoz-b-style';
const classBLink = 'compoz-b-link';
const classBSend = 'compoz-b-send';
const classActive = 'compoz-b-active';

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
      <div class="${classInputLink}">
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
        <a href="#" class="button ${classBStyle}">
          <img src="${svgStyle}" />
        </a>
        <a href="#" class="button ${classBLink}">Link</a>
        <a href="#" class="button ${classBSend}">
          <img src="${svgSend}" />
        </a>
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
  private elBSend!: HTMLAnchorElement;
  private elBBold!: HTMLAnchorElement;
  private elBItalic!: HTMLAnchorElement;
  private elBUnderline!: HTMLAnchorElement;
  private elBUL!: HTMLAnchorElement;
  private elBOL!: HTMLAnchorElement;
  private files: CompozFile[] = new Array();

  constructor(id: string, opts: ConfigInterface, files: CompozFileInterface[]) {
    this.id = id;
    this.cfg = new Config(opts);

    this.elRoot = document.getElementById(id)! as HTMLElement;
    if (this.elRoot) {
      this.elRoot.innerHTML = compozTmpl;
    }

    const sel = '#' + this.id;
    this.initInput(sel);
    this.initElExpand(sel);
    this.initMenuWrapper(sel);

    if (!files) {
      return;
    }

    for (let x = 0; x < files.length; x++) {
      this.addCompozFile(files[x]);
    }
  }

  isEmpty(): boolean {
    let v = this.elInput.textContent || '';
    v = v.trim();
    return (v === inputHint || v === '');
  }

  private initInput(sel: string) {
    sel += ' div.' + classInput;
    this.elInput = document.querySelector(sel)! as HTMLInputElement;
    this.elInput.contentEditable = 'true';
    this.elInput.innerHTML = inputHintTmpl;

    this.elInput.innerHTML = this.cfg.contentHTML;

    this.elInput.onfocus = (e) => {
      if (this.isEmpty()) {
        this.elInput.innerHTML = '';
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
      if (this.cfg.onContentChange) {
        this.cfg.onContentChange(this.getContentHTML());
      }
    };
  }

  private initElExpand(sel: string) {
    sel += ' div.' + classExpand;
    this.elExpand = document.querySelector(sel)! as HTMLElement;

    if (this.cfg.hideExpand) {
      this.elExpand.style.display = 'none';
      return;
    }

    this.elExpand.onclick = (e) => {
      if (this.cfg.onExpand) {
        this.cfg.onExpand();
      }
    };
  }

  private initMenuWrapper(sel: string) {
    sel += ' div.' + classMenuWrapper;
    this.elMenuWrapper = document.querySelector(sel)! as HTMLElement;

    this.initFileList(sel);
    this.initInputLink(sel);
    this.initMenuStyles(sel);
    this.initMenu(sel);
    this.initInputFile(sel);

    if (this.cfg.height) {
      this.resizeInput(0, this.cfg.height);
    }
  }

  private initFileList(sel: string) {
    sel += ' div.' + classFileList;

    this.elFiles = document.querySelector(sel)! as HTMLElement;
  }

  private initInputLink(sel: string) {
    sel += ' div.' + classInputLink;
    this.elMenuLink = document.querySelector(sel)! as HTMLElement;

    this.elMenuLink.style.display = 'none';

    const selInput = sel + ' input';
    this.elInputLink = document.querySelector(selInput)! as HTMLInputElement;

    const selButton = sel + ' button';

    this.elBInsertLink = document.querySelector(selButton)! as HTMLElement;

    this.elBInsertLink.onclick = (e) => {
      const val = this.elInputLink.value;

      document.execCommand('createLink', false, val);

      this.elInput.focus();
      this.hideInputLink();
    };
  }

  private initMenuStyles(sel: string) {
    sel += ' div.' + classStyles;
    this.elStyles = document.querySelector(sel)! as HTMLElement;

    this.elStyles.style.display = 'none';

    this.initBBold(sel);
    this.initBItalic(sel);
    this.initBUnderline(sel);
    this.initBUL(sel);
    this.initBOL(sel);
  }

  private addFile(f: File): CompozFile|null {
    const cfi = {
      raw: f,
      id: 0,
      name: f.name,
      size: f.size,
      type: f.type,
    };

    return this.addCompozFile(cfi);
  }

  private addCompozFile(cfi: CompozFileInterface): CompozFile|null {
    const svc = this;

    if (cfi.size > this.cfg.fileMaxSize) {
      return null;
    }

    const cf = new CompozFile(cfi, () => {
      return svc.onFileDeleted(cf);
    });

    this.files.push(cf);
    this.elFiles.appendChild(cf.el);

    return cf;
  }

  private initInputFile(sel: string) {
    sel += ' input.' + classInputFile;

    this.elInputFile = document.querySelector(sel)! as HTMLInputElement;

    this.elInputFile.onchange = () => {
      if (!this.elInputFile.value) {
        return;
      }

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
    sel += ' a.bold';
    this.elBBold = document.querySelector(sel)! as HTMLAnchorElement;
    this.elBBold.onclick = (e) => {
      document.execCommand('bold', false, null);
      this.elInput.focus();
    };
  }

  private initBItalic(sel: string) {
    sel += ' a.italic';
    this.elBItalic = document.querySelector(sel)! as HTMLAnchorElement;
    this.elBItalic.onclick = (e) => {
      document.execCommand('italic', false, null);
      this.elInput.focus();
    };
  }

  private initBUnderline(sel: string) {
    sel += ' a.underline';
    this.elBUnderline = document.querySelector(sel)! as HTMLAnchorElement;
    this.elBUnderline.onclick = (e) => {
      document.execCommand('underline', false, null);
      this.elInput.focus();
    };
  }

  private initBUL(sel: string) {
    sel += ' a.ul';
    this.elBUL = document.querySelector(sel)! as HTMLAnchorElement;
    this.elBUL.onclick = (e) => {
      document.execCommand('insertUnorderedList', false, null);
      this.elInput.focus();
    };
  }

  private initBOL(sel: string) {
    sel += ' a.ol';
    this.elBOL = document.querySelector(sel)! as HTMLAnchorElement;
    this.elBOL.onclick = (e) => {
      document.execCommand('insertOrderedList', false, null);
      this.elInput.focus();
    };
  }

  private initMenu(sel: string) {
    sel += ' div.' + classMenu;

    this.elMenu = document.querySelector(sel)! as HTMLElement;

    this.initBAttachment(sel);
    this.initBStyle(sel);
    this.initBLink(sel);
    this.initBSend(sel);
  }

  private initBAttachment(sel: string) {
    sel += ' a.' + classBAttachment;
    this.elBAttachment = document.querySelector(sel)! as HTMLAnchorElement;

    if (this.cfg.hideAttachment) {
      this.elBAttachment.style.display = 'none';
      return;
    }

    this.elBAttachment.onclick = (e) => {
      this.elInputFile.click();
    };
  }

  private initBStyle(sel: string) {
    sel += ' a.' + classBStyle;

    this.elBStyle = document.querySelector(sel)! as HTMLAnchorElement;

    this.elBStyle.onclick = (e) => {
      if (this.elStyles.style.display === 'none') {
        this.hideInputLink();
        this.showStyles();
      } else {
        this.hideStyles();
      }
    };
  }

  private initBLink(sel: string) {
    sel += ' a.' + classBLink;

    this.elBLink = document.querySelector(sel)! as HTMLAnchorElement;

    this.elBLink.onclick = (e) => {
      if (this.elMenuLink.style.display === 'none') {
        this.hideStyles();
        this.showInputLink();
      } else {
        this.hideInputLink();
      }
    };
  }

  private initBSend(sel: string) {
    sel += ' a.' + classBSend;
    this.elBSend = document.querySelector(sel)! as HTMLAnchorElement;

    if (this.cfg.hideSend) {
      this.elBSend.style.display = 'none';
      return;
    }

    this.elBSend.onclick = (e) => {
      if (this.cfg.onSend) {
        this.cfg.onSend();
      }
    };
  }

  private showStyles() {
    this.elStyles.style.display = 'block';
    this.elBStyle.classList.add(classActive);
  }

  private hideStyles() {
    this.elBStyle.classList.remove(classActive);
    this.elStyles.style.display = 'none';
  }

  private showInputLink() {
    this.elMenuLink.style.display = 'block';
    this.elInputLink.focus();
    this.elBLink.classList.add(classActive);
  }

  private hideInputLink() {
    this.elMenuLink.style.display = 'none';
    this.elBLink.classList.remove(classActive);
  }

  private onFileDeleted(cf: CompozFile): Promise<boolean> {
    return new Promise((resolve) => {
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

        return this.cfg.onFileDeletedBefore(this.files[x])
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

  getContentHTML(): string {
    if (this.isEmpty()) {
      return '';
    }

    return this.elInput.innerHTML;
  }

  getFiles(): CompozFile[] {
    return this.files;
  }

  reset() {
    this.elInput.innerHTML = '';
    this.elFiles.innerHTML = '';
    this.files = new Array();
  }

  resizeInput(w: number, h: number) {
    if (w && w > 0) {
      this.elInput.style.width = w + 'px';
      this.elInput.style.maxWidth = w + 'px';
    }
    if (h && h > 0) {
      this.elInput.style.height = h + 'px';
      this.elInput.style.maxHeight = h + 'px';
    }
  }

  setContentHTML(c: string) {
    this.elInput.innerHTML = c;
  }
}
