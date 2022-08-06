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
	Player.setTime(e);
});

var duration_bar = document.createElement("div");
duration_bar.classList.add("duration-bar");

var player_holder = document.createElement("div");
player_holder.classList.add("player-holder");
player_holder.classList.add("noselect");

var player = document.createElement("div");
player.classList.add("player");

var player_icon = document.createElement("div");
player_icon.classList.add("player-icon");

var player_icon_img = document.createElement("img");
player_icon_img.src = Player.getList()[Player.getIndex()].src;
player_icon.appendChild(player_icon_img);

var player_info = document.createElement("div");
player_info.classList.add("player-info");

var player_title = document.createElement("div");
player_title.classList.add("player-title");
player_title.innerHTML = Player.getList()[Player.getIndex()].title;

var plyer_artist = document.createElement("div");
plyer_artist.classList.add("player-artist");
plyer_artist.innerHTML = Player.getList()[Player.getIndex()].artist;

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
	Player.prev();
});

var player_pause = document.createElementNS("http://www.w3.org/2000/svg", "svg");
player_pause.setAttributeNS(null, "viewBox", "0 0 24 24");
player_pause.innerHTML = '<path d="M3 22v-17c0 0-0.5-4 3-3l15 8.5c0 0 1.5 1.5 0 3l-15 8.5c 0 0-4 1-3-3z"></path>';
player_pause.style.fill = "#ffffff";
player_pause.addEventListener("click", e => {
	Player.toggle();
});

var player_next = document.createElementNS("http://www.w3.org/2000/svg", "svg");
player_next.setAttributeNS(null, "viewBox", "0 0 24 24");
player_next.innerHTML = '<path d="M0 21v-15c 0 0-0.5-4 3-3l12 7.5c0 0 1.5 1.5 0 3l-12 7.5c0 0-4 1-3-3zm12-16c 0 0-2 0-1 2.268l5.888 3.732c0 0 1 1 0 2l-3.888 2.732c0 0-4.5 2.5-1 3.268l11-6c0 0 1-1 0-2 l-11-6z"></path>';
player_next.style.fill = "#ffffff";
player_next.addEventListener("click", e => {
	Player.next();
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
