// Copyright 2018 Myabuy LLC. All rights reserved.
// Use of this source code is governed by a MIT-style license that can be found
// in the LICENSE file.

import iconDoc from './assets/file-doc.png';
import iconImg from './assets/file-image.png';
import iconOth from './assets/file-others.png';
import iconPdf from './assets/file-pdf.png';
import iconPpt from './assets/file-ppt.png';
import iconTxt from './assets/file-txt.png';
import iconXls from './assets/file-xls.png';

import imgStateError from './assets/state-error.svg';
import imgStateUploading from './assets/state-uploading.gif';

import {FileState} from './filestate';

const classCompozFile = 'compoz-file';
const classDelete = 'delete';

export class CompozFile {
  file: File;
  el!: HTMLElement;
  elIcon!: HTMLImageElement;
  state!: FileState;
  private onDelete: Function;

  constructor(file: File, onDelete: Function) {
    this.file = file;
    this.onDelete = onDelete;
    this.el = document.createElement('div')! as HTMLElement;
    this.el.classList.add(classCompozFile);

    const elDummy = document.createElement('div');
    this.el.appendChild(elDummy);

    this.createElName();
    this.createElIcon();
    this.createElDelete();
  }

  private createElName() {
    const elName = document.createElement('div');
    elName.classList.add('name');

    let name = this.file.name;
    const len = name.length;
    if (len > 20) {
      elName.title = this.file.name;
      name = name.substring(0, 8) + '...' + name.substring(len - 8, len);
    }

    elName.innerText = name;
    this.el.appendChild(elName);
  }

  private createElIcon() {
    this.elIcon = document.createElement('img')! as HTMLImageElement;
    this.elIcon.classList.add('icon');
    this.el.appendChild(this.elIcon);
    this.updateIcon();
  }

  private updateIcon() {
    const type = this.file.type;

    if (type === 'application/msword' ||
        type === 'application/vnd.oasis.opendocument.text' ||
        type === 'application/vnd.oasis.opendocument.text-master' ||
        type === 'application/vnd.oasis.opendocument.text-template' ||
        type === 'application/vnd.oasis.opendocument.text-web' ||
        type ===
            'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
      this.elIcon.src = iconDoc;
      return;
    }

    if (type === 'application/vnd.ms-powerpoint' ||
        type === 'application/vnd.oasis.opendocument.presentation' ||
        type === 'application/vnd.oasis.opendocument.presentation-template' ||
        type ===
            'application/vnd.openxmlformats-officedocument.presentationml.presentation') {
      this.elIcon.src = iconPpt;
      return;
    }

    if (type === 'application/vnd.ms-excel' ||
        type === 'application/vnd.oasis.opendocument.spreadsheet' ||
        type === 'application/vnd.oasis.opendocument.spreadsheet-template' ||
        type ===
            'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet') {
      this.elIcon.src = iconPpt;
      return;
    }

    if (type === 'application/pdf') {
      this.elIcon.src = iconPdf;
      return;
    }

    if (type.substring(0, 5) === 'image') {
      this.elIcon.src = iconImg;
      return;
    }

    if (type.substring(0, 4) === 'text') {
      this.elIcon.src = iconTxt;
      return;
    }

    this.elIcon.src = iconOth;
  }

  private createElDelete() {
    const elDelete = document.createElement('span');

    elDelete.innerText = 'X';
    elDelete.classList.add(classDelete);

    elDelete.onclick = (e) => {
      if (this.el.parentNode) {
        this.el.parentNode.removeChild(this.el);
      }
      this.onDelete();
    };

    this.el.appendChild(elDelete);
  }

  setState(state: FileState) {
    this.state = state;

    switch (state) {
      case FileState.UPLOADING:
        this.elIcon.src = imgStateUploading;
        break;
      case FileState.SUCCESS:
        this.updateIcon();
        break;
      default:
        this.elIcon.src = imgStateError;
        break;
    }
  }
}
