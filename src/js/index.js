// Grab elements needed for JavaScript operations
const clockMessage = document.querySelector('.clock__message');
const time = document.querySelector('.clock__time');
// const calendar = document.querySelector('.calendar');
const calendarTitle = document.querySelector('.cal__title');
const calendarGrid = document.querySelector('.cal__grid');
const leftBtn = document.querySelector('.cal__btn--left');
const rightBtn = document.querySelector('.cal__btn--right');
const calendarMobile = document.querySelector('.cal__mobile');

// Add event listeners to back/forward month buttons
leftBtn.addEventListener('click', () => {
  renderMonth(-1);
});
rightBtn.addEventListener('click', () => {
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
    clockMessage.innerText = `Your life will begin anew in:`;
  } else {
    clockMessage.innerText = `YOUR LIFE ENDS IN:`;
  }

  time.innerHTML = `
    <ul>
      <li class="clock__time--numbers">${daysLeft}</li>
      <li class="clock__time--numbers">:</li>
      <li class="clock__time--numbers">${
        hoursLeft < 10 ? '0' : ''
      }${hoursLeft}</li>
      <li class="clock__time--numbers">:</li>
      <li class="clock__time--numbers">${
        minutesLeft < 10 ? '0' : ''
      }${minutesLeft}</li>
      <li class="clock__time--numbers">:</li>
      <li class="clock__time--numbers">${
        secondsLeft < 10 ? '0' : ''
      }${secondsLeft}</li>
      <li class="clock__time--labels">Days</li>
      <li class="clock__time--labels">Hours</li>
      <li class="clock__time--labels">Minutes</li>
      <li class="clock__time--labels">Seconds</li>
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

// Main Dataset (Rosh Hashanah, Yom Kippur, Easter & Good Friday are only good thru 2020 dates)
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
    name: "Harry Potter's Birthday",
    type: 'birthday',
    dateType: 'static',
    month: 6,
    date: 31,
  },
  {
    name: 'Original Star Wars premier in 1977',
    type: 'birthday',
    dateType: 'static',
    month: 4,
    date: 25,
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
  {
    name: '1st day a senator may place 5 bills on the Intent Calendar',
    type: 'legislative',
    dateType: 'static',
    month: 3,
    date: 15,
  },
  {
    name: 'General Election',
    type: 'legislative',
    dateType: 'general',
    month: 10,
  },
  {
    name: 'First Day legislators may file bills for the legislative session',
    type: 'legislative',
    dateType: 'firstDay',
    month: 10,
  },
  {
    name: 'Memorial Day',
    type: 'holiday',
    dateType: 'memorial',
    month: 4,
  },
  {
    name: 'Easter',
    type: 'holiday',
    dateType: 'goofy',
    year: 2019,
    month: 3,
    date: 21,
  },
  {
    name: 'Easter',
    type: 'holiday',
    dateType: 'goofy',
    year: 2020,
    month: 3,
    date: 12,
  },
  {
    name: 'Good Friday',
    type: 'holiday',
    dateType: 'goofy',
    year: 2019,
    month: 3,
    date: 19,
  },
  {
    name: 'Good Friday',
    type: 'holiday',
    dateType: 'goofy',
    year: 2020,
    month: 3,
    date: 10,
  },
  {
    name: 'Yom Kippur',
    type: 'holiday',
    dateType: 'goofy',
    year: 2019,
    month: 9,
    date: 9,
  },
  {
    name: 'Yom Kippur',
    type: 'holiday',
    dateType: 'goofy',
    year: 2020,
    month: 8,
    date: 28,
  },
  {
    name: 'Rosh Hashanah',
    type: 'holiday',
    dateType: 'goofy',
    year: 2019,
    month: 8,
    date: 30,
  },
  {
    name: 'Rosh Hashanah',
    type: 'holiday',
    dateType: 'goofy',
    year: 2019,
    month: 9,
    date: 1,
  },
  {
    name: 'Rosh Hashanah',
    type: 'holiday',
    dateType: 'goofy',
    year: 2020,
    month: 8,
    date: 19,
  },
  {
    name: 'Rosh Hashanah',
    type: 'holiday',
    dateType: 'goofy',
    year: 2020,
    month: 8,
    date: 20,
  },
];

const sessionData = [
  {
    name: 'Bill Filing Deadline',
    sessionDay: 60, // 60th day of session
  },
  {
    name:
      'Last day of regular session (sine die); only corrections may be considered in the house and senate',
    sessionDay: 140,
  },
  {
    name: 'Legislature convenes',
    sessionDay: 1,
  },
  {
    name: 'Last day for house committees to report house bills and house JRs',
    sessionDay: 119,
  },
  {
    name:
      'Deadline for the house to distribute its last House Daily Calendar with house bills and house JRs',
    sessionDay: 120,
  },
  {
    name:
      'Deadline for the house to distribute its last House Local & Consent Calendar with consent house bills',
    sessionDay: 121,
  },
  {
    name:
      'Last day for the house to consider house bills and house JRs on 2nd reading on Daily or Supplemental Calendar',
    sessionDay: 122,
  },
  {
    name:
      'Last day for the house to consider consent house bills on 2nd and 3rd reading and all 3rd reading house bills or house JRs on the Supplemental Calendar',
    sessionDay: 123,
  },
  {
    name:
      'Deadline for house to distribute its last House Local & Consent Calendar with local house bills',
    sessionDay: 128,
  },
  {
    name:
      'Last day for the house to consider local house bills on 2nd and 3rd reading',
    sessionDay: 130,
  },
  {
    name:
      'First day teh senate can consider bills and resolutions on the 1st day they are place on the Intent Calendar',
    sessionDay: 130,
  },
  {
    name: 'Last day for house comittees to report senate bills and JRs',
    sessionDay: 131,
  },
  {
    name:
      'Deadline for the house to distribute its last House Daily Calendar with senate bills and senate JRs',
    sessionDay: 132,
  },
  {
    name:
      'Deadline for the house to distribute its last House Local & Consent Calendar with senate bills',
    sessionDay: 133,
  },
  {
    name:
      'Last day for the house to consider 2nd reading senate bills and senate JRs on the Daily or Supplemental Calendar',
    sessionDay: 134,
  },
  {
    name:
      'Last day for the house to consider local and consent senate bills on 2nd and 3rd reading and all 3rd reading senate bills and JRs on the Supplemental Calendar',
    sessionDay: 135,
  },
  {
    name:
      'Last day for senate to consider all bills and JRs on 2nd or 3rd reading',
    sessionDay: 135,
  },
  {
    name: 'Deadline for the house to distribute senate amendments',
    sessionDay: 136,
  },
  {
    name:
      'Last day for the house to act on senate amendments (concur or request a conference committee)',
    sessionDay: 137,
  },
  {
    name:
      'Deadline for the senate to print and distribute senate copies of CCRs on tax, general appropriations, reapportionment bills',
    sessionDay: 137,
  },
  {
    name: 'Deadline for the house to distribute house copies of all CCRs',
    sessionDay: 138,
  },
  {
    name:
      'Deadline for the senate to print and distribute senate copies of all CCRs on bills other than tax, general appropriations, reapportionment bills and all house amendments to senate bills and JRs that did not go to a CCR',
    sessionDay: 138,
  },
  {
    name:
      'Last day for the house to adopt CCRs or discharge house conferees and concur in senate amendments',
    sessionDay: 139,
  },
  {
    name: 'Last day for the senate to concur in house amendments or adopt CCRs',
    sessionDay: 139,
  },
  {
    name:
      'Last day the governor can sign or veto bills passed during regular session',
    sessionDay: 160,
  },
  {
    name: 'Date that bills without specific effective dates become law',
    sessionDay: 231,
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
      // Only include general election if it's the correct year
    } else if (date.dateType === 'general' && currentYear % 2 === 0) {
      let monthStart = dateFns.startOfMonth(new Date(currentYear, date.month));
      while (!dateFns.isMonday(monthStart)) {
        monthStart = dateFns.addDays(monthStart, 1);
      }
      monthStart = dateFns.addDays(monthStart, 1);

      newDate = dateFns.getDate(new Date(monthStart));
    } else if (date.dateType === 'firstDay' && currentYear % 2 === 0) {
      let monthStart = dateFns.startOfMonth(new Date(currentYear, date.month));
      while (!dateFns.isMonday(monthStart)) {
        monthStart = dateFns.addDays(monthStart, 1);
      }
      monthStart = dateFns.addDays(monthStart, 7);
      newDate = dateFns.getDate(new Date(monthStart));
    } else if (date.dateType === 'memorial') {
      let monthEnd = dateFns.endOfMonth(new Date(currentYear, date.month));
      while (!dateFns.isMonday(monthEnd)) {
        monthEnd = dateFns.subDays(monthEnd, 1);
      }
      newDate = dateFns.getDate(new Date(monthEnd));
    } else if (date.dateType === 'goofy') {
      if (date.year === currentYear) {
        newDate = date.date;
      }
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
        `<div class="calendar__item--mobile ${item.type}">${item.date}st ${
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
      let suffix;
      if (item.date % 10 === 1 && item.date !== 11) {
        suffix = 'st';
      } else if (item.date % 10 === 2 && item.date !== 12) {
        suffix = 'nd';
      } else if (item.date % 10 === 3 && item.date !== 13) {
        suffix = 'rd';
      } else {
        suffix = 'th';
      }
      if (item.date === i) {
        calendarInfo.push(`
            <div class="calendar-item ${item.type}">${item.name}</div>
          `);
        calendarInfoMobile.push(
          `<div class="calendar__item--mobile ${item.type}">${
            item.date
          }${suffix} ${item.name}</div>`
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
