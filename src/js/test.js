const time = document.querySelector('.time');
const clockMessage = document.querySelector('.clock__message');

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

// setInterval(countdown, 1000);
countdown();
