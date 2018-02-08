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

function createQuickCompose() {
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
					if ((x % 2) === 1) {
						files[x].setState(FileState.SUCCESS)
					} else {
						files[x].setState(FileState.ERROR)
					}

				}
			}, 2000);
		}
	,	onExpand: () => {
			console.log("onExpand")
		}
	,	fileMaxSize: 4194304 // 4MB
	,	contentHTML: "<b> this is </b> the content"
	}

	let c = new Compoz("quick-compose", config)
}

function createFullCompose() {
	let config = {
		onSend: () => {
			console.log("content:", c.getContentHTML())
		}
	,	onExpand: () => {
			console.log("onExpand")
		}
	,	fileMaxSize: 4194304 // 4MB
	,	height: 500
	}

	let c = new Compoz("full-compose", config)
}

generateContent()
createQuickCompose()
createFullCompose()

// vim: set ts=4 sw=4 noexpandtab:
