// Copyright 2018 Myabuy LLC. All rights reserved.
// Use of this source code is governed by a MIT-style license that can be found
// in the LICENSE file.

import { Config, Compoz } from "./compoz"

const elID = "compose"
let config = {
	onSend: () => {
		console.log("content:", c1.getContent())
		console.log("files:", c1.getFiles())
	}
,	fileMaxSize: 4194304 // 4MB
}

let elCompose1 = document.createElement("div")

elCompose1.id = "compose-1"

document.body.appendChild(elCompose1)

let c1 = new Compoz("compose-1", config)

// vim: set ts=4 sw=4 noexpandtab:
