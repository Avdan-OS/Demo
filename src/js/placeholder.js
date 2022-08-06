class Placeholder {

	content;
	title;
	src;
	extraClass;
	
	constructor(title, src, extraClass = []) {
		if (!title || !src) {
			console.error("Placeholder.constructor: Title and icon src required");
			return 1;
		}

		this.title = title;
		this.src = src;
		this.extraClass = extraClass;

		this.content = document.createElement("div");
		this.content.classList.add("placeholder-content");

		// -- M A I N  T I T L E
		var placeholder_title = document.createElement("div");
		placeholder_title.classList.add("placeholder-title");
		placeholder_title.innerHTML = this.title;
		this.content.appendChild(placeholder_title);

		var placeholder_main = document.createElement("div");
		placeholder_main.classList.add("placeholder-main");

		var placeholder_placeholder = document.createElement("div");
		placeholder_placeholder.classList.add("placeholder-placeholder");
		placeholder_placeholder.innerHTML = "There is no content here for now...";
		placeholder_main.appendChild(placeholder_placeholder);

		this.content.appendChild(placeholder_main);

		// -- //

		this.content.classList.add("noselect");
	}
}
