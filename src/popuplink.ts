export interface IPopupLink {
	el: HTMLAnchorElement
	event: Event
	link: string
	text: string
}

export interface IElementPos {
	left: number
	top: number
}

export class PopupLink {
	public el = document.createElement("div")
	private elLink = document.createElement("a")
	private elChange = document.createElement("span")
	private elRemove = document.createElement("span");
	private in: IPopupLink | null = null

	constructor() {
		this.el.classList.add("compoz-popup-link")
		this.el.style.visibility = "hidden"

		this.elLink.innerText = ""
		this.elLink.href = "#"
		this.elLink.target = "_blank"
		this.el.appendChild(this.elLink)

		this.el.appendChild(document.createTextNode("-"))

		this.createButtonChange(this.el)
		this.el.appendChild(document.createTextNode("|"))
		this.createButtonRemove(this.el)
	}

	public onChange(inp: IPopupLink | null) {
		return
	}

	public reset() {
		if (!this.in) {
			return
		}
		this.elLink.innerText = ""
		this.elLink.href = "#"
		this.el.style.visibility = "hidden"
		this.in = null
		document.removeEventListener("mousedown", this.onMouseDown)
	}

	public show(p: IPopupLink) {
		const pos = this.getPosition(p.el)

		this.elLink.innerText = p.link
		this.elLink.href = p.link

		this.el.style.top = "-20px"
		this.el.style.left = pos.left + "px"
		this.el.style.visibility = "visible"
		this.in = p

		document.addEventListener("mousedown", this.onMouseDown)
	}

	private getPosition(el: HTMLAnchorElement): IElementPos {
		const rect = el.getBoundingClientRect()
		const docEl = document.documentElement
		const pos = {} as IElementPos

		if (docEl) {
			pos.top = rect.top + window.pageYOffset - docEl.clientTop
			pos.left = rect.left + window.pageXOffset - docEl.clientLeft
		}

		return pos
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
		this.elChange.classList.add("action")
		this.elChange.style.cursor = "pointer"
		this.elChange.innerText = "Change"
		parent.appendChild(this.elChange)

		this.elChange.onclick = e => {
			this.onChange(this.in)
		}
	}

	private createButtonRemove(parent: HTMLElement) {
		const el = document.createElement("span")
		el.classList.add("action")
		el.style.cursor = "pointer"
		el.innerText = "Remove"
		parent.appendChild(el)

		el.onclick = e => {
			if (!this.in) {
				return
			}

			const textNode = document.createTextNode(this.in.text)

			const parEl = this.in.el.parentElement
			if (parEl) {
				parEl.insertBefore(textNode, this.in.el.nextSibling)
				parEl.removeChild(this.in.el)
			}
			this.reset()
		}
	}
}
