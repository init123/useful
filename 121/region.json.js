var obRegion = {

	createOptions: function(n, json, chr){
		
		var _html = '';
	    var _prov = obRegion.area;

	    chr = chr || 'li';
	    
	    var _ext = '';
	    for(var x = 0; x < n; x++){
	        _ext += '<'+ chr +' data-id="0">&nbsp;</'+ chr +'>';
	    }

	    var x = 0;
	    for(var i in json){
	        _html += '<'+ chr +' data-id="'+ i +'" data-index="'+ x +'" class="j-region-li">'+ json[i] +'</'+ chr +'>';
	        x++;
	    }
	    return _ext + _html + _ext;
	},
	
	retSubDataById: function(id){

		id += '';

		var _len = id.length, _data = {};
		if(_len == 2){
			_data = this.city;
		}else if(_len == 4){
			_data = this.area;
		}

		if(_data[id]) return _data[id];

		return false;
	},

	retFirst: function(json){
		var i = 0, k;
		for(k in json){
			if(i == 0) return [k, json[k]];
		}
	},
	
	retIndex: function(id){
		
		id += '';
		var _data = {}, _len = id.length;
		if(_len == 2){
			_data = this.prov;
		}else if(_len == 4){
			_data = this.city;
			_data = _data[id.substr(0, 2)];
		}else if(_len == 6){
			_data = this.area;
			_data = _data[id.substr(0, 4)];
		}

		var i = 0, k;
		for(k in _data){
			if(k == id) break;
			i++;
		}

		return i;
	}
};