// Grab elements needed for JavaScript operations
const sessionMessage = document.querySelector('.session-message');
const time = document.querySelector('.time');
const calendar = document.querySelector('.calendar');
const calendarTitle = document.querySelector('.calendar-title');
const calendarGrid = document.querySelector('.calendar-grid');
const backButton = document.querySelector('.left');
const forwardButton = document.querySelector('.right');
const calendarMobile = document.querySelector('.calendar-mobile');

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
sineDieDate = dateFns.addDays(sessionStartDate, 139);

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

// Main Dataset
const data = [
  {
    name: 'Christmas Day',
    type: 'holiday',
    dateType: 'static',
    month: 11,
    date: 25, // I don't need the month because it's in a separate key above
  },
  {
    name: 'Day After Christmas',
    type: 'holiday',
    dateType: 'static',
    month: 11,
    date: 26,
  },
  {
    name: 'Christmas Eve Day',
    type: 'holiday',
    dateType: 'static',
    month: 11,
    date: 24,
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
    name: 'Labor Day',
    type: 'holiday',
    dateType: 'flex',
    month: 8,
    date: {
      nth: 1,
      weekday: 1,
    },
  },
  {
    name: "Dan Buda's Birthday",
    type: 'birthday',
    dateType: 'static',
    month: 2,
    date: 14,
  },
  {
    name: "New Year's Day",
    type: 'holiday',
    dateType: 'static',
    month: 0,
    date: 1,
  },
  {
    name: 'Veterans Day',
    type: 'holiday',
    dateType: 'static',
    month: 10,
    date: 11,
  },
  {
    name: 'Thanksgiving Day',
    type: 'holiday',
    dateType: 'flex',
    month: 10,
    date: {
      nth: 4,
      weekday: 4,
    },
  },
  {
    name: 'Day After Thanksgiving',
    type: 'holiday',
    dateType: 'flex',
    month: 10,
    date: {
      nth: 4,
      weekday: 5,
    },
  },
  {
    name: 'Confederate Heroes Day',
    type: 'holiday',
    dateType: 'static',
    month: 0,
    date: 19,
  },
  {
    name: "Presidents' Day",
    type: 'holiday',
    dateType: 'flex',
    month: 1,
    date: {
      nth: 3,
      weekday: 1,
    },
  },
  {
    name: 'Texas Independence Day',
    type: 'holiday',
    dateType: 'static',
    month: 2,
    date: 2,
  },
  {
    name: 'Cesar Chavez Day',
    type: 'holiday',
    dateType: 'static',
    month: 2,
    date: 31,
  },
  {
    name: 'San Jacinto Day',
    type: 'holiday',
    dateType: 'static',
    month: 3,
    date: 21,
  },
  {
    name: 'Emancipation Day',
    type: 'holiday',
    dateType: 'static',
    month: 5,
    date: 19,
  },
  {
    name: 'Independence Day',
    type: 'holiday',
    dateType: 'static',
    month: 6,
    date: 4,
  },
  {
    name: 'LBJ Day',
    type: 'holiday',
    dateType: 'static',
    month: 7,
    date: 27,
  },
];

