var demo_body = document.querySelector(".demo-body") || document.body;

// -- W I N D O W  C O N T R O L

// on insert window drag
const iconify = (e, target, info) => {
	target.style.transition = null;
	target.lastMinWidth = target.lastMinWidth || target.style.minWidth || "450px";
	target.style.minWidth = "initial";
	target.style.minHeight = "initial";
	target.style.width = target.offsetWidth/2+"px";
	target.style.height = target.offsetHeight/2+"px";
	target.style.flexDirection = "row";
	target.querySelector(".win-panel").style.display = "none";
	target.querySelector(".container").style.display = "none";
	target.querySelectorAll(".icon-block").forEach(item => {
		item.style.display = null;
	});
	target.style.zIndex = Layer.get();
	Layer.inc();
}

// on insert window drop
const deiconify = (e, target, info) => {
	target.style.width = target.offsetWidth*2+"px";
	target.style.height = target.offsetHeight*2+"px";
	target.style.minWidth = target.lastMinWidth;
	target.style.minHeight = null;
	target.lastMinWidth = undefined;
	target.style.flexDirection = null;
	target.querySelector(".win-panel").style.display = null;
	target.querySelector(".container").style.display = null;
	target.querySelectorAll(".icon-block").forEach(item => {
		item.style.display = "none";
	});
}

// on going out of bounds 
const attach = (e, target, info) => {
	target.style.transition = null;
	target.lastTransform = target.lastTransform || target.style.transform;
	target.lastWidth = target.lastWidth || target.offsetWidth;
	target.lastHeight = target.lastHeight || target.offsetHeight;
	target.lastMinWidth = target.lastMinWidth || target.style.minWidth || "450px";
	target.style.minWidth = "initial";
	if (e.screenX > window.innerWidth/2) {
		target.style.top = 0;
		target.style.left = "50%";
		target.style.width = "50%";
		target.style.height = "100%";
		target.style.transform = null;
	}
	else {
		target.style.top = 0;
		target.style.left = 0;
		target.style.width = "50%";
		target.style.height = "100%";
		target.style.transform = null;
	}
	target.style.zIndex = Layer.get();
	Layer.inc();
}

// left attach button on click
const leftAttach = (e, target) => {
	target.style.transition = "width 0.1s ease-in-out, transform 0.1s ease-in-out, height 0.1s ease-in-out, top 0.1s ease-in-out, left 0.1s ease-in-out";
	if (typeof target.lastWidth == "number" && typeof target.lastHeight == "number" && target.style.left == "0px" && target.style.width == "50%" && target.style.height == "100%") {
		target.style.top = null;
		target.style.left = null;
		target.style.width = target.lastWidth+"px";
		target.style.height = target.lastHeight+"px";
		target.style.transform = target.lastTransform;
		target.style.minWidth = target.lastMinWidth;
		target.lastTransform = undefined;
		target.lastWidth = undefined;
		target.lastHeight = undefined;
		target.lastMinWidth = undefined;
	}
	else {
		target.lastMinWidth = target.lastMinWidth || target.style.minWidth || "450px";
		target.style.minWidth = "initial";
		target.lastTransform = target.lastTransform || target.style.transform;
		target.lastWidth = target.lastWidth || target.offsetWidth;
		target.lastHeight = target.lastHeight || target.offsetHeight;
		target.style.top = 0;
		target.style.left = 0;
		target.style.width = "50%";
		target.style.height = "100%";
		target.style.transform = null;
	}
	target.style.zIndex = Layer.get();
	Layer.inc();
}

// left attach button on click
const rightAttach = (e, target) => {
	target.style.transition = "width 0.1s ease-in-out, transform 0.1s ease-in-out, height 0.1s ease-in-out, top 0.1s ease-in-out, left 0.1s ease-in-out";
	if (typeof target.lastWidth == "number" && typeof target.lastHeight == "number" && target.style.left == "50%" && target.style.width == "50%" && target.style.height == "100%") {
		target.style.top = null;
		target.style.left = null;
		target.style.width = target.lastWidth+"px";
		target.style.height = target.lastHeight+"px";
		target.style.transform = target.lastTransform;
		target.style.minWidth = target.lastMinWidth;
		target.lastTransform = undefined;
		target.lastWidth = undefined;
		target.lastHeight = undefined;
		target.lastMinWidth = undefined;
	}
	else {
		target.lastMinWidth = target.lastMinWidth || target.style.minWidth || "450px";
		target.style.minWidth = "initial";
		target.lastTransform = target.lastTransform || target.style.transform;
		target.lastWidth = target.lastWidth || target.offsetWidth;
		target.lastHeight = target.lastHeight || target.offsetHeight;
		target.style.top = 0;
		target.style.left = "50%";
		target.style.width = "50%";
		target.style.height = "100%";
		target.style.transform = null;
	}
	target.style.zIndex = Layer.get();
	Layer.inc();
}

// fullsize button on click
const fullsize = (e, target) => {
	target.style.transition = "width 0.1s ease-in-out, transform 0.1s ease-in-out, height 0.1s ease-in-out, top 0.1s ease-in-out, left 0.1s ease-in-out";
	if (typeof target.lastWidth == "number" && typeof target.lastHeight == "number" && target.style.width == "100%" && target.style.height == "100%") {
		target.style.top = null;
		target.style.left = null;
		target.style.width = target.lastWidth+"px";
		target.style.height = target.lastHeight+"px";
		target.style.transform = target.lastTransform;
		target.style.minWidth = target.lastMinWidth;
		target.lastTransform = undefined;
		target.lastWidth = undefined;
		target.lastHeight = undefined;
		target.lastMinWidth = undefined;
	}
	else {
		target.lastMinWidth = target.lastMinWidth || target.style.minWidth || "450px";
		target.style.minWidth = "initial";
		target.lastTransform = target.lastTransform || target.style.transform;
		target.lastWidth = target.lastWidth || target.offsetWidth;
		target.lastHeight = target.lastHeight || target.offsetHeight;
		target.style.top = 0;
		target.style.left = 0;
		target.style.width = "100%";
		target.style.height = "100%";
		target.style.transform = null;
	}
	target.style.zIndex = Layer.get();
	Layer.inc();
}

// minimalize button on click 
const minimalize = (e, target) => {
	var underline = document.querySelector("#underline"+target.id.match("[0-9]+")[0]);
	underline.style.backgroundColor = "var(--light-bg)";
	target.style.display = "none";
}

// E X T R A  F O R  T A B S  C L I C K

// on win tab click
const hideAllContent = (e, target) => {
	var win = target;
	while (!win.classList.contains("window")) {
		win = win.parentElement;
	}
	win.querySelectorAll(".content-holder").forEach(item => {
		item.style.display = "none";
	});
}

// on win tab click (show win tab binded content)
const showContent = (e, target) => {
	target.style.display = null;
}

// R E S I Z E R S

// width left side
const dragResizeWL = (e, target, info) => {
	target.style.width = `${target.clientWidth-e.movementX}px`;
}

