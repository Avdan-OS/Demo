let intro = document.querySelector(".intro");
if (getCookie("intro")!=""){
	document.body.removeChild(intro);
}
else {
	setCookie("intro", 1, 20);
}
