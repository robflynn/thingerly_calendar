/*
Copyright (C) 2010 by Thingerly, Rob Flynn <rob@thingerly.com>

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.
*/

(function($) {
  // Class methods
  
  // TODO: i18n
 var months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 
               'August', 'September', 'October', 'November', 'December'];

	var months_abbr = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
  
  // TODO: Maybe make these changable later
  var days_of_week = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa']
  
	var days_in_month = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];

	var methods = {
		'init' : function(params) {

			return this.each(function()
			{
				var $this = $(this);

				// Some Constants
				var now = new Date();
		
				// Default options
				var options = {
					'month' : now.getMonth(),
					'year' : now.getFullYear(),
					'transition' : 'slide',
					'viewTransition' : 'zoom',
					'speed' : 300,
					'dayClick' : null,
					'eventClick' : null,
					'events' : []
				};

				// Merge in the user params
				if (params)
				{
					$.extend(options, params);
				}

				var data = $this.data('thingerlyCalendar');

				// If this is our first run on the element, set up some things
				if (!data)
				{
					var calendar = $('<div />');
					calendar.addClass('tc-wrapper');

					var outer = $('<div />');
					outer.addClass("tc-calendar");

					outer.append(calendar);

					renderSkeleton(calendar);

          $this.append(outer);

          var parsedEvents = [];
          for (i = 0; i < options.events.length; i++)
          {
              var evt = options.events[i];

              var evtdate = new Date(Date.parse(evt));
              parsedEvents[parsedEvents.length] = evtdate;
          }

					$(this).data('thingerlyCalendar', {
						'target' : $this,
						'calendar' : calendar,
						'view' : 'days',
						'options' : options,
						'now' : now,
						'events' : parsedEvents
					});

					cdate = new Date(options.year, options.month, 1);
					var view = getView($this, 'days', cdate);
					jQuery('.tc-body', $this).replaceWith(view);

					// Bind our buttons
					jQuery(".tc-header-l", this).bind('click.thingerlyCalendar', function() {
						var data = $this.data('thingerlyCalendar');
						var cdate = getPageDate('prev', data);

						var new_view = getView($this, data.view, cdate);

						data.options.month = cdate.getMonth();
						data.options.year = cdate.getFullYear();

						showView($this, new_view, data.options.transition, 'prev');
					});

					jQuery(".tc-header-r", this).bind('click.thingerlyCalendar', function() {
						var data = $this.data('thingerlyCalendar');
						var cdate = getPageDate('next', data);

						data.options.month = cdate.getMonth();
						data.options.year = cdate.getFullYear();

						var new_view = getView($this, data.view, cdate);



						showView($this, new_view, data.options.transition, 'next');
					});

					jQuery(".tc-header-t", this).bind('click.thingerlyCalendar', function() {
						var data = $this.data('thingerlyCalendar');

						switch (data.view)
						{
							case 'days' : {
								data.view = 'months';

								view = getView($this, 'months', new Date(data.options.year, data.options.month, 1));

								showView($this, view, data.options.viewTransition, 'out');

								break;
							}
              case 'months' : {
                data.view = 'years';

                view = getView($this, 'years', new Date(data.options.year, data.options.month, 1));

                showView($this, view, data.options.viewTransition, 'out');

                break;
              }
						}
					});
				}
			});
		},
    'addEvent': function(event_date)
    {
        var data = $(this).data('thingerlyCalendar');
        data.events[data.events.length] = event_date;
        p_event_date = new Date(Date.parse(event_date));

        // TODO: This needs to be DRYed.
        jQuery('.tc-day', data.calendar).each(function () {
            if ($(this).attr('date') == p_event_date)
            {
                if (!$(this).hasClass("tc-event"))
                {
                    $(this).addClass("tc-event");
                    if (data.options.eventClick)
                    {
                        $(this).bind('click.thingerlyCalendar', function() {
                    		    data.options.eventClick($(this).attr("date"));
                        });
                    }
                }
            }
        });
    }
	};

	function getPageDate(direction, data)
	{
		var cm = data.options.month;
		var cy = data.options.year;

		if (direction == 'prev')
		{
			if (data.view == 'days')
			{
				var pm = cm == 0 ? 11 : cm - 1;
				var py = pm == 11 ? cy - 1 : cy;

				return new Date(py, pm, 1);
			}
			else if (data.view == 'months')
			{
				return new Date(cy-1, cm, 1);
			}
      else if (data.view == 'years')
      {
        return new Date(cy-12, cm, 1);
      }
		}
		else if (direction = 'next')
		{
			if (data.view == 'days')
			{
				var nm = cm == 11 ? 0 : cm + 1;
				var ny = nm == 0 ? cy + 1 : cy;

				return new Date(ny, nm, 1);
			}
			else if (data.view == 'months')
			{
				return new Date(cy+1, cm, 1);
			}
      else if (data.view == 'years')
      {
        return new Date(cy+12, cm, 1);
      }
		}
	}

	function showView(cal, view, transType, direction)
	{
		var old_view = jQuery('.tc-body', cal);
		var new_view = view;

		switch (transType)
		{
			case 'fade': {
				transitionFade(cal, old_view, new_view, direction);
				break;
			}
			case 'zoom': {
				transitionZoom(cal, old_view, new_view, direction);
				break;
			}
			case 'slide':
			default: {
				transitionSlide(cal, old_view, new_view, direction);

				break;
			}
		}
	}

	function transitionSlide(cal, orig, repl, direction)
	{
		var data = cal.data('thingerlyCalendar');

		repl.hide();

		data.calendar.append(repl);

		hdir = 'left';
		sdir = 'right';

		if (direction == 'prev' || direction == 'out')
		{
			hdir = 'right';
			sdir = 'left';
		}

		orig.hide('slide', { 'direction' : hdir }, data.options.speed, function() {
			orig.remove();
		});

		repl.show('slide', { 'direction' : sdir }, data.options.speed);
	}

	function transitionZoom(cal, orig, repl, direction)
	{
		var data = cal.data('thingerlyCalendar');


		if (direction == 'prev' || direction == 'out')
		{
			per = 0;
		orig.css("z-index", 5);
		repl.css("z-index", 4);

		data.calendar.append(repl);


			orig.hide('scale', {percent: per},  data.options.speed, function() {
				orig.remove();
			});

		}
		else
		{
			per = 100;
		orig.css("z-index", 4);
		repl.css("z-index", 5);
		repl.hide();

		data.calendar.append(repl);


			repl.show('scale', {percent: per},  data.options.speed, function() {
				orig.remove();
			});

		}






//		repl.show('scale', { 'direction' : 'right' }, data.options.speed);
	}

	function transitionFade(cal, orig, repl, direction)
	{
		var data = cal.data('thingerlyCalendar');

		repl.fadeTo(1, 0, function() { 
			data.calendar.append(repl);
			orig.fadeTo(data.options.speed, 0);

			repl.fadeTo(data.options.speed, 1.0, function() {
				orig.remove();
			});
		});
	}


	function getView(cal, type, d)
	{
		view = $('<div />');
		view.addClass("tc-body");

		switch (type)
		{
			case 'days': {
				return renderDayView(cal, view, d);
			}
			case 'months': {
				return renderMonthView(cal, view, d);
			}
      case 'years': {
        return renderYearView(cal, view, d);
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

	function renderYearView(cal, view, d)
	{
		var data = cal.data('thingerlyCalendar');

    var curYear = d.getFullYear();
    var startYear = curYear - 6;
    var endYear = curYear + 5;
    var year = startYear;

		for (row = 0; row < 3; row++)
		{
			bigRow = $("<div/>");
			bigRow.addClass("tc-row-bg");

			if (row % 2 == 1)
			{
				bigRow.addClass("tc-odd");
			}
			else
			{
				bigRow.addClass("tc-even");
			}

			for (i = 0; i < 4; i++)
			{
				yDiv = $("<div />");
				yDiv.addClass("tc-cell");
				yDiv.addClass("tc-year");
        yDiv.html(year);
				yDiv.attr('y-no', year);
				yDiv.bind('click.thingerlyCalendar', function() {
                                    selectYear(cal, parseInt($(this).attr('y-no'), 10));
				});
        year++;
				bigRow.append(yDiv);
			}

			view.append(bigRow);
		}

		setCalendarTitle(cal, startYear + " - " + endYear);

		return view
	}

	function renderMonthView(cal, view, d)
	{
		var data = cal.data('thingerlyCalendar');

		count = 0;
		for (row = 0; row < 3; row++)
		{
			bigRow = $("<div/>");
			bigRow.addClass("tc-row-bg");

			if (row % 2 == 1)
			{
				bigRow.addClass("tc-odd");
			}
			else
			{
				bigRow.addClass("tc-even");
			}

			for (i = 0; i < 4; i++)
			{
				moDiv = $("<div />");
				moDiv.addClass("tc-cell");
				moDiv.addClass("tc-month");
				moDiv.html(months_abbr[count]);
				moDiv.attr('mo-no', count);
				moDiv.attr('y-no', d.getFullYear());
				moDiv.bind('click.thingerlyCalendar', function() {
					selectMonth(cal, parseInt($(this).attr('mo-no'), 10), parseInt($(this).attr('y-no'), 10));
				});
				count++;
				bigRow.append(moDiv);
			}

			view.append(bigRow);
		}

		setCalendarTitle(cal, (d.getFullYear()).toString());

		return view
	}

        function selectYear(cal, year)
        {
            var data = cal.data('thingerlyCalendar'); 
            data.view = 'months';
            data.options.year = year;
            var view = getView(cal, 'months', new Date(year, data.options.month, 1));
            showView(cal, view, data.options.viewTransition, 'in');
        }

	function selectMonth(cal, month, year)
	{
		view = getView(cal, 'days', new Date(year, month, 1));
		var data = cal.data('thingerlyCalendar');
		data.view = 'days';
		data.options.year = year;
		data.options.month = month;
		showView(cal, view, data.options.viewTransition, 'in');
	}

	function renderDayView(cal, view, d)
	{
		var data = cal.data('thingerlyCalendar');

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
		year = d.getFullYear();

		// When did this month begin?
		first_date = new Date(year, month, 1);
		first_day = first_date.getDay();
		var num_days = getNumDays(month, year);

		// ANd now for the previous month
		prev_month = month == 0 ? 11 : month - 1;
		prev_year = prev_month == 11 ? year - 1 : year;
		prev_num_days = getNumDays(prev_month, prev_year);

		next_month = month == 11 ? 0 : month + 1;
		next_year = next_month == 0 ? year + 1 : year;

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

					dayDiv.attr('date', new Date(prev_year, prev_month, dayText));
				}
				else if (dayText > num_days)
				{
					// We're out of the current month and into the next
					dayDiv.addClass("tc-grey");
					dayText = ++next_month_days;

					dayDiv.attr('date', new Date(next_year, next_month, dayText));
				}
				else
				{
					if (dayText == data.now.getDate() && d.getFullYear() == data.now.getFullYear() && d.getMonth() == data.now.getMonth())
					{
						dayDiv.addClass("tc-today");
					}

					dayDiv.attr('date', new Date(year, month, dayText));
				}

        var cDayDate = dayDiv.attr('date');
        for (var _i = 0; _i < data.events.length; _i++)
        {
            if (cDayDate == data.events[_i])
            {
                dayDiv.addClass("tc-event");
            }
        }


				dayDiv.html(dayText);
				
				weekDiv.append(dayDiv);

				// increment our day counter
				day_counter++;
			}

			// Append the week 
			view.append(weekDiv);
		}

    if (data.options.dayClick)
    {
        jQuery('.tc-day', view).bind('click.thingerlyCalendar', function() {
    		    data.options.dayClick($(this).attr("date"));
        });
    }

    if (data.options.eventClick)
    {
        jQuery('.tc-event', view).bind('click.thingerlyCalendar', function() {
    		    data.options.eventClick($(this).attr("date"));
        });
    }

		setCalendarTitle(cal, months[d.getMonth()] + " - " + (d.getFullYear()));

		return view;
	}

	function renderSkeleton(el)
	{
		// Calendar Header
		header = $('<div />');
		header.addClass("tc-header tc-row-sm tc-cf");

		leftButton = $('<div />', {
		});
		leftButton.addClass("tc-header-l");

		middleButton = $('<div />');
		middleButton.addClass("tc-header-t");

		rightButton = $('<div />', {
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