// width right side
const dragResizeWR = (e, target, info) => {
	target.style.width = `${target.clientWidth+e.movementX}px`;
}

// height top
const dragResizeHT = (e, target, info) => {
	target.style.height = `${target.clientHeight-e.movementY}px`;
}

// height bottom
const dragResizeHB = (e, target, info) => {
	target.style.height = `${target.clientHeight+e.movementY}px`;
}

// width height left top
const dragResizeWHLT = (e, target, info) => {
	target.style.width = `${target.clientWidth-e.movementX}px`;
	target.style.height = `${target.clientHeight-e.movementY}px`;
}

// width height right top
const dragResizeWHRT = (e, target, info) => {
	target.style.width = `${target.clientWidth+e.movementX}px`;
	target.style.height = `${target.clientHeight-e.movementY}px`;
}

// width height left bottom
const dragResizeWHLB = (e, target, info) => {
	target.style.width = `${target.clientWidth-e.movementX}px`;
	target.style.height = `${target.clientHeight+e.movementY}px`;
}

// width height right bottom
const dragResizeWHRB = (e, target, info) => {
	target.style.width = `${target.clientWidth+e.movementX}px`;
	target.style.height = `${target.clientHeight+e.movementY}px`;
}

// on drag start (tabs)
const dropTransition = (e, target, info) => {
	target.style.transition = "none";
	var win = target;
	while (!win.classList.contains("window")) {
		win = win.parentElement;
	}
	win.style.zIndex = Layer.get();
	Layer.inc();
}

// R E C R E A T I O N  C H E C K  O N  T A B  O U T

const swapTab = (e, target, info) => {
	var win = target;
	while (!win.classList.contains("window")) {
		win = win.parentElement;
	}

	var targetTransformX = 0;
	var targetTransformY = 0;
	if (win.style.transform != '') {
	
		var nums = win.style.transform.split("translate3d")[1];
		nums = nums.slice(1, nums.length-1).split("px,");
		
		targetTransformX = parseInt(nums[0]);
		targetTransformY = parseInt(nums[1]);
	}

	var x1 = win.offsetLeft+targetTransformX;
	var x2 = x1+win.offsetWidth;
	var y1 = win.offsetTop+targetTransformY;
	var y2 = y1+win.offsetHeight;

	// get  items to (move tab)/(recreate window)
	var id_num = target.id.match("[0-9]+"); // get id to catch element from window
	var target_content_holder = win.querySelector("#content-holder"+id_num); // catch content
	var icon_block = win.querySelector("#icon-block"+id_num); // catch icon
	var icon_src = icon_block.querySelector("img").src; // get icon src

	var panel = target.parentElement;
	var insAfter = false;

	panel.querySelectorAll(".win-tab").forEach(item => {
		if (item != target) {
			if (item != panel.firstChild) {
				var win_tab_x1 = x1 + panel.offsetLeft + item.offsetLeft
				var win_tab_x2 = win_tab_x1 + item.offsetWidth;
				var win_tab_y1 = y1 + panel.offsetTop + item.offsetTop;
				var win_tab_y2 = win_tab_y1 + item.offsetHeight;

				if (win_tab_x1 <= e.clientX && e.clientX <= win_tab_x2 && win_tab_y1 <= e.clientY && e.clientY <= win_tab_y2) {

					var item_id = item.id.match("[0-9]+")[0];
					var item_content_holder = win.querySelector("#content-holder"+item_id);
					var item_icon_block = win.querySelector("#icon-block"+item_id);
					
					targetTransformX = 0;
					targetTransformY = 0;
					if (win.style.transform != '') {
					
						var nums = target.style.transform.split("translate3d")[1];
						nums = nums.slice(1, nums.length-1).split("px,");
						
						targetTransformX = parseInt(nums[0]);
						targetTransformY = parseInt(nums[1]);
					}

					if (insAfter) {
						item_content_holder.parentElement.insertBefore(target_content_holder, item_content_holder.nextSibling);
						item_icon_block.parentElement.insertBefore(icon_block, item_icon_block.nextSibling);

						var offsetBefore = target.offsetLeft;
						panel.insertBefore(target, item.nextSibling);
						var offsetAfter = target.offsetLeft;
					}
					else {
						item_content_holder.parentElement.insertBefore(target_content_holder, item_content_holder);
						item_icon_block.parentElement.insertBefore(icon_block, item_icon_block);

						var offsetBefore = target.offsetLeft;
						panel.insertBefore(target, item);
						var offsetAfter = target.offsetLeft;
					}

					target.style.transform = `translate3d(${targetTransformX+(offsetBefore-offsetAfter)}px,${targetTransformY}px,0px)`;
					return
				}
			}
		}
		else {
			insAfter = true;
		}
	});
}

