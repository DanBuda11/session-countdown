// "dateFns." is the syntax for date-fns

// Get current year to determine if we're in an odd or even # year

// If current year even, then figure out session start date for the next year
// If current year odd, then figure out ...

// You need to figure out if you're before SESSION START or before SINE DIE.
// You're always before SESSION START in an even year
// But if in an odd year, you need to figure out whether you're:
// before session start (show clock until session starts)
// after sine die (show clock until session starts)
// between session start and sine die (show clock until sine die)

// if (in even year OR in odd year AND before session start OR after sine die)
// then show countdown to session clock
// if (in odd year AND after session start AND before sine die)
// show countdown to sine die clock

// const days = document.querySelector('.days');
// const hours = document.querySelector('.hours');
// const minutes = document.querySelector('.minutes');
// const seconds = document.querySelector('.seconds');
const sessionMessage = document.querySelector('.session-message');
const time = document.querySelector('.time');

let sessionYear;
let sineDieDate;
let duringSession;

const currentYear = dateFns.getYear(new Date());
// console.log('currentYear: ', currentYear);

// Determine next session start and next sine die
// You'll need them for any calculation you need to do, so just
// figure them out at the start and set them to a const

// Determine if odd or even year then if even, add a year to currentYear
if (currentYear % 2 === 0) {
  sessionYear = currentYear + 1;
} else {
  sessionYear = currentYear;
}
// console.log('sessionYear:', sessionYear);
// Find the start of the sessionYear

// let beginning = dateFns.startOfYear(new Date(sessionYear, 0, 1));
// console.log('beginning', beginning);

let januaryOne = dateFns.startOfYear(new Date(sessionYear, 0, 1));
// console.log('januaryOne:', januaryOne);

let sessionStartDate = januaryOne;

// If year starts on a Tuesday, add 7 days to startOfYear and that will be beginning day of session (2nd Tuesday)
// if (dateFns.isTuesday(startOfYear)) {
//   sessionStartDate = dateFns.addDays(startOfYear, 7);
// }

// console.log(dateFns.isWednesday(januaryOne));

// if (dateFns.isTuesday(startofYear)) {
//   sessionStartDate = dateFns.addDays(startOfYear, 7);
// } else {

// }

// If year does not start on a Tuesday, keep adding a day at a time and checking, then add 7 days for the 2nd Tuesday
while (!dateFns.isTuesday(sessionStartDate)) {
  sessionStartDate = dateFns.addDays(sessionStartDate, 1);
  // console.log('while running');
}
sessionStartDate = dateFns.addDays(sessionStartDate, 7);
// console.log('sessionStartDate Final: ', sessionStartDate);

// So when is Sine Die?
sineDieDate = dateFns.addDays(sessionStartDate, 140);
// console.log('sineDieDate: ', sineDieDate);

// Next, figure out if we are during session and need to calculate time until Sine Die,
// or before session and need to calculate time until session starts
// Set a boolean for "duringSession"

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
  // console.log('duringSession: ', duringSession);

  // Calculate time left until (session start, sine die)
  const daysLeft = -dateFns.differenceInDays(now, end);
  // console.log('daysLeft: ', daysLeft);

  const hoursLeft = -dateFns.differenceInHours(
    dateFns.addDays(now, daysLeft),
    end
  );
  // console.log('hoursLeft: ', hoursLeft);

  const minutesLeft = -dateFns.differenceInMinutes(
    dateFns.addHours(dateFns.addDays(now, daysLeft), hoursLeft),
    end
  );
  // console.log('minutesLeft: ', minutesLeft);

  const secondsLeft = -dateFns.differenceInSeconds(
    dateFns.addMinutes(
      dateFns.addHours(dateFns.addDays(now, daysLeft), hoursLeft),
      minutesLeft
    ),
    end
  );
  // console.log('secondsLeft: ', secondsLeft);

  if (duringSession === true) {
    sessionMessage.innerText = `Your life will begin anew in:`;
  } else {
    sessionMessage.innerText = `Your life ends in:`;
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

// else {
//   console.log('figure out non-Tuesdays');
//   console.log(dateFns.addDays(startOfYear, 7));
// }
// const now = new Date();
// const currentYear = now.getFullYear();
// console.log('currentYear: ', currentYear);
// console.log(typeof currentYear);
// const nextSessionStart = 'next session start date';
// const nextSineDie = 'next sine die date';

// if (currentYear % 2 === 0) {
//   console.log('even year');
// } else {
//   console.log('odd year');
// }
