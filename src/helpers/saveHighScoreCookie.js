/**
 * Write a cookie with an expiration date
 * Source: https://stackoverflow.com/a/2138471/5731525
 *
 * @param {*} key name of cookie
 * @param {*} value value of cookie
 * @param {*} days how many days until cookie expires
 */
function setCookie(key, value, days) {
  let expires = '';
  if (days) {
    const date = new Date();
    date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
    expires = `; expires=${date.toUTCString()}`;
  }
  document.cookie = `${key}=${value || ''}${expires}; path=/`;
}

/**
 * Read the value of a cookie with a given name
 * Returns null if no cookie matching name is found
 *
 * Source: https://stackoverflow.com/a/2138471/5731525
 * @param {*} name name of cookie
 */
function getCookie(name) {
  const nameEQ = `${name}=`;
  const ca = document.cookie.split(';');
  for (let i = 0; i < ca.length; i += 1) {
    let c = ca[i];
    while (c.charAt(0) === ' ') c = c.substring(1, c.length);
    if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length, c.length);
  }
  return null;
}

/**
 * Delete a cookie by name
 *
 * Source: https://stackoverflow.com/a/2138471/5731525
 * @param {*} name name of cookie
 */
function eraseCookie(name) {
  document.cookie = `${name}=; Max-Age=-99999999;`;
}

export function readHighScoreCookie() {
  const highScoreStr = getCookie('high_score');
  const highScore = parseInt(highScoreStr, 10);
  if (highScore) {
    return highScore;
  }
  return -1;
}

export function writeHighScoreCookie(score) {
  const cookieName = 'high_score';
  const daysTillExpires = 7;

  const currentHighScore = readHighScoreCookie();

  if (score > currentHighScore) {
    setCookie(cookieName, score, daysTillExpires);
  }
}