// on tab in/out drop
const remakeWindow = (e, target, info) => {

	// get current window
	var win = target;
	while (!win.classList.contains("window")) {
		win = win.parentElement;
	}

	// get current window translate
	var targetTransformX = 0;
	var targetTransformY = 0;
	if (win.style.transform != '') {
	
		var nums = win.style.transform.split("translate3d")[1];
		nums = nums.slice(1, nums.length-1).split("px,");
		
		targetTransformX = parseInt(nums[0]);
		targetTransformY = parseInt(nums[1]);
	}

	// get current window X Y
	var x1 = win.offsetLeft+targetTransformX;
	var x2 = x1+win.offsetWidth;
	var y1 = win.offsetTop+targetTransformY;
	var y2 = y1+win.offsetHeight;

	// get  items to (move tab)/(recreate window)
	var id_num = target.id.match("[0-9]+"); // get id to catch element from window
	var target_content_holder = win.querySelector("#content-holder"+id_num); // catch content
	var icon_block = win.querySelector("#icon-block"+id_num); // catch icon
	var icon_src = icon_block.querySelector("img").src; // get icon src

	if (x1, x2, y1, y2, x1 <= e.clientX && e.clientX <= x2 && y1 <= e.clientY && e.clientY <= y2) { // check if over current window
		var container = win.querySelector(".container");

		// get current window container coords
		var container_x1 = x1 + container.offsetLeft;
		var container_x2 = container_x1 + container.offsetWidth;
		var container_y1 = y1 + container.offsetTop;
		var container_y2 = container_y1 + container.offsetHeight;
		
		if (container_x1 <= e.clientX && e.clientX <= container_x2 && container_y1 <= e.clientY && e.clientY <= container_y2) { // if over container
			win.querySelector("#content-holder"+id_num).style.display = null; // make visible
		}
		
		// set transition and smooth return to topbar
		target.style.transition = "background-color 0.1s ease-in-out, transform 0.1s ease-in-out";
		target.style.transform = null;
	}
	else { // if out the current window
		// get highest window by z-index
		var highestWin = "";

		// check all windows
		document.querySelectorAll(".window").forEach(item => {
			// get translate
			var targetTransformX = 0;
			var targetTransformY = 0;
			if (item.style.transform != '') {
			
				var nums = item.style.transform.split("translate3d")[1];
				nums = nums.slice(1, nums.length-1).split("px,");
				
				targetTransformX = parseInt(nums[0]);
				targetTransformY = parseInt(nums[1]);
			}

			// get coords (rewrite current window coords)
			x1 = item.offsetLeft+targetTransformX;
			x2 = x1+item.offsetWidth;
			y1 = item.offsetTop+targetTransformY;
			y2 = y1+item.offsetHeight;

			if (x1, x2, y1, y2, x1 <= e.clientX && e.clientX <= x2 && y1 <= e.clientY && e.clientY <= y2) { // if over a window
				if (highestWin == "") { 
					highestWin = item;
				}
				else {
					highestWin = (highestWin.style.zIndex > item.style.zIndex) && highestWin || item; // if bigger z-index then rewrite
				}
			}
		});

		if (!highestWin || highestWin == win) { // if default left (no window under cursor)

			// find icon match in appbar
			document.querySelectorAll(".img-container").forEach(item => {
				if (icon_src == item.querySelector("img").src) { // if matches
					// get selected underlines
					var underlines = item.querySelector(".underlines");

					// create new underline
					var underline = document.createElement("div");
					underline.classList.add("underline");
					underline.id = `underline${Window.get()}`; // set new id

					// add minimalize function
					underline.addEventListener("click", e => {
						var win = document.querySelector("#window"+e.currentTarget.id.match("[0-9]+")[0]); // catch new window (with new id)
						if (win.style.display) {
							e.currentTarget.style.backgroundColor = "var(--light-bg-hl)";
							win.style.display = null;
						}
						else {
							e.currentTarget.style.backgroundColor = "var(--light-bg)";
							win.style.display = "none";
						}
					});

					underlines.appendChild(underline); // add underline 
				}
			});

			// recreate window
			var win = Window.make(target_content_holder.firstChild || document.createElement("div"), icon_src, target.innerHTML);
			Workspace.add(win);
			win.style.top = window.innerHeight/2-win.offsetHeight/2+"px";
			win.style.left = window.innerWidth/2-win.offsetWidth/2+"px";

			var i = 1;
			var content_holders = win.querySelectorAll(".content-holder");
			content_holders.forEach(item => {
				if (item.style.display) {i+=1}
			});
			if (i == content_holders.length) {
				target_content_holder.previousSibling.style.display = null;
			}

			// erase elements from the current window 
			target.parentElement.removeChild(target);
			icon_block.parentElement.removeChild(icon_block);
			target_content_holder.parentElement.removeChild(target_content_holder);
		}
		else { // if window under cursor

			// get selected window topbar
			var winPanel = highestWin.querySelector(".win-panel");
			
			// get topbar coords
			var panel_x1 = x1 + winPanel.offsetLeft;
			var panel_x2 = panel_x1 + winPanel.offsetWidth;
			var panel_y1 = y1 + winPanel.offsetTop;
			var panel_y2 = panel_y1 + winPanel.offsetHeight;
			
			// delete target's transform
			target.style.transform = null;

			// move tab to the new window
			highestWin.querySelector(".tab-holder").insertBefore(target, highestWin.querySelector(".tab-add"));

			// if already has drag function (was once moved)
			if (!target.hasDrag) {
				target.hasDrag = true;
				target.addEventListener("mousedown", e => {
					DragAndDrop.DragAndDrop.add(e, `#${target.id}`, `#${target.id}`, undefined, dropTransition, undefined, swapTab, undefined, remakeWindow); // add this function to tab
				});
				window.addEventListener("mouseup", e => {DragAndDrop.drop(e, `#${target.id}`)}); // add global drop check for this tab
				item.addEventListener("dblclick", e => {
					var id_num = e.currentTarget.id.match("[0-9]+"); // get id to catch element from window
					var win = e.currentTarget;
					while (!win.classList.contains("window")) {
						win = win.parentElement;
					}

					var target_content_holder = win.querySelector("#content-holder"+id_num); // catch content
					var icon_block = win.querySelector("#icon-block"+id_num); // catch icon

					var i = 1;
					var content_holders = win.querySelectorAll(".content-holder");
					content_holders.forEach(item => {
						if (item.style.display) {i+=1}
					});
					if (i == content_holders.length) {
						target_content_holder.previousSibling.style.display = null;
					}

					e.currentTarget.parentElement.removeChild(e.currentTarget);
					target_content_holder.parentElement.removeChild(target_content_holder);
					icon_block.parentElement.removeChild(icon_block);
				});
			}

			if (panel_x1 <= e.clientX && e.clientX <= panel_x2 && panel_y1 <= e.clientY && e.clientY <= panel_y2) { // if over panel
				target_content_holder.style.display = "none";
			}
			else { // else tile window
				target_content_holder.style.display = null;
			}

			// move container to the selected window
			highestWin.querySelector(".container").appendChild(target_content_holder);

			// hide icon block and move it to the selected window
			icon_block.style.display = "none";
			highestWin.insertBefore(icon_block, highestWin.querySelector(".wl"));
		
			// recreate min-width for selected window
			highestWin.style.minWidth = (highestWin.querySelector(".tab-holder").children.length-1)*150+280+"px";

			// place selected window over other windows
			highestWin.style.zIndex = Layer.get();
			Layer.inc();
		}

		// recreate min-width for current window if tab out
		win.style.minWidth = (win.querySelector(".tab-holder").children.length-1)*150+280+"px";
	}
}

const barDropTransition = (e, target, info) => {
	target.style.transition = null;
	target.style.backgroundColor = "var(--dark-bg)";
	target.style.backDrop = "blur(40px)";

	var parentElement = target;
	while (!parentElement.classList.contains("dock")) {
		parentElement.style.zIndex = 2;
		parentElement = parentElement.parentElement;
	}
}

