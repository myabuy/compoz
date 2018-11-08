import svgOl = require("./assets/b-ol.svg")
import svgUl = require("./assets/b-ul.svg")

export class FormStyles {
	el = document.createElement("div")
	private elInput: HTMLDivElement

	constructor(elInput: HTMLDivElement) {
		this.el.classList.add("compoz-form-styles")
		this.elInput = elInput

		this.createButtonBold()
		this.createButtonItalic()
		this.createButtonUnderline()
		this.createButtonUL()
		this.createButtonOL()
	}

	onClickBold(e: MouseEvent) {
		return
	}

	private createButtonBold() {
		const button = document.createElement("span")

		button.classList.add("button")
		button.classList.add("bold")
		button.innerText = "B"

		this.el.appendChild(button)

		button.onmousedown = e => {
			document.execCommand("bold", false, "")
			this.elInput.focus()
			return false
		}
	}

	private createButtonItalic() {
		const button = document.createElement("span")

		button.classList.add("button")
		button.classList.add("italic")
		button.innerText = "I"

		this.el.appendChild(button)

		button.onmousedown = e => {
			document.execCommand("italic", false, "")
			this.elInput.focus()
			return false
		}
	}

	private createButtonUnderline() {
		const button = document.createElement("span")

		button.classList.add("button")
		button.classList.add("underline")
		button.innerHTML = "U"

		this.el.appendChild(button)

		button.onmousedown = e => {
			document.execCommand("underline", false, "")
			this.elInput.focus()
			return false
		}
	}

	private createButtonUL() {
		const button = document.createElement("span")

		button.classList.add("button")
		button.classList.add("ul")

		const img = document.createElement("img")
		img.src = svgUl
		button.appendChild(img)

		this.el.appendChild(button)

		button.onmousedown = e => {
			document.execCommand("insertUnorderedList", false, "")
			this.elInput.focus()
			return false
		}
	}

	private createButtonOL() {
		const button = document.createElement("span")
		button.classList.add("button")
		button.classList.add("ol")

		const img = document.createElement("img")
		img.src = svgOl
		button.appendChild(img)

		this.el.appendChild(button)

		button.onmousedown = e => {
			document.execCommand("insertOrderedList", false, "")
			this.elInput.focus()
			return false
		}
	}
}
