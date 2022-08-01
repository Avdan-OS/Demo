// M A I N

// -- T E S T S  ( P L A C E H O L D E R S )

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

mail_content.classList.add("noselect");
photos_content.classList.add("noselect");
calendar_content.classList.add("noselect");
notes_content.classList.add("noselect");
settings_content.classList.add("noselect");
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
app_bar.addEventListener("mousedown", e => {dragAdd(e, ".app-bar", ".app-bar", barDropTransition, undefined, swapBar, undefined, insertBar)});
window.addEventListener("mouseup", e => {leave(e, ".app-bar")});

var menu_bar = document.querySelector(".menu-bar");
menu_bar.addEventListener("mousedown", e => {dragAdd(e, ".menu-bar", ".menu-bar", barDropTransition, undefined, swapBar, undefined, insertBar)});
window.addEventListener("mouseup", e => {leave(e, ".menu-bar")});

var scroll_bar = document.querySelector(".scroll-bar");
scroll_bar.addEventListener("mousedown", e => {dragAdd(e, ".scroll-bar", ".scroll-bar", barDropTransition, undefined, swapBar, undefined, insertBar)});
window.addEventListener("mouseup", e => {leave(e, ".scroll-bar")});

var info_bar = document.querySelector(".info-bar");
info_bar.addEventListener("mousedown", e => {dragAdd(e, ".info-bar", ".info-bar", barDropTransition, undefined, swapBar, undefined, insertBar)});
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
		demo_body.appendChild(menu);
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
