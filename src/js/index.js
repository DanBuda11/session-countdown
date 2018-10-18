// Grab elements needed for JavaScript operations
const sessionMessage = document.querySelector('.session-message');
const time = document.querySelector('.time');
const calendar = document.querySelector('.calendar');
const calendarTitle = document.querySelector('.calendar-title');
const calendarGrid = document.querySelector('.calendar-grid');
const backButton = document.querySelector('.left');
const forwardButton = document.querySelector('.right');

// Add event listeners to back/forward month buttons
backButton.addEventListener('click', () => {
  renderMonth(-1);
});
forwardButton.addEventListener('click', () => {
  renderMonth(1);
});

let sessionYear;
let sineDieDate;
let duringSession;

// Set variables for current month and year for initial calendar render
let currentYear = dateFns.getYear(new Date());
let currentMonth = dateFns.getMonth(new Date());

// Determine next session start and next sine die
// You'll need them for any calculation you need to do, so just
// figure them out at the start and set them to a const

// **************************************************************
// Start of Countdown Clock Code

// Determine if odd or even year then if even, add a year to currentYear
if (currentYear % 2 === 0) {
  sessionYear = currentYear + 1;
} else {
  sessionYear = currentYear;
}
// Find the start of the sessionYear

let januaryOne = dateFns.startOfYear(new Date(sessionYear, 0, 1));

let sessionStartDate = januaryOne;

// If year does not start on a Tuesday, keep adding a day at a time and checking, then add 7 days for the 2nd Tuesday
while (!dateFns.isTuesday(sessionStartDate)) {
  sessionStartDate = dateFns.addDays(sessionStartDate, 1);
}
sessionStartDate = dateFns.addDays(sessionStartDate, 7);

// So when is Sine Die?
sineDieDate = dateFns.addDays(sessionStartDate, 140);

// Next, figure out if we are during session and need to calculate time until Sine Die,
// or before session and need to calculate time until session starts

function countdown() {
  let now = new Date();
  let end;
  if (
    dateFns.isBefore(sessionStartDate, now) &&
    dateFns.isAfter(sineDieDate, now)
  ) {
    // Need duringSession only for determining UI for 'time until sine die' or 'time until session'
    duringSession = true;
    end = sineDieDate;
  } else {
    duringSession = false;
    end = sessionStartDate;
  }

  // Calculate time left until (session start, sine die)
  const daysLeft = -dateFns.differenceInDays(now, end);

  const hoursLeft = -dateFns.differenceInHours(
    dateFns.addDays(now, daysLeft),
    end
  );

  const minutesLeft = -dateFns.differenceInMinutes(
    dateFns.addHours(dateFns.addDays(now, daysLeft), hoursLeft),
    end
  );

  const secondsLeft = -dateFns.differenceInSeconds(
    dateFns.addMinutes(
      dateFns.addHours(dateFns.addDays(now, daysLeft), hoursLeft),
      minutesLeft
    ),
    end
  );

  if (duringSession === true) {
    sessionMessage.innerText = `Your life will begin anew in:`;
  } else {
    sessionMessage.innerText = `YOUR LIFE ENDS IN:`;
  }

  time.innerHTML = `
    <ul>
      <li>${daysLeft}</li>
      <li>:</li>
      <li>${hoursLeft < 10 ? '0' : ''}${hoursLeft}</li>
      <li>:</li>
      <li>${minutesLeft < 10 ? '0' : ''}${minutesLeft}</li>
      <li>:</li>
      <li>${secondsLeft < 10 ? '0' : ''}${secondsLeft}</li>
    </ul>
`;
}

// What happens when everything is at 0? Need to stop it running? Or someone automatically
// switch it over to until sine die? I think it might already do this

// Need to be able to test what happens when everything hits 0

setInterval(countdown, 1000);
countdown();
// ************************************************************
// Start of Calendar Code

const months = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
];

const days = [
  'Sunday',
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
  'Saturday',
];
// Show a list of important session dates, holidays on Patsty's calendar, and my birthday
// Color code for holiday, session event
// For mobile, definitely just a list of events, not an actual calendar
// left/right arrows for changing the month shown

// meybe an actual calendar-looking render for destktop size?

// Need to populate days of the month (probably with dateFns)
// Need to merge month dates with holidays and session days, given that they won't always
// fall on the same date

// Start message of the day code

// Have specific messages for certain days (like my birthday) and probably set those
// with if statements before rendering the message. And if there's no specific message for that day,
// maybe just randomly choose form an array of options

// Sandbox Code for Functions to be able to render any date

