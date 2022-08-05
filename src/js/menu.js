var menu_content = document.createElement("div");
menu_content.classList.add("menu-content");

var menu_main_frame = document.createElement("div");
menu_main_frame.classList.add("menu-main-frame");

var menu_main_header = document.createElement("div");
menu_main_header.classList.add("menu-main-header");

var menu_main_header_weather = document.createElement("div");
menu_main_header_weather.classList.add("menu-main-header-weather");
menu_main_header_weather.classList.add("menu-main-header-item");

var menu_main_header_weather_top = document.createElement("div");
menu_main_header_weather_top.classList.add("menu-main-header-weather-top");

var menu_main_header_weather_top_left = document.createElement("div");
menu_main_header_weather_top_left.classList.add("menu-main-header-weather-top-left");

var menu_main_header_weather_top_left_city = document.createElement("div");
menu_main_header_weather_top_left_city.classList.add("menu-main-header-weather-top-left-city");
menu_main_header_weather_top_left_city.innerHTML = "Somewhere";

var menu_main_header_weather_top_left_temperature = document.createElement("div");
menu_main_header_weather_top_left_temperature.classList.add("menu-main-header-weather-top-left-temperature");
menu_main_header_weather_top_left_temperature.innerHTML = "24&#176;";

menu_main_header_weather_top_left.appendChild(menu_main_header_weather_top_left_city);
menu_main_header_weather_top_left.appendChild(menu_main_header_weather_top_left_temperature);

menu_main_header_weather_top.appendChild(menu_main_header_weather_top_left);

var menu_main_header_weather_top_right = document.createElement("div");
menu_main_header_weather_top_right.classList.add("menu-main-header-weather-top-right");

var menu_main_header_weather_top_right_info = document.createElement("div");
menu_main_header_weather_top_right_info.classList.add("menu-main-header-weather-top-right-info");

var menu_main_header_weather_top_right_info_status = document.createElement("div");
menu_main_header_weather_top_right_info_status.classList.add("menu-main-header-weather-top-right-info-status");
menu_main_header_weather_top_right_info_status.innerHTML = "Sunny";

var menu_main_header_weather_top_right_info_temps = document.createElement("div");
menu_main_header_weather_top_right_info_temps.classList.add("menu-main-header-weather-top-right-info-temps");
menu_main_header_weather_top_right_info_temps.innerHTML = "H:28&#176;,L:6&#176;";

var menu_main_header_weather_top_right_icon = document.createElementNS("http://www.w3.org/2000/svg", "svg");
menu_main_header_weather_top_right_icon.setAttributeNS(null, "viewBox", "0 0 24 24");
menu_main_header_weather_top_right_icon.innerHTML = '<circle cx="12" cy="12" r="5"></circle><line x1="12" y1="1" x2="12" y2="3"></line><line x1="12" y1="21" x2="12" y2="23"></line><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line><line x1="1" y1="12" x2="3" y2="12"></line><line x1="21" y1="12" x2="23" y2="12"></line><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line>';

menu_main_header_weather_top_right_info.appendChild(menu_main_header_weather_top_right_info_status);
menu_main_header_weather_top_right_info.appendChild(menu_main_header_weather_top_right_info_temps);

menu_main_header_weather_top_right.appendChild(menu_main_header_weather_top_right_info);
menu_main_header_weather_top_right.appendChild(menu_main_header_weather_top_right_icon);

menu_main_header_weather_top.appendChild(menu_main_header_weather_top_right);

var menu_main_header_weather_bottom = document.createElement("div");
menu_main_header_weather_bottom.classList.add("menu-main-header-weather-bottom");

var weather_list_config = [
	{
		"day" : "Sun",
		"src" : "sun",
		"temp" : "24"
	},
	{
		"day" : "Mon",
		"src" : "sun",
		"temp" : "22"
	},
	{
		"day" : "Tue",
		"src" : "sun",
		"temp" : "23"
	},
	{
		"day" : "Wed",
		"src" : "sun",
		"temp" : "27"
	},
	{
		"day" : "Thu",
		"src" : "sun",
		"temp" : "21"
	},
	{
		"day" : "Fri",
		"src" : "sun",
		"temp" : "29"
	},
	{
		"day" : "Sat",
		"src" : "sun",
		"temp" : "28"
	},
]

weather_list_config.forEach(item => {
	var weather_item = document.createElement("div");
	weather_item.classList.add("menu-main-header-bottom-item");
	
	var weather_item_day = document.createElement("div");
	weather_item_day.classList.add("menu-main-header-bottom-item-day");
	weather_item_day.innerHTML = item.day;

	var weather_item_icon_holder = document.createElement("div");
	weather_item_icon_holder.classList.add("menu-main-header-bottom-item-icon-holder");

	if (item.src == "sun") {
		var weather_item_icon = document.createElementNS("http://www.w3.org/2000/svg", "svg");
		weather_item_icon.setAttributeNS(null, "viewBox", "0 0 24 24");
		weather_item_icon.classList.add("menu-main-header-bottom-item-icon");
		weather_item_icon.innerHTML = '<circle cx="12" cy="12" r="5"></circle><line x1="12" y1="1" x2="12" y2="3"></line><line x1="12" y1="21" x2="12" y2="23"></line><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line><line x1="1" y1="12" x2="3" y2="12"></line><line x1="21" y1="12" x2="23" y2="12"></line><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line>';
	}
	else {
		var weather_item_icon = document.createElement("img");
		weather_item_icon.classList.add("menu-main-header-bottom-item-icon");
		weather_item_icon.src = item.src;
	}

	weather_item_icon_holder.appendChild(weather_item_icon);

	var weather_item_temp = document.createElement("div");
	weather_item_temp.classList.add("menu-main-header-bottom-item-temp");
	weather_item_temp.innerHTML = item.temp+"&#176;";

	weather_item.appendChild(weather_item_day);
	weather_item.appendChild(weather_item_icon_holder);
	weather_item.appendChild(weather_item_temp);

	menu_main_header_weather_bottom.appendChild(weather_item);
});

