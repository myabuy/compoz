// Copyright 2018 Myabuy LLC. All rights reserved.
// Use of this source code is governed by a MIT-style license that can be found
// in the LICENSE file.

import {Compoz, Config} from './compoz';
import {FileState} from './filestate';

function generateContent() {
  const elContent = document.querySelector('div.panel div.content');

  for (let x = 0; x < 100; x++) {
    const d = document.createElement('div');
    d.innerText = 'Test ' + x;

    if (elContent) {
      elContent.appendChild(d);
    }
  }
}

function createQuickCompose() {
  const config = {
    onSend: () => {
      console.log('content:', c.getContentHTML());

      const files = c.getFiles();

      for (let x = 0; x < files.length; x++) {
        files[x].setState(FileState.UPLOADING);
      }

      setTimeout(() => {
        for (let x = 0; x < files.length; x++) {
          if ((x % 2) === 1) {
            files[x].setState(FileState.SUCCESS);
          } else {
            files[x].setState(FileState.ERROR);
          }
        }
      }, 2000);
    },
    onExpand: () => {
      console.log('onExpand');
    },
    fileMaxSize: 4194304  // 4MB
    ,
    contentHTML: '<b> this is </b> the content'
  };

  const c = new Compoz('quick-compose', config);
}

function createFullCompose() {
  const config = {
    onSend: () => {
      console.log('content:', c.getContentHTML());
    },
    onExpand: () => {
      console.log('onExpand');
    },
    onContentChange: (contentHTML: string) => {
      console.log('onContentChange:', contentHTML);
    },
    onBlur: () => {
      console.log('onBlur');
    },
    hideExpand: true,
    hideSend: true,
    height: 500
  };

  const c = new Compoz('full-compose', config);

  c.setContentHTML('<b>Test</b> set content');
}

generateContent();
createQuickCompose();
createFullCompose();
