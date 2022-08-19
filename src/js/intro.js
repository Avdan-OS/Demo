let intro = document.querySelector(".intro");
if (Cookie.get("intro") != "" && false){
	intro.parentElement.removeChild(intro);
}
else {
	Cookie.set("intro", 1, 20);
}

// Start intro animations when fully loaded.
window.addEventListener("load", () => {
	let intro = document.querySelector(".intro");
	intro.style.animationName = "make-visible";
	intro.style.visibility = "hidden";
	intro.style.opacity = 0;

	document.querySelectorAll(".intro-letter").forEach((letter => {
		letter.style.animationName = "outer-animate";
	}));
});
