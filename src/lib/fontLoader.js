const loaded = new Set();

export function loadGoogleFont(font) {
	if (!font) return;
	if (loaded.has(font)) return;

	const id = `font-${font}`;

	if (document.getElementById(id)) return;

	const link = document.createElement("link");
	link.id = id;
	link.rel = "stylesheet";
	link.href =
		`https://fonts.googleapis.com/css2?family=${font.replaceAll(" ", "+")}:wght@300;400;500;600;700&display=swap`;

	document.head.appendChild(link);

	loaded.add(font);
}