const insertBar = (e, target, info) => {
	var dock = document.querySelector(".dock");

	if (target.classList.contains("dragged")) {
		var parentElement = target;
		while (!parentElement.parentElement.classList.contains("dock")) {
			parentElement = parentElement.parentElement;
			parentElement.style.zIndex = null;
		}

		var x1 = dock.offsetLeft + parentElement.offsetLeft;
		var y1 = dock.offsetTop + parentElement.offsetTop;
		var y2 = y1 + parentElement.offsetHeight;

		if (x1 <= e.clientX && e.clientX <= (x1 + parentElement.offsetWidth) && y1 <= e.clientY && e.clientY <= y2) {
			target.style.transition = "transform 0.1s ease-in-out";
		}
		else if (e.clientX <= (x1 + parentElement.offsetWidth/2)) {
			if (target.nextSibling) {
				if (target.nextSibling.classList.contains("bar-split")) {
					target.parentElement.removeChild(target.nextSibling);
				}
			}
			else if (target.previousSibling.classList.contains("bar-split")) {
				target.parentElement.removeChild(target.previousSibling);
			}
			dock.insertBefore(target, parentElement);
			target.classList.remove("dragged");
		}
		else {
			if (target.nextSibling) {
				if (target.nextSibling.classList.contains("bar-split")) {
					target.parentElement.removeChild(target.nextSibling);
				}
			}
			else if (target.previousSibling.classList.contains("bar-split")) {
				target.parentElement.removeChild(target.previousSibling);
			}
			dock.insertBefore(target, parentElement.nextSibling);
			target.classList.remove("dragged");
		}
		target.style.transform = null;
	}
	else {
		if (dock.children.length <= 1) {
			target.style.transition = "transform 0.1s ease-in-out, background-color 0.1s ease-in-out";
			target.style.transform = null;
		}
		else {
			for (var i = 0; i < dock.children.length; i++) {
				var item = dock.children[i];
				if (item != target) {
					var x1 = dock.offsetLeft + item.offsetLeft;
					var y1 = dock.offsetTop + item.offsetTop;
					var y2 = y1 + item.offsetHeight;

					if (x1 <= e.clientX && e.clientX <= (x1 + item.offsetWidth/2) && y1 <= e.clientY && e.clientY <= y2) {
						var spliter = document.createElement("hr");
						spliter.classList.add("bar-split");
						item.insertBefore(spliter, item.firstChild);
						item.insertBefore(target, item.firstChild);
						target.classList.add("dragged");
					}
					else if ((x1 + item.offsetWidth/2) <= e.clientX && e.clientX <= (x1 + item.offsetWidth) && y1 <= e.clientY && e.clientY <= y2) {
						var spliter = document.createElement("hr");
						spliter.classList.add("bar-split");
						item.appendChild(spliter);
						item.appendChild(target);
						target.classList.add("dragged");
					}
					else {
						target.style.transition = "transform 0.1s ease-in-out, background-color 0.1s ease-in-out";
					}
					target.style.transform = null;
				}
			}
		}
	}
	target.style.backgroundColor = null;
	target.style.backDrop = null;

	target.style.zIndex = null;
}

const swapBar = (e, target, info) => {
	var dock = document.querySelector(".dock");

	if (!target.classList.contains("dragged")) {
		for (var i = 0; i < dock.children.length; i++) {
			var item = dock.children[i];
			if (item != target) {
				var x1 = dock.offsetLeft + item.offsetLeft;
				var y1 = dock.offsetTop + item.offsetTop;
				var y2 = y1 + item.offsetHeight;

				if (x1 <= e.clientX && e.clientX <= (x1 + item.offsetWidth/2) && y1 <= e.clientY && e.clientY <= y2) {
					var targetTransformX = 0;
					var targetTransformY = 0;
					if (target.style.transform != '') {
					
						var nums = target.style.transform.split("translate3d")[1];
						nums = nums.slice(1, nums.length-1).split("px,");
						
						targetTransformX = parseInt(nums[0]);
						targetTransformY = parseInt(nums[1]);
					}

					var offsetBefore = target.offsetLeft;
					target.parentElement.insertBefore(target, item);
					var offsetAfter = target.offsetLeft;

					target.style.transform = `translate3d(${targetTransformX+(offsetBefore-offsetAfter)}px,${targetTransformY}px,0px)`;
					return
				}
				else if ((x1 + item.offsetWidth/2) <= e.clientX && e.clientX <= (x1 + item.offsetWidth) && y1 <= e.clientY && e.clientY <= y2) {
					var targetTransformX = 0;
					var targetTransformY = 0;
					if (target.style.transform != '') {
					
						var nums = target.style.transform.split("translate3d")[1];
						nums = nums.slice(1, nums.length-1).split("px,");
						
						targetTransformX = parseInt(nums[0]);
						targetTransformY = parseInt(nums[1]);
					}

					var offsetBefore = target.offsetLeft;
					target.parentElement.insertBefore(target, item.nextSibling);
					var offsetAfter = target.offsetLeft;

					target.style.transform = `translate3d(${targetTransformX+(offsetBefore-offsetAfter)}px,${targetTransformY}px,0px)`;
					return
				}
			}
		}
	}
}

// W I N D O W  C O N T R O L  F U N C  F O R  W I N D O W  S T A C K I N G

const insertCheck = (e, target, info) => {
	// default for window under cursor
	var highestWin = "";

	// get highest window under cursor
	document.querySelectorAll(".window").forEach(item => {
		if (document.querySelector(info.target) != item) {
			var targetTransformX = 0;
			var targetTransformY = 0;
			if (item.style.transform != '') {
			
				var nums = item.style.transform.split("translate3d")[1];
				nums = nums.slice(1, nums.length-1).split("px,");
				
				targetTransformX = parseInt(nums[0]);
				targetTransformY = parseInt(nums[1]);
			}

			// get coords
			var x1 = item.offsetLeft+targetTransformX;
			var x2 = x1+item.offsetWidth;
			var y1 = item.offsetTop+targetTransformY;
			var y2 = y1+item.offsetHeight;

			// check position
			if (x1, x2, y1, y2, x1 <= e.clientX && e.clientX <= x2 && y1 <= e.clientY && e.clientY <= y2) {
				if (highestWin == "") { 
					highestWin = item;
				}
				else {
					highestWin = (highestWin.style.zIndex > item.style.zIndex) && highestWin || item;
				}
			}
		}
	});

	// if a window under cursor
	if (highestWin != "") { 

		var targetTransformX = 0;
		var targetTransformY = 0;
		if (highestWin.style.transform != '') {
		
			var nums = highestWin.style.transform.split("translate3d")[1];
			nums = nums.slice(1, nums.length-1).split("px,");
			
			targetTransformX = parseInt(nums[0]);
			targetTransformY = parseInt(nums[1]);
		}

		// get coords again
		var x1 = highestWin.offsetLeft+targetTransformX;
		var x2 = x1+highestWin.offsetWidth;
		var y1 = highestWin.offsetTop+targetTransformY;
		var y2 = y1+highestWin.offsetHeight;

		// get highest window panel
		var winPanel = highestWin.querySelector(".win-panel");
		
		// get coords for panel
		var panel_x1 = x1 + winPanel.offsetLeft;
		var panel_x2 = panel_x1 + winPanel.offsetWidth;
		var panel_y1 = y1 + winPanel.offsetTop;
		var panel_y2 = panel_y1 + winPanel.offsetHeight;
		
		// get current window
		var win = document.querySelector(info.target);
		
		// move all tabs to new window
		win.querySelectorAll(".win-tab").forEach(item => {
			highestWin.querySelector(".tab-holder").insertBefore(item, highestWin.querySelector(".tab-add"));

			// if tab doesn't have a drag event
			if (!item.hasDrag) {
				item.hasDrag = true;
				item.addEventListener("mousedown", e => {
					DragAndDrop.add(e, `#${item.id}`, `#${item.id}`, undefined, dropTransition, undefined, swapTab, undefined, remakeWindow);
				});
				window.addEventListener("mouseup", e => {DragAndDrop.drop(e, `#${item.id}`)});
				item.addEventListener("dblclick", e => {
					var id_num = e.currentTarget.id.match("[0-9]+"); // get id to catch element from window
					var win = e.currentTarget;
					while (!win.classList.contains("window")) {
						win = win.parentElement;
					}
					var target_content_holder = win.querySelector("#content-holder"+id_num); // catch content
					var icon_block = win.querySelector("#icon-block"+id_num); // catch icon
					e.currentTarget.parentElement.removeChild(e.currentTarget);
					target_content_holder.parentElement.removeChild(target_content_holder);
					icon_block.parentElement.removeChild(icon_block);
				});
			}

		});

		// move all content to new window
		win.querySelectorAll(".content-holder").forEach(item => {
			if (panel_x1 <= e.clientX && e.clientX <= panel_x2 && panel_y1 <= e.clientY && e.clientY <= panel_y2 || false) {
				item.style.display = "none";
			}
			highestWin.querySelector(".container").appendChild(item);
		});
		
		// move all icons to new window
		win.querySelectorAll(".icon-block").forEach(item => {
			item.style.display = "none";
			highestWin.insertBefore(item, highestWin.querySelector(".wl"));
		});
		
		// close current window
		Window.close(e, win);

		// change minimal sizes
		highestWin.style.minWidth = (highestWin.querySelector(".tab-holder").children.length-1)*150+280+"px";

		// change z-index
		highestWin.style.zIndex = Layer.get();
		Layer.inc();
	}
}

