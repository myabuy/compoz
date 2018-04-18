export class Utils {
  // Preserve content editable selection https://stackoverflow.com/a/3316483/3034747
  static saveSelection() {
    if (window.getSelection) {
        const sel = window.getSelection();
        if (sel.getRangeAt && sel.rangeCount) {
            return sel.getRangeAt(0);
        }
    }
    return null;
  }
  // restore content editable selection https://stackoverflow.com/a/3316483/3034747
  static restoreSelection(range: Range | null) {
    if (range) {
        if (window.getSelection) {
            const sel = window.getSelection();
            sel.removeAllRanges();
            sel.addRange(range);
        }
    }
  }

  static preserveSelection(callback: Function) {
    const currentSelection: Range | null = this.saveSelection();
    callback();
    this.restoreSelection(currentSelection);
  }
}
