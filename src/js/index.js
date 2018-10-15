const sessionMessage = document.querySelector('.session-message');
const time = document.querySelector('.time');

const calendar = document.querySelector('.calendar');
const calendarTitle = document.querySelector('.calendar-title');
const calendarGrid = document.querySelector('.calendar-grid');

let sessionYear;
let sineDieDate;
let duringSession;

const currentYear = dateFns.getYear(new Date());

// Determine next session start and next sine die
// You'll need them for any calculation you need to do, so just
// figure them out at the start and set them to a const

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

setInterval(countdown, 1000);
countdown();

// Start Calendar Code

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

const calendarMonth = dateFns.getMonth(new Date());
calendarTitle.textContent = `${months[calendarMonth]} ${currentYear}`;

// How many days in the current month?
const monthDays = dateFns.getDaysInMonth(new Date());
console.log('month days: ', monthDays);

// What's the first day of the month?
const firstDay = dateFns.startOfMonth(new Date());
console.log('start of month:', firstDay);

// What day of the week is that first day?
const dayOfWeek = days[dateFns.getDay(new Date(firstDay))];

// Use firstDay to set where the calendar for that month starts in the calendar-view
// version and fill in the grid wrapping until the last day of the month
calendarGrid.innerHTML = `This month has ${monthDays} days and starts on a ${dayOfWeek}`;

// Start message of the day code

// Have specific messages for certain days (like my birthday) and probably set those
// with if statements before rendering the message. And if there's no specific message for that day,
// maybe just randomly choose form an array of options
