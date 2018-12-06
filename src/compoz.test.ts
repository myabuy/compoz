// Copyright 2018 Myabuy LLC. All rights reserved.
// Use of this source code is governed by a MIT-style license that can be found
// in the LICENSE file.

/* tslint:disable:no-console */

import { Compoz } from "./compoz"
import { CompozFile, ICompozFile } from "./compozfile"
import { FileState } from "./filestate"

function generateContent() {
	const elContent = document.querySelector("div.panel div.content")

	for (let x = 0; x < 100; x++) {
		const d = document.createElement("div")
		d.innerText = "Test " + x

		if (elContent) {
			elContent.appendChild(d)
		}
	}
}

function createQuickCompose() {
	const config = {
		avatarURL:
			"https://d26i9nvlq0mz5u.cloudfront.net/avatar/default/v0/avatar192.png",
		composeStyle: "",
		// tslint:disable-next-line
		contentHTML: `
<b> this is </b> <a href="http://test.com">the</a> content.
<br/>
Test long
<a href="https://www.reddit.com/r/Documentaries/comments/9v55kl/i_was_a_yazidi_slave_2018_documentary_the_story/">
link.
</a>
`,
		fileMaxSize: 4194304,
		height: 0,

		hideAttachment: false,
		hideDiscard: false,
		hideExpand: false,
		hideSave: false,
		hideSend: false,

		participants: "You, Kukuh, Mirah, Matias & Mas Shulhan",
		subject: "Bootcamp LPDP",

		onBlur: () => {
			return
		},
		onContentChange: (contentHTML: string) => {
			return
		},
		onChangeHeight: () => {
			return
		},
		onDiscard: () => {
			console.log("onDiscard")
		},
		onExpand: () => {
			c.setHeight(400)
		},
		onFileDeletedBefore: (f: CompozFile) => {
			console.log("onFileDeletedBefore:", f)
			return Promise.resolve(true)
		},
		onSend: () => {
			console.log("content:", c.getContentHTML())

			const files = c.getFiles()

			for (const file of files) {
				file.setState(FileState.UPLOADING)
			}

			setTimeout(() => {
				for (let x = 0; x < files.length; x++) {
					if (x % 2 === 1) {
						files[x].setState(FileState.SUCCESS)
					} else {
						files[x].setState(FileState.ERROR)
					}
				}
			}, 2000)
		},
		onUnexpand: () => {
			c.setHeight(0)
		},
	}

	const c = new Compoz("quick-compose", config, [])
}

function createFullCompose() {
	const files: ICompozFile[] = []

	files.push({
		id: 2,
		name: "test.jpg",
		raw: null,
		size: 512,
		type: "image/png",
	})

	const config = {
		avatarURL:
			"https://d26i9nvlq0mz5u.cloudfront.net/avatar/default/v0/avatar192.png",
		composeStyle: "compoz-input-expand",
		contentHTML: "",
		fileMaxSize: 0,
		height: 500,

		hideAttachment: true,
		hideDiscard: false,
		hideExpand: true,
		hideSave: true,
		hideSend: false,

		participants: "You, Kukuh, Mirah, Matias & Mas Shulhan",
		subject: "Bootcamp",

		onBlur: () => {
			console.log("onBlur")
		},
		onChangeHeight: () => {
			console.log("change height")
		},
		onContentChange: (contentHTML: string) => {
			console.log("onContentChange:", contentHTML)
		},
		onDiscard: () => {
			console.log("onDiscard")
		},
		onExpand: () => {
			console.log("onExpand")
		},
		onFileDeletedBefore: (f: CompozFile): Promise<boolean> => {
			console.log("onFileDeletedBefore:", f)
			return Promise.resolve(false)
		},
		onSend: () => {
			console.log("content:", c.getContentHTML())
			console.log("files:", c.getFiles())
		},
		onUnexpand: () => {
			console.log("onUnexpand")
		},
	}

	const c = new Compoz("full-compose", config, files)

	c.setContentHTML(`
        <b>Test</b> set content
        <br/>
        <a href="https://alpha.proofn.com">link</a>
    `)
}

generateContent()
createQuickCompose()
createFullCompose()
