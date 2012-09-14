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

		# Merge our defaults with user provided parameters
		options = $.extend options, params

		initialize_calendar = (obj) ->			
			$this = $(obj)

			$data = $this.data 'thingerlyCalendar'

			if not $data
				# initial calendar wrapper

				# render the calendar skeleton onto the calendar element
				render_skeleton $this
			
		render_skeleton = ($ele) ->

			template = """
				<!-- calendar wrapper -->
				<div class="tc-calendar">
					<!-- main calendar -->
					<div class="tc-wrapper">
						<!-- begin header -->
						<div class="tc-header tc-row-small tc-cf">
							<div class="tc-header-left"></div>
							<div class="tc-header-middle"></div>
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

			
		return @each () ->
			initialize_calendar this
			




	