// change z-index
const moveUp = (e, target, info) => {
	target.style.zIndex = Layer.get();
	Layer.inc();
}

const moveUpAndClean = (e, target, info) => {
	target.style.transition = null;
	target.style.zIndex = Layer.get();
	Layer.inc();
}

// A P P  B A R

// disable transition on move start and set higher layer
const iconDropTransition = (e, target, info) => {
	target.style.transition = null;
	target.style.zIndex = 2;
}

// drag icon func
const moveIcon = (e, target, info) => {

	// get dock
	var dock = document.querySelector(".dock");

	// get app bar
	var icon_holder = document.querySelector(".app-bar");

	// flag for position before or after current icon 
	var insertAfter = false;

	// get all icons
	document.querySelectorAll(".img-container, .app-split").forEach(item => {
		if (target != item) { // if not current icon

			// get positions
			var x1 = dock.offsetLeft + icon_holder.offsetLeft + item.offsetLeft;
			var x2 = x1 + item.offsetWidth;
			var y1 = dock.offsetTop + icon_holder.offsetTop + item.offsetTop;
			var y2 = y1 + item.offsetHeight;

			// check if over
			if (x1, x2, y1, y2, x1 <= e.clientX && e.clientX <= x2 && y1 <= e.clientY && e.clientY <= y2) {

				var targetTransformX = 0;
				var targetTransformY = 0;
				if (target.style.transform != '') {
				
					var nums = target.style.transform.split("translate3d")[1];
					nums = nums.slice(1, nums.length-1).split("px,");
					
					targetTransformX = parseInt(nums[0]);
					targetTransformY = parseInt(nums[1]);
				}

				var offsetBefore = target.offsetLeft;
				// check flag
				if (insertAfter) {
					item.parentElement.insertBefore(target, item.nextSibling);
				}
				else {
					item.parentElement.insertBefore(target, item);
				}
				var offsetAfter = target.offsetLeft;

				target.style.transform = `translate3d(${targetTransformX+(offsetBefore-offsetAfter)}px,${targetTransformY}px,0px)`;

				return
			}
		}
		else { // toggle flag if current
			insertAfter = true;
		}
	});
}

const returnIcon = (e, target, info) => {
	target.style.transition = "transform 0.1s ease-in-out";
	target.style.transform = null;
	target.style.zIndex = null;
}

const newTab = (e, target) => {
	var win = document.querySelector(target);
	var tab_holder = win.querySelector(".tab-holder");
	var container = win.querySelector(".container");
	var icon_block = win.querySelector(".icon-block");

	var new_tab = document.createElement("div");
	new_tab.classList.add("win-tab");
	new_tab.id = `win-tab${Window.get()}`;
	new_tab.innerHTML = "New Tab";
	new_tab.hasDrag = true;

	var new_content_holder = document.createElement("div");
	new_content_holder.classList.add("content-holder");
	new_content_holder.id = `content-holder${Window.get()}`;

	var new_icon_block = document.createElement("div");
	new_icon_block.classList.add("icon-block");
	new_icon_block.style.display = "none";
	new_icon_block.id = `icon-block${Window.get()}`;

	new_tab.addEventListener("click", e => {
		if (Keylogger.get().includes(17)) {
			DragAndDrop.click(e, `#${new_content_holder.id}`, undefined, showContent)
		}
		else {
			DragAndDrop.click(e, `#${new_content_holder.id}`, hideAllContent, showContent)
		}
	});
	
	new_tab.addEventListener("dblclick", e => {
		var id_num = e.currentTarget.id.match("[0-9]+"); // get id to catch element from window
		var win = e.currentTarget;
		while (!win.classList.contains("window")) {
			win = win.parentElement;
		}
		var target_content_holder = win.querySelector("#content-holder"+id_num); // catch content
		var icon_block = win.querySelector("#icon-block"+id_num); // catch icon

		var i = 1;
		var content_holders = win.querySelectorAll(".content-holder");
		content_holders.forEach(item => {
			if (item.style.display) {i+=1}
		});
		if (i == content_holders.length) {
			target_content_holder.previousSibling.style.display = null;
		}
		e.currentTarget.parentElement.removeChild(e.currentTarget);
		target_content_holder.parentElement.removeChild(target_content_holder);
		icon_block.parentElement.removeChild(icon_block);
	});

	var new_tab_content = document.createElement("div");
	new_tab_content.classList.add("new-tab-content");

	var apps_holder = document.createElement("div");
	apps_holder.classList.add("apps-holder");
	apps_holder.classList.add("noselect");

	apps_list.forEach(item => {
		if (item.content != "hr") {
			var app_holder = document.createElement("div");
			app_holder.classList.add("app-holder");

			app_holder.addEventListener("click", e => {
				new_tab.innerHTML = item.title;
				new_tab.addEventListener("mousedown", e => {
					DragAndDrop.add(e, `#${new_tab.id}`, `#${new_tab.id}`, undefined, dropTransition, undefined, swapTab, undefined, remakeWindow);
				});
				window.addEventListener("mouseup", e => {DragAndDrop.drop(e, `#${new_tab.id}`)});

				var id_num = new_tab.id.match("[0-9]+"); // get id to catch element from window
				var win = new_tab;
				while (!win.classList.contains("window")) {
					win = win.parentElement;
				}
				var target_content_holder = win.querySelector("#content-holder"+id_num); // catch content
				var target_icon_block = win.querySelector("#icon-block"+id_num); // catch icon

				target_content_holder.innerHTML = "";

				var innerContent = item.content.cloneNode(true);
				target_content_holder.appendChild(innerContent);

				if (item.listenerAdder) {
					item.listenerAdder(innerContent);
				}

				var new_icon = document.createElement("img");
				new_icon.src = item.src;
				new_icon.setAttribute('draggable', false);
				new_icon.classList.add("noselect");
				new_icon.id = "icon"+id_num;
				target_icon_block.appendChild(new_icon);
			});

			var app_icon_holder = document.createElement("div");
			app_icon_holder.classList.add("app-icon-holder");

			var app_icon = document.createElement("img");
			app_icon.classList.add("app-icon");
			app_icon.src = item.src;

			var app_title = document.createElement("div");
			app_title.classList.add("app-title");
			app_title.innerHTML = item.title;

			app_icon_holder.appendChild(app_icon);

			app_holder.appendChild(app_icon_holder);
			app_holder.appendChild(app_title);

			apps_holder.appendChild(app_holder);
		}
	});

	new_tab_content.appendChild(apps_holder);
	new_content_holder.appendChild(new_tab_content);

	if (!Keylogger.get().includes(17)) {
		hideAllContent(e, win);
	}

	tab_holder.insertBefore(new_tab, e.currentTarget);
	container.appendChild(new_content_holder);
	win.insertBefore(new_icon_block, win.querySelector(".wl"));

	win.style.minWidth = (tab_holder.children.length-1)*150+280+"px";
	Window.inc();
}

