import { LinkState } from "./linkservice"

export class FormLink {
	el = document.createElement("div")
	private elInputText = document.createElement("input")
	private elInputLink = document.createElement("input")
	private elError = document.createElement("span")
	private elBInsert = document.createElement("button")

	constructor() {
		this.el.classList.add("compoz-form-link")

		this.createInputText()
		this.createInputLink()
		this.createFooter()
	}

	/**
	 * onInsert a callback that will overwritten.
	 */
	onInsert(text: string, link: string) {
		// noop.
	}

	setInput(state: LinkState, text: string, link: string) {
		this.elInputText.value = text
		this.elInputLink.value = link

		switch (state) {
			case LinkState.New:
				this.elBInsert.innerText = "Insert"
				break
			case LinkState.Update:
				this.elBInsert.innerText = "Update"
				break
		}
	}

	private createInputText() {
		const row = document.createElement("div")
		row.classList.add("row")

		const label = document.createElement("label")
		label.innerText = "Text"
		row.appendChild(label)
		row.appendChild(this.elInputText)
		this.el.appendChild(row)
	}

	private createInputLink() {
		const row = document.createElement("div")
		row.classList.add("row")

		const label = document.createElement("label")
		label.innerText = "Link"
		row.appendChild(label)

		row.appendChild(this.elInputLink)
		this.el.appendChild(row)
	}

	private createFooter() {
		const row = document.createElement("div")
		row.classList.add("row")
		row.classList.add("footer")

		this.addError(row)
		this.addButtonInsert(row)

		this.el.appendChild(row)
	}

	private addError(parent: HTMLElement) {
		this.elError.classList.add("error")
		parent.appendChild(this.elError)
	}

	private addButtonInsert(parent: HTMLElement) {
		this.elBInsert.innerHTML = "Insert"
		parent.appendChild(this.elBInsert)

		this.elBInsert.onclick = e => {
			const text = this.elInputText.value
			const link = this.elInputLink.value

			if (!this.isValidLink(link)) {
				this.showError()
				return
			}

			this.clearError()
			this.onInsert(text, link)
		}
	}

	private isValidLink(link: string): boolean {
		const schemaPath = link.split("://")
		if (schemaPath.length < 2) {
			return false
		}
		switch (schemaPath[0].toLowerCase()) {
			case "ftp":
			case "http":
			case "https":
				break
			default:
				return false
		}
		if (schemaPath[1].length === 0) {
			return false
		}
		return true
	}

	private showError() {
		this.elError.innerText = "Invalid link."
	}

	private clearError() {
		this.elError.innerText = ""
	}
}
