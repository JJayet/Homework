var Tools = function() { 
	this.getFormattedDate = function(dateToFormat) {
		var date = new Date(dateToFormat);
        var yyyy = date.getFullYear().toString();                                    
        var mm = (date.getMonth() + 1).toString();
        var dd  = date.getDate().toString();             
        return (dd[1]?dd:"0"+dd[0]) + '-' + (mm[1]?mm:"0"+mm[0]) + '-' + yyyy;
	}
}