menu_main_header_weather_top.appendChild(menu_main_header_weather_top_left);
menu_main_header_weather_top.appendChild(menu_main_header_weather_top_right);

menu_main_header_weather.appendChild(menu_main_header_weather_top);
menu_main_header_weather.appendChild(menu_main_header_weather_bottom);

menu_main_header.appendChild(menu_main_header_weather);

var menu_main_header_reminders = document.createElement("div");
menu_main_header_reminders.classList.add("menu-main-header-reminders");
menu_main_header_reminders.classList.add("menu-main-header-item");

var menu_main_header_reminders_title = document.createElement("div");
menu_main_header_reminders_title.classList.add("menu-main-header-reminders-title");
menu_main_header_reminders_title.innerHTML = "Today";

var menu_main_header_reminders_list = document.createElement("div");
menu_main_header_reminders_list.classList.add("menu-main-header-reminders-list");

var reminders_list_config = [
	{
		"time" : "12:00 - 13:00",
		"content" : "Reminder 1"
	},
	{
		"time" : "17:00 - 18:00",
		"content" : "Reminder 2"
	},
]

reminders_list_config.forEach(item => {
	var reminder_item = document.createElement("div");
	reminder_item.classList.add("menu-main-header-reminders-list-item");

	var reminder_item_dot = document.createElement("div");
	reminder_item_dot.classList.add("menu-main-header-reminders-list-item-dot");

	var reminder_item_info = document.createElement("div");
	reminder_item_info.classList.add("menu-main-header-reminders-list-item-info");

	var reminder_item_time = document.createElement("div");
	reminder_item_time.classList.add("menu-main-header-reminders-list-item-time");
	reminder_item_time.innerHTML = item.time;

	var reminder_item_content = document.createElement("div");
	reminder_item_content.classList.add("menu-main-header-reminders-list-item-content");
	reminder_item_content.innerHTML = item.content;

	reminder_item_info.appendChild(reminder_item_time);
	reminder_item_info.appendChild(reminder_item_content);

	reminder_item.appendChild(reminder_item_dot);
	reminder_item.appendChild(reminder_item_info);

	menu_main_header_reminders_list.appendChild(reminder_item);
});

menu_main_header_reminders.appendChild(menu_main_header_reminders_title);
menu_main_header_reminders.appendChild(menu_main_header_reminders_list);

menu_main_header.appendChild(menu_main_header_reminders);

var menu_main_header_devices = document.createElement("div");
menu_main_header_devices.classList.add("menu-main-header-devices");
menu_main_header_devices.classList.add("menu-main-header-item");

devices_list_config = [
	{
		"src" : "src/images/demo/icons/Start/DevicePhone.png",
		"device" : "My Phone",
		"percent" : 25
	},
	{
		"src" : "src/images/demo/icons/Start/DeviceWatch.png",
		"device" : "Kaan's Watch",
		"percent" : 85
	},
	{
		"src" : "src/images/demo/icons/Start/DeviceCar.png",
		"device" : "Togg SUV",
		"percent" : 55
	},
]

devices_list_config.forEach(item => {
	var device_item = document.createElement("div");
	device_item.classList.add("menu-main-header-devices-item");

	var device_item_icon_holder = document.createElement("div");
	device_item_icon_holder.classList.add("menu-main-header-devices-item-icon-holder");

	var device_item_icon = document.createElement("img");
	device_item_icon.classList.add("menu-main-header-devices-item-icon");
	device_item_icon.src = item.src;

	device_item_icon_holder.appendChild(device_item_icon);

	var device_item_label = document.createElement("div");
	device_item_label.classList.add("menu-main-header-devices-item-label");
	device_item_label.innerHTML = item.device;

	var device_item_percent = document.createElement("div");
	device_item_percent.classList.add("menu-main-header-devices-item-percent");
	device_item_percent.innerHTML = item.percent + "%";

	var device_item_bar_holder = document.createElement("div");
	device_item_bar_holder.classList.add("menu-main-header-devices-item-bar-holder");

	var device_item_bar = document.createElement("div");
	device_item_bar.classList.add("menu-main-header-devices-item-bar");
	device_item_bar.style.width = item.percent + "%";

	device_item_bar_holder.appendChild(device_item_bar);

	device_item.appendChild(device_item_icon_holder);
	device_item.appendChild(device_item_label);
	device_item.appendChild(device_item_percent);
	device_item.appendChild(device_item_bar_holder);

	menu_main_header_devices.appendChild(device_item);
});

menu_main_header.appendChild(menu_main_header_devices);

menu_main_frame.appendChild(menu_main_header);

menu_content.appendChild(menu_main_frame);
