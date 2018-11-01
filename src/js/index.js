const clockMessage = document.querySelector('.clock__message');
const time = document.querySelector('.clock__time');
const calendarTitle = document.querySelector('.cal__title');
const calendarGrid = document.querySelector('.cal__grid');
const leftBtn = document.querySelector('.cal__btn--left');
const rightBtn = document.querySelector('.cal__btn--right');
const calendarEvents = document.querySelector('.cal__events');
const actions = document.querySelectorAll('.cal__btn');
const calBlocks = document.querySelectorAll('.cal__block');

actions.forEach(action => {
  action.addEventListener('touchstart', e => {
    action.classList.add('hover');
    e.preventDefault();
  });
  action.addEventListener('touchend', () => {
    action.classList.remove('hover');
    if (action.classList.contains('cal__btn--left')) {
      renderMonth(-1);
    } else if (action.classList.contains('cal__btn--right')) {
      renderMonth(1);
    }
  });
  action.addEventListener('mouseover', () => {
    action.classList.add('hover');
  });
  action.addEventListener('mouseout', () => {
    action.classList.remove('hover');
  });
});

leftBtn.addEventListener('click', () => {
  renderMonth(-1);
});
rightBtn.addEventListener('click', () => {
  renderMonth(1);
});

// Set globally used variables
let currentYear = dateFns.getYear(new Date());
let currentMonth = dateFns.getMonth(new Date());

// ***********************************************************************************
// Start of Countdown Clock Code

function countdown() {
  // Create variable to store what the year of session will be
  let sessionYear;
  // Find current year
  const currentYear = dateFns.getYear(new Date());
  // Store whether or not current time is during session
  let duringSession;
  // Create variable to store the date that session starts
  let sessionStartDate;
  // Store date for Sine Die
  let sineDieDate;
  // Now means now
  const now = new Date();
  let end;

  // Set the first day of a legislative session
  function getDate(year) {
    let startDate = dateFns.startOfYear(new Date(year, 0, 1));
    while (!dateFns.isTuesday(startDate)) {
      startDate = dateFns.addDays(startDate, 1);
    }
    sessionStartDate = dateFns.addDays(startDate, 7);
    sessionStartDate = dateFns.addHours(sessionStartDate, 12);
  }

  if (currentYear % 2 === 0) {
    // In even year so need to get sessionStartDate for next year
    sessionYear = currentYear + 1;
    getDate(sessionYear);
    // Countdown ends when session starts
    end = sessionStartDate;
    duringSession = false;
  } else {
    // Odd year
    sessionYear = currentYear;
    // Get sessionStartDate for current year
    getDate(sessionYear);
    // Calculate Sine Die date
    sineDieDate = dateFns.addDays(sessionStartDate, 139);
    sineDieDate = dateFns.subHours(sineDieDate, 12);

    if (
      // If during session
      dateFns.isBefore(sessionStartDate, now) &&
      dateFns.isBefore(now, sineDieDate)
    ) {
      duringSession = true;
      end = sineDieDate;
    } else if (dateFns.isBefore(now, sessionStartDate)) {
      // In a session year before session has started
      duringSession = false;
      end = sessionStartDate;
    } else {
      // In a session year after session has ended
      const nextSessionYear = sessionYear + 2;
      getDate(nextSessionYear);
      end = sessionStartDate;
      duringSession = false;
    }
  }
  // console.log('now: ', now);
  // console.log('end: ', end);

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
    clockMessage.innerText = `YOUR LIFE RESUMES IN:`;
  } else {
    clockMessage.innerText = `YOUR LIFE ENDS IN:`;
  }

  time.innerHTML = `
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
    <li class="clock__time--labels clock__time--hours">Hours</li>
    <li class="clock__time--labels clock__time--minutes">Minutes</li>
    <li class="clock__time--labels clock__time--seconds">Seconds</li>
`;
}

setInterval(countdown, 1000);
countdown();