// W I N D O W  G E N E R A T O R

class Layer {
	static #z_index = 1; // global z-index counter

	static inc = () => {
		Layer.#z_index += 1;
		return this;
	}

	static get = () => {
		return Layer.#z_index;
	}

	static set = (i) => {
		Layer.#z_index = i;
		return this;
	}
}

class Window {
	static #win_id = 1; // global window id number 

	static get = () => {
		return Window.#win_id;
	}

	static inc = () => {
		Window.#win_id += 1;
		return this;
	}

	static close = (e, win) => {
		win.parentElement.removeChild(win);
		var underline = document.querySelector(`#underline${win.id.match("[0-9]+")}`);
		
		if (underline) {
			underline.parentElement.removeChild(underline);
		}

		return this;
	}


	static make = (content, icon_src, title, extraClass, makeClone, addPanel = true, addResize = true, listenerAdder = content => {}) => {
		var win = document.createElement("div");
		if (addPanel) {
			win.classList.add("window");
		}
		else {
			win.classList.add("static-window");
		}
		win.id = "window"+Window.#win_id;
		win.style.zIndex = Layer.get();
		Layer.inc();
		win.setAttribute('draggable', false);
		if (extraClass) {
			extraClass.forEach(item => {
				win.classList.add(item);
			});
		}
		win.addEventListener("click", e => {moveUp(e, win, undefined)});

		if (addPanel) {
			var panel = document.createElement("div");
			panel.classList.add("win-panel");
			panel.classList.add("noselect");
			panel.id = "win-panel"+Window.#win_id;
			panel.addEventListener("mousedown", e => {DragAndDrop.add(e, `#${panel.id}`, `#${win.id}`, undefined, moveUpAndClean, undefined, undefined, undefined, undefined, attach)});
			panel.addEventListener("dblclick", e => {
				if (e.target == e.currentTarget) {
					fullsize(e, win)
				}
			});

			var tab_holder = document.createElement("div");
			tab_holder.classList.add("tab-holder");
			tab_holder.id = "tab-holder"+Window.#win_id;

			var win_tab = document.createElement("div");
			win_tab.classList.add("win-tab");
			win_tab.id = "win-tab"+Window.#win_id;
			win_tab.innerHTML = title;
			win_tab.addEventListener("click", e => {
				if (Keylogger.get().includes(17)) {
					DragAndDrop.click(e, `#${content_holder.id}`, undefined, showContent)
				}
				else {
					DragAndDrop.click(e, `#${content_holder.id}`, hideAllContent, showContent)
				}
			});

			var tab_add = document.createElement("div");
			tab_add.classList.add("tab-add");
			tab_add.id = "tab-add"+Window.#win_id;
			tab_add.innerHTML = "+";
			tab_add.addEventListener("click", e => {newTab(e, `#${win.id}`)});

			var win_panel_buttons = document.createElement("div");
			win_panel_buttons.classList.add("win-panel-buttons");
			win_panel_buttons.id = "win-panel-buttons"+Window.#win_id;

			var win_resizers = document.createElement("div");
			win_resizers.classList.add("win-resizers");
			win_resizers.id = "win-resizers"+Window.#win_id;

			var split_left = document.createElement("div");
			split_left.classList.add("split-left");
			split_left.id = "split-left"+Window.#win_id;
			split_left.addEventListener("click", e => {DragAndDrop.click(e, `#${win.id}`, undefined, leftAttach)});
			var split_left_img = document.createElement("img");
			split_left_img.src = "src/images/demo/icons/Frame/SplitLeft.png";
			split_left_img.setAttribute('draggable', false);
			split_left.appendChild(split_left_img);

			var win_insert = document.createElement("div");
			win_insert.classList.add("win-insert");
			win_insert.id = "win-insert"+Window.#win_id;
			win_insert.addEventListener("mousedown", e => {DragAndDrop.add(e, `#${win_insert.id}`, `#${win.id}`, undefined, iconify, undefined, undefined, insertCheck, deiconify, attach, true, true, win.offsetWidth/2)});
			var win_insert_img = document.createElement("img");
			win_insert_img.src = "src/images/demo/icons/Frame/Multitask.png";
			win_insert_img.setAttribute('draggable', false);
			win_insert.appendChild(win_insert_img);

			var split_right = document.createElement("div");
			split_right.classList.add("split-right");
			split_right.id = "split-right"+Window.#win_id;
			split_right.addEventListener("click", e => {DragAndDrop.click(e, `#${win.id}`, undefined, rightAttach)});
			var split_right_img = document.createElement("img");
			split_right_img.src = "src/images/demo/icons/Frame/SplitRight.png";
			split_right_img.setAttribute('draggable', false);
			split_right.appendChild(split_right_img);

			var win_control = document.createElement("div");
			win_control.classList.add("win-control");
			win_control.id = "win-control"+Window.#win_id;

			var win_fullsize = document.createElement("div");
			win_fullsize.classList.add("win-fullsize");
			win_fullsize.id = "win-fullsize"+Window.#win_id;
			win_fullsize.addEventListener("click", e => {DragAndDrop.click(e, `#${win.id}`, undefined, fullsize)});
			var win_fullsize_img = document.createElement("img");
			win_fullsize_img.src = "src/images/demo/icons/Frame/Maximize.png";
			win_fullsize_img.setAttribute('draggable', false);
			win_fullsize.appendChild(win_fullsize_img);

			var win_minimalize = document.createElement("div");
			win_minimalize.classList.add("win-minimalize");
			win_minimalize.id = "win-minimalize"+Window.#win_id;
			win_minimalize.addEventListener("click", e => {DragAndDrop.click(e, `#${win.id}`, undefined, minimalize)});
			var win_minimalize_img = document.createElement("img");
			win_minimalize_img.src = "src/images/demo/icons/Frame/Minimize.png";
			win_minimalize_img.setAttribute('draggable', false);
			win_minimalize.appendChild(win_minimalize_img);

			var win_close = document.createElement("div");
			win_close.classList.add("win-close");
			win_close.id = "win-close"+Window.#win_id;
			win_close.addEventListener("click", e => {DragAndDrop.click(e, `#${win.id}`, undefined, Window.close)});
			var win_close_img = document.createElement("img");
			win_close_img.src = "src/images/demo/icons/Frame/Close.png";
			win_close_img.setAttribute('draggable', false);
			win_close.appendChild(win_close_img);
		}

		var container = document.createElement("div");
		container.classList.add("container");
		container.id = "container"+Window.#win_id;

		var content_holder = document.createElement("div");
		content_holder.classList.add("content-holder");
		content_holder.id = "content-holder"+Window.#win_id;

		var icon_block = document.createElement("div");
		icon_block.classList.add("icon-block");
		icon_block.style.display = "none";
		icon_block.id = "icon-block"+Window.#win_id;

		if (icon_src) {
			var icon = document.createElement("img");
			icon.src = icon_src || "src/images/demo/icons/Apps/TextEditor.png";
			icon.setAttribute('draggable', false);
			icon.classList.add("noselect");
			icon.id = "icon"+Window.#win_id;
		}

		if (addResize) {
			var wl = document.createElement("div");
			wl.classList.add("wl");
			wl.id = "wl"+Window.#win_id;
			wl.addEventListener("mousedown", e => {DragAndDrop.add(e, `#${wl.id}`, `#${win.id}`, (e, target, info) => {document.body.style.cursor="e-resize"}, moveUpAndClean, undefined, dragResizeWL, (e, target, info) => {document.body.style.cursor=null}, undefined, undefined, true, false)});

			var wr = document.createElement("div");
			wr.classList.add("wr");
			wr.id = "wr"+Window.#win_id;
			wr.addEventListener("mousedown", e => {DragAndDrop.add(e, `#${wr.id}`, `#${win.id}`, (e, target, info) => {document.body.style.cursor="w-resize"}, moveUpAndClean,  undefined, dragResizeWR, (e, target, info) => {document.body.style.cursor=null}, undefined, undefined, false, false)});

			var ht = document.createElement("div");
			ht.classList.add("ht");
			ht.id = "ht"+Window.#win_id;
			ht.addEventListener("mousedown", e => {DragAndDrop.add(e, `#${ht.id}`, `#${win.id}`, (e, target, info) => {document.body.style.cursor="s-resize"}, moveUpAndClean, undefined, dragResizeHT, (e, target, info) => {document.body.style.cursor=null}, undefined, undefined, false, true)});

			var hb = document.createElement("div");
			hb.classList.add("hb");
			hb.id = "hb"+Window.#win_id;
			hb.addEventListener("mousedown", e => {DragAndDrop.add(e, `#${hb.id}`, `#${win.id}`, (e, target, info) => {document.body.style.cursor="n-resize"}, moveUpAndClean,  undefined, dragResizeHB, (e, target, info) => {document.body.style.cursor=null}, undefined, undefined, false, false)});

			var whlt = document.createElement("div");
			whlt.classList.add("whlt");
			whlt.id = "whlt"+Window.#win_id;
			whlt.addEventListener("mousedown", e => {DragAndDrop.add(e, `#${whlt.id}`, `#${win.id}`, (e, target, info) => {document.body.style.cursor="se-resize"}, moveUpAndClean, undefined, dragResizeWHLT, (e, target, info) => {document.body.style.cursor=null}, undefined, undefined, true, true)});

			var whrt = document.createElement("div");
			whrt.classList.add("whrt");
			whrt.id = "whrt"+Window.#win_id;
			whrt.addEventListener("mousedown", e => {DragAndDrop.add(e, `#${whrt.id}`, `#${win.id}`, (e, target, info) => {document.body.style.cursor="sw-resize"}, moveUpAndClean, undefined, dragResizeWHRT, (e, target, info) => {document.body.style.cursor=null}, undefined, undefined, false, true)});

			var whlb = document.createElement("div");
			whlb.classList.add("whlb");
			whlb.id = "whlb"+Window.#win_id;
			whlb.addEventListener("mousedown", e => {DragAndDrop.add(e, `#${whlb.id}`, `#${win.id}`, (e, target, info) => {document.body.style.cursor="nw-resize"}, moveUpAndClean, undefined, dragResizeWHLB, (e, target, info) => {document.body.style.cursor=null}, undefined, undefined, true, false)});

			var whrb = document.createElement("div");
			whrb.classList.add("whrb");
			whrb.id = "whrb"+Window.#win_id;
			whrb.addEventListener("mousedown", e => {DragAndDrop.add(e, `#${whrb.id}`, `#${win.id}`, (e, target, info) => {document.body.style.cursor="ne-resize"}, moveUpAndClean, undefined, dragResizeWHRB, (e, target, info) => {document.body.style.cursor=null}, undefined, undefined, false, false)});
		}

		window.addEventListener("mouseup", e => {DragAndDrop.drop(e, `#${win.id}`)});


		if (addPanel) {
			tab_holder.appendChild(win_tab);
			tab_holder.appendChild(tab_add);

			win_resizers.appendChild(split_left);
			win_resizers.appendChild(win_insert);
			win_resizers.appendChild(split_right);

			win_control.appendChild(win_fullsize);
			win_control.appendChild(win_minimalize);
			win_control.appendChild(win_close);

			win_panel_buttons.appendChild(win_resizers);
			win_panel_buttons.appendChild(win_control);
			
			panel.appendChild(tab_holder);
			panel.appendChild(win_panel_buttons);
		}

		var innerContent = makeClone && content.cloneNode(true) || content;
		content_holder.appendChild(innerContent);
		container.appendChild(content_holder);

		listenerAdder(innerContent);

		if (addPanel) {
			win.appendChild(panel);
		}
		
		win.appendChild(container);
		
		if (icon_src) {
			icon_block.appendChild(icon);
		}
		win.appendChild(icon_block);

		if (addResize) {
			win.appendChild(wl);
			win.appendChild(wr);
			win.appendChild(hb);
			win.appendChild(ht);
			win.appendChild(whlt);
			win.appendChild(whrt);
			win.appendChild(whlb);
			win.appendChild(whrb);
		}

		Window.#win_id += 1;
		return win;
	}
}

