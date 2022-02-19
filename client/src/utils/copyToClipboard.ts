export const copy = (d: string = "") => {
	if (navigator.clipboard && window.isSecureContext) navigator.clipboard.writeText(d);
	else {
		const textArea = document.createElement("textarea");
		textArea.value = d
		textArea.style.position = "fixed";
		textArea.style.left = "-999999px";
		textArea.style.top = "-999999px";
		document.body.appendChild(textArea);
		textArea.focus();
		textArea.select();

		document.execCommand('copy')
		textArea.remove();
	}
}