// Temp Data
const data = [
  {
    name: 'Christmas Day',
    type: 'holiday',
    dateType: 'static',
    month: 11,
    date: 25, // I don't need the month because it's in a separate key above
  },
  {
    name: 'Martin Luther King, Jr. Day',
    type: 'holiday',
    dateType: 'flex',
    month: 0,
    date: {
      nth: 3, // 3rd
      weekday: 1, // Monday
    },
  },
  {
    name: 'Saturday Holiday',
    type: 'holiday',
    dateType: 'flex',
    month: 9,
    date: {
      nth: 2,
      weekday: 6,
    },
  },
  {
    name: "Dan Buda's Birthday",
    type: 'birthday',
    dateType: 'static',
    month: 3,
    date: 14,
  },
  {
    name: 'Bill Filing Deadline',
    type: 'legislative',
    dateType: 'session',
    month: 2,
    date: 60, // 60th day of session
  },
  {
    name: "New Year's Day",
    type: 'holiday',
    dateType: 'static',
    month: 0,
    date: 1,
  },
];

function filterData(data) {
  const thisMonth = dateFns.getMonth(new Date());

  const filteredData = data
    .filter(date => date.month === 2)
    // Which date type are we lookg at when we loop over the eventual filtered array with
    // only dates from the current month?

    // This isn't going to work because it's not returning anything
    .map(item => {
      if (item.dateType === 'static') {
        getStaticDate(item.month, item.date);
      } else if (item.dateType === 'flex') {
        getFlexDate(item.month, item.date.nth, item.date.weekday);
      } else if (item.dateType === 'session') {
        getSessionDate(sessionStartDate, item.date - 1);
      }
    });
  // console.log('filteredData: ', filteredData);
}

// Each of the 3 "get" functions will probably only run after an if statement determining
// which type of date the current item is. So first we'd check to see if it's a "session"
// type then we'd run it thru the getSessionDate function, so we will already know which
// array item we're working with

function getStaticDate(month, date) {}

function getFlexDate(month, nth, day) {}

function getSessionDate(start, days) {
  // console.log(dateFns.addDays(start, days));
}

filterData(data);

// getSessionDate(sessionStartDate, 60 - 1); // this will probably look like (sessionStartDate, date - 1)

// What needs to happen in the filterData() function above is to choose only the dates in
// the data array that are in the current month (or the month that was clicked to by
// forward or back arrow). Once all those dates are pulled out, I need the actual date
// of the holiday/etc so that will come from one of the functions depending on the dateType
// then once I have the date (I only need the day of the month at this point), I can use that
// along with the name of the holiday/etc, and the item's type (to give it class and style
// it in the DOM) to render to the screen
// The end goal at least initially should be to take all the "holidays" in the entire
// dataset, keep only the ones for the currently rendered month, run functions to change
// "flex" and "session" dates into actual static dates, then combine these with the "static"
// dates into a new array for all of the "holidays" in the current month. Then use that
// data to map over & render everytyhing to the calendar grid.

