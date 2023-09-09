const OFFSET = 3 // plus or minus deg
let sign = Math.random() >= 0.5 ? 1 : -1

function rotateLines() {
	document.querySelectorAll('div').forEach(el => {
		const offsetMagnitude = Math.random() * OFFSET
		sign *= -1
		// el.style.transform = `rotate(${offsetMagnitude * offsetSign}deg)`
		// el.style.transition = 'rotate 1.5s'
		el.style.transform = `rotate(${offsetMagnitude * sign}deg)`
	})
}

setTimeout(rotateLines, 2000)