let intro = document.querySelector(".intro");
if (Cookie.get("intro")!=""){
	intro.parentElement.removeChild(intro);
}
else {
	Cookie.set("intro", 1, 20);
}

// Start intro animations when fully loaded.
window.addEventListener("load", () => {
	document.querySelector(".intro").style.animationName = "make-visible";

	document.querySelectorAll(".intro-letter").forEach((letter => {
		letter.style.animationName = "outer-animate";
	}));
});
