// Copyright 2018 Myabuy LLC. All rights reserved.
// Use of this source code is governed by a MIT-style license that can be found
// in the LICENSE file.

import { Config, Compoz } from "./compoz"
import { FileState } from "./filestate"

function generateContent() {
	var elContent = document.querySelector("div.panel div.content")

	for (let x = 0; x < 100; x++) {
		let d = document.createElement("div")
		d.innerText = "Test "+ x

		elContent.appendChild(d)
	}
}

function createCompose() {
	let config = {
		onSend: () => {
			console.log("content:", c.getContentHTML())

			let files = c.getFiles();

			for (var x = 0; x < files.length; x++) {
				files[x].setState(FileState.UPLOADING)
			}

			setTimeout(function()
			{
				for (var x = 0; x < files.length; x++) {
					files[x].setState(FileState.REMOTE)
				}
			}, 2000);
		}
	,	fileMaxSize: 4194304 // 4MB
	}

	let c = new Compoz("compose", config)
}

generateContent()
createCompose()

// vim: set ts=4 sw=4 noexpandtab:
