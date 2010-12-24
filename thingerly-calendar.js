(function($) {
	// Class methods
	
	// TODO: i18n
  var months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 
                'August', 'September', 'October', 'November', 'December'];


  // TODO: Maybe make these changable later
  var days_of_week = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa']
  
	var days_in_month = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];

	var methods = {
		'init' : function(params) {

			return this.each(function()
			{
				$this = $(this);

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

				data = $this.data('thingerlyCalendar');

				// If this is our first run on the element, set up some things
				if (!data)
				{
					var calendar = $('<div />');
					calendar.addClass('tc-wrapper');

					renderSkeleton(calendar);

					$this.append(calendar);

					$(this).data('thingerlyCalendar', {
						'target' : $this,
						'calendar' : calendar,
						'view' : 'days',
						'options' : options,
						'now' : now
					});

					cdate = new Date(options.year, options.month, 1);
					var view = getView($this, 'days', cdate);
					jQuery('.tc-body', $this).replaceWith(view);
				}
			});
		}
	};

	function getView(cal, type, d)
	{
		view = $('<div />');
		view.addClass("tc-body");

		switch (type)
		{
			case 'days': {
				return renderDayView(cal, view, d);
			}
			default: {
				return renderDayView(cal, view, d);
			}
		}
	}

	function setCalendarTitle(cal, s)
	{
		jQuery('.tc-header-t', cal).html(s);
	}

	function renderDayView(cal, view, d)
	{
		// Render the month header, this consists of listing days of the week
		v_head = $('<div />');
		v_head.addClass("tc-month-h tc-row-sm tc-cf");

		for (i = 0; i < days_of_week.length; i++)
		{
			dayDiv = $('<div />');
			dayDiv.addClass("tc-cell tc-sub-h");
			dayDiv.html(days_of_week[i]);
			v_head.append(dayDiv);
		}

		view.append(v_head);

		// Now we need to figure out how many days are in the month
		// we are viewing, as well as how many were in last month.
		// (We need last month's since we need to populate empty spaces
		// on the calendar)
		month = d.getMonth();
		year = d.getYear() + 1900;

		// When did this month begin?
		first_date = new Date(year, month, 1);
		first_day = first_date.getDay();
		var num_days = getNumDays(month, year);

		// ANd now for the previous month
		prev_month = month == 0 ? 11 : month - 1;
		prev_year = prev_month == 11 ? year - 1 : year;
		prev_num_days = getNumDays(prev_month, prev_year);

		// Set up some counters
		var day_counter = 0, last_month_days = 0, next_month_days = 0;

		// We will always use 6 week calendars. This will handle any number of weeks
		// in a month and will keep the calendars from being different sizes.
		for (week = 0; week < 6; week++)
		{
			weekDiv = $("<div />");
			weekDiv.addClass("tc-week tc-row-sm tc-cf");

			if (week % 2 == 0)
			{
				weekDiv.addClass("tc-even");
			}
			else
			{
				weekDiv.addClass("tc-odd");
			}

			// Draw each day
			for (i = 0; i < 7; i++)
			{
				dayDiv = $("<div />");
				dayDiv.addClass("tc-cell tc-day");

				dayText = day_counter - last_month_days + 1;

				if (day_counter < first_day)
				{
					// The month hasn't begun yet, show last month
					dayDiv.addClass("tc-grey");
					dayText = prev_num_days - first_day + day_counter + 1;
					last_month_days++;
				}
				else if (dayText > num_days)
				{
					// We're out of the current month and into the next
					dayDiv.addClass("tc-grey");
					dayText = ++next_month_days;
				}

				dayDiv.html(dayText);
				weekDiv.append(dayDiv);

				// increment our day counter
				day_counter++;
			}

			// Append the week 
			view.append(weekDiv);
		}


		setCalendarTitle(cal, months[d.getMonth()]);

		return view;
	}

	function renderSkeleton(el)
	{
		// Calendar Header
		header = $('<div />');
		header.addClass("tc-header tc-row-sm tc-cf");

		leftButton = $('<div />', {
			'html' : '&laquo;'
		});
		leftButton.addClass("tc-header-l");

		middleButton = $('<div />');
		middleButton.addClass("tc-header-t");

		rightButton = $('<div />', {
			'html' : '&raquo;'
		});
		rightButton.addClass("tc-header-r");

		// Append buttons to header
		header.append(leftButton);
		header.append(middleButton);
		header.append(rightButton);

		body = $('<div />');
		body.addClass("tc-body tc-cf");


		// Append Header and Body to the wrapper
		el.append(header);
		el.append(body);
	}

	function getNumDays(month, year)
	{
		if ((month == 1) && (year % 4 == 0) && ((year % 100 != 0) || (year % 400 == 0)))
		{
			return 29;
		}

		return days_in_month[month];
	}

	// Set up our plugin
	$.fn.thingerlyCalendar = function(method)
	{
		if (methods[method])
		{
			return methods[method].apply(this, Array.prototype.slice.call(arguments, 1));
		}
		else if (typeof method === 'object' || !method)
		{
			return methods.init.apply(this, arguments);
		}
		else
		{
			$.error('Method ' + method + ' does not exist for thingerlyCalendar');
		}
	};

})(jQuery);
