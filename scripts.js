$(function() {
	var transformStack = {
		x: 0,
		y: 0,
		rotate: 0
	};
	var INITIAL_TRANSFORM_STACK = jQuery.extend(true, {}, transformStack);

	populateCanvas();

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

		setTransformation('dots-transform');
	});

	$('#controls form').on('reset', function(evt) {
		setTimeout(function() {
			transformStack = jQuery.extend(true, {}, INITIAL_TRANSFORM_STACK);
			setTransformation('dots-transform');
		});
	});

	function setTransformation(canvasId) {
		var canvas = $('#' + canvasId);
		var transformString = buildTransformString();

		canvas.css({
			'transform': transformString
		});
	}

	function buildTransformString() {
		return "translateX(" + transformStack.x +
			"px) translateY(" + transformStack.y + "px) rotate(" +
			transformStack.rotate + "deg)";
	}

	function populateCanvas() {
		var canvas = $("#dots").get(0);
		var ctx = canvas.getContext("2d");

		var CWIDTH = canvas.width;
		var CHEIGHT = canvas.height;

		var id = ctx.createImageData(CWIDTH, CHEIGHT);
		var d = id.data;

		for (var i = 0; i < d.length; i += 4) {
			var rand = Math.random();
			if (rand < 0.8) {
				d[i + 0] = 255;
				d[i + 1] = 255;
				d[i + 2] = 255;
				d[i + 3] = 0;
			}
			else {
				d[i + 0] = 0;
				d[i + 1] = 0;
				d[i + 2] = 0;
				d[i + 3] = 255;
			}
		}

		ctx.putImageData(id, 0, 0);

		// copy canvas data
		var canvasTransform = $("#dots-transform").get(0);
		var ctxTransform = canvasTransform.getContext("2d");

		ctxTransform.putImageData(id, 0, 0);
	}
});

