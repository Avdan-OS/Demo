let intro = document.querySelector(".intro");
if (Cookie.get("intro")!=""){
	document.body.removeChild(intro);
}
else {
	Cookie.set("intro", 1, 20);
}
