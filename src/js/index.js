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

const currentYear = dateFns.getYear(new Date());
console.log(currentYear);
// const now = new Date();
// const currentYear = now.getFullYear();
// console.log('currentYear: ', currentYear);
// console.log(typeof currentYear);
// const nextSessionStart = 'next session start date';
// const nextSineDie = 'next sine die date';

if (currentYear % 2 === 0) {
  console.log('even year');
} else {
  console.log('odd year');
}
