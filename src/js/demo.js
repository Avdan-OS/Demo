// M A I N

// -- F I L E  M A N A G E R -- //

// M A I N  E L E M E N T
var files_content = document.createElement("div");
files_content.classList.add("files-content");

// -- M A I N  T I T L E
var files_title = document.createElement("div");
files_title.classList.add("files-title");
files_title.innerHTML = "Files";
files_content.appendChild(files_title);
// -- //

// -- S E A R C H B A R  W R A P
var files_searchbar_holder = document.createElement("div");
files_searchbar_holder.classList.add("files-searchbar-holder");

// S E A R C H B A R 
var files_searchbar = document.createElement("div");
files_searchbar.classList.add("files-searchbar");

// I N P U T  E L E M E N T 
var files_searchbar_input = document.createElement("input");
files_searchbar_input.setAttribute("type", "text");
files_searchbar_input.setAttribute("placeholder", "Find a file...");

// S E A R C H  I C O N
var files_searchbar_icon = document.createElement("img");
files_searchbar_icon.src = "src/images/demo/icons/Search.png";

// A D D I N G  S E A R C H B A R
files_searchbar.appendChild(files_searchbar_input);
files_searchbar.appendChild(files_searchbar_icon);

files_searchbar_holder.appendChild(files_searchbar);

files_content.appendChild(files_searchbar_holder);
// -- //

// -- A L L  F I L E S  A N D  F O L D E R S
var files_folder_list = document.createElement("div");
files_folder_list.classList.add("files-folder-list");

// L E F T  S I D E  C O N F I G S
var files_open_list_items = [
	{
		"title" : "Favorites", // section title
		"items" : [
			{
				"src" : "src/images/demo/icons/Files/Documents.png", // item icon
				"label" : "Documents" // item label
			},
			{
				"src" : "src/images/demo/icons/Files/Downloads.png",
				"label" : "Downloads"
			},
			{
				"src" : "src/images/demo/icons/Files/Aplications.png",
				"label" : "Applications"
			},
			{
				"src" : "src/images/demo/icons/Files/Desktop.png",
				"label" : "Desktop"
			},
			{
				"src" : "src/images/demo/icons/Files/Recents.png",
				"label" : "Recents"
			},
		]
	},
	{
		"title" : "Pinned",
		"items" : [
			{
				"src" : "folder", // special element "folder" (svg)
				"label" : "Notes",
				"color" : "#d06b6e" // color for special element
			},
			{
				"src" : "folder",
				"label" : "Voice Memos",
				"color" : "#d54686"
			},
			{
				"src" : "folder",
				"label" : "Work",
				"color" : "#835cc0"
			},
			{
				"src" : "folder",
				"label" : "Wallpapers",
				"color" : "#379ea4"
			},
			{
				"src" : "folder",
				"label" : "Project M",
				"color" : "#519fc4" // default color
			},
		]
	},
	{
		"title" : "Tags",
		"items" : [
			{
				"src" : "rounded", // special element "circle" (div)
				"label" : "Projects",
				"color" : "#519fc4" // default color
			},
			{
				"src" : "rounded",
				"label" : "Important",
				"color" : "#d06b6e"
			},
			{
				"src" : "rounded",
				"label" : "Sound",
				"color" : "#d54686"
			},
			{
				"src" : "rounded",
				"label" : "Work",
				"color" : "#835cc0"
			},
			{
				"src" : "rounded",
				"label" : "Travel",
				"color" : "#d59232"
			},
			{
				"src" : "rounded",
				"label" : "Design",
				"color" : "#379ea4"
			}
		]
	}
]

// L E F T  S I D E
var files_open_list = document.createElement("div");
files_open_list.classList.add("files-open-list");

// - L E F T  S I D E  C O N S T R U C T O R
files_open_list_items.forEach(item => {
	// create a section
	var files_open_list_item = document.createElement("div");
	files_open_list_item.classList.add("files-open-list-item");

	// create title for it
	var files_open_list_item_title = document.createElement("div");
	files_open_list_item_title.classList.add("files-open-list-item-title");
	files_open_list_item_title.innerHTML = item.title;

	// craete folders/files list
	var files_open_list_item_folders = document.createElement("div");
	files_open_list_item_folders.classList.add("files-open-list-item-folders");

	// roll through the items
	item["items"].forEach(folder => {
		// craete main wrap for folder/file
		var files_open_list_item_folder = document.createElement("div");
		files_open_list_item_folder.classList.add("files-open-list-item-folder");

		// create icon
		var files_open_list_item_folder_src;
		if (folder.src == "rounded") { // if circle needed
			files_open_list_item_folder_src = document.createElement("div");
			files_open_list_item_folder_src.classList.add("rounded-icon");
			files_open_list_item_folder_src.style.backgroundColor = folder.color || "#519fc4";
		}
		else if (folder.src == "folder") { // if colored folder needed
			files_open_list_item_folder_src = document.createElementNS("http://www.w3.org/2000/svg", "svg");
			files_open_list_item_folder_src.setAttributeNS(null, "viewBox", "0 0 96 96");
			files_open_list_item_folder_src.innerHTML = '<path d="M12 8.5L30 8.5C30 8.5 35 8.5 38 12L41 14.5C41 14.5 44 17 46 16.5L82 16.5C82 16.5 88 18 91 26L91.5 79C91.5 79 91.75 88.75 83 88.5L13 88.5C13 88.5 5 88 4 79L4 20C4 20 4 11 12 8.5Z"></path><path d="M 4 44L4 79C4 79 5 88 13 88.5L83 88.5C83 88.5 91.75 88.75 91.5 79L91.5 44C91.5 44 89 38 83 38L13 38C13 38 6 37 4 44Z"></path>';
			files_open_list_item_folder_src.style.fill = folder.color || "#519fc4";
		}
		else { // default img 
			files_open_list_item_folder_src = document.createElement("img");
			files_open_list_item_folder_src.src = folder.src;
		}

		// create label to folder/file
		var files_open_list_item_folder_label = document.createElement("div");
		files_open_list_item_folder_label.classList.add("folder-label");
		files_open_list_item_folder_label.innerHTML = folder.label;

		// add all to the wrap
		files_open_list_item_folder.appendChild(files_open_list_item_folder_src);
		files_open_list_item_folder.appendChild(files_open_list_item_folder_label);

		// add to the folders
		files_open_list_item_folders.appendChild(files_open_list_item_folder);
	});

	// add titles and folders
	files_open_list_item.appendChild(files_open_list_item_title);
	files_open_list_item.appendChild(files_open_list_item_folders);

	// add to the left side element
	files_open_list.appendChild(files_open_list_item);
});
// - //

// R I G H T  S I D E  C O N F I G S
files_closed_items = [
	{
		"title" : "Recently Opened", // section title
		"items" : [
			{
				"src" : "src/images/demo/icons/Files/Documents.png", // item icon
				"label" : "2022 Monthly Expenses", // item label
				"date" : "5m ago" // last opened date
			},
			{
				"src" : "src/images/demo/icons/Files/Downloads.png",
				"label" : "Instructions",
				"date" : "1h ago"
			},
			{
				"src" : "src/images/demo/icons/Files/Documents.png",
				"label" : "Rental Agreement",
				"date" : "2h ago"
			}
		],
	},
	{
		"title" : "Recommended",
		"items" : [
			{
				"src" : "src/images/demo/icons/Files/Documents.png",
				"label" : "Introduction Video.aep",
			},
			{
				"src" : "src/images/demo/icons/Files/Documents.png",
				"label" : "Brand Guidelines.psd",
			},
			{
				"src" : "folder",
				"label" : "Project X",
			}
		],
	}
]

// R I G H T  S I D E
var files_closed_list = document.createElement("div");
files_closed_list.classList.add("files-closed-list");

