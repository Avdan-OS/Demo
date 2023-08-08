// M A I N

// P L A C E H O L D E R S

var Mail = new Placeholder("Mail", "src/images/demo/icons/Apps/Mail.png");
var Photos = new Placeholder("Photos", "src/images/demo/icons/Apps/Gallery.png");
var Calendar = new Placeholder("Calendar", "src/images/demo/icons/Apps/Calendar.png");
var Notes = new Placeholder("Notes", "src/images/demo/icons/Apps/Notes.png");
var Settings = new Placeholder("Settings", "src/images/demo/icons/Apps/Settings.png");
var MyApp = new Placeholder("MyApp", "src/images/demo/icons/Apps/Settings.png");

// -- A P P B A R  C O N F I G S
var apps_list = [
	Filemanager,
	Mail,
	Lale, 
	Photos,
	Calendar,
	Notes,
	Appbar.Split,
	Settings,
	Music,
	Messages,
	MyApp,
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
app_bar.addEventListener("mousedown", e => {DragAndDrop.add(e, ".app-bar", ".app-bar", barDropTransition, undefined, swapBar, animateBar, undefined, insertBar)});
window.addEventListener("mouseup", e => {DragAndDrop.drop(e, ".app-bar")});

var menu_bar = document.querySelector(".menu-bar");
menu_bar.addEventListener("mousedown", e => {DragAndDrop.add(e, ".menu-bar", ".menu-bar", barDropTransition, undefined, swapBar, animateBar, undefined, insertBar)});
window.addEventListener("mouseup", e => {DragAndDrop.drop(e, ".menu-bar")});

var scroll_bar = document.querySelector(".scroll-bar");
scroll_bar.addEventListener("mousedown", e => {DragAndDrop.add(e, ".scroll-bar", ".scroll-bar", barDropTransition, undefined, swapBar, animateBar, undefined, insertBar)});
window.addEventListener("mouseup", e => {DragAndDrop.drop(e, ".scroll-bar")});

var info_bar = document.querySelector(".info-bar");
info_bar.addEventListener("mousedown", e => {DragAndDrop.add(e, ".info-bar", ".info-bar", barDropTransition, undefined, swapBar, animateBar, undefined, insertBar)});
window.addEventListener("mouseup", e => {DragAndDrop.drop(e, ".info-bar")});

demo_body.querySelector("#avdan-menu").addEventListener("click", e => {
	if (Menu.launched) {
		var menu = document.querySelector(".avdan-menu");
		Window.close(e, menu);
		Menu.launched = false;
	}
	else {
		var menu = Window.make(Menu.content, Menu.src, Menu.title, Menu.extraClass, false, false, false);
		Workspace.add(menu);
		menu.style.transform = `translate3d(${demo_body.offsetWidth/2-menu.offsetWidth/2}px, ${(demo_body.offsetHeight-document.querySelector('.dock').offsetHeight)-(menu.offsetHeight+16)}px, 0)`;
		Menu.launched = true;
	}
});

window.addEventListener("resize", e => {
	var menu = document.querySelector(".avdan-menu");
	if (menu) {
		menu.style.transform = `translate3d(${demo_body.offsetWidth/2-menu.offsetWidth/2}px, ${(demo_body.offsetHeight-document.querySelector('.dock').offsetHeight)-(menu.offsetHeight+16)}px, 0)`;
	}
});

const fullscreen = e => {
	e.currentTarget.requestFullscreen();
	demo_body.removeEventListener("click", fullscreen);
}

demo_body.addEventListener("click", fullscreen);

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