// So maybe the overall function is:
function renderMonth(change) {
  // Everything goes in here

  // NOTE: Should I just run the renderMonth function on page load and use a change
  // value of 0 and check for that in the function? Then I can just do nothing to currentMonth
  // and currentYear and run the same function as if a button is clicked.
  // YES - DO THIS!

  // Check what the current month and year are for the chosen calendar month, taking in
  // to account if someone clicks from Dec to Jan you need to +1 the year and opposite
  // for going back from Jan to Dec
  // Test against the variable currentYear which will be updated everytime it needs to be
  // So if you're in October 2018 (which would auto load at this point) and hit the right
  // arrow, you would check to see if year changed (it doesn't) and you know month needs
  // to go +1. So currentYear is 2018, current month is 9 but needs to change to 10 before
  // running the function to render the holidays for November 2018
  // You can do if change = +1 AND currentMonth is 11, then add +1 to year
  // if change = -1 AND current month is 0, then -1 to year

  // First check to see if this is the initial run of the function on page load with
  // change = 0
  if (change !== 0) {
    // The rest of this is setting up what the month and year are that are needed to filer
    // the holidays to render based on the button that was clicked (forward or backward a month)
    // If forward button clicked
    if (change === 1) {
      // console.log('forward clicked');
      // If month will change from Dec to Jan because of click
      if (currentMonth === 11) {
        // Set values of currentMonth and currentYear to January of next year
        currentMonth = 0;
        ++currentYear;
        // console.log(
        //   'inside change to January function: ',
        //   currentMonth,
        //   currentYear
        // );
      } else {
        // Increase month by 1 if year didn't change
        ++currentMonth;
        // console.log(
        //   'inside non-year change function: ',
        //   currentMonth,
        //   currentYear
        // );
      }
      // If backward button clicked
    } else if (change === -1) {
      // console.log('backward clicked');
      // If month will change from Jan to Dec because of click
      if (currentMonth === 0) {
        // Set values of currentMonth and currentYear to Dec of previous year
        currentMonth = 11;
        --currentYear;
      } else {
        // Decrease currentMonth by 1 if year didn't change
        --currentMonth;
      }
    }
  }
  // Console.log the month and year to be used in the calculations to follow
  // console.log(currentMonth, currentYear);

  // show current month & year in calendar title
  calendarTitle.textContent = `${months[currentMonth]} ${currentYear}`;

  // How many days in the current month?
  const monthDays = dateFns.getDaysInMonth(new Date(currentYear, currentMonth));
  // console.log('monthDays: ', monthDays);

  // // What's the first day of the month?
  const firstDay = dateFns.startOfMonth(new Date(currentYear, currentMonth));
  // console.log('firstDay: ', firstDay);

  const firstDayNum = dateFns.getDay(firstDay);
  // console.log('firstDayNum: ', firstDayNum);
  // // What day of the week is that first day? (Do I need to know this or just the day's
  // Javascript number? Eg: 4 for Thursday)
  const dayOfWeek = days[dateFns.getDay(new Date(firstDay))];
  // console.log('dayOfWeek: ', dayOfWeek);

  // Render the calendar into the calendar grid (dont' worry about the mobile version for now)
  let calendarInfo = [];

  // *********************************************
  // Put all code filtering the date into the final dataset to be rendered to the calendar here

  // So you have the original dataset, "data"

  // You need to pull out all events for the month being used

  // You need to run all those dates thru one of the 3 functions (or maybe just 2) to put
  // them in the correct format to run thru the calendarInfo.push stuff
  //

  const thisMonthData = data.filter(item => item.month === currentMonth);
  // console.log('thisMonthData: ', thisMonthData);

  const finalData = thisMonthData.map(date => {
    let newDate;

    if (date.dateType === 'session') {
      // Figure out the new date based on days after session starts
      newDate = sessionStartDate + date.date;
      console.log('session newDate: ', newDate);
    } else if (date.dateType === 'flex') {
      // Figure out for flex date
      // start by asking if the item's date.weekday is the first day of the month
      // if so, start the next calculation
      // if not, keep adding 1 until they match up

      let dayCalc = date.date.weekday;
      console.log('first dayCalc: ', dayCalc);
      console.log('firstDayNum: ', firstDayNum);
      let counter = 0;
      console.log('first counter: ', counter);
      while (dayCalc !== firstDayNum) {
        counter = ++counter;
        console.log('flex counter: ', counter);
        if (dayCalc === 0) {
          dayCalc = 6;
          console.log('flex dayCalc: ', dayCalc);
        } else {
          dayCalc = --dayCalc;
          console.log('flex dayCalc: ', dayCalc);
        }
      }
      // after matching up weekday days, next calc here
      newDate = 1 + (date.date.nth - 1) * 7 + counter;
      console.log('flex newDate: ', newDate);
    } else {
      newDate = date.date;
      console.log('static/birthday newDate: ', newDate);
    }

    return {
      name: date.name,
      type: date.type,
      date: newDate,
    };
  });

  console.log('finalData: ', finalData);

  // {
  //   name: 'Martin Luther King, Jr. Day',
  //   type: 'holiday',
  //   dateType: 'flex',
  //   month: 0,
  //   date: {
  //     nth: 3, // 3rd
  //     weekday: 1, // Monday
  //   },
  // },

  // *********************************************

  // Push 1st calendar block into array with class to denote is as first for starting position
  // in grid
  calendarInfo.push(
    `<div class="day-block day-one" style="grid-column-start: ${firstDayNum +
      1};"><div class="day-date">${1}</div>`
  );

  // This will need to be rename to something other than "data" because I'll be using a
  // filtered array and not the general data set.
  finalData.forEach(item => {
    if (item.date === 1) {
      calendarInfo.push(
        `<div class="calendar-item ${item.type}">${item.name}</div>`
      );
    }
  });

  calendarInfo.push(`</div>`);

  // For adding events, if any events in the already filtered array of events (where
  // I filter only for those in the month being rendered), match the day I'm pushing
  // to the array, add it into the "day-block" class after the "day-date" div.

  // For test purposes only:
  const fakeData = [
    {
      name: 'Febtober',
      date: 9,
      type: 'holiday',
    },
    {
      name: 'Birthday!',
      date: 14,
      type: 'birthday',
    },
    {
      name: 'Bill Filing',
      date: 12,
      type: 'legislative',
    },
  ];

  for (var i = 2; i < monthDays + 1; i++) {
    // console.log('hey!', i);

    calendarInfo.push(
      `<div class="day-block"><div class="day-date">${i}</div>`
    );

    finalData.forEach(item => {
      console.log('item.date: ', item.date);
      if (item.date === i) {
        calendarInfo.push(`
            <div class="calendar-item ${item.type}">${item.name}</div>
          `);
      }
    });

    calendarInfo.push(`</div>`);
  }

  // Use firstDay to set where the calendar for that month starts in the calendar-view
  // version and fill in the grid wrapping until the last day of the month
  // calendarGrid.innerHTML = `This month has ${monthDays} days and starts on a ${dayOfWeek}`;
  calendarGrid.innerHTML = calendarInfo.join('');

  // Pull out only the holidays that are in the current month
  // Transform holiday dates that are flex or session into static and put those and
  // any existing static dates into a final array of all info needed to render holidays
  // to calendar using the new static-only date info for holidays
  // Info needed to render includes holiday name, type, & date
  // name and date for obvious reasons, type to determine styling if it's a holiday,
  // birthday, or legislative date
}

// Then that function gets called on page load and when someone wants to go
// back/forward months using the arrows
renderMonth(0);
