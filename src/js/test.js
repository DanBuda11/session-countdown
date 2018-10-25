function countdown() {
  let sessionYear;

  const currentYear = dateFns.getYear(new Date(2019, 0, 1));

  let duringSession;

  let sessionStartDate;

  let nextSessionStartDate;

  let sineDieDate;

  const now = new Date(2019, 2, 15);
  console.log('now: ', now);
  let end;
  console.log('currentYear: ', currentYear);

  function getDate(year) {
    let startDate = dateFns.startOfYear(new Date(year, 0, 1));
    while (!dateFns.isTuesday(startDate)) {
      startDate = dateFns.addDays(startDate, 1);
    }
    sessionStartDate = dateFns.addDays(startDate, 7);
    // sineDieDate = dateFns.addDays(sessionStartDate, 139);
    console.log('sessionStartDate: ', sessionStartDate);
    // console.log('sineDieDate: ', sineDieDate);
  }

  if (currentYear % 2 === 0) {
    // In even year so need to get sessionStartDate for next year
    // So session year has to be next year
    sessionYear = currentYear + 1;
    getDate(sessionYear);
    end = sessionStartDate;
    duringSession = false;
    console.log('countdown end: ', end);
    console.log('duringSession: ', duringSession);
  } else {
    //You're in an odd year now
    sessionYear = currentYear;
    getDate(sessionYear);
    sineDieDate = dateFns.addDays(sessionStartDate, 139);
    console.log(
      'sessionStartDate when you get to odd year code: ',
      sessionStartDate
    );
    console.log(
      'sine die date at first getting to odd year code: ',
      sineDieDate
    );
    // console.log('sessionYear: ', sessionYear);
    // If you're in session:
    if (
      dateFns.isBefore(sessionStartDate, now) &&
      dateFns.isBefore(now, sineDieDate)
    ) {
      duringSession = true;
      end = sineDieDate;
      console.log('during session end: ', end);
      // Not in session but during session year and before session start date
    } else if (dateFns.isBefore(now, sessionStartDate)) {
      duringSession = false;
      end = sessionStartDate;
      console.log('before session during session year end: ', end);
    } else {
      // Not in session but after sine die
      // duringSession = false;
      // getDate(sessionYear + 2);
      // end = sessionStartDate;
      // console.log('after sine die end: ', end);
    }
  }

  if (
    dateFns.isBefore(sessionStartDate, now) &&
    dateFns.isAfter(sineDieDate, now)
  ) {
    // duringSession determines which message shows above countdown clock
    duringSession = true;
    end = sineDieDate;
  }

  console.log('sine die date: ', sineDieDate);
  // // when is next session start date and sine die?
  // const januaryOne = dateFns.startOfYear(new Date(sessionYear, 0, 1));
  // console.log('January 1 of session year: ', januaryOne);
  // let sessionStartDate = januaryOne;

  // while (!dateFns.isTuesday(sessionStartDate)) {
  //   sessionStartDate = dateFns.addDays(sessionStartDate, 1);
  // }
  // sessionStartDate = dateFns.addDays(sessionStartDate, 7);

  // // Date of Sine Die
  // sineDieDate = dateFns.addDays(sessionStartDate, 139);
}

countdown();
