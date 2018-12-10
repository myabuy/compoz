// Copyright 2018 Myabuy LLC. All rights reserved.
// Use of this source code is governed by a MIT-style license that can be found
// in the LICENSE file.

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
		subject: "Bootcamp LPDP",
		participants: "You, Kukuh, Mirah, Matias & Mas Shulhan",
		avatarURL:
			"https://d26i9nvlq0mz5u.cloudfront.net/avatar/default/v0/avatar192.png",
		contentHTML: "",
		fileMaxSize: 4194304,

		height: 0,
		hideAttachment: false,
		hideDiscard: false,
		hideExpand: false,
		hideSave: false,
		hideSend: false,
		composeStyle: "",

		onDiscard: () => {
			console.log("onDiscard")
		},
		onSend: () => {
			console.log("content:", c.getContentHTML())

			const files = c.getFiles()

			for (let x = 0; x < files.length; x++) {
				files[x].setState(FileState.UPLOADING)
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
		onBlur: null,
		onContentChange: null,
		onExpand: () => {
			c.setHeight(400)
		},
		onUnexpand: () => {
			c.resetInputHeight()
		},
		onFileDeletedBefore: (f: CompozFile) => {
			console.log("onFileDeletedBefore:", f)
			return Promise.resolve(true)
		},
	}

	const c = new Compoz("quick-compose", config, [])
}

function createFullCompose() {
	const files: ICompozFile[] = []

	files.push({
		raw: null,
		id: 2,
		name: "test.jpg",
		size: 512,
		type: "image/png",
	})

	const config = {
		subject: "Bootcamp LPDP",
		participants: "You, Kukuh, Mirah, Matias & Mas Shulhan",
		avatarURL:
			"https://d26i9nvlq0mz5u.cloudfront.net/avatar/default/v0/avatar192.png",
		contentHTML: "",
		height: 500,
		fileMaxSize: 0,

		hideAttachment: true,
		hideDiscard: false,
		hideExpand: true,
		hideSave: true,
		hideSend: false,
		composeStyle: "compoz-input-expand",

		onDiscard: () => {
			console.log("onDiscard")
		},
		onSend: () => {
			console.log("content:", c.getContentHTML())
			console.log("files:", c.getFiles())
		},
		onExpand: () => {
			console.log("onExpand")
		},
		onUnexpand: () => {
			console.log("onUnexpand")
		},
		onContentChange: (contentHTML: string) => {
			console.log("onContentChange:", contentHTML)
		},
		onBlur: () => {
			console.log("onBlur")
		},
		onFileDeletedBefore: (f: CompozFile): Promise<boolean> => {
			console.log("onFileDeletedBefore:", f)
			return Promise.resolve(false)
		},
	}

	const c = new Compoz("full-compose", config, files)

	c.setContentHTML("<b>Test</b> set content")
}

generateContent()
createQuickCompose()
createFullCompose()
