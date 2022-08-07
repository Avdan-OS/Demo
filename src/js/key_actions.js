const sayHi = (e, info) => {
    var keys = Keylogger.getKeys();
	if (keys.includes(16) && keys.includes(17)) {
        console.log(`Wow, you pressed Ctrl, Shift and ${e.code} at once`);
	}
	else if (keys.includes(17)) {
        console.log(`Hi, you pressed Ctrl and ${e.code}`);
    }
	else if (keys.includes(16)) {
        console.log(`Hi, you pressed Shift and ${e.code}`);
	}
	else {
        console.log(`Oh, just a simple ${e.code}?`);
	}
}

Keylogger.press(32, sayHi);
