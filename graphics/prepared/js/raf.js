function line(ctx, x1, y1, x2, y2, color) {
	ctx.strokeStyle = color;
	ctx.beginPath();
	ctx.moveTo(x1, y1);
	ctx.lineTo(x2, y2);
	ctx.stroke();
}
function arrow(ctx, x1, y1, x2, y2, color) {
	line(ctx, x1, y1, x2, y2, color);
	var dx = x2 - x1;
	var dy = y2 - y1;
	var len = Math.sqrt(dx * dx + dy * dy);
	var perc = (len - 10) / len;
	var bx = x1 + perc * dx;
	var by = y1 + perc * dy;
	var ux = dx / len;
	var uy = dy / len;
	var ax = uy * 5;
	var ay = -ux * 5;
	ctx.fillStyle = color;
	ctx.beginPath();
	ctx.moveTo(bx + ax, by + ay);
	ctx.lineTo(x2, y2);
	ctx.lineTo(bx - ax, by - ay);
	ctx.lineTo(bx + ax, by + ay);
	ctx.fill();
}

function niceRect(ctx, x, y, w, h, text) {
	ctx.fillStyle = 'rgba(255,255,255,0.75)';
	ctx.fillRect(x, y, w, h);

	ctx.strokeStyle = 'rgba(0,0,0,1)';
	ctx.strokeRect(x, y, w, h);

	var tw = ctx.measureText(text).width;
	ctx.textBaseline = 'middle';
	ctx.fillStyle = 'rgba(0,0,0,1)';
	ctx.fillText(text, x + 0.5 * w - 0.5 * tw, y + 0.5 * h);
}

function redraw() {
	var canvas0 = document.querySelector('#canvas0');
	var w = canvas0.width;
	var h0 = canvas0.height;

	var ctx0 = canvas0.getContext('2d');
	ctx0.clearRect(0, 0, w, h0);

	var canvas1 = document.querySelector('#canvas1');
	if (canvas1.width != canvas0.width)
		canvas1.width = canvas0.width;
	var h = canvas1.height;
	var ctx = canvas1.getContext('2d');
	ctx.clearRect(0, 0, w, h);

	var px_per_ms = 60 / (1000 / 60);
	var cur_vsync = document.querySelector('#display-refresh').value;
	document.querySelector('#cur-display-refresh').textContent = cur_vsync;
	var vsync_width = (1000 / cur_vsync) * px_per_ms;

	var N = Math.ceil(w / vsync_width);
	var current_interval = document.querySelector('#interval').value;
	document.querySelector('#cur-interval').textContent = current_interval;

	var cur_interval_width = current_interval * px_per_ms;
	var M = Math.ceil(w / cur_interval_width);

	for (var i = 0; i < N; i++)
		line(ctx0, i * vsync_width, 0, i * vsync_width, h, 'rgba(0,0,255,1.0)');

	for (var i = 0; i < N; i++)
		line(ctx, i * vsync_width, 0, i * vsync_width, h, 'rgba(0,0,255,1.0)');

	ctx.stroke();
	ctx.fillStyle = 'rgba(0,0,0,1)';
	ctx.textBaseline = 'top';
	if (current_interval < 14)
		ctx.font = '10px sans-serif';
	else
		ctx.font = '16px sans-serif';

	for (var i = 0; i < M; i++) {
		var doneAt = (i + 1) * cur_interval_width - 4;
		var nearestVSync = Math.ceil(doneAt / vsync_width) * vsync_width;

		var nextDoneAt = (i + 2) * cur_interval_width - 4;
		var nextNearestVSync = Math.ceil(nextDoneAt / vsync_width) * vsync_width;

		var c;
		if (nearestVSync == nextNearestVSync)
			c = 'rgba(255, 0, 0, 0.75)';
		else
			c = 'rgba(0, 0, 0, 0.75)';

		if (current_interval < 10.5)
			suffix = ''
		else
			suffix = 'ms';
		niceRect(ctx, i * cur_interval_width, 10, cur_interval_width - 3, 30, current_interval + suffix);
		arrow(ctx, doneAt, 40, nearestVSync, 59, c);

		if (nearestVSync == nextNearestVSync) {
			ctx.lineWidth = 3;
			line(ctx, i * cur_interval_width, 15, i * cur_interval_width + cur_interval_width - 4, 45, 'rgba(255, 0, 0, 0.75)');
			line(ctx, i * cur_interval_width, 45, i * cur_interval_width + cur_interval_width - 4, 15, 'rgba(255, 0, 0, 0.75)');
			ctx.lineWidth = 1;
		}
	}
}

redraw();
document.querySelector('#display-refresh').addEventListener('change', redraw);
document.querySelector('#interval').addEventListener('change', redraw);
