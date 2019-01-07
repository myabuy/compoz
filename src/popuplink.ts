import { linkSvc } from "./linkservice"

export interface IInputLink {
	el: HTMLAnchorElement
	event: Event
	range: Range
	text: string
	url: string
}

export interface IElementPos {
	left: number
	top: number
}

export class PopupLink {
	el = document.createElement("div")
	private elLink = document.createElement("a")
	private elChange = document.createElement("span")
	private elRemove = document.createElement("span")

	constructor() {
		this.el.classList.add("compoz-popup-link")
		this.el.style.display = "none"

		const span = document.createElement("span")

		this.elLink.innerText = ""
		this.elLink.href = "#"
		this.elLink.target = "_blank"

		span.appendChild(this.elLink)
		this.el.appendChild(span)

		this.el.appendChild(document.createTextNode("-"))

		this.createButtonChange(this.el)
		this.el.appendChild(document.createTextNode("|"))
		this.createButtonRemove(this.el)
	}

	onChange() {
		return
	}

	reset() {
		this.elLink.innerText = ""
		this.elLink.href = "#"
		this.el.style.display = "none"
		document.removeEventListener("mousedown", this.onMouseDown)
	}

	show() {
		if (linkSvc.url.length > 20) {
			this.elLink.innerText =
				linkSvc.url.substring(0, 20) +
				"..." +
				linkSvc.url.substring(linkSvc.url.length - 5)
		} else {
			this.elLink.innerText = linkSvc.url
		}
		this.elLink.href = linkSvc.url

		this.el.style.top = linkSvc.el.offsetTop - 40 + "px"
		this.el.style.left = "8px"
		this.el.style.display = "block"

		document.addEventListener("mousedown", this.onMouseDown)
	}

	private onMouseDown = (e: MouseEvent) => {
		if (!e.target) {
			return
		}
		const targetNode = e.target as Node
		if (!this.el.contains(targetNode)) {
			this.reset()
		}
	}

	private createButtonChange(parent: HTMLElement) {
		this.elChange.style.cursor = "pointer"
		this.elChange.innerText = "Change"
		parent.appendChild(this.elChange)

		this.elChange.onclick = e => {
			this.onChange()
			this.reset()
		}
	}

	private createButtonRemove(parent: HTMLElement) {
		const el = document.createElement("span")
		el.style.cursor = "pointer"
		el.innerText = "Remove"
		parent.appendChild(el)

		el.onclick = e => {
			linkSvc.remove()
			this.reset()
		}
	}
}
