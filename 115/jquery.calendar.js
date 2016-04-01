/*
 * 预约日历JS插件[构造函数法]
 * intval@163.com >< Tony.zen
 */
function zCalendar(ele, cfg){

	var that = this;

	var Ele = $(ele);
	this.Table = Ele.find('table:first');
	this.Arrow = Ele.find('div:first');
	this.Hide = Ele.find('input:first');
	this.Show = Ele.find('p:first');

	// 默认配置
	this.cfg  = {
		txt : ['年', '月', '已预约时间：', '可预约', '不可预约'],
		cls : ['z-on', 'z-dis', 'z-at'],
		iw : true,		// 是否允许周末预约 注：只针对连续选择有效
		sp : 5,			// 设置不可预约天数 注：目前只支持1-5天
		fw : 0, 		// 星期的排列顺序 参数：[0:周日排前; 1:周一排前]
		num : 3,		// 选择总数量 注：数量为1时表示，选择非当前日期 可取消 当前已选择的日期；大于数值1时则无法达到此效果]
		tp : true,		// 时间类型 参数：[false:非连续时间(各个独立日期); true:连续的时间(某日到某日)]
		ls : [],		// 时间区间 格式：['20150901', '20151220', ...]
		mt : false,		// 加载时制定月份 参数：[false:系统当前年月份; 反之为指定年月(格式：['2015', '11'])]
		has : [],		// 已保存值 格式：['20151113', '20151229', '20151127'])
		err : false,	// 提示回调 默认false，自定义的格式：function(n){ .... }; 注: n为已存在个数
		jump : false,	// 非连续性(区间)时间空月是否显示，默认:false, 即不跳跃
		msg : '',		// 提示信息
		is67: true,
		max : 20301231	// 日历的最大时间值
	};

	// 先排序
	this.cfg.ls.sort();

	// 合并自定义的配置项
	for(var i in cfg) this.cfg[i] = cfg[i];

	// 生成唯一标识(防止多个日历时冲突)
	this.rand = (Math.random() - Math.random() + '').substr(3, 5);

	// 返回当前日期集
	this.thenD = (function(){

		/* 按今天日期 */ 
		// var D = new Date(), w = D.getDay(), m = D.getMonth() + 1, d = D.getDate();
		// if(w == 0) w = 7;
		// if(m < 10) m = '0'+ m;
		// if(d < 10) d = '0'+ d;
		// return [D.getFullYear(), m, d, w, D.valueOf()]; 

		/* 按今天日期 */
		// 获取起始时间
		var S = that.cfg.ls[0];
		if(S === undefined || S == ''){
			var tD = new Date(), m = tD.getMonth() + 1, d = tD.getDate();
			if(m < 10) m = '0'+ m;
			if(d < 10) d = '0'+ d;
			S = tD.getFullYear() + '' + m + '' + d;
		}

		var Y = S.slice(0, 4),
			M = S.slice(4, 6),
			D = S.slice(6, 8),
			W = new Date(Y + '/' + M + '/' + D).getDay(),
			V = new Date(parseInt(Y, 10), (parseInt(M, 10) - 1), parseInt(D, 10), 8, 30).getTime();

		if(W == 0) W = 7;

		return [Y, M, D, W, V];
	})();

	// 隐藏域赋值
	if(that.cfg.has.length > 0) that.Hide.val(that.cfg.has.join('||'));

	// 解析时间值(包括时间范围)
	this.parseRange = (function(){

		if(that.cfg.ls[0] === '' || that.cfg.ls[0] === undefined){
			that.cfg.mt = false;
			that.cfg.has = [];
			that.cfg.ls = false;
			that.note(that.cfg.msg);
			return false;
		}

		// 先排序
		that.cfg.ls.sort();

		// 连续时间
		if(that.cfg.tp){

			var _then = that.thenD[0] + '' + that.thenD[1] + '' + that.thenD[2],
				_start = that.cfg.ls[0],
				_end = that.cfg.ls[1],
				_tmp = {};

			if(_start <= _then) _start = _then;
			if(_end <= _then) _end = _then;

			// 设置最大的结束日期(防止循环过大)
			if(_end > that.cfg.max) _end = that.cfg.max + '';

			var i = _start.substr(0, 6), 
				n = _end.substr(0, 6),
				id = _start.substr(6), 
				nd = _end.substr(6);

			// 同一年
			if(i.substr(0,4) == n.substr(0,4)){
				i = Math.floor(i), n = Math.floor(n);
				for(; i <= n; i++){
					var a = _start.indexOf(i) === -1 ? 1 : id;
					var z = _end.indexOf(i) === -1 ? 'x' : nd;
					_tmp[i] = [a,z];
				}
			}else{
				var ary = that.parseMonth(i, n), z = 0, y = ary.length;
				for(; z < y; z++){
					_tmp[ary[z]] = [(z == 0 ? id : 1), (z == (y - 1) ? nd : 'x')];
				}
			}

		// 不连续时间
		}else{

			var _then = that.thenD[0] + '' + 
						(that.thenD[1] < 10 ? '0' + that.thenD[1] : that.thenD[1]) + '' + 
						(that.thenD[2] < 10 ? '0' + that.thenD[2] : that.thenD[2]),
				_list = that.cfg.ls, _tmp = {};

			var n = _list.length;
			if(n > 0){

				for(var i = 0; i < n; i++){
					if(_list[i] >= _then){
						var _k1 = _list[i].substr(0, 6), _k2 = _list[i].substr(6);
				        if(_tmp[_k1] === undefined) _tmp[_k1] = {};
				        _tmp[_k1][_k2] = Math.floor(_k2);
					}
				}
			}

			// 月份是否跳跃
			if(that.cfg.jump === false){

				var allMonth = that.parseMonth(_list[0], _list[n-1]);
				for(var ym in allMonth){
					if(_tmp[allMonth[ym]] === undefined) _tmp[allMonth[ym]] = {};
				}
			}
		}

		return _tmp;
	})();

	// 不可预约时间(前5天)
	this.disableRange = (function(){

		var d = that.thenD,
			d0 = d[0], d1 = parseInt(d[1], 10), d2 = parseInt(d[2], 10);
			d1 = d1 < 10 ? '0' + d1 : d1;
			d2 = d2 < 10 ? '0' + d2 : d2;

		// 计算五天情况
		var w = 0;
		if(that.cfg.iw === true){
			var step = that.cfg.sp, wd = that.thenD[3];
			if(step == 5){
				switch(true){
					case (wd < 6): w = 2; break;
					case (wd > 6): w = 3; break;
					default: w = 4;
				}
			}else if(step == 4){
				switch(true){
					case (wd < 2): w = 0; break;
					case (wd > 6): w = 1; break;
					default: w = 2;
				}
			}else if(step == 3){
				switch(true){
					case (wd < 3): w = 0; break;
					case (wd > 6): w = 1; break;
					default: w = 2;
				}
			}else if(step == 2){
				switch(true){
					case (wd < 4): w = 0; break;
					case (wd > 6): w = 1; break;
					default: w = 2;
				}
			}else if(step == 1){
				switch(true){

					case (wd < 5): w = 0; break;
					case (wd > 6): w = 1; break;
					default: w = 2;
				}
			}
		}

		var d7 = d[4] + (that.cfg.sp - 1 + w) * 24 * 60 * 60 * 1000;
		var D = new Date(d7);

		var nd = [D.getFullYear(), (D.getMonth() + 1), D.getDate()],
			nd0 = nd[0], nd1 = nd[1], nd2 = nd[2];;
			nd1 = nd1 < 10 ? '0' + nd1 : nd1;
			nd2 = nd2 < 10 ? '0' + nd2 : nd2;

		var tmp = [];
		
		if(d0 + '' + d1 == nd0 + '' + nd1){
			tmp[d0 + '' + d1] = [Math.floor(d2), Math.floor(nd2)];
		}else{
			tmp[d0 + '' + d1] = [Math.floor(d2), 'x'];
			tmp[nd0 + '' + nd1] = [1, Math.floor(nd2)];
		}

		return tmp;
	})();

	// 存储已选日期
	this.storage = '';
	this.dinfo = [];

	// 初始化
	var Y = this.thenD[0], M = this.thenD[1];
	if(this.cfg.mt !== false) Y = this.cfg.mt[0], M = this.cfg.mt[1];
	this.init(Y, M);

	// 日期选择点击事件 注：先解绑 再绑定
	this.Table.off('click', 'td.' + this.cfg.cls[0]).on('click', 'td.' + this.cfg.cls[0], function(){
		that.dayClick($(this), that);
		return false;
	});

	// 左右按钮点击事件
	this.Arrow.off('click', 'a.' + this.cfg.cls[0]).on('click', 'a.' + this.cfg.cls[0], function(){
		var _v = $(this).attr('data-v');
		if(_v) that.keepon(_v.substr(0, 4), _v.substr(4));
		return false;
	});
}

