var tetris = {
	
	colors: ['#eaeaea','#ff6600','#eec900','#0000ff',
		'#cc00ff','#00ff00','#66ccff','#ff0000'],
	
	startAt: [0, -1, -1, -1, 0, -1, -1, 0],
	
	points: [0, 40, 100, 300, 1200],
	
	shapes: [
		[],

		[[[0,0,0,0],[1,1,1,1],[0,0,0,0],[0,0,0,0]],
		 [[0,1,0,0],[0,1,0,0],[0,1,0,0],[0,1,0,0]]],

		[[[0,0,0,0],[1,1,1,0],[0,1,0,0],[0,0,0,0]],
		 [[0,1,0,0],[1,1,0,0],[0,1,0,0],[0,0,0,0]],
		 [[0,1,0,0],[1,1,1,0],[0,0,0,0],[0,0,0,0]],
		 [[0,1,0,0],[0,1,1,0],[0,1,0,0],[0,0,0,0]]],

		[[[0,0,0,0],[1,1,1,0],[1,0,0,0],[0,0,0,0]],
		 [[1,1,0,0],[0,1,0,0],[0,1,0,0],[0,0,0,0]],
		 [[0,0,1,0],[1,1,1,0],[0,0,0,0],[0,0,0,0]],
		 [[0,1,0,0],[0,1,0,0],[0,1,1,0],[0,0,0,0]]],

		[[[1,0,0,0],[1,1,1,0],[0,0,0,0],[0,0,0,0]],
		 [[0,1,1,0],[0,1,0,0],[0,1,0,0],[0,0,0,0]],
		 [[0,0,0,0],[1,1,1,0],[0,0,1,0],[0,0,0,0]],
		 [[0,1,0,0],[0,1,0,0],[1,1,0,0],[0,0,0,0]]],

		[[[0,0,0,0],[1,1,0,0],[0,1,1,0],[0,0,0,0]],
		 [[0,0,1,0],[0,1,1,0],[0,1,0,0],[0,0,0,0]]],

		[[[0,0,0,0],[0,1,1,0],[1,1,0,0],[0,0,0,0]],
		 [[0,1,0,0],[0,1,1,0],[0,0,1,0],[0,0,0,0]]],
		
		[[[0,1,1,0],[0,1,1,0],[0,0,0,0],[0,0,0,0]]]],

	
	init: function() {
		var i, j, k;
		tetris.cells = [];
		for (i = -3; i < 18; ++i) {
			tetris.cells[i] = [];
			for (j = 1; j < 11; ++j) {
				k = String.fromCharCode(i + 97);
				tetris.cells[i][j] = $(['#', k, j].join(''));
			}
		}
		tetris.bound = $.browser == 'msie' ? '#tetris' : window;
	},

	
	start: function() {
		
		tetris.level = 0;
		tetris.lines = 0;
		tetris.score = 0;
		
		tetris.grid = [
			[1,0,0,0,0,0,0,0,0,0,0,1],[1,0,0,0,0,0,0,0,0,0,0,1],
			[1,0,0,0,0,0,0,0,0,0,0,1],[1,0,0,0,0,0,0,0,0,0,0,1],
			[1,0,0,0,0,0,0,0,0,0,0,1],[1,0,0,0,0,0,0,0,0,0,0,1],
			[1,0,0,0,0,0,0,0,0,0,0,1],[1,0,0,0,0,0,0,0,0,0,0,1],
			[1,0,0,0,0,0,0,0,0,0,0,1],[1,0,0,0,0,0,0,0,0,0,0,1],
			[1,0,0,0,0,0,0,0,0,0,0,1],[1,0,0,0,0,0,0,0,0,0,0,1],
			[1,0,0,0,0,0,0,0,0,0,0,1],[1,0,0,0,0,0,0,0,0,0,0,1],
			[1,0,0,0,0,0,0,0,0,0,0,1],[1,0,0,0,0,0,0,0,0,0,0,1],
			[1,0,0,0,0,0,0,0,0,0,0,1],[1,0,0,0,0,0,0,0,0,0,0,1],
			[1,1,1,1,1,1,1,1,1,1,1,1]];
		$('#grid td').css('backgroundColor', tetris.colors[0]);
		$('#start').unclick(tetris.start).val('pause').click(tetris.pause);
		$('#stop').set('disabled', false);
		tetris.navKey();
		tetris.next = tetris.newShape();
		tetris.shift();
		tetris.duration = 600;
		tetris.refresh();
		tetris.timer = window.setInterval(tetris.moveDown, tetris.duration);
	},

	
	navKey: function() {
		$('.btn-left').click(tetris.moveLeft);
		$('.btn-right').click(tetris.moveRight);
		$('.btn-down').click(tetris.moveDown);
		$('.btn-rotate').click(tetris.rotate);
	},

	
	newShape: function() {
		var r = 1 + Math.random() * 7;
		return parseInt(r > 7 ? 7 : r, 10);
	},

	
	setNext: function() {
		var i, j, s, c, d, n = tetris.colors[0];
		tetris.next = tetris.newShape();
		s = tetris.shapes[tetris.next][0];
		c = tetris.colors[tetris.next];
		for (i = 0; i < 4; ++i) {
			for (j = 0; j < 4; ++j) {
				d = s[i][j] ? c : n;
				$(['#x', j, i].join('')).css('backgroundColor', d);
			}
		}
	},

	
	shift: function() {
		tetris.cur = tetris.next;
		tetris.x = tetris.x0 = 4;
		tetris.y = tetris.startAt[tetris.cur];
		tetris.y0 = tetris.y - 2;
		tetris.r = tetris.r0 = 0;
		tetris.curShape = tetris.shapes[tetris.cur];
		if (tetris.canGo(0, tetris.x, tetris.y)) {
			tetris.setNext();
			return true;
		}
		return false;
	},

	
	pause: function() {
		$(tetris.bound).unkeypress(tetris.key);
		window.clearInterval(tetris.timer);
		tetris.timer = null;
		$('#start').unclick(tetris.pause).val('resume').click(tetris.resume);
	},

	
	resume: function() {
		$(tetris.bound).keypress(tetris.key);
		tetris.timer = window.setInterval(tetris.moveDown, tetris.duration);
		$('#start').unclick(tetris.resume).val('pause').click(tetris.pause);
	},

	
	gameOver: function() {
		var i, j;
		
		if (tetris.timer) {
			$(tetris.bound).unkeypress(tetris.key);
			window.clearInterval(tetris.timer);
			tetris.timer = null;
			$('#start').unclick(tetris.pause).val('start').click(tetris.start);
		} else {
			$('#start').unclick(tetris.resume).val('start').click(tetris.start);
		}
		$('#stop').set('disabled', true);
		
		for (i = 0; i < 18; ++i) {
			for (j = 1; j < 11; ++j) {
				if (tetris.grid[i][j]) {
					tetris.cells[i][j].css('backgroundColor', '#cccccc');
				}
			}
		}
		tetris.draw(tetris.r0, tetris.x0, tetris.y0, '#cccccc');
	},

	
	canGo: function(r, x, y) {
		var i, j;
		for (i = 0; i < 4; ++i) {
			for (j = 0; j < 4; ++j) {
				if (tetris.curShape[r][j][i] && tetris.grid[y + j] &&
						tetris.grid[y + j][x + i]) {
					return false;
				}
			}
		}
		return true;
	},

	
	moveLeft: function() {
		if (tetris.canGo(tetris.r, tetris.x - 1, tetris.y)) {
			--tetris.x;
			tetris.refresh();
		}
	},

	
	moveRight: function() {
		if (tetris.canGo(tetris.r, tetris.x + 1, tetris.y)) {
			++tetris.x;
			tetris.refresh();
		}
	},

	
	rotate: function() {
		var r = tetris.r == tetris.curShape.length - 1 ? 0 : tetris.r + 1;
		if (tetris.canGo(r, tetris.x, tetris.y)) {
			tetris.r0 = tetris.r;
			tetris.r = r;
			tetris.refresh();
		}
	},

	
	moveDown: function() {
		if (tetris.canGo(tetris.r, tetris.x, tetris.y + 1)) {
			++tetris.y;
			tetris.refresh();
		} else {
			tetris.touchDown();
		}
	},

	
	touchDown: function() {
		var i, j, k, r, f;
		
		for (i = 0; i < 4; ++i) {
			for (j = 0; j < 4; ++j) {
				if (tetris.curShape[tetris.r][j][i] &&
						tetris.grid[tetris.y + j]) {
					tetris.grid[tetris.y + j][tetris.x + i] = tetris.cur;
				}
			}
		}
		
		f = 0;
		for (i = 17, k = 17; i > -1 && f < 4; --i, --k) {
			if (tetris.grid[i].join('').indexOf('0') == -1) {
				
				for (j = 1; j < 11; ++j) {
					tetris.cells[k][j].css('backgroundColor', '#cccccc');
				}
				++f;
				for (j = i; j > 0; --j) {
					tetris.grid[j] = tetris.grid[j - 1].concat();
				}
				++i;
			}
		}
		
		if (f) {
			window.clearInterval(tetris.timer);
			tetris.timer = window.setTimeout(function(){tetris.after(f);}, 100);
		}
		
		if (tetris.shift()) {
			tetris.refresh();
		} else {
			tetris.gameOver();
		}
	},

	
	after: function(f) {
		var i, j, l = (tetris.level < 20 ? tetris.level : 20) * 25;
		
		tetris.lines += f;
		if (tetris.lines % 10 === 0) {
			tetris.level = tetris.lines / 10;
		}
		window.clearTimeout(tetris.timer);
		tetris.timer = window.setInterval(tetris.moveDown, tetris.duration - l);
		tetris.score += (tetris.level + 1) * tetris.points[f];
		
		for (i = 0; i < 18; ++i) {
			for (j = 1; j < 11; ++j) {
				tetris.cells[i][j].css('backgroundColor',
					tetris.colors[tetris.grid[i][j]]);
			}
		}
		tetris.refresh();
	},

	
	draw: function(r, x, y, c) {
		var i, j;
		for (i = 0; i < 4; ++i) {
			for (j = 0; j < 4; ++j) {
				if (tetris.curShape[r][j][i]) {
					tetris.cells[y + j][x + i].css('backgroundColor', c);
				}
			}
		}
	},

	
	refresh: function() {
		
		tetris.draw(tetris.r0, tetris.x0, tetris.y0, tetris.colors[0]);
		
		tetris.draw(tetris.r, tetris.x, tetris.y, tetris.colors[tetris.cur]);
		
		$('#level').html(tetris.level + 1);
		$('#lines').html(tetris.lines);
		$('#score').html(tetris.score);
		
		tetris.x0 = tetris.x;
		tetris.y0 = tetris.y;
		tetris.r0 = tetris.r;
	}

};


$(window).load(function() {
	tetris.init();
	$('#grid table, #next table').css('backgroundColor', tetris.colors[0]);
	$('#start').click(tetris.start);
	$('#stop').click(tetris.gameOver);
});
