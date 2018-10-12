const sessionMessage = document.querySelector('.session-message');
const time = document.querySelector('.time');

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