const sessionData = [
  {
    name: 'Bill Filing Deadline',
    dateType: 'session',
    sessionDay: 60, // 60th day of session
  },
  {
    name: 'Sine Die',
    dateType: 'session',
    sessionDay: 140,
  },
];

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
      // If month will change from Dec to Jan because of click
      if (currentMonth === 11) {
        // Set values of currentMonth and currentYear to January of next year
        currentMonth = 0;
        ++currentYear;
      } else {
        // Increase month by 1 if year didn't change
        ++currentMonth;
      }
      // If backward button clicked
    } else if (change === -1) {
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

  // show current month & year in calendar title
  calendarTitle.textContent = `${months[currentMonth]} ${currentYear}`;

  // How many days in the current month?
  const monthDays = dateFns.getDaysInMonth(new Date(currentYear, currentMonth));

  // // What's the first day of the month?
  const firstDay = dateFns.startOfMonth(new Date(currentYear, currentMonth));

  const firstDayNum = dateFns.getDay(firstDay);
  // const dayOfWeek = days[dateFns.getDay(new Date(firstDay))];

  // Render the calendar into the calendar grid
  let calendarInfo = [];
  let calendarInfoMobile = [];

  // *********************************************
  // Put all code filtering the date into the final dataset to be rendered to the calendar here

  // Pull out only calendar dates (excluding session dates) and put them in a separate array
  const thisMonthData = data.filter(item => item.month === currentMonth);
  // calculate the dates for flex dateType items and return all non-sesion dates to a
  // finalData array
  const finalData = thisMonthData.map(date => {
    let newDate;

    if (date.dateType === 'flex') {
      // Figure out for flex date
      // start by asking if the item's date.weekday is the first day of the month
      // if so, start the next calculation
      // if not, keep adding 1 until they match up

      let dayCalc = date.date.weekday;

      let counter = 0;
      while (dayCalc !== firstDayNum) {
        counter = ++counter;
        if (dayCalc === 0) {
          dayCalc = 6;
        } else {
          dayCalc = --dayCalc;
        }
      }
      // after matching up weekday days, next calc here
      newDate = 1 + (date.date.nth - 1) * 7 + counter;
    } else {
      newDate = date.date;
    }

    return {
      name: date.name,
      type: date.type,
      date: newDate,
    };
  });

  // Push the calculated session dates into finalData only during odd years
  if (currentYear % 2 !== 0) {
    // Recalculate the start of session for the calendar dates only
    let calSessionStartDate = dateFns.startOfYear(new Date(currentYear, 0, 1));
    while (!dateFns.isTuesday(calSessionStartDate)) {
      calSessionStartDate = dateFns.addDays(calSessionStartDate, 1);
    }
    calSessionStartDate = dateFns.addDays(calSessionStartDate, 7);

    // Calculate the month/date of session calendar dates
    const finalSessionData = sessionData.map(item => {
      // console.log('sessionStartDate: ', sessionStartDate);
      const newDay = dateFns.addDays(
        new Date(calSessionStartDate),
        item.sessionDay - 1
      );
      const newDate = dateFns.getDate(new Date(newDay));
      const newMonth = dateFns.getMonth(new Date(newDay));
      return {
        name: item.name,
        type: 'legislative',
        date: newDate,
        month: newMonth,
      };
    });

    finalSessionData.forEach(item => {
      if (item.month === currentMonth) {
        finalData.push(item);
      }
    });
  }

  // *********************************************

  // Push 1st calendar block into array with class to denote is as first for starting position
  // in grid
  calendarInfo.push(
    `<div class="day-block day-one" style="grid-column-start: ${firstDayNum +
      1};"><div class="day-date">${1}</div>`
  );

  finalData.forEach(item => {
    if (item.date === 1) {
      calendarInfo.push(
        `<div class="calendar-item ${item.type}">${item.name}</div>`
      );
      calendarInfoMobile.push(
        `<div class="calendar__item--mobile ${item.type}">${item.date} ${
          item.name
        }</div>`
      );
    }
  });

  calendarInfo.push(`</div>`);

  // For adding events, if any events in the already filtered array of events (where
  // I filter only for those in the month being rendered), match the day I'm pushing
  // to the array, add it into the "day-block" class after the "day-date" div.

  for (var i = 2; i < monthDays + 1; i++) {
    calendarInfo.push(
      `<div class="day-block"><div class="day-date">${i}</div>`
    );

    finalData.forEach(item => {
      if (item.date === i) {
        calendarInfo.push(`
            <div class="calendar-item ${item.type}">${item.name}</div>
          `);
        calendarInfoMobile.push(
          `<div class="calendar__item--mobile ${item.type}">${item.date} ${
            item.name
          }</div>`
        );
      }
    });

    calendarInfo.push(`</div>`);
  }

  // Use firstDay to set where the calendar for that month starts in the calendar-view
  // version and fill in the grid wrapping until the last day of the month
  calendarGrid.innerHTML = calendarInfo.join('');
  calendarMobile.innerHTML = calendarInfoMobile.join('');
}

// Then that function gets called on page load and when someone wants to go
// back/forward months using the arrows
renderMonth(0);
