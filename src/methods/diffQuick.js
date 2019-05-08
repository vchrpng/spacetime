// don't do anything too fancy here.
// 2020 - 2019 may be 1 year, or 0 years
// - '1 year difference' means 366 days during a leap year
const fastYear = (a, b) => {
  let years = b.year() - a.year()
  // should we decrement it by 1?
  a = a.year(b.year())
  if (a.isAfter(b)) {
    years -= 1
  }
  return years
}

// use a waterfall-method for computing a diff of any 'pre-knowable' units
// compute years, then compute months, etc..
// ... then ms-math for any very-small units
const diff = function(a, b) {
  // an hour is always the same # of milliseconds
  // so these units can be 'pre-calculated'
  let ms = b.epoch - a.epoch
  let obj = {
    milliseconds: ms,
    seconds: parseInt(ms / 1000, 10)
  }
  obj.minutes = parseInt(obj.seconds / 60, 10)
  obj.hours = parseInt(obj.minutes / 60, 10)

  //do the year
  let tmp = a.clone()
  obj.years = fastYear(tmp, b)
  tmp = a.add(obj.years, 'year')

  //there's always 12 months in a year...
  obj.months = obj.years * 12
  tmp = a.add(obj.months, 'month')
  obj.months += tmp.diff(b, 'month')

  // there's always atleast 4 weeks in a month..
  obj.weeks = obj.months * 4
  tmp = a.add(obj.weeks, 'week')
  obj.weeks += tmp.diff(b, 'week')

  // there's always atleast 7 days in a week
  obj.days = obj.weeks * 7
  tmp = a.add(obj.days, 'day')
  obj.days += tmp.diff(b, 'day')

  return obj
}
module.exports = diff