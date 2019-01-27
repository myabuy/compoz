export enum LinkState {
	New = 0,
	Update = 1,
}

class LinkService {
	el = document.createElement("a")
	event = new Event("")
	range = new Range()
	sel = window.getSelection()
	state = LinkState.New
	text = ""
	url = ""

	insert(text: string, url: string) {
		this.el.href = url
		this.el.innerText = text
		this.el.target = "_blank"
		this.range.insertNode(this.el)
		this.sel.addRange(this.range)
	}

	remove() {
		const textNode = document.createTextNode(this.text)

		const parEl = this.el.parentElement
		if (parEl) {
			parEl.insertBefore(textNode, this.el.nextSibling)
			parEl.removeChild(this.el)
		}
	}

	reset() {
		this.state = LinkState.New
	}

	set(el: HTMLAnchorElement, e: Event, range: Range) {
		this.state = LinkState.Update
		this.el = el
		this.event = e
		this.range = range
		this.text = el.innerText
		this.url = el.href
	}

	//
	// setFromRange set the link state based on when user clicking create
	// link.  There are two possible cases,
	// (1) the caret position is in link, this mean user want to update
	// the link.
	// (2) the caret position is normal, this mean user want to create new
	// link after caret.
	//
	setFromRange(sel: Selection, range: Range) {
		if (this.state === LinkState.Update) {
			this.range.selectNode(this.el)
			return
		}

		this.range = range
		this.sel = sel
		this.state = LinkState.New
		this.url = ""

		if (range.collapsed) {
			this.el = document.createElement("a")
			this.text = ""
		} else {
			this.text = range.toString().trim()
		}
	}

	update(text: string, url: string) {
		this.text = text
		this.url = url
		this.el.target = "_blank"

		this.el.innerText = text
		this.el.href = url
	}

	upsert(text: string, url: string) {
		switch (this.state) {
			case LinkState.New:
				document.execCommand("createLink", false, url)
				break
			case LinkState.Update:
				linkSvc.update(text, url)
				break
		}
	}
}

export const linkSvc = new LinkService()