// ******************************************************************************
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
    name: "Valentine's Day",
    type: 'holiday',
    dateType: 'static',
    month: 1,
    date: 14,
  },
  {
    name: "St. Patrick's Day",
    type: 'holiday',
    dateType: 'static',
    month: 2,
    date: 17,
  },
  {
    name: 'Tax Day',
    type: 'holiday',
    dateType: 'static',
    month: 3,
    date: 15,
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
    name: 'Black Friday',
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
    name: 'Cinco de Mayo',
    type: 'holiday',
    dateType: 'static',
    month: 4,
    date: 5,
  },
  {
    name: "Mother's Day",
    type: 'holiday',
    dateType: 'flex',
    month: 4,
    date: {
      nth: 2,
      weekday: 0,
    },
  },
  {
    name: "Father's Day",
    type: 'holiday',
    dateType: 'flex',
    month: 5,
    date: {
      nth: 3,
      weekday: 0,
    },
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
    name: 'Easter Sunday',
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
  {
    name: 'End of Fiscal Year',
    type: 'legislative',
    dateType: 'static',
    month: 7,
    date: 31,
  },
  {
    name: 'Halloween',
    type: 'holiday',
    dateType: 'static',
    month: 9,
    date: 31,
  },
  {
    name: "Dan Buda's Wife's Birthday",
    type: 'other',
    dateType: 'static',
    month: 6,
    date: 13,
  },
  {
    name: "New Year's Eve",
    type: 'holiday',
    dateType: 'static',
    month: 11,
    date: 31,
  },
  {
    name: 'Columbus Day',
    type: 'holiday',
    dateType: 'flex',
    month: 9,
    date: {
      nth: 2,
      weekday: 1,
    },
  },
  {
    name: 'Daylight Savings Time Starts',
    type: 'holiday',
    dateType: 'flex',
    month: 2,
    date: {
      nth: 2,
      weekday: 0,
    },
  },
  {
    name: 'Daylight Savings Time Ends',
    type: 'holiday',
    dateType: 'flex',
    month: 10,
    date: {
      nth: 1,
      weekday: 0,
    },
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
      'First day the senate can consider bills and resolutions on the 1st day they are place on the Intent Calendar',
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
  // Is this the initial run of the function on page load?
  if (change !== 0) {
    // Determine which month/year calendar should show on button click
    if (change === 1) {
      // If month will change from Dec to Jan
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
      // If month will change from Jan to Dec
      if (currentMonth === 0) {
        // Set values of currentMonth and currentYear to Dec of previous year
        currentMonth = 11;
        --currentYear;
      } else {
        // Decrease month by 1 if year didn't change
        --currentMonth;
      }
    }
  }

  // Show current month & year in calendar title
  calendarTitle.textContent = `${months[currentMonth]} ${currentYear}`;

  // Number of days in the current month
  const monthDays = dateFns.getDaysInMonth(new Date(currentYear, currentMonth));
  // First day of the month
  const firstDay = dateFns.startOfMonth(new Date(currentYear, currentMonth));
  const firstDayNum = dateFns.getDay(firstDay);

  // Empty arrays to push calendar data into
  let calendar = [];
  let calendarInfo = [];

  // Pull out only calendar dates (excluding session dates) and put them in a separate array
  const thisMonthData = data.filter(item => item.month === currentMonth);
  // Calculate the dates for flex dateType items and return all non-sesion dates to a finalData array
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

  //Push 1st calendar block into array with style to put it into 1st day of month
  calendar.push(
    `<div class="cal__block" style="grid-column-start: ${firstDayNum +
      1};"><div class="cal__date">${1}</div></div>`
  );

  // Check if any calendar items in the final dataset occur on the 1st of the month
  // finalData.forEach(item => {
  //   // if (item.date === 1) {
  //   //   calendarInfo.push(
  //   //     `<div class="cal__item ${item.type}">${item.name}</div>`
  //   //   );
  //   calendarInfo.push(
  //     `<p class="cal__events--date">${
  //       item.date
  //     }st</p><p class="cal__events--name ${item.type}">${item.name}</p>`
  //   );
  //   // }
  // });

  // Close div tag of 1st day of month
  // calendarInfo.push(`</div>`);

  // Populate the rest of month's dates
  for (var i = 2; i < monthDays + 1; i++) {
    calendar.push(
      `<div class="cal__block"><div class="cal__date">${i}</div></div>`
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
        // calendarInfo.push(`
        //     <div class="cal__item ${item.type}">${item.name}</div>
        //   `);
        calendarInfo.push(
          `<p class="cal__events--date">${
            item.date
          }${suffix}</p><p class="cal__events--name ${item.type}">${
            item.name
          }</p>`
        );
      }
    });

    calendarInfo.push(`</div>`);
  }

  // Render calendar
  calendarGrid.innerHTML = calendar.join('');
  calendarEvents.innerHTML = calendarInfo.join('');

  // if year/month/date matches then change current date background in calendar grid
  // need to give each grid date block a unique id
  if (
    dateFns.getYear(new Date()) === currentYear &&
    dateFns.getMonth(new Date()) === currentMonth
  ) {
    console.log('yay');
    console.log(calBlocks);
  }
}

// Initial calendar render
renderMonth(0);
