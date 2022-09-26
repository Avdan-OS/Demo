// -- L A L E -- //

class Lale {

	static content;
	static title = "Lale";
	static src = "src/images/demo/icons/Apps/Lale.png";
	static extraClass = [];
	
	static {
		var lale_content = document.createElement("div");
		lale_content.classList.add("lale-content");

		// -- M A I N  B U T T O N S
		var lale_buttons = document.createElement("div");
		lale_buttons.classList.add("lale-buttons");

		var lale_top_buttons = [
			{
			}
		]


		lale_content.appendChild(lale_buttons);

		// -- M A I N  I C O N
		var lale_icon = document.createElement("div");
		lale_icon.classList.add("lale-icon");

		var lale_icon_img = document.createElement("img");
		lale_icon_img.src = "src/images/demo/icons/Apps/Lale.png";

		// -- M A I N  T I T L E
		var lale_title = document.createElement("div");
		lale_title.classList.add("lale-title");
		lale_title.innerHTML = "Lale";

		lale_icon.appendChild(lale_icon_img);
		lale_icon.appendChild(lale_title);
		lale_content.appendChild(lale_icon);

		// -- S E A R C H B A R  W R A P
		var lale_searchbar_holder = document.createElement("div");
		lale_searchbar_holder.classList.add("lale-searchbar-holder");

		// S E A R C H B A R 
		var lale_searchbar = document.createElement("div");
		lale_searchbar.classList.add("lale-searchbar");

		// S E A R C H  I C O N
		var lale_searchbar_icon = document.createElement("img");
		lale_searchbar_icon.src = "src/images/demo/icons/Search.png";

		// I N P U T  E L E M E N T 
		var lale_searchbar_input = document.createElement("input");
		lale_searchbar_input.setAttribute("type", "text");
		lale_searchbar_input.setAttribute("placeholder", "Search...");

		// A D D I N G  S E A R C H B A R
		lale_searchbar.appendChild(lale_searchbar_icon);
		lale_searchbar.appendChild(lale_searchbar_input);

		lale_searchbar_holder.appendChild(lale_searchbar);

		lale_content.appendChild(lale_searchbar_holder);

		// -- //

		lale_content.classList.add("noselect");
		Lale.content = lale_content;
	}

	static async listener(content) {
	}
}