// A P P  B A R  F I L L E R

class Appbar {
	static #list = []; // global app list for window functions

	static get = () => {
		return Appbar.#list;
	}

	static add = list_l => { // local app list
		// get app bar
		var app_bar = document.querySelector(".app-bar");	
		app_bar.innerHTML = '';

		// rewrite global app list
		Appbar.#list = list_l;

		var i = 0; // ids for icons and wrappers (required for drag function)
		list_l.forEach(item => { // iterate list

			if (item.content == "hr") {
				var app_split = document.createElement("hr");
				app_split.classList.add("app-split");
				app_bar.appendChild(app_split);
			}
			else {
				// create one item
				var img_container = document.createElement("div");
				img_container.classList.add("img-container");
				img_container.id = `img-container${i}`;
				
				// create icon wrap
				var img_wrap = document.createElement("div");
				img_wrap.classList.add("img-wrapper");
				img_wrap.addEventListener("click", e => { // add window creation
				
					// create new underline on click
					var underline = document.createElement("div");
					underline.classList.add("underline");
					underline.id = `underline${Window.get()}`;

					underline.addEventListener("click", e => { // add minimalize func
						var win = document.querySelector("#window"+e.currentTarget.id.match("[0-9]+")[0]);
						if (win.style.display) {
							e.currentTarget.style.backgroundColor = "var(--light-bg-hl)";
							win.style.display = null;
						}
						else {
							e.currentTarget.style.backgroundColor = "var(--light-bg)";
							win.style.display = "none";
						}
					});

					// add underline on create
					underlines.appendChild(underline);

					// create window
					var defaultFunc = content => {};
					var win = Window.make(item.content, item.src, item.title, item.extraClass || [], true, true, true, item.listenerAdder || defaultFunc);
					Workspace.add(win);
					win.style.transform = `translate3d(${window.innerWidth/2-win.offsetWidth/2}px, ${window.innerHeight/2-win.offsetHeight/2}px, 0)`;
				});
				
				// create icon
				var img = document.createElement("img");
				img.classList.add("noselect");
				img.src = item["src"];
				img.id = `app-icon${i}`;
				i+=1; // increment id
				img.addEventListener("mousedown", e => {DragAndDrop.add(e, `#${img.id}`, `#${img_container.id}`, undefined, iconDropTransition, undefined, moveIcon, undefined, returnIcon)});

				// create underlines container
				var underlines = document.createElement("div");
				underlines.classList.add("underlines");

				// add icon to wrap
				img_wrap.appendChild(img);

				// add all to the item
				img_container.appendChild(img_wrap);
				img_container.appendChild(underlines);

				// add drop event
				window.addEventListener("mouseup", e => {DragAndDrop.drop(e, `#${img_container.id}`)});

				// add icon and underlines section to bar
				app_bar.appendChild(img_container);
			}
		});

		var hider_holder = document.createElement("div");
		hider_holder.classList.add("hider-holder");

		var hider = document.createElement("img");
		hider.classList.add("noselect");
		hider.src = "src/images/demo/icons/Back.png";

		hider_holder.addEventListener("click", e => {
			var get_app = document.querySelector(".app-split");
			var curr_icon = hider.src.split("/");

			curr_icon = curr_icon[curr_icon.length-1];
			
			if (curr_icon == "Back.png") {
				while (!get_app.nextSibling.classList.contains("hider-holder")) {
					get_app.nextSibling.style.display = "none";
					get_app = get_app.nextSibling;
				}
				hider.src = "src/images/demo/icons/Forward.png";
			}
			else {
				while (!get_app.nextSibling.classList.contains("hider-holder")) {
					get_app.nextSibling.style.display = null;
					get_app = get_app.nextSibling;
				}
				hider.src = "src/images/demo/icons/Back.png";
			}
		});

		hider_holder.appendChild(hider);
		app_bar.appendChild(hider_holder);
		return this;
	}
}

