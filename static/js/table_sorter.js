var temp_tdize_function = function(str){
	return '<td><div>' + str + '</div></td>';
}

var table_sorter = {
	sort : function(table, columnToSort){
		mute = [];
		var tables = [];
		table.children('tbody').find('tr').each(function(rowIndex, r){
			cols = [];
	//		console.log(r);
			$(r).children('td').each(function (colIndex, c) {
            	cols.push(c.textContent);
        	});
        	var temp = {
        		col:cols,
        		id :$(r).attr('id')
        	};
        	tables.push(temp);
        	mute.push(temp.id);
		});
		tables.sort(function(a,b){
			if (a.col[columnToSort] === b.col[columnToSort]) {
		        return 0;
		    }
		    else {
		        return (a.col[columnToSort] < b.col[columnToSort]) ? -1 : 1;
		    }
		});
		$(table.children('tbody')[0]).empty();
		for(var i = 0; i < tables.length; i++){
			var row = '<tr id="' + tables[i].id +'"">';
			for(var j = 0; j < tables[i].col.length; j++){
				row += temp_tdize_function(tables[i].col[j]);
			}
			row += '</tr>'
			$(table.children('tbody')[0]).append(row); 
		}
		return mute;	
	}
}