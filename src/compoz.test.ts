// Copyright 2018 Myabuy LLC. All rights reserved.
// Use of this source code is governed by a MIT-style license that can be found
// in the LICENSE file.

import { Config, Compoz } from "./compoz"

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
			console.log("content:", c.getContent())
			console.log("files:", c.getFiles())
			c.reset()
		}
	,	fileMaxSize: 4194304 // 4MB
	}

	let c = new Compoz("compose", config)
}

generateContent()
createCompose()

// vim: set ts=4 sw=4 noexpandtab:
