export default class AddToHomeSceenButton {
  constructor({
    prompt, installed, fnt, x = 0, y = 0, fntSize = 30,
  }) {
    this.x = x;
    this.y = y;
    this.fnt = fnt;
    this.fntSize = fntSize;

    this.text = '\uf019';

    this.installed = installed;
    this.prompt = prompt;
  }

  get width() {
    push();
    textFont(this.fnt);
    textSize(this.fntSize);
    const w = textWidth(this.text);
    pop();
    return w;
  }

  get height() {
    return this.fntSize;
  }

  clicked(clickX, clickY) {
    if (this.installed) return false;

    const onX = abs(clickX - this.x) < this.width / 2;
    const onY = abs(clickY - this.y) < this.height / 2;
    return onX && onY;
  }

  clickEvent(clickX, clickY) {
    if (this.clicked(clickX, clickY) && this.prompt) {
      this.prompt.prompt();

      this.prompt.userChoice.then((choiceResult) => {
        if (choiceResult.outcome === 'accepted') {
          this.installed = false;
        }
      });
    }
  }

  draw() {
    if (this.installed) return;

    push();
    textFont(this.fnt);
    textSize(this.fntSize);
    textAlign(CENTER, CENTER);
    text(this.text, this.x, this.y);
    pop();
  }
}
