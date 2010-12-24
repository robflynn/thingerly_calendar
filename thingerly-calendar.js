(function($) {

	// Class methods
	var methods = {
		'init' : function(params) {}
	};

	// Set up our plugin
	$.fn.thingerlyCalendar = function(params)
	{
		// Some Constants
		var now = new Date();
		
		// Default options
		var options = {
			'month' : now.getMonth(),
			'year' : now.getYear() + 1900
		};

		// Merge in the user params
		if (params)
		{
			$.extend(options, params);
		}

	};

})(jQuery);
