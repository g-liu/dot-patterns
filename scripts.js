var patternDrawer = (function() {
	var getRandom = function(width, height) {
		var id = new ImageData(width, height);
		var d = id.data;

		for (var i = 0; i < d.length; i += 4) {
			var rand = Math.random();
			if (rand < 0.8) {
				d[i + 0] = 255;
				d[i + 1] = 255;
				d[i + 2] = 255;
				d[i + 3] = 0;
			} else {
				d[i + 0] = 0;
				d[i + 1] = 0;
				d[i + 2] = 0;
				d[i + 3] = 255;
			}
		}

		return id;
	};

	var getGrid = function(width, height) {
		var id = new ImageData(width, height);
		var d = id.data;

		for (var i = 0; i < height; i++) {
			for (var j = 0; j < width; j++) {
				if ((~~(i/4) + ~~(j/4)) % 2 === 1) {
					d[4 * i * width + 4 * j + 0] = 255;
					d[4 * i * width + 4 * j + 1] = 255;
					d[4 * i * width + 4 * j + 2] = 255;
					d[4 * i * width + 4 * j + 3] = 0;
				} else {
					d[4 * i * width + 4 * j + 0] = 0;
					d[4 * i * width + 4 * j + 1] = 0;
					d[4 * i * width + 4 * j + 2] = 0;
					d[4 * i * width + 4 * j + 3] = 255;
				}
			}
		}

		return id;
	};

	var getTriangularGrid = function(width, height) {
		var canvas = document.createElement('canvas');
		canvas.width = width;
		canvas.height = height;
		var ctx = canvas.getContext('2d');

		// size of the side of a triangle
		var TRIANGLE_SIZE = 10;

		// automatically computed
		var TRIANGLE_VERT_HEIGHT = Math.sqrt((TRIANGLE_SIZE * TRIANGLE_SIZE) - ((TRIANGLE_SIZE / 2) * (TRIANGLE_SIZE / 2)));

		// draw triangle pattern
		ctx.fillStyle = "#000";

		for (var i = 0, rowCounter = 0; i < height; i += TRIANGLE_VERT_HEIGHT, rowCounter++) {
			var horizontalOffset = rowCounter % 2 === 1 ? TRIANGLE_SIZE / 2 : 0;
			for (var j = -TRIANGLE_SIZE; j < width; j += TRIANGLE_SIZE) {
				ctx.beginPath();
				ctx.moveTo(horizontalOffset + j, i + TRIANGLE_VERT_HEIGHT);
				ctx.lineTo(horizontalOffset + j + TRIANGLE_SIZE / 2, i);
				ctx.lineTo(horizontalOffset + j + TRIANGLE_SIZE, i + TRIANGLE_VERT_HEIGHT);
				ctx.closePath();
				ctx.fill();
			}
		}

		return ctx.getImageData(0, 0, width, height);
	};

	var nameToPatternMap = {
		'random': getRandom,
		'grid-dots': getGrid,
		'grid-triangles': getTriangularGrid
	};

	var getPatternByName = function(name, width, height) {
		var fnToCall = nameToPatternMap[name];
		if (!fnToCall) return null;
		return fnToCall(width, height);
	};

	return {
		getPatternByName: getPatternByName
	};
})();

var transformations = (function () {
	setTransformation = function(canvasId, transformStack) {
		var canvas = $('#' + canvasId);
		var transformString = buildTransformString(transformStack);

		canvas.css({
			'transform': transformString
		});
	};

	buildTransformString = function(transformStack) {
		return "translateX(" + transformStack.x +
			"px) translateY(" + transformStack.y + "px) rotate(" +
			transformStack.rotate + "deg)";
	};

	populateCanvas = function(patternName) {
		var canvas = $("#dots").get(0);
		var ctx = canvas.getContext("2d");

		// clear canvas for redraw
		ctx.clearRect(0, 0, canvas.width, canvas.height);

		var CWIDTH = canvas.width;
		var CHEIGHT = canvas.height;
		
		var imageData = patternDrawer.getPatternByName(patternName, CWIDTH, CHEIGHT);

		if (imageData instanceof ImageData) {
			ctx.putImageData(imageData, 0, 0);

			// copy canvas data
			var canvasTransform = $("#dots-transform").get(0);
			var ctxTransform = canvasTransform.getContext("2d");

			ctxTransform.putImageData(imageData, 0, 0);
		} else {
			console.log("not a valid pattern type");
		}
	};

	return {
		populateCanvas: populateCanvas,
		setTransformation: setTransformation
	};
})();

$(function() {
	var transformStack = {
		x: 0,
		y: 0,
		rotate: 0
	};
	var INITIAL_TRANSFORM_STACK = jQuery.extend(true, {}, transformStack);

	transformations.populateCanvas($('#pattern').val());

	$('#pattern').bind('input', function(evt) {
		transformations.populateCanvas($('#pattern').val());
	});

	$('#controls input[type=range]').bind('input', function(evt) {
		var type = $(this).attr('name');
		if (type == 'x-transform') {
			transformStack.x = $(this).val();
		} else if (type == 'y-transform') {
			transformStack.y = $(this).val();
		}
		else {
			transformStack.rotate = $(this).val();
		}

		transformations.setTransformation('dots-transform', transformStack);
	});

	$('#controls form').on('reset', function(evt) {
		setTimeout(function() {
			transformStack = jQuery.extend(true, {}, INITIAL_TRANSFORM_STACK);
			transformations.setTransformation('dots-transform', transformStack);
		});
	});
});