class Scrollbar {
	static #list = [];

	static get = () => {
		return Scrollbar.#list;
	}

	static add = list_l => {
		Scrollbar.#list = list_l;
		var scroll_bar = document.querySelector(".scroll-bar");
		var oldChild = scroll_bar.querySelector(".scroll-item");
		var child = list_l.items[list_l.pos];
		child.classList.add("scroll-item");
		
		if (oldChild) {
			scroll_bar.replaceChild(child, oldChild);
		}
		else {
			scroll_bar.appendChild(child);
		}
		
		if (!scroll_bar.hasScroll) {
			scroll_bar.addEventListener("wheel", e => {
				if (Keylogger.get().includes(16)) {
					if (e.deltaY > 0) {
						Scrollbar.#list.pos += parseInt((Scrollbar.#list.pos >= Scrollbar.#list.items.length-1) && `${-1*Scrollbar.#list.items.length+1}` || "1");
					}
					else {
						Scrollbar.#list.pos -= parseInt((Scrollbar.#list.pos <= 0) && `${-1*Scrollbar.#list.items.length+1}` || "1");
					}
					Scrollbar.add(Scrollbar.#list);
				}
			});
			scroll_bar.hasScroll = true;
		}
		return this;
	}
}

class Workspace {
	static #current_ws = 1;

	static get = () => {
		return Workspace.#current_ws;
	}

	static add = (win) => {
		document.querySelector(`#workspace${Workspace.#current_ws}`).appendChild(win);
		return this;
	}

	static set = ws_num => {
		document.querySelectorAll(".workspace").forEach(item => {
			if (!item.style.display) {
				if (item.children.length) {
					item.style.display = "none";
				}
				else {
					item.parentElement.removeChild(item);
				}
			}
		});

		Workspace.#current_ws = ws_num;

		var workspace = document.querySelector(`#workspace${ws_num}`);

		if (!workspace) {
			workspace = document.createElement("div");
			workspace.classList.add("workspace");
			workspace.id = `workspace${ws_num}`;
			demo_body.insertBefore(workspace, demo_body.firstChild);
		}
		else {
			workspace.style.display = null;
		}
		
		return this;
	}
}

class Keylogger {
	static #keys = [];

	static listen = () => {
		window.addEventListener("keydown", e => {
			Keylogger.append(e.keyCode);
		});

		window.addEventListener("keyup", e => {
			var keys = Keylogger.get();
			var i = 0;

			while (i < keys.length) {
				if (e.keyCode == keys[i]) {
					keys = Keylogger.remove(i).get();
				}
				else {
					i++;
				}
			}
		});

		return this;
	}

	static get = () => {
		return Keylogger.#keys;
	}

	static append = (keyCode) => {
		Keylogger.#keys.push(keyCode);
		
		return this;
	}

	static wipe = () => {
		Keylogger.#keys = [];
		return this;
	}

	static remove = (i) => {
		Keylogger.#keys.splice(i, 1);
		return this;
	}
}

Workspace.set(Workspace.get());
Keylogger.listen();

window.addEventListener("mousemove", DragAndDrop.listen); // add main drag check
demo_body.addEventListener("mouseleave", e => {
	DragAndDrop.dropAll(e); 
	Keylogger.wipe();
}); // add out of bounds check