// - R I G H T  S I D E  C O N S T R U C T O R
files_closed_items.forEach(item => {
	// create a section 
	var files_closed_item = document.createElement("div");
	files_closed_item.classList.add("files-closed-item");

	// create a title for section
	var files_closed_title = document.createElement("div");
	files_closed_title.classList.add("files-closed-title");
	files_closed_title.innerHTML = item.title;

	// folders/files list wrpa
	var files_closed_folders = document.createElement("div");
	files_closed_folders.classList.add("files-closed-folders");

	// roll through items
	item.items.forEach(folder => {
		// create folder/file wrpa
		var files_closed_folder = document.createElement("div");
		files_closed_folder.classList.add("files-closed-folder");

		// create icon
		if (folder.src == "folder") { // if colored folder needed
			var files_closed_folder_icon = document.createElementNS("http://www.w3.org/2000/svg", "svg");
			files_closed_folder_icon.setAttributeNS(null, "viewBox", "0 0 96 96");
			files_closed_folder_icon.innerHTML = '<path d="M12 8.5L30 8.5C30 8.5 35 8.5 38 12L41 14.5C41 14.5 44 17 46 16.5L82 16.5C82 16.5 88 18 91 26L91.5 79C91.5 79 91.75 88.75 83 88.5L13 88.5C13 88.5 5 88 4 79L4 20C4 20 4 11 12 8.5Z"></path><path d="M 4 44L4 79C4 79 5 88 13 88.5L83 88.5C83 88.5 91.75 88.75 91.5 79L91.5 44C91.5 44 89 38 83 38L13 38C13 38 6 37 4 44Z"></path>';
			files_closed_folder_icon.style.fill = folder.color || "#519fc4";
		}
		else { // default img
			var files_closed_folder_icon = document.createElement("img");
			files_closed_folder_icon.classList.add("right-folders-icon");
			files_closed_folder_icon.src = folder.src;
		}

		// create label
		var files_closed_folder_label = document.createElement("div");
		files_closed_folder_label.classList.add("right-folders-label");
		files_closed_folder_label.innerHTML = folder.label;

		// add date (default "" if none)
		var files_closed_folder_date = document.createElement("div");
		files_closed_folder_date.classList.add("right-folders-date");
		files_closed_folder_date.innerHTML = folder.date || "";

		// add all element to the wrap
		files_closed_folder.appendChild(files_closed_folder_icon);
		files_closed_folder.appendChild(files_closed_folder_label);
		files_closed_folder.appendChild(files_closed_folder_date);

		// add to the folders/files wrap
		files_closed_folders.appendChild(files_closed_folder);
	});

	// title and folders to the section
	files_closed_item.appendChild(files_closed_title);
	files_closed_item.appendChild(files_closed_folders);

	// add section to the right side
	files_closed_list.appendChild(files_closed_item);
});
// - //

// add right and left side to the wrap
files_folder_list.appendChild(files_open_list);
files_folder_list.appendChild(files_closed_list);

// make unselectable
files_content.classList.add("noselect");

// add wrap to the main
files_content.appendChild(files_folder_list);
// -- //

// -- P H O T O S -- //

var photos_content = document.createElement("div");
photos_content.classList.add("photos-content");

// -- M A I N  T I T L E
var photos_title = document.createElement("div");
photos_title.classList.add("photos-title");
photos_title.innerHTML = "Photos";
photos_content.appendChild(photos_title);

var photos_main = document.createElement("div");
photos_main.classList.add("photos-main");

var photos_placeholder = document.createElement("div");
photos_placeholder.classList.add("photos-placeholder");
photos_placeholder.innerHTML = "There is no content here for now...";
photos_main.appendChild(photos_placeholder);

photos_content.appendChild(photos_main);
// -- //

// -- L A L E -- //

var lale_content = document.createElement("div");
lale_content.classList.add("lale-content");

// -- M A I N  B U T T O N S
var lale_buttons = document.createElement("div");
lale_buttons.classList.add("lale-buttons");

