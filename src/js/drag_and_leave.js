class DragAndDrop {

	// main drag list (wipe to drop all)
	static #dragList = [];

	static get = () => {
		return DragAndDrop.#dragList;
	}

	static wipe = () => {
		DragAndDrop.#dragList = [];
		return this;
	}

	// mousedown event (add to #dragList)
	static add = (e, currentTarget, target, currentTarget_in_f, target_in_f, currentTarget_f, target_f, currentTarget_out_f, target_out_f, drop_f, modify_X = true, modify_Y = true, extraX, extraY) => {
		if (e.target == e.currentTarget) { // check if target

			// generate info
			var info = {
				"currentTarget" : currentTarget,
				"target" : target,
				"currentTarget_in_f" : currentTarget_in_f,
				"target_in_f" : target_in_f,
				"currentTarget_f" : currentTarget_f,
				"target_f" : target_f,
				"currentTarget_out_f" : currentTarget_out_f,
				"target_out_f" : target_out_f,
				"drop_f" : drop_f,
				"modify_X" : modify_X,
				"modify_Y" : modify_Y,
				"extraX" : extraX || 0,
				"extraY" : extraY || 0
			};

			// append info
			DragAndDrop.#dragList.push(info);

			// get target
			var target = document.querySelector(target);

			// control element function on drag start
			if (typeof currentTarget_in_f == "function") {
				currentTarget_in_f(e, e.currentTarget, info);
			}

			// target function on drag start
			if (typeof target_in_f == "function") {
				target_in_f(e, target, info);
			}

			// default value
			var targetTransformX = 0;
			var targetTransformY = 0;

			// get target transform
			if (target.style.transform != '') {
			
				var nums = target.style.transform.split("translate3d")[1];
				nums = nums.slice(1, nums.length-1).split("px,");
				
				targetTransformX = parseInt(nums[0]);
				targetTransformY = parseInt(nums[1]);
			}

			// ad extraX or extraY
			target.style.transform = `translate3d(${targetTransformX+(extraX || 0)}px,${targetTransformY+(extraY || 0)}px,0)`;
		}

		return this;
	}

	// extra click function control -> target
	static click = (e, target, currentTarget_f, target_f) => {
		
		var target = document.querySelector(target);

		if (typeof currentTarget_f == "function") {
			currentTarget_f(e, e.currentTarget);
		}

		if (typeof target_f == "function") {
			target_f(e, target);
		}

		return this;
	}

	// mousemove event (window)
	static listen = e => {

		// go through #dragList
		DragAndDrop.get().forEach(item => {
			var target = document.querySelector(item.target);

			// control element function while drag
			if (typeof item.currentTarget_f == "function") {
				item.currentTarget_f(e, document.querySelector(item.currentTarget), item);
			}

			// target function while drag
			if (typeof item.target_f == "function") {
				item.target_f(e, target, item);
			}

			var targetTransformX = 0;
			var targetTransformY = 0;
			if (target.style.transform != '') {
			
				var nums = target.style.transform.split("translate3d")[1];
				nums = nums.slice(1, nums.length-1).split("px,");
				
				targetTransformX = parseInt(nums[0]);
				targetTransformY = parseInt(nums[1]);
			}

			var movementX = item.modify_X && e.movementX || 0;
			var movementY = item.modify_Y && e.movementY || 0;
			target.style.transform = `translate3d(${targetTransformX+movementX}px,${targetTransformY+movementY}px,0)`;
		});
	}

	//mouseup event (control element) (also may be mouseout as main drop) 
	static drop = (e, target) => { // event, move target, fuction for control, function for target
		
		// default value for info
		var info = '';

		// get target from #dragList
		for (var i = 0; i < DragAndDrop.get().length; i++) { 
		
			if (DragAndDrop.get()[i].target == target) { 
		
				info = DragAndDrop.get().splice(i, 1)[0]; 
			}
		
		}
		
		// if not default
		if (info != '') {

			// get targets
			var target = document.querySelector(target);
			var currentTarget = document.querySelector(info.currentTarget);

			// control element on drop
			if (typeof info.currentTarget_out_f == "function") {
				info.currentTarget_out_f(e, currentTarget, info);
			}

			// target function on drop
			if (typeof info.target_out_f == "function") {
				info.target_out_f(e, target, info);
			}

			if (target.style.transform != '') {
			
				var nums = target.style.transform.split("translate3d")[1];
				nums = nums.slice(1, nums.length-1).split("px,");
				
				var targetTransformX = parseInt(nums[0]);
				var targetTransformY = parseInt(nums[1]);
			}

			// delete extraX and extraY
			target.style.transform = `translate3d(${targetTransformX-info.extraX}px,${targetTransformY-info.extraY}px,0)`;
		}

		return this;
	}


	static dropAll = e => {

		// get all items from #dragList
		DragAndDrop.get().forEach(info => {
			
			var target = document.querySelector(info.target);
			var currentTarget = document.querySelector(info.currentTarget);

			// control element function on drop
			if (typeof info.currentTarget_out_f == "function") {
				info.currentTarget_out_f(e, currentTarget, info);
			}

			// target function on drop
			if (typeof info.target_out_f == "fuction") {
				info.target_out_f(e, target, info);
			}

			// target function on out_of_bounds
			if (typeof info.drop_f == "function") {
				info.drop_f(e, target, info);
			}
			

			if (target.style.transform != '') {
			
				var nums = target.style.transform.split("translate3d")[1];
				nums = nums.slice(1, nums.length-1).split("px,");
				
				var targetTransformX = parseInt(nums[0]);
				var targetTransformY = parseInt(nums[1]);
			}

			// delete extraX and extraY
			target.style.transform = `translate3d(${targetTransformX-info.extraX}px,${targetTransformY-info.extraY}px,0)`;
		});

		// wipe list 
		DragAndDrop.wipe();

		return this;
	}
}
