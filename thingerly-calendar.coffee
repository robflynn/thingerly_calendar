###
Copyright (C) 2010-2012 by Thingerly, Rob Flynn <rob@thingerly.com>

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
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,£
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.
###

$.fn.extend
	thingerlyCalendar: (params) ->

		# I need to i18n this
		DAYS_OF_WEEK = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa']
		DAYS_IN_MONTH = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31]
		MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']

		# Set up some defaults
		now = new Date()

		options = 
			month : now.getMonth()
			year : now.getFullYear()
			pageTransition : 'slide'    # left / right transitions (back/foward)
			viewTransition : 'zoom'     # view state change transition
			speed : 300 								# millisecnods
			events : []  								# dates to highlight on the calendar
			onDay : null								# a day is clicked
			onMonth : null              # a month is clicked
			onYear  : null              # a year is clicked
			onEvent : null              # a calendar event is clicked
			view : 'days'               # what view should we start on?

		# Merge our defaults with user provided parameters
		options = $.extend options, params

		initialize_calendar = (obj) ->			
			$this = $(obj)

			$data = $this.data 'thingerlyCalendar'

			if not $data
				# initial calendar wrapper

				# render the calendar skeleton onto the calendar element
				$obj = render_skeleton $this

				# capture some useful dom elements
				$calendar = $obj.find(".tc-wrapper")
				$body = $obj.find(".tc-body")
				$header = $obj.find(".tc-header")

				# store various things that we may need to know into our data object
				$this.data 'thingerlyCalendar'
					target: $this
					calendar: $calendar
					view: options['view']
					options : options
					now: now
					events : []									# We'll parse these later

				current_date = new Date(options.year, options.month, 1)

				# Get our initial view
				view = get_view($this, options['view'], current_date)

				# And show it
				$(".tc-body", $this).replaceWith(view)

		get_view = ($ele, view_type, date) ->
			$view = $("""
				<div class="tc-body">
				</div>
				""")

			switch view_type
				when 'days' then render_day_view($ele, $view, date)

			$view

		render_day_view = ($ele, $view, date) ->

			$data = $ele.data("thingerlyCalendar")

			$view_head = $("""<div class="tc-month-header tc-row-small tc-cf"></div>""")

			for day in DAYS_OF_WEEK
				$day_div = $("""<div class="tc-cell tc-sub-header">#{day}</div>""")

				$view_head.append $day_div

			$view.append $view_head

			# Now we need to figure out how many days are in the month
			# we are viewing, as well as how many were in last month.
			# (We need last month's since we need to populate empty spaces
			# on the calendar)
			month = date.getMonth()
			year = date.getFullYear()
			first_day = date.getDay()

			num_days = get_num_days month, year
			day_counter = 0
			last_month_days = 0
			next_month_days = 0

			# previous and next month
			prev_month = if month == 0 then 11 else month - 1
			prev_year = if prev_month == 1 then year - 1 else year			
			prev_num_days = get_num_days prev_month, prev_year
			
			next_month = (month + 1) % 12;
			next_year = if next_month == 0 then year + 1 else year

			for week in [1..6]
				week_template = """<div class="tc-week tc-row-small tc-cf">"""

				# now render each day within the week
				for day in [0...7]
					grey_day = false
					day_text = day_counter - last_month_days + 1;					
					day_month = month
					day_year = year

					if day_counter < first_day
						grey_day = true
						day_text = prev_num_days - first_day + day_counter + 1;
						day_year = prev_year
						day_month = prev_month

						last_month_days++
					else if day_text > num_days
						# We passed the current month
						grey_day = true
						day_text = ++next_month_days
						day_year = next_year
						day_month = next_month

					day_template = """<div class="tc-cell tc-day #{if grey_day then "tc-grey" else ""}" data-day="#{day_text}" data-month="#{day_month + 1}" data-year="#{day_year}">#{day_text}</div>"""

					week_template += day_template

					day_counter++

				week_template = """#{week_template}</div>"""

				$week_div = $(week_template)

				# stripey
				$week_div.addClass week % 2 == 0  ? "tc-even" : "tc-odd"
				$view.append $week_div

			set_calendar_title $ele, "#{MONTHS[month]} - #{year}"
			console.log($data.options.onDay)

			if $data.options.onDay
				$(".tc-day", $view).bind 'click.thingerlyCalendar', ->
					day = $(this).data("day")
					month = $(this).data("month")
					year = $(this).data("year")

					console?.log "#{day} #{month} #{year}"

		set_calendar_title = ($ele, title) ->
			$(".tc-header-title", $ele).html title

		render_skeleton = ($ele) ->

			template = """
				<!-- calendar wrapper -->
				<div class="tc-calendar">
					<!-- main calendar -->
					<div class="tc-wrapper">
						<!-- begin header -->
						<div class="tc-header tc-row-small tc-cf">
							<div class="tc-header-left"></div>
							<div class="tc-header-title"></div>
							<div class="tc-header-right"></div>
						</div>
						<!-- end header -->

						<!-- begin body -->
						<div class="tc-body tc-cf">

						</div>
						<!-- end body -->
					</div>
				</div>
			"""

			$ele.append template

		get_num_days = (month, year) ->
			# 29 if it's a leap year and feburary
			29 if ((month == 1) && (year % 4 == 0) && ((year % 100 != 0) || (year % 400 == 0)))

			# otherwise we'll just use our lookup table
			DAYS_IN_MONTH[month]

			
		return @each () ->
			initialize_calendar this
			




	