lale_top_buttons = [
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

// -- T E S T S  ( P L A C E H O L D E R S )

// -- M A I L -- //

var mail_content = document.createElement("div");
mail_content.classList.add("mail-content");

// -- M A I N  T I T L E
var mail_title = document.createElement("div");
mail_title.classList.add("mail-title");
mail_title.innerHTML = "Mail";
mail_content.appendChild(mail_title);

var mail_main = document.createElement("div");
mail_main.classList.add("mail-main");

var mail_placeholder = document.createElement("div");
mail_placeholder.classList.add("mail-placeholder");
mail_placeholder.innerHTML = "There is no content here for now...";
mail_main.appendChild(mail_placeholder);

mail_content.appendChild(mail_main);
// -- //

// -- C A L E N D A R -- //

var calendar_content = document.createElement("div");
calendar_content.classList.add("calendar-content");

// -- M A I N  T I T L E
var calendar_title = document.createElement("div");
calendar_title.classList.add("calendar-title");
calendar_title.innerHTML = "Calendar";
calendar_content.appendChild(calendar_title);

var calendar_main = document.createElement("div");
calendar_main.classList.add("calendar-main");

var calendar_placeholder = document.createElement("div");
calendar_placeholder.classList.add("calendar-placeholder");
calendar_placeholder.innerHTML = "There is no content here for now...";
calendar_main.appendChild(calendar_placeholder);

calendar_content.appendChild(calendar_main);
// -- //

// -- N O T E S -- //

var notes_content = document.createElement("div");
notes_content.classList.add("notes-content");

// -- M A I N  T I T L E
var notes_title = document.createElement("div");
notes_title.classList.add("notes-title");
notes_title.innerHTML = "Notes";
notes_content.appendChild(notes_title);

var notes_main = document.createElement("div");
notes_main.classList.add("notes-main");

var notes_placeholder = document.createElement("div");
notes_placeholder.classList.add("notes-placeholder");
notes_placeholder.innerHTML = "There is no content here for now...";
notes_main.appendChild(notes_placeholder);

notes_content.appendChild(notes_main);
// -- //

// -- S E T T I N G S -- //

var settings_content = document.createElement("div");
settings_content.classList.add("settings-content");

// -- M A I N  T I T L E
var settings_title = document.createElement("div");
settings_title.classList.add("settings-title");
settings_title.innerHTML = "Settings";
settings_content.appendChild(settings_title);

var settings_main = document.createElement("div");
settings_main.classList.add("settings-main");

var settings_placeholder = document.createElement("div");
settings_placeholder.classList.add("settings-placeholder");
settings_placeholder.innerHTML = "There is no content here for now...";
settings_main.appendChild(settings_placeholder);

settings_content.appendChild(settings_main);
// -- //

// -- M U S I C -- //

var currentAudioIndex = 0;
var durationBarInterval;
var audios = [
	{
		"title" : "AWOL",
		"artist" : "Papa Khan",
		"url" : "src/audio/Papa Khan - AWOL.mp3",
		"src" : "src/images/Papa Khan - AWOL.jpg"
	},
	{
		"title" : "The Search",
		"artist" : "NF",
		"url" : "src/audio/NF - The Search.mp3",
		"src" : "src/images/NF - The Search.jpg"
	},
	{
		"title" : "Rain",
		"artist" : "Papa Khan",
		"url" : "src/audio/Papa Khan - Rain.mp3",
		"src" : "src/images/Papa Khan - Rain.jpg"
	},
	{
		"title" : "Let You Down",
		"artist" : "NF",
		"url" : "src/audio/NF - Let You Down.mp3",
		"src" : "src/images/NF - Let You Down.webp"
	},
]

for (var i = 0; i < audios.length; i++) {
	audios[i].id = i;
}

var audio = new Audio(audios[currentAudioIndex].url);

const reloadPlayer = () => {
	audio.src = audios[currentAudioIndex].url;
	audio.addEventListener("canplay", e => {
		audio.play();
	});
	player_title.innerHTML = audios[currentAudioIndex].title;
	document.querySelectorAll(".music-bottom-side-player-title").forEach(item => {
		item.innerHTML = audios[currentAudioIndex].title;

	});
	plyer_artist.innerHTML = audios[currentAudioIndex].artist;
	document.querySelectorAll(".music-bottom-side-player-artist").forEach(item => {
		item.innerHTML = audios[currentAudioIndex].artist;
	});
	player_icon_img.src = audios[currentAudioIndex].src;
	document.querySelectorAll(".music-bottom-side-icon").forEach(item => {
		item.src = audios[currentAudioIndex].src;
	});
	duration_bar.style.width = `0%`;
	player_pause.innerHTML = '<path d="M10 24h-3c 0 0-3 0-3-3v-18c0 0 0-3 3-3c0 0 3 0 3 3v18c 0 0 0 3-3 3zm10 0h-3c0 0-3 0-3-3v-18c0 0 0-3 3-3c0 0 3 0 3 3v18 c 0 0 0 3-3 3z"></path>';
	document.querySelectorAll(".music-bottom-side-pause").forEach(item => {
		item.innerHTML = '<path d="M10 24h-3c 0 0-3 0-3-3v-18c0 0 0-3 3-3c0 0 3 0 3 3v18c 0 0 0 3-3 3zm10 0h-3c0 0-3 0-3-3v-18c0 0 0-3 3-3c0 0 3 0 3 3v18 c 0 0 0 3-3 3z"></path>';
	});

	document.querySelectorAll(".music-right-side").forEach(item => {
		item.querySelectorAll(".music-right-side-music-list-line").forEach(line => {
			if (line.item_id == currentAudioIndex) {
				line.style.backgroundColor = "var(--light-bg)";
			}
			else {
				line.style.backgroundColor = null;
			}
		});
	});

	audio.addEventListener("play", e => {
		playAudio();
	});

	audio.addEventListener("pause", e => {
		pauseAudio();
	});
}

const nextTrack = () => {
	currentAudioIndex += parseInt((currentAudioIndex >= audios.length-1) && `${-1*audios.length+1}` || "1");
	reloadPlayer();
}

const previousTrack = () => {
	currentAudioIndex -= parseInt((currentAudioIndex <= 0) && `${-1*audios.length+1}` || "1");
	reloadPlayer();
}

const playAudio = () => {
	durationBarInterval = setInterval(() => {
		duration_bar.style.width = `${(audio.currentTime/audio.duration)*100}%`;
		document.querySelectorAll(".music-bottom-side-duration-bar").forEach(item => {
			item.style.width = `${(audio.currentTime/audio.duration)*100}%`;
		});
	}, 500);
}

const pauseAudio = () => {
	clearInterval(durationBarInterval);
	if (audio.currentTime == audio.duration) {
		nextTrack();
	}
}

const changeCurrentAudioTime = (e) => {
	audio.currentTime = (e.offsetX/e.currentTarget.offsetWidth)*audio.duration;
	duration_bar.style.width = `${(audio.currentTime/audio.duration)*100}%`;
	document.querySelectorAll(".music-bottom-side-duration-bar").forEach(item => {
		item.style.width = `${(audio.currentTime/audio.duration)*100}%`;
	});
}

const playPauseAudio = () => {
	if (audio.paused) {
		audio.play();
		player_pause.innerHTML = '<path d="M10 24h-3c 0 0-3 0-3-3v-18c0 0 0-3 3-3c0 0 3 0 3 3v18c 0 0 0 3-3 3zm10 0h-3c0 0-3 0-3-3v-18c0 0 0-3 3-3c0 0 3 0 3 3v18 c 0 0 0 3-3 3z"></path>';
		document.querySelectorAll(".music-bottom-side-pause").forEach(item => {
			item.innerHTML = '<path d="M10 24h-3c 0 0-3 0-3-3v-18c0 0 0-3 3-3c0 0 3 0 3 3v18c 0 0 0 3-3 3zm10 0h-3c0 0-3 0-3-3v-18c0 0 0-3 3-3c0 0 3 0 3 3v18 c 0 0 0 3-3 3z"></path>';
		});
	}
	else {
		audio.pause();
		player_pause.innerHTML = '<path d="M3 22v-17c0 0-0.5-4 3-3l15 8.5c0 0 1.5 1.5 0 3l-15 8.5c 0 0-4 1-3-3z"></path>';
		document.querySelectorAll(".music-bottom-side-pause").forEach(item => {
			item.innerHTML = '<path d="M3 22v-17c0 0-0.5-4 3-3l15 8.5c0 0 1.5 1.5 0 3l-15 8.5c 0 0-4 1-3-3z"></path>';
		});
	}
}

var music_content = document.createElement("div");
music_content.classList.add("music-content");

var music_left_side = document.createElement("div");
music_left_side.classList.add("music-left-side");

var music_left_side_items = document.createElement("div");
music_left_side_items.classList.add("music-left-side-items");

var music_left_side_sections = document.createElement("div");
music_left_side_sections.classList.add("music-left-side-section");

music_left_side_sections_items = [
	{
		"src" : "home",
		"label" : "Home"
	},
	{
		"src" : "home",
		"label" : "Search"
	},
	{
		"src" : "home",
		"label" : "Your Library"
	},
]

music_left_side_sections_items.forEach(item => {
	var music_left_side_sections_item = document.createElement("div");
	music_left_side_sections_item.classList.add("music-left-side-sections-item");

	var music_left_side_sections_item_icon_holder = document.createElement("div");
	music_left_side_sections_item_icon_holder.classList.add("music-left-side-sections-item-icon-holder");
	if (item.src == "home") { // if colored folder needed
		var music_left_side_sections_item_icon = document.createElementNS("http://www.w3.org/2000/svg", "svg");
		music_left_side_sections_item_icon.setAttributeNS(null, "viewBox", "0 0 196 196");
		music_left_side_sections_item_icon.classList.add("music-left-side-sections-item-icon");
		music_left_side_sections_item_icon.innerHTML = '<path d="m 54.253,194.747 c 7.35695,0 16.747,-3.95785 16.747,-10.878 v -44.783 c 0,0 -0.83176,-8.1372 10.416,-8.54422 11.247769,-0.40702 33.168,0 33.168,0 0,0 10.416,-1.1125 10.416,8.54422 v 44.46 c 0,8.40413 9.35218,11.201 16.747,11.201 H 178 c 0,0 16.74701,1.33209 16.747,-11.201 0,0 -5e-5,-76.24649 -5e-5,-95.816 C 194.74695,73.126372 183.2,65.088 183.2,65.088 L 116.78272,8.0140635 c 0,0 -15.55026,-15.2658229 -34.213176,0 L 12.795,65.088 c 0,0 -11.533,7.268738 -11.533,22.642 0,8.58803 0,96.48922 0,96.48922 0,0 -0.058669,10.54188 13.102057,10.52778 h 16.219975 z"></path>';
	}
	else {
		var music_left_side_sections_item_icon = document.createElement("img");
		music_left_side_sections_item_icon.classList.add("music-left-side-sections-item-icon");
		music_left_side_sections_item_icon.src = item.src;
	}

	var music_left_side_sections_item_label = document.createElement("div");
	music_left_side_sections_item_label.classList.add("music-left-side-sections-item-label");
	music_left_side_sections_item_label.innerHTML = item.label;

	music_left_side_sections_item_icon_holder.appendChild(music_left_side_sections_item_icon);

	music_left_side_sections_item.appendChild(music_left_side_sections_item_icon_holder);
	music_left_side_sections_item.appendChild(music_left_side_sections_item_label);

	music_left_side_sections.appendChild(music_left_side_sections_item);
});

var music_left_side_playlists = document.createElement("div");
music_left_side_playlists.classList.add("music-left-side-playlists");

var music_left_side_main_playlists_items = [
	{
		"src" : "src/images/home.svg",
		"label" : "Create Playlist"
	},
	{
		"src" : "src/images/home.svg",
		"label" : "Liked Songs"
	},
]

var music_left_side_personal_playlists_items = [
	{
		"label" : "Guest's best"
	},
]

var music_left_side_main_playlists = document.createElement("div");
music_left_side_main_playlists.classList.add("music-left-side-main-playlists");

music_left_side_main_playlists_items.forEach(item => {
	var music_left_side_main_playlist = document.createElement("div");
	music_left_side_main_playlist.classList.add("music-left-side-main-playlist");

	var music_left_side_main_playlist_icon_holder = document.createElement("div");
	music_left_side_main_playlist_icon_holder.classList.add("music-left-side-main-playlist-icon-holder");

	var music_left_side_main_playlist_icon = document.createElement("img");
	music_left_side_main_playlist_icon.classList.add("music-left-side-main-playlist-icon");
	music_left_side_main_playlist_icon.src = item.src;

	var music_left_side_main_playlist_label = document.createElement("div");
	music_left_side_main_playlist_label.classList.add("music-left-side-main-playlist-label");
	music_left_side_main_playlist_label.innerHTML = item.label;

	music_left_side_main_playlist_icon_holder.appendChild(music_left_side_main_playlist_icon);

	music_left_side_main_playlist.appendChild(music_left_side_main_playlist_icon_holder);
	music_left_side_main_playlist.appendChild(music_left_side_main_playlist_label);

	music_left_side_main_playlists.appendChild(music_left_side_main_playlist);
});

var music_left_side_personal_playlists = document.createElement("div");
music_left_side_personal_playlists.classList.add("music-left-side-personal-playlists");

music_left_side_personal_playlists_items.forEach(item => {
	var music_left_side_personal_playlist = document.createElement("div");
	music_left_side_personal_playlist.classList.add("music-left-side-personal-playlist");

	var music_left_side_personal_playlist_label = document.createElement("div");
	music_left_side_personal_playlist_label.classList.add("music-left-side-personal-playlist-label");
	music_left_side_personal_playlist_label.innerHTML = item.label;

	music_left_side_personal_playlist.appendChild(music_left_side_personal_playlist_label);

	music_left_side_personal_playlists.appendChild(music_left_side_personal_playlist);
});

music_left_side_playlists.appendChild(music_left_side_main_playlists);
music_left_side_playlists.appendChild(document.createElement("hr"));
music_left_side_playlists.appendChild(music_left_side_personal_playlists);

music_left_side_items.appendChild(music_left_side_sections);

music_left_side.appendChild(music_left_side_sections);
music_left_side.appendChild(music_left_side_playlists);

var music_right_side = document.createElement("div");
music_right_side.classList.add("music-right-side");

var music_bottom_side = document.createElement("div");
music_bottom_side.classList.add("music-bottom-side");

var music_main = document.createElement("div");
music_main.classList.add("music-main");

music_main.appendChild(music_left_side);
music_main.appendChild(music_right_side);

music_content.appendChild(music_main);
music_content.appendChild(music_bottom_side);

const musicListeners = content => {
	var music_list_holder = content.querySelector(".music-right-side");

	var music_list = document.createElement("div");
	music_list.classList.add("music-right-side-music-list");

	var music_list_header = document.createElement("div");
	music_list_header.classList.add("music-right-side-music-list-header");
	
	var music_list_header_ids = document.createElement("div");
	music_list_header_ids.style.textAlign = "center";
	music_list_header_ids.innerHTML = "#";

	var music_list_header_titles = document.createElement("div");
	music_list_header_titles.innerHTML = "TITLE";

	var music_list_header_durations = document.createElement("div");
	music_list_header_durations.style.textAlign = "center";
	music_list_header_durations.innerHTML = "DURATION";

	var music_list_split = document.createElement("hr");

	music_list_header.appendChild(music_list_header_ids);
	music_list_header.appendChild(music_list_header_titles);
	music_list_header.appendChild(music_list_header_durations);

	music_list.appendChild(music_list_header);
	music_list.appendChild(music_list_split);

	const addDuration = (i) => {
		var item = music_list_holder.querySelectorAll(".music-right-side-music-list-line")[i];
		var duration = item.querySelector(".music-right-side-music-list-line-duration");
		duration.innerHTML = `${(item.tmp_audio.duration - item.tmp_audio.duration%60)/60}:${(parseInt(item.tmp_audio.duration%60) < 10) && '0'+parseInt(item.tmp_audio.duration%60) || parseInt(item.tmp_audio.duration%60)}`;
		item.tmp_audio = null;
	}

	var i = 0;
	while (i < audios.length) {
		var music_list_line = document.createElement("div");
		music_list_line.classList.add("music-right-side-music-list-line");
		music_list_line.item_id = audios[i].id;
		music_list_line.style.backgroundColor = (i == currentAudioIndex) && "var(--light-bg)";
		music_list_line.addEventListener("click", e => {
			if (currentAudioIndex != e.currentTarget.item_id || audio.paused) {
				currentAudioIndex = e.currentTarget.item_id;
				reloadPlayer();
			}
		});

		var music_list_line_id = document.createElement("div");
		music_list_line_id.classList.add("music-right-side-music-list-line-id");
		music_list_line_id.innerHTML = audios[i].id + 1;

		var music_list_line_title = document.createElement("div");
		music_list_line_title.classList.add("music-right-side-music-list-line-title");
		music_list_line_title.innerHTML = audios[i].title;

		var music_list_line_duration = document.createElement("div");
		music_list_line_duration.classList.add("music-right-side-music-list-line-duration");

		music_list_line.tmp_audio = new Audio(audios[i].url);
		music_list_line.tmp_audio.item_id = audios[i].id;
		music_list_line.tmp_audio.addEventListener("loadedmetadata", e => {
			addDuration(e.currentTarget.item_id);
		});

		music_list_line.appendChild(music_list_line_id);
		music_list_line.appendChild(music_list_line_title);
		music_list_line.appendChild(music_list_line_duration);

		music_list.appendChild(music_list_line);
		i += 1;
	}

	music_list_holder.appendChild(music_list);

	var bottom_bar = content.querySelector(".music-bottom-side");
	
	var left_bottom = document.createElement("div");
	left_bottom.classList.add("music-bottom-left-side");

	var icon_holder = document.createElement("div");
	icon_holder.classList.add("music-bottom-side-icon-holder");

	var icon = document.createElement("img");
	icon.classList.add("music-bottom-side-icon");
	icon.src = audios[currentAudioIndex].src;

	var info = document.createElement("div");
	info.classList.add("music-bottom-side-player-info");
	
	var title = document.createElement("div"); 
	title.classList.add("music-bottom-side-player-title");
	title.innerHTML = audios[currentAudioIndex].title;

	var artist = document.createElement("div"); 
	artist.classList.add("music-bottom-side-player-artist");
	artist.innerHTML = audios[currentAudioIndex].artist;

	info.appendChild(title);
	info.appendChild(artist);

	icon_holder.appendChild(icon);
	
	left_bottom.appendChild(icon_holder);
	left_bottom.appendChild(info);

	bottom_bar.appendChild(left_bottom);

	var player = document.createElement("div");
	player.classList.add("music-bottom-side-player");

	var player_control = document.createElement("div");
	player_control.classList.add("music-bottom-side-player-control");

	var player_prev = document.createElementNS("http://www.w3.org/2000/svg", "svg");
	player_prev.classList.add("music-bottom-side-prev");
	player_prev.setAttributeNS(null, "viewBox", "0 0 24 24");
	player_prev.innerHTML = '<path d="M0 21v-15c 0 0-0.5-4 3-3l12 7.5c0 0 1.5 1.5 0 3l-12 7.5c0 0-4 1-3-3zm12-16c 0 0-2 0-1 2.268l5.888 3.732c0 0 1 1 0 2l-3.888 2.732c0 0-4.5 2.5-1 3.268l11-6c0 0 1-1 0-2 l-11-6z"></path>';
	player_prev.style.transform = "rotate(180deg)";
	player_prev.style.fill = "#ffffff";
	player_prev.addEventListener("click", e => {
		previousTrack();
	});

	var player_pause = document.createElementNS("http://www.w3.org/2000/svg", "svg");
	player_pause.classList.add("music-bottom-side-pause");
	player_pause.setAttributeNS(null, "viewBox", "0 0 24 24");
	if (audio.paused) {
		player_pause.innerHTML = '<path d="M3 22v-17c0 0-0.5-4 3-3l15 8.5c0 0 1.5 1.5 0 3l-15 8.5c 0 0-4 1-3-3z"></path>';
	}
	else {
		player_pause.innerHTML = '<path d="M10 24h-3c 0 0-3 0-3-3v-18c0 0 0-3 3-3c0 0 3 0 3 3v18c 0 0 0 3-3 3zm10 0h-3c0 0-3 0-3-3v-18c0 0 0-3 3-3c0 0 3 0 3 3v18 c 0 0 0 3-3 3z"></path>';
	}
	player_pause.style.fill = "#ffffff";
	player_pause.addEventListener("click", e => {
		playPauseAudio();
	});

	var player_next = document.createElementNS("http://www.w3.org/2000/svg", "svg");
	player_next.classList.add("music-bottom-side-next");
	player_next.setAttributeNS(null, "viewBox", "0 0 24 24");
	player_next.innerHTML = '<path d="M0 21v-15c 0 0-0.5-4 3-3l12 7.5c0 0 1.5 1.5 0 3l-12 7.5c0 0-4 1-3-3zm12-16c 0 0-2 0-1 2.268l5.888 3.732c0 0 1 1 0 2l-3.888 2.732c0 0-4.5 2.5-1 3.268l11-6c0 0 1-1 0-2 l-11-6z"></path>';
	player_next.style.fill = "#ffffff";
	player_next.addEventListener("click", e => {
		nextTrack();
	});

	var duration_bar_holder = document.createElement("div");
	duration_bar_holder.classList.add("music-bottom-side-duration-bar-holder");
	duration_bar_holder.addEventListener("click", e => {
		changeCurrentAudioTime(e);
	});

	var duration_bar = document.createElement("div");
	duration_bar.classList.add("music-bottom-side-duration-bar");

	player_control.appendChild(player_prev);
	player_control.appendChild(player_pause);
	player_control.appendChild(player_next);

	duration_bar_holder.appendChild(duration_bar);

	player.appendChild(player_control);
	player.appendChild(duration_bar_holder);

	bottom_bar.appendChild(player);

	var right_bottom = document.createElement("div");
	right_bottom.classList.add("music-bottom-right-side");

	var volume_bar_holder = document.createElement("div");
	volume_bar_holder.classList.add("music-bottom-side-volume-bar-holder");

	var volume_bar = document.createElement("div");
	volume_bar.classList.add("music-bottom-side-volume-bar");

	volume_bar_holder.addEventListener("click", e => {
		audio.volume = (e.currentTarget.offsetHeight-e.offsetY)/e.currentTarget.offsetHeight;
		e.currentTarget.querySelector(".music-bottom-side-volume-bar").style.height = `${audio.volume*100}%`;
	});

	volume_bar_holder.appendChild(volume_bar);

	right_bottom.appendChild(volume_bar_holder);

	bottom_bar.appendChild(right_bottom);
}

// -- //

// -- M E S S G E S -- //

var messages_content = document.createElement("div");
messages_content.classList.add("messages-content");

var messages_left_side = document.createElement("div");
messages_left_side.classList.add("messages-left-side");

var messages_search_chat = document.createElement("div");
messages_search_chat.classList.add("messages-search-chat");

var messages_search_chat_input = document.createElement("input");
messages_search_chat_input.setAttribute("type", "text");
messages_search_chat_input.setAttribute("placeholder", "Search");

var messages_search_chat_icon = document.createElement("img");
messages_search_chat_icon.src = "src/images/demo/icons/Search.png";

messages_search_chat.appendChild(messages_search_chat_input);
messages_search_chat.appendChild(messages_search_chat_icon);

messages_left_side.appendChild(messages_search_chat);

var messages_chat_list = document.createElement("div");
messages_chat_list.classList.add("messages-chat-list");

var messages_chat_list_items = [
	{
		"name" : "John",
		"status" : "offline",
		"messages" : [
			{
				"send_by" : "person",
				"content" : "Did you try this scroll feature?",
				"time" : "9:07 PM"
			},
			{
				"send_by" : "person",
				"content" : "It's really cool",
				"time" : "9:07 PM"
			},
			{
				"send_by" : "you",
				"content" : "Not yet, how can i try it?",
				"time" : "9:08 PM"
			},
			{
				"send_by" : "person",
				"content" : "Just hold cursor over the weather widget and scroll mouse wheel",
				"time" : "9:09 PM"
			},
			{
				"send_by" : "person",
				"content" : "Oh, and don't forget to hold Shift",
				"time" : "9:09 PM"
			},
			{
				"send_by" : "person",
				"content" : "Did it work?",
				"time" : "9:11 PM"
			},
		]
	},
	{
		"name" : "Jane",
		"status" : "offline",
		"messages" : [
			{
				"send_by" : "you",
				"content" : "Hi, Jane. I can't figure out how tab system works",
				"time" : "9:13 PM"
			},
			{
				"send_by" : "person",
				"content" : "Oh, there are guidelines on Github",
				"time" : "9:17 PM"
			},
			{
				"send_by" : "you",
				"content" : "Can you send me the link?",
				"time" : "9:18 PM"
			},
			{
				"send_by" : "person",
				"content" : "<a href='https://github.com/CodeHeister/avdan_web'>Avdan Demo</a>",
				"time" : "9:18 PM"
			},
			{
				"send_by" : "person",
				"content" : "But it will be easier for me to explain it here",
				"time" : "9:19 PM"
			},
			{
				"send_by" : "you",
				"content" : "So, how can i use tabs?",
				"time" : "9:21 PM"
			},
			{
				"send_by" : "person",
				"content" : "Double click to close it, if it's not the first one in a row",
				"time" : "9:22 PM"
			},
			{
				"send_by" : "person",
				"content" : "Hold shift and and drag it",
				"time" : "9:22 PM"
			},
			{
				"send_by" : "person",
				"content" : "In that case you can change it's place droping it over other tabs in the same window",
				"time" : "9:23 PM"
			},
			{
				"send_by" : "you",
				"content" : "?!",
				"time" : "9:24 PM"
			},
			{
				"send_by" : "person",
				"content" : "Just try it",
				"time" : "9:24 PM"
			},
			{
				"send_by" : "you",
				"content" : "It really works 🤨",
				"time" : "9:26 PM"
			},
			{
				"send_by" : "person",
				"content" : "That's not all",
				"time" : "9:26 PM"
			},
			{
				"send_by" : "you",
				"content" : "Really?",
				"time" : "9:26 PM"
			},
			{
				"send_by" : "person",
				"content" : "Yes, you can also tile a window using tabs",
				"time" : "9:27 PM"
			},
			{
				"send_by" : "you",
				"content" : "😵‍💫",
				"time" : "9:27 PM"
			},
			{
				"send_by" : "person",
				"content" : "Just hold Ctrl and press a tab",
				"time" : "9:28 PM"
			},
			{
				"send_by" : "person",
				"content" : "You'll see",
				"time" : "9:28 PM"
			},
			{
				"send_by" : "person",
				"content" : "You can also drag and drop it out of the window",
				"time" : "9:29 PM"
			},
			{
				"send_by" : "person",
				"content" : "Or you can even drop it in another window 😏",
				"time" : "9:31 PM"
			},
			{
				"send_by" : "person",
				"content" : "So, what do you think about it?",
				"time" : "9:31 PM"
			},
		]
	},
	{
		"name" : "James",
		"status" : "offline",
		"messages" : [
			{
				"send_by" : "person",
				"content" : "Well, i told you 100 times to try it",
				"time" : "1:20 PM"
			},
			{
				"send_by" : "person",
				"content" : "Are you here?",
				"time" : "1:22 PM"
			},
			{
				"send_by" : "you",
				"content" : "Yes, i was busy, so, what are you talking about?",
				"time" : "9:03 PM"
			},
			{
				"send_by" : "person",
				"content" : "🤨",
				"time" : "9:07 PM"
			},
			{
				"send_by" : "person",
				"content" : "I said you about app icon swapping",
				"time" : "9:09 PM"
			},
			{
				"send_by" : "person",
				"content" : "You can drag it and change their order",
				"time" : "9:09 PM"
			},
			{
				"send_by" : "person",
				"content" : "They are in the dock below",
				"time" : "9:10 PM"
			},
			{
				"send_by" : "person",
				"content" : "There's also an arrow to hide them",
				"time" : "9:12 PM"
			},
			{
				"send_by" : "person",
				"content" : "You can place unused apps after the line and hide them it 😌",
				"time" : "9:13 PM"
			},
			{
				"send_by" : "person",
				"content" : "It saves a lot of place",
				"time" : "9:13 PM"
			},
			{
				"send_by" : "person",
				"content" : "I wrote about it to Jane, but she didn't answer",
				"time" : "9:15 PM"
			},
			{
				"send_by" : "person",
				"content" : "Do you know where she is?",
				"time" : "9:15 PM"
			},
			{
				"send_by" : "person",
				"content" : "Hey, where you are?",
				"time" : "9:17 PM"
			},
		]
	},
	{
		"name" : "William",
		"status" : "offline",
		"messages" : [
			{
				"send_by" : "person",
				"content" : "This AvdanOS is amazing",
				"time" : "8:47 PM"
			},
			{
				"send_by" : "person",
				"content" : "I can drop a window in another window",
				"time" : "8:48 PM"
			},
			{
				"send_by" : "person",
				"content" : "And it will tile it, the same thing works with draggable tabs",
				"time" : "8:48 PM"
			},
			{
				"send_by" : "person",
				"content" : "Or you can just drop them in window's topbar",
				"time" : "8:50 PM"
			},
			{
				"send_by" : "you",
				"content" : "And what will happen? I'm busy, so i can't test it",
				"time" : "9:52 PM"
			},
			{
				"send_by" : "person",
				"content" : "It will add it without tilling",
				"time" : "9:53 PM"
			},
			{
				"send_by" : "person",
				"content" : "It's hard to notice from the first try",
				"time" : "8:53 PM"
			},
			{
				"send_by" : "you",
				"content" : "Oh, really?!",
				"time" : "9:11 PM"
			},
			{
				"send_by" : "you",
				"content" : "It's cool",
				"time" : "9:11 PM"
			},
		]
	},
	{
		"name" : "Sarah",
		"status" : "offline",
		"messages" : [
			{
				"send_by" : "you",
				"content" : "I accidentally dragged a bar in dock",
				"time" : "9:24 PM"
			},
			{
				"send_by" : "you",
				"content" : "Is it a bug?",
				"time" : "9:24 PM"
			},
			{
				"send_by" : "person",
				"content" : "No, you can merge and unmerge them",
				"time" : "9:26 PM"
			},
			{
				"send_by" : "you",
				"content" : "Wow",
				"time" : "9:27 PM"
			},
		]
	},
];

for (var i = 0; i < messages_chat_list_items.length; i++) {
	messages_chat_list_items[i].id = i;
}

messages_left_side.appendChild(messages_chat_list);

var messages_right_side = document.createElement("div");
messages_right_side.classList.add("messages-right-side");

var messages_header = document.createElement("div");
messages_header.classList.add("messages-header");

var messages_header_icon_holder = document.createElement("div");
messages_header_icon_holder.classList.add("messages-header-icon");

var messages_header_icon = document.createElement("img");
messages_header_icon.src = messages_chat_list_items[0].src || "src/images/demo/icons/Start/DefaultProfilePicture.png";

var messages_header_info = document.createElement("div");
messages_header_info.classList.add("messages-header-info");

var messages_header_name = document.createElement("div");
messages_header_name.classList.add("messages-header-name");
messages_header_name.innerHTML = messages_chat_list_items[0].name;

var messages_header_status = document.createElement("div");
messages_header_status.classList.add("messages-header-status");
messages_header_status.innerHTML = messages_chat_list_items[0].status;

messages_header_icon_holder.appendChild(messages_header_icon);

messages_header_info.appendChild(messages_header_name);
messages_header_info.appendChild(messages_header_status);

messages_header.appendChild(messages_header_icon_holder);
messages_header.appendChild(messages_header_info);

var messages_messages_list = document.createElement("div");
messages_messages_list.classList.add("messages-messages-list");

var messages_type = document.createElement("div");
messages_type.classList.add("messages-type");

var messages_type_input = document.createElement("input");
messages_type_input.classList.add("messages-type-input");
messages_type_input.setAttribute("type", "text");
messages_type_input.setAttribute("placeholder", "Type a message");

var messages_type_icon = document.createElement("img");
messages_type_icon.src = "src/images/demo/icons/Messages/Emoji.png";

messages_type.appendChild(messages_type_input);
messages_type.appendChild(messages_type_icon);

messages_right_side.appendChild(messages_header);
messages_right_side.appendChild(messages_messages_list);
messages_right_side.appendChild(messages_type);

messages_content.appendChild(messages_left_side);
messages_content.appendChild(messages_right_side);

const messageListeners = content => {
	for (var i = 0; i < messages_chat_list_items.length; i++) {
		var item = messages_chat_list_items[i];
		var messages_chat_list_item = document.createElement("div");
		messages_chat_list_item.classList.add("messages-chat-list-item");

		var messages_chat_list_item_icon_holder = document.createElement("div");
		messages_chat_list_item_icon_holder.classList.add("messages-chat-list-item-icon-holder");

		var messages_chat_list_item_icon = document.createElement("img");
		messages_chat_list_item_icon.src = item.src || "src/images/demo/icons/Start/DefaultProfilePicture.png";

		var messages_chat_list_item_info = document.createElement("div");
		messages_chat_list_item_info.classList.add("messages-chat-list-item-info");

		var messages_chat_list_item_name_line = document.createElement("div");
		messages_chat_list_item_name_line.classList.add("messages-chat-list-item-name-line");

		var messages_chat_list_item_name = document.createElement("span");
		messages_chat_list_item_name.classList.add("messages-chat-list-item-name");
		messages_chat_list_item_name.innerHTML = item.name;

		var messages_chat_list_item_date = document.createElement("span");
		messages_chat_list_item_date.classList.add("messages-chat-list-item-date");
		messages_chat_list_item_date.innerHTML = item.messages[item.messages.length-1].time;

		messages_chat_list_item_name_line.appendChild(messages_chat_list_item_name);
		messages_chat_list_item_name_line.appendChild(messages_chat_list_item_date);

		var messages_chat_list_item_message = document.createElement("span");
		messages_chat_list_item_message.classList.add("messages-chat-list-item-message");
		messages_chat_list_item_message.innerHTML = item.messages[item.messages.length-1].content;
		
		messages_chat_list_item_icon_holder.appendChild(messages_chat_list_item_icon);

		messages_chat_list_item_info.appendChild(messages_chat_list_item_name_line);
		messages_chat_list_item_info.appendChild(messages_chat_list_item_message);

		messages_chat_list_item.appendChild(messages_chat_list_item_icon_holder);
		messages_chat_list_item.appendChild(messages_chat_list_item_info);

		content.querySelector(".messages-chat-list").appendChild(messages_chat_list_item);
	}

	content.querySelector(".messages-chat-list").firstChild.style.backgroundColor = "var(--light-bg-hl)";

	var chat = content.querySelector(".messages-messages-list");
	chat.item_id = messages_chat_list_items[0].id;

	for (var i = 0; i < messages_chat_list_items[0].messages.length; i++) {
		var item = messages_chat_list_items[0].messages[i];
		var message_holder = document.createElement("div");
		message_holder.classList.add("message-holder");
		message_holder.classList.add(item.send_by);
		
		var messages_message = document.createElement("div");
		messages_message.classList.add("messages-message");
		messages_message.innerHTML = `${item.content}<sub>${item.time}</sub>`;

		message_holder.appendChild(messages_message);
		chat.appendChild(message_holder);
	}

	var messages_chat_list_children = content.querySelector(".messages-chat-list").children;
	var i = 0;

	var name = content.querySelector(".messages-header-name");
	var chat_status = content.querySelector(".messages-header-status");
	var chat_icon = content.querySelector(".messages-header-icon img");

	messages_chat_list_items.forEach(item => {
		messages_chat_list_children[i].addEventListener("click", e => {
			e.currentTarget.parentElement.querySelectorAll(".messages-chat-list-item").forEach(chat_item => {
				chat_item.style.backgroundColor = null;
			});
			e.currentTarget.style.backgroundColor = "var(--light-bg-hl)";
			
			name.innerHTML = item.name;
			chat_status.innerHTML = item.status;
			chat.innerHTML = "";
			chat.item_id = item.id;
			chat_icon.src = item.src || "src/images/demo/icons/Start/DefaultProfilePicture.png";

			item.messages.forEach(chat_item => {
				var message_holder = document.createElement("div");
				message_holder.classList.add("message-holder");
				message_holder.classList.add(chat_item.send_by);
				
				var messages_message = document.createElement("div");
				messages_message.classList.add("messages-message");
				messages_message.innerHTML = `${chat_item.content}<sub>${chat_item.time}</sub>`;

				message_holder.appendChild(messages_message);
				chat.appendChild(message_holder);
			});

		});
		i += 1;
	});

	var type_input = content.querySelector(".messages-type-input");
	type_input.addEventListener("keypress", e => {
		if (e.keyCode == 13 && type_input.value != "") {
			var date = new Date;
			var send_date = `${(date.getHours() >= 12) && (date.getHours() - 12) || date.getHours()}:${(date.getMinutes() < 10) && "0"+date.getMinutes() || date.getMinutes()} ${(date.getHours() >= 12) && 'PM' || 'AM'}`;

			messages_chat_list_items[chat.item_id].messages.push({
				"send_by" : "you",
				"content" : type_input.value,
				"time" : send_date

			});
				
			document.querySelectorAll(".messages-content").forEach(messages_content => {
				var message_holder = document.createElement("div");
				message_holder.classList.add("message-holder");
				message_holder.classList.add("you");
				
				var messages_message = document.createElement("div");
				messages_message.classList.add("messages-message");
				messages_message.innerHTML = `${type_input.value}<sub>${send_date}</sub>`;

				message_holder.appendChild(messages_message);
				var selected_chat = messages_content.querySelector(".messages-messages-list");
				if (selected_chat.item_id == chat.item_id) {
					selected_chat.appendChild(message_holder);
				}

				var curr_chat = messages_content.querySelector(".messages-chat-list").children[chat.item_id];
				curr_chat.querySelector(".messages-chat-list-item-message").innerHTML = type_input.value;
				curr_chat.querySelector(".messages-chat-list-item-date").innerHTML = send_date;
			});
			type_input.value = "";
		}
	});
}

// -- //

mail_content.classList.add("noselect");
lale_content.classList.add("noselect");
photos_content.classList.add("noselect");
calendar_content.classList.add("noselect");
notes_content.classList.add("noselect");
settings_content.classList.add("noselect");
music_content.classList.add("noselect");
messages_content.classList.add("noselect");
// -- //

// -- A P P B A R  C O N F I G S
var apps_list_g = [
	{
		"title" : "Files", // window title
		"src" : "src/images/demo/icons/Apps/Files.png", // appbar/window icon
		"content" : files_content, // content for the window
		"extraClass" : ["file-manager"] // extra classes for window (optional)
	},
	{
		"title" : "Mail",
		"src" : "src/images/demo/icons/Apps/Mail.png",
		"content" : mail_content
	},
	{
		"title" : "Lale",
		"src" : "src/images/demo/icons/Apps/Lale.png",
		"content" : lale_content
	},
	{
		"title" : "Photos",
		"src" : "src/images/demo/icons/Apps/Gallery.png",
		"content" : photos_content
	},
	{
		"title" : "Calendar",
		"src" : "src/images/demo/icons/Apps/Calendar.png",
		"content" : calendar_content
	},
	{
		"title" : "Notes",
		"src" : "src/images/demo/icons/Apps/Notes.png",
		"content" : notes_content
	},
	{
		"content" : "hr"
	},
	{
		"title" : "Settings",
		"src" : "src/images/demo/icons/Apps/Settings.png",
		"content" : settings_content
	},
	{
		"title" : "Music",
		"src" : "src/images/demo/icons/Apps/Music.png",
		"content" : music_content,
		"listenerAdder" : musicListeners
	},
	{
		"title" : "Messages",
		"src" : "src/images/demo/icons/Apps/Messages.png",
		"content" : messages_content,
		"listenerAdder" : messageListeners
	},
]

// add apps to the appbar
appBarGenerate(apps_list_g);
// -- //


// -- W E A T H E R  &  T I M E

var weather_time = document.createElement("div");
weather_time.classList.add("weather-time");
weather_time.classList.add("noselect");

var date = new Date;

var curr_time = document.createElement("div");
curr_time.classList.add("curr-time");
curr_time.innerHTML = `${date.getHours()}:${(date.getMinutes() < 10) && "0"+date.getMinutes() || date.getMinutes()}`;
setInterval(() => {
	var date = new Date;
	curr_time.innerHTML = `${date.getHours()}:${(date.getMinutes() < 10) && "0"+date.getMinutes() || date.getMinutes()}`;
}, 1000);


var curr_date = document.createElement("div");
curr_date.classList.add("curr-date");
var days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
curr_date.innerHTML = `${days[date.getDay()-1]}, ${date.toDateString().split(' ')[1]} ${date.getDate()}`;
setInterval(() => {
	var date = new Date;
	curr_date.innerHTML = `${days[date.getDay()-1]}, ${date.toDateString().split(' ')[1]} ${date.getDate()}`;
}, 1000*60*60);

var time_panel = document.createElement("div");
time_panel.classList.add("time-panel");
time_panel.appendChild(curr_time);
time_panel.appendChild(curr_date);

var weather_icon = document.createElementNS("http://www.w3.org/2000/svg", "svg");
weather_icon.setAttributeNS(null, "viewBox", "0 0 24 24");
weather_icon.innerHTML = '<circle cx="12" cy="12" r="5"></circle><line x1="12" y1="1" x2="12" y2="3"></line><line x1="12" y1="21" x2="12" y2="23"></line><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line><line x1="1" y1="12" x2="3" y2="12"></line><line x1="21" y1="12" x2="23" y2="12"></line><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line>';

var weather_grad = document.createElement("div");
weather_grad.classList.add("weather-grad");
weather_grad.innerHTML = "24&#176;";

var weather_panel = document.createElement("div");
weather_panel.classList.add("weather-panel");
weather_panel.appendChild(weather_icon);
weather_panel.appendChild(weather_grad);

weather_time.appendChild(time_panel);
weather_time.appendChild(weather_panel);

// -- //

var duration_bar_holder = document.createElement("div");
duration_bar_holder.classList.add("duration-bar-holder");
duration_bar_holder.addEventListener("click", e => {
	changeCurrentAudioTime(e);
});

var duration_bar = document.createElement("div");
duration_bar.classList.add("duration-bar");

audio.addEventListener("play", e => {
	playAudio();
});

audio.addEventListener("pause", e => {
	pauseAudio();
});

var player_holder = document.createElement("div");
player_holder.classList.add("player-holder");
player_holder.classList.add("noselect");

var player = document.createElement("div");
player.classList.add("player");

var player_icon = document.createElement("div");
player_icon.classList.add("player-icon");

var player_icon_img = document.createElement("img");
player_icon_img.src = audios[currentAudioIndex].src;
player_icon.appendChild(player_icon_img);

var player_info = document.createElement("div");
player_info.classList.add("player-info");

var player_title = document.createElement("div");
player_title.classList.add("player-title");
player_title.innerHTML = audios[currentAudioIndex].title;

var plyer_artist = document.createElement("div");
plyer_artist.classList.add("player-artist");
plyer_artist.innerHTML = audios[currentAudioIndex].artist;

player_info.appendChild(player_title);
player_info.appendChild(plyer_artist);

var player_control = document.createElement("div");
player_control.classList.add("player-control");

var player_prev = document.createElementNS("http://www.w3.org/2000/svg", "svg");
player_prev.setAttributeNS(null, "viewBox", "0 0 24 24");
player_prev.innerHTML = '<path d="M0 21v-15c 0 0-0.5-4 3-3l12 7.5c0 0 1.5 1.5 0 3l-12 7.5c0 0-4 1-3-3zm12-16c 0 0-2 0-1 2.268l5.888 3.732c0 0 1 1 0 2l-3.888 2.732c0 0-4.5 2.5-1 3.268l11-6c0 0 1-1 0-2 l-11-6z"></path>';
player_prev.style.transform = "rotate(180deg)";
player_prev.style.fill = "#ffffff";
player_prev.addEventListener("click", e => {
	previousTrack();
});

var player_pause = document.createElementNS("http://www.w3.org/2000/svg", "svg");
player_pause.setAttributeNS(null, "viewBox", "0 0 24 24");
player_pause.innerHTML = '<path d="M3 22v-17c0 0-0.5-4 3-3l15 8.5c0 0 1.5 1.5 0 3l-15 8.5c 0 0-4 1-3-3z"></path>';
player_pause.style.fill = "#ffffff";
player_pause.addEventListener("click", e => {
	playPauseAudio();
});

var player_next = document.createElementNS("http://www.w3.org/2000/svg", "svg");
player_next.setAttributeNS(null, "viewBox", "0 0 24 24");
player_next.innerHTML = '<path d="M0 21v-15c 0 0-0.5-4 3-3l12 7.5c0 0 1.5 1.5 0 3l-12 7.5c0 0-4 1-3-3zm12-16c 0 0-2 0-1 2.268l5.888 3.732c0 0 1 1 0 2l-3.888 2.732c0 0-4.5 2.5-1 3.268l11-6c0 0 1-1 0-2 l-11-6z"></path>';
player_next.style.fill = "#ffffff";
player_next.addEventListener("click", e => {
	nextTrack();
});

player_control.appendChild(player_prev);
player_control.appendChild(player_pause);
player_control.appendChild(player_next);

player.appendChild(player_icon);
player.appendChild(player_info);
player.appendChild(player_control);

duration_bar_holder.appendChild(duration_bar);

player_holder.appendChild(player);
player_holder.appendChild(duration_bar_holder);

// -- S C R O L L  B A R  C O N F I G S

var scroll_list_g = { 
	"pos" : 0,
	"items" : [
		weather_time,
		player_holder,
	]
}

scrollBarGenerate(scroll_list_g);
// -- //

var app_bar = document.querySelector(".app-bar");
app_bar.addEventListener("mousedown", e => {dragAdd(e, ".app-bar", ".app-bar", barDropTransition, undefined, undefined, undefined, insertBar)});
window.addEventListener("mouseup", e => {leave(e, ".app-bar")});

var menu_bar = document.querySelector(".menu-bar");
menu_bar.addEventListener("mousedown", e => {dragAdd(e, ".menu-bar", ".menu-bar", barDropTransition, undefined, undefined, undefined, insertBar)});
window.addEventListener("mouseup", e => {leave(e, ".menu-bar")});

var scroll_bar = document.querySelector(".scroll-bar");
scroll_bar.addEventListener("mousedown", e => {dragAdd(e, ".scroll-bar", ".scroll-bar", barDropTransition, undefined, undefined, undefined, insertBar)});
window.addEventListener("mouseup", e => {leave(e, ".scroll-bar")});

var info_bar = document.querySelector(".info-bar");
info_bar.addEventListener("mousedown", e => {dragAdd(e, ".info-bar", ".info-bar", barDropTransition, undefined, undefined, undefined, insertBar)});
window.addEventListener("mouseup", e => {leave(e, ".info-bar")});

// -- S E T T I N G S -- //

var menu_content = document.createElement("div");
menu_content.classList.add("menu-content");

// -- M A I N  T I T L E
var menu_title = document.createElement("div");
menu_title.classList.add("menu-title");
menu_title.innerHTML = "Menu";
menu_content.appendChild(menu_title);

var menu_main = document.createElement("div");
menu_main.classList.add("menu-main");

var menu_placeholder = document.createElement("div");
menu_placeholder.classList.add("menu-placeholder");
menu_placeholder.innerHTML = "There is no content here for now...";
menu_main.appendChild(menu_placeholder);

menu_content.appendChild(menu_main);
// -- //

var menuLaunched = false;
document.querySelector("#avdan-menu").addEventListener("click", e => {
	if (menuLaunched) {
		var menu = document.querySelector(".avdan-menu");
		closeWindow(e, menu);
		menuLaunched = false;
	}
	else {
		var menu = makeWindow(menu_content, undefined, "Menu", ["avdan-menu"], false, false, false);
		document.body.appendChild(menu);
		menu.style.transform = `translate3d(${window.innerWidth/2-menu.offsetWidth/2}px, ${(window.innerHeight-document.querySelector('.dock').offsetHeight)-(menu.offsetHeight+16)}px, 0)`;
		menuLaunched = true;
	}
});

window.addEventListener("resize", e => {
	var menu = document.querySelector(".avdan-menu");
	if (menu) {
		menu.style.transform = `translate3d(${window.innerWidth/2-menu.offsetWidth/2}px, ${(window.innerHeight-document.querySelector('.dock').offsetHeight)-(menu.offsetHeight+16)}px, 0)`;
	}
});

if (window.navigator.userAgent.match("Firefox")) {
	var app_bar = document.querySelector(".app-bar");
	app_bar.querySelectorAll(".img-wrapper img").forEach(item => {
		item.style.width = item.clientHeight+"px";
	});
	window.addEventListener("resize", e => {
		var app_bar = document.querySelector(".app-bar");
		app_bar.querySelectorAll(".img-wrapper img").forEach(item => {
			item.style.width = item.clientHeight+"px";
		});
	});
}
