const clockMessage = document.querySelector('.clock__message');
const time = document.querySelector('.clock__time');
const calendarTitle = document.querySelector('.cal__title');
const calendarGrid = document.querySelector('.cal__grid');
const leftBtn = document.querySelector('.cal__btn--left');
const rightBtn = document.querySelector('.cal__btn--right');
const calendarMobile = document.querySelector('.cal__mobile');

leftBtn.addEventListener('click', () => {
  renderMonth(-1);
});
rightBtn.addEventListener('click', () => {
  renderMonth(1);
});

// Set variables for current month and year for initial calendar render
let currentYear = dateFns.getYear(new Date());
let currentMonth = dateFns.getMonth(new Date());

// **************************************************************
// Start of Countdown Clock Code

function countdown() {
  // Create variable to store what the year of session will be
  let sessionYear;
  // find the current year (2019, 0, 1 is only in there for testing - it should be empty)
  const currentYear = dateFns.getYear(new Date());
  // is "now" during session or not?
  let duringSession;
  // create variable to store the date that session starts
  let sessionStartDate;

  // store date for sine die
  let sineDieDate;

  // get info for right now and store in variable "now" (2019, 2, 15 is only in for testting - should be blank)
  const now = new Date();
  // console.log('now: ', now);
  // create variable to store the end date for the countdown depending on when during the 2 year cycle you are
  let end;
  // console.log('currentYear: ', currentYear);

  // function to get the 1st day of a legislative session
  function getDate(year) {
    let startDate = dateFns.startOfYear(new Date(year, 0, 1));
    while (!dateFns.isTuesday(startDate)) {
      startDate = dateFns.addDays(startDate, 1);
    }
    sessionStartDate = dateFns.addDays(startDate, 7);
    sessionStartDate = dateFns.addHours(sessionStartDate, 12);
    // console.log('sSD: ', sessionStartDate);
    // sineDieDate = dateFns.addDays(sessionStartDate, 139);
    // console.log('sessionStartDate: ', sessionStartDate);
    // console.log('sineDieDate: ', sineDieDate);
  }

  if (currentYear % 2 === 0) {
    console.log('In an even year');
    // In even year so need to get sessionStartDate for next year
    // So session year has to be next year
    sessionYear = currentYear + 1;
    getDate(sessionYear);
    // in this scenario, we're counting down to when session starts
    end = sessionStartDate;
    // this time period is not during session
    duringSession = false;
    // console.log('countdown end: ', end);
    // console.log('duringSession: ', duringSession);
  } else {
    //You're in an odd year now
    console.log('In an odd year');
    sessionYear = currentYear;
    // get session start date for the current year (it may or may not already have passed)
    getDate(sessionYear);
    // when is sine die of this year?
    sineDieDate = dateFns.addDays(sessionStartDate, 139);
    sineDieDate = dateFns.subHours(sineDieDate, 12);
    // console.log(
    //   'sessionStartDate when you get to odd year code: ',
    //   sessionStartDate
    // );
    // console.log(
    //   'sine die date at first getting to odd year code: ',
    //   sineDieDate
    // );
    // console.log('sessionYear: ', sessionYear);
    // If you're in session:
    if (
      dateFns.isBefore(sessionStartDate, now) &&
      dateFns.isBefore(now, sineDieDate)
    ) {
      duringSession = true;
      console.log('In the middle of session in an odd year');
      end = sineDieDate;
      // console.log('during session end: ', end);
      // Not in session but during session year and before session start date
    } else if (dateFns.isBefore(now, sessionStartDate)) {
      duringSession = false;
      end = sessionStartDate;
      console.log('In an odd year before session starts');
      // console.log('before session during session year end: ', end);
      // Not in session but in session year and after sine die
    } else {
      console.log('In an odd year after session has ended');
      const nextSessionYear = sessionYear + 2;
      console.log('nSY: ', nextSessionYear);
      getDate(nextSessionYear);
      end = sessionStartDate;
      // Not in session but after sine die
      duringSession = false;
      // end = next session start date 2 years away

      // getDate(sessionYear + 2);
      // end = sessionStartDate;
      // console.log('after sine die end: ', end);
    }
  }
  console.log('now: ', now);
  console.log('end: ', end);

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

// Main Dataset (Rosh Hashanah, Yom Kippur, Easter & Good Friday are only good thru 2020 dates)
const data = [
  {
    name: 'Christmas Day',
    type: 'holiday',
    dateType: 'static',
    month: 11,
    date: 25,
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
    type: 'other',
    dateType: 'static',
    month: 2,
    date: 14,
  },
  {
    name: "Harry Potter's Birthday",
    type: 'other',
    dateType: 'static',
    month: 6,
    date: 31,
  },
  {
    name: 'Original Star Wars premier in 1977',
    type: 'other',
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

// Legislative dates
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

function renderMonth(change) {
  // First check to see if this is the initial run of the function on page load with
  // change = 0
  if (change !== 0) {
    // The rest of this is setting up what the month and year are that are needed to filter
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

  // Show current month & year in calendar title
  calendarTitle.textContent = `${months[currentMonth]} ${currentYear}`;

  // How many days in the current month?
  const monthDays = dateFns.getDaysInMonth(new Date(currentYear, currentMonth));
  // // What's the first day of the month?
  const firstDay = dateFns.startOfMonth(new Date(currentYear, currentMonth));
  const firstDayNum = dateFns.getDay(firstDay);

  // Empty arrays to push calendar data into
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
      // Is item's date.weekday the first day of the month?
      // If so, start the next calculation
      // If not, keep adding 1 until they match up
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
      // After matching up weekday days, next calc here
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
  // Populate Calendar

  // Push 1st calendar block into array with style to put it into 1st day of month
  calendarInfo.push(
    `<div class="cal__block" style="grid-column-start: ${firstDayNum +
      1};"><div class="cal__date">${1}</div>`
  );

  // Check if any calendar items in the final dataset occur on the 1st of the month
  finalData.forEach(item => {
    if (item.date === 1) {
      calendarInfo.push(
        `<div class="cal__item ${item.type}">${item.name}</div>`
      );
      calendarInfoMobile.push(
        `<div class="cal__item--mobile ${item.type}">${item.date}st ${
          item.name
        }</div>`
      );
    }
  });

  // Close div tag of 1st day of month
  calendarInfo.push(`</div>`);

  // Populate the rest of month's dates
  for (var i = 2; i < monthDays + 1; i++) {
    calendarInfo.push(
      `<div class="cal__block"><div class="cal__date">${i}</div>`
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
            <div class="cal__item ${item.type}">${item.name}</div>
          `);
        calendarInfoMobile.push(
          `<div class="cal__item--mobile ${item.type}">${item.date}${suffix} ${
            item.name
          }</div>`
        );
      }
    });

    calendarInfo.push(`</div>`);
  }

  // Render calendar(s)
  calendarGrid.innerHTML = calendarInfo.join('');
  calendarMobile.innerHTML = calendarInfoMobile.join('');
}

// Initial calendar render
renderMonth(0);
