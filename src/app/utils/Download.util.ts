export function download(blob: Blob, name: string) {
	const url = window.URL.createObjectURL(blob);
	const a = document.createElement('a');
	a.href = url;
	a.download = name;
	a.click();
	window.URL.revokeObjectURL(url);
}
