export const displayBestScore = (score, gameFont, x = 10, txtSize = 30) => {
  if (score === 0) return;

  push();

  fill(255, 30);
  strokeWeight(1);

  textFont(gameFont);
  textSize(txtSize);
  textAlign(LEFT);

  text(`Best: ${score}`, x, txtSize + x);
  pop();
};

export const displayScore = (score, gameFont, x = width / 2,
  y = height / 2, txtSize = 150) => {
  push();

  fill(255, 30);
  stroke(0);
  strokeWeight(1);

  textFont(gameFont);
  textSize(txtSize);
  textAlign(CENTER, CENTER);

  text(score, x, y);
  pop();
};
