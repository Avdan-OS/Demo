// M A I N

// P L A C E H O L D E R S

var Mail = new Placeholder("Mail", "src/images/demo/icons/Apps/Mail.png");
var Photos = new Placeholder("Photos", "src/images/demo/icons/Apps/Gallery.png");
var Calendar = new Placeholder("Calendar", "src/images/demo/icons/Apps/Calendar.png");
var Notes = new Placeholder("Notes", "src/images/demo/icons/Apps/Notes.png");
var Settings = new Placeholder("Settings", "src/images/demo/icons/Apps/Settings.png");

// -- A P P B A R  C O N F I G S
var apps_list = [
	{
		"title" : Filemanager.title, // window title
		"src" : Filemanager.src, // appbar/window icon
		"content" : Filemanager.content, // content for the window
		"extraClass" : Filemanager.extraClass // extra classes for window (optional)
	},
	{
		"title" : Mail.title,
		"src" : Mail.src,
		"content" : Mail.content
	},
	{
		"title" : Lale.title, 
		"src" : Lale.src, 
		"content" : Lale.content, 
	},
	{
		"title" : Photos.title,
		"src" : Photos.src,
		"content" : Photos.content
	},
	{
		"title" : Calendar.title,
		"src" : Calendar.src,
		"content" : Calendar.content
	},
	{
		"title" : Notes.title,
		"src" : Notes.src,
		"content" : Notes.content
	},
	{
		"content" : "hr"
	},
	{
		"title" : Settings.title,
		"src" : Settings.src,
		"content" : Settings.content
	},
	{
		"title" : Music.title,
		"src" : Music.src,
		"content" : Music.content,
		"listenerAdder" : Music.listener
	},
	{
		"title" : Messages.title, 
		"src" : Messages.src, 
		"content" : Messages.content, 
		"listenerAdder" : Messages.listener, 
		"extraClass" : Messages.extraClass 
	},
]

// add apps to the appbar
Appbar.set(apps_list);
// -- //

// -- S C R O L L  B A R  C O N F I G S

var scroll_list = { 
	"pos" : 0,
	"items" : [
		weather_time,
		player_holder,
	]
}

Scrollbar.set(scroll_list);
// -- //

var app_bar = document.querySelector(".app-bar");
app_bar.addEventListener("mousedown", e => {DragAndDrop.add(e, ".app-bar", ".app-bar", barDropTransition, undefined, swapBar, undefined, insertBar)});
window.addEventListener("mouseup", e => {DragAndDrop.drop(e, ".app-bar")});

var menu_bar = document.querySelector(".menu-bar");
menu_bar.addEventListener("mousedown", e => {DragAndDrop.add(e, ".menu-bar", ".menu-bar", barDropTransition, undefined, swapBar, undefined, insertBar)});
window.addEventListener("mouseup", e => {DragAndDrop.drop(e, ".menu-bar")});

var scroll_bar = document.querySelector(".scroll-bar");
scroll_bar.addEventListener("mousedown", e => {DragAndDrop.add(e, ".scroll-bar", ".scroll-bar", barDropTransition, undefined, swapBar, undefined, insertBar)});
window.addEventListener("mouseup", e => {DragAndDrop.drop(e, ".scroll-bar")});

var info_bar = document.querySelector(".info-bar");
info_bar.addEventListener("mousedown", e => {DragAndDrop.add(e, ".info-bar", ".info-bar", barDropTransition, undefined, swapBar, undefined, insertBar)});
window.addEventListener("mouseup", e => {DragAndDrop.drop(e, ".info-bar")});

document.querySelector("#avdan-menu").addEventListener("click", e => {
	if (Menu.launched) {
		var menu = document.querySelector(".avdan-menu");
		Window.close(e, menu);
		Menu.launched = false;
	}
	else {
		var menu = Window.make(Menu.content, Menu.src, Menu.title, Menu.extraClass, false, false, false);
		Workspace.add(menu);
		menu.style.transform = `translate3d(${window.innerWidth/2-menu.offsetWidth/2}px, ${(window.innerHeight-document.querySelector('.dock').offsetHeight)-(menu.offsetHeight+16)}px, 0)`;
		Menu.launched = true;
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