zCalendar.prototype = {

	// 日历初始化
	init : function(year, month){

		// 设置已选状态
		if(this.cfg.has.length > 0){
			var _list = this.cfg.has, _str = '';
			for(var i in _list){
				_str += '|'+ _list[i] +'|';
			}
			this.storage = _str;
			this.setAt(year, month);
		}

		this.keepon(year, month);
	},

	// 执行操作
	keepon : function(year, month){

		// 创建按钮
		this.arrow(year, month);

		// 创建表格
		this.Table.html(this.thead() + this.tbody(year, month));

		// 设置可用状态
		this.setOn(year, month);

		// 设置已选状态
		this.setAt(year, month);

		// 日期提示
		if(this.cfg.ls !== false) this.note();
	},

	// 日期的点击执行函数
	dayClick : function(_ob, that){

		var _v = _ob.attr('data-v');
		if(_ob.hasClass(that.cfg.cls[2])){
			_ob.removeClass(that.cfg.cls[2]);
			that.storage = that.storage.replace('|'+ _v +'|', '');
			that.note();
		}else{
			if(that.cfg.num === 1){
				that.Table.find('td').removeClass(that.cfg.cls[2]);
				_ob.addClass(that.cfg.cls[2]);
				that.storage = '|'+ _v +'|';
				that.note();
			}else{
				var _isEnough = that.isEnough();
				if(_isEnough === false){
					_ob.addClass(that.cfg.cls[2]);
					that.storage += '|'+ _v +'|';
					that.note();
				}else{
					if(that.cfg.err === false){
						console.log(_isEnough);
					}else{
						that.cfg.err.call(null, that.cfg.num)
					}
				}
			}
		}

		// 隐藏域赋值
		that.Hide.val(that.storage.replace(/(^\||\|$)/g, ''));
	},

	// 解析连续的月份
	parseMonth : function(st, ed){

		var a =  st.substr(0,4),
			b =  ed.substr(0,4),
			aa = st.substr(4,2),
			bb = ed.substr(4,2);

		var tmp = [], x = 0, y = b - a;
		
		for(; a <= b; a++){
			var i = 1, j = 12;
			if(x == 0) i = Math.floor(aa);
			if(x == y) j = Math.floor(bb);
			for(; i <= j; i++){
				tmp.push(a + '' + (i < 10 ? '0' + i : i));
			}
			x++;
		}

		return tmp;
	},

	// 数组化字符串
	arrDate : function(){
		var _tmp = [];
		if(this.storage.indexOf('||') !== -1){
			_tmp = this.storage.replace(/(^\||\|$)/g, '').split('||');
		}else if(this.storage.indexOf('|') !== -1){
			_tmp = this.storage.replace(/\|/g, '').split(/\s+/);
		}
		return _tmp;
	},

	// 判断数量是否足够
	isEnough : function(){
		if(this.storage){
			var _len = this.storage.match(/\|/g).length / 2;
			return _len > (this.cfg.num - 1) ? 'Limit reached !' : false;
		}else{
			return false;
		}
	},

	// 设置可以点击的日期
	setOn : function(year, month){

		var arr = this.parseRange[year+''+month];
		if(arr === undefined) return false;

		if(this.cfg.tp){

			// 调用赋值
			var d = this.dinfo;

			if(arr[1] === 'x') arr[1] = d[1];

			this.Table.find('td').removeClass(this.cfg.cls[0]);

			var i = Math.floor(arr[0]), n = Math.floor(arr[1]), tmp = [];

			// 屏蔽周末预约
			if(this.cfg.iw){

				var k = 1;
				if(d[0] < 0){
					k = Math.abs(d[0]) + 1;
				}else if(d[0] > 0){
					k = d[0] - 1;
				}
				if(this.cfg.fw !== 0) k += 1;

				if(i !== 1) k = k + (i % 7) - 1;
				
				for(; i<=n; i++){
					if(k % 7 != 0 && k % 7 != 6) tmp.push('#j-'+ this.rand +'-' + i);
					k++;
				}

			}else{

				for(; i<=n; i++){
					tmp.push('#j-'+ this.rand +'-' + i);
				}
			}
				
		}else{

			var tmp = [];
			for(var k in arr){
				tmp.push('#j-'+ this.rand +'-' + arr[k]);
			}
		}
		
		$(tmp.join()).addClass(this.cfg.cls[0]).append($('<i>'+ this.cfg.txt[3] +'</i>'));

		if(this.cfg.tp){

			// 设置不可预约(前五天)
			var _dis = this.disableRange[year+''+month];
			if(_dis !== undefined){
				var ii = _dis[0], nn = _dis[1], lst = [];
				if(nn === 'x') nn = arr[1];
				for(; ii<=nn; ii++) lst.push('#j-'+ this.rand +'-' + ii);
			}

			var _zdis = this.cfg.cls[0], _k = this.cfg.txt[3], _bk = this.cfg.txt[4], _f1 = false;
			if(lst !== undefined){
				$(lst.join()).filter(function(){ return $(this).hasClass(_zdis); }).removeClass(this.cfg.cls[0]).each(function(){
					var _html = $(this).html().replace(_k, _bk);
					$(this).html(_html)
				});
			}else{
				_f1 = true;
			}

			//设置周末可约
			if(this.cfg.is67){
				var _ii = $('td.z-on:first');
				if(_ii.length > 0){
					var _xx = 1, tmp = [];
					if(_f1 === false) _xx = parseInt(_ii.attr('data-v').substring(6), 10), tmp = [];
					if(arr[1] === 'x') arr[1] = d[1];
					for(; _xx <= arr[1]; _xx++){
						var _id = '#j-'+ this.rand +'-' + _xx;
						if(!$(_id).hasClass('z-on')) tmp.push(_id);
					}
					$(tmp.join()).addClass(this.cfg.cls[0]).append($('<i>'+ this.cfg.txt[3] +'</i>'));
				}
			}
		}
	},

	// 设置选中的日期
	setAt : function(year, month){

		var _tmp = this.arrDate(), days = [];
		if(_tmp.length > 0){
			
			for(var i in _tmp){
				if(_tmp[i].substr(0, 6) === year+''+month) days.push('#j-'+ this.rand +'-' + Math.floor(_tmp[i].substr(6)));
			}
			if(days.length > 0) $(days.join()).addClass('z-at');
		}
	},

	// 根据当前月份和已经存在的月份 返回其前后兄弟月份
	arrSiblings : function(v, json){

		if(json[v] === undefined) json[v] = {};

		var tmp = [], ret = ['',''];
		var i = 0, n = 1;
		for(var k in json){
			tmp.push(k);
			if(k == v) i = n;
			n++;
		}

		if(i > 1) ret[0] = tmp[i-2];
		if(tmp[i] !== undefined) ret[1] = tmp[i];

		return ret;
	},

	// 创建左右月份箭头(按钮)
	arrow : function(year, month){

		var _hasSib = this.arrSiblings( year+''+month, this.parseRange);

		var _span = '<span>'+ year + this.cfg.txt[0] + ' ' + parseInt(month, 10) + this.cfg.txt[1] +'</span>',
			_arLft = '<a href="javascript:void(0);" class="lft">&nbsp;</a>',
			_arRgt = '<a href="javascript:void(0);" class="rgt">&nbsp;</a>';

		if(_hasSib[0] != '') _arLft = '<a href="javascript:void(0);" class="lft z-on" data-v="'+ _hasSib[0] +'">'+ parseInt(_hasSib[0].substr(4), 10) +'月</a>';

		if(_hasSib[1] != '') _arRgt = '<a href="javascript:void(0);" class="rgt z-on" data-v="'+ _hasSib[1] +'">'+ parseInt(_hasSib[1].substr(4), 10) +'月</a>';
			
		this.Arrow.html(_arLft + _span + _arRgt);
	},

	// 创建日历的表头(星期值)
	thead : function(){

		var _list = ['日', '一', '二', '三', '四', '五', '六'], _tmp = [];
		if(this.cfg.fw !== 0){
			var f = _list.shift();
			_list.push(f);
		}
		for(var i in _list){
			var _sp = (_list[i] == '日' || _list[i] == '六') ? ' class="z-sp"' : '';
			_tmp[i] = '<td'+ _sp +'>'+ _list[i] +'</td>';
		}
		return '<thead><tr>'+ _tmp.join('') +'</tr></thead>';
	},

	// 创建日历的内容(日期值)
	tbody : function(year, month){

		var _arr = this._compute(year, month), _day = '', e = 1;

		// 赋值, setOn调用
		this.dinfo = _arr;
		
		for(var x = _arr[0]; x <= _arr[2]; x++){

			var _id = '', _txt = '&nbsp;', _val = '';
			if(x > 0 && x <= _arr[1]){
				_txt = x;
				_id = ' id="j-'+ this.rand +'-'+ x +'"';
				_val = ' data-v="'+ year + month + (x < 10 ? '0' + x : x) +'"';
			}

			_day += '<td'+ _id + _val +'>'+ _txt +'</td>';
			if(e % 7 == 0) _day += '</tr><tr>';
			e++;
		}
		return '<tbody><tr>' + _day + '</tr></tbody>';
	},

	// 创建日历的文字提示
	note : function(msg){

		if(msg === undefined){

			var _tmp = this.arrDate(), str = [];
			if(_tmp.length > 0){
				for(var i in _tmp){
					var v = _tmp[i];
					str.push(v.substr(0, 4) + '年' + v.substr(4, 2) + '月' + v.substr(6) + '日');
				}
			}

			var _html = str.length === 0 ? '' : this.cfg.txt[2] + '<span>'+ str.join('<br />') +'</span>';

		}else{
			
			var _html = '<span>'+ msg +'</span>';
			
		}
		
		this.Show.html(_html);
	},

	// 计算日期循环需要的数组
	_compute : function(_y, _m){

		var d = new Date(_y, _m, 0), x = d.getDate(), w, fx = [];

		d.setDate(1);
		w = d.getDay();

		if(this.cfg.fw === 0){
			fx[0] = 0 - (w - 1);
			fx[1] = (w == 0 ? x : (Math.abs(fx[0]) + 1 + x)) % 7;
		}else{
			if(w == 0) w = 7;
			fx[0] = 0 - (w - 2);
			fx[1] = (w == 1 ? x : Math.abs(fx[0]) + 1 + x) % 7;
		}
		if(fx[1] != 0) fx[1] = 7 - fx[1];

		return [fx[0], x, (x + fx[1])];
	}
};