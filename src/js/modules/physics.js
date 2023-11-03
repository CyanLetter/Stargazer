export { Physics };

class Physics {
	static boxIntersect(a, b) {
		return (
			a.x < b.x + b.width &&		// left edge of A is less than right edge of B
			a.x + a.width > b.x &&		// right edge of A is greater than left edge of B
			a.y < b.y + b.height &&		// top edge of A is less than bottom edge of B
			a.y + a.height > b.y 		// bottom edge of A is greater than top edge of B
		);
	}

	static r2d(r) {
		return r * (180/Math.PI);
	}
}