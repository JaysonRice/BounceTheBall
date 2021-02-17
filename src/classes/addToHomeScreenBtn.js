const isIos = (userAgent) => {
  const ua = userAgent || window.navigator.userAgent;
  return /iPhone|iPad|iPod/i.test(ua);
};

const isIosSafari = () => {
  const ua = window.navigator.userAgent;
  const iOS = isIos(ua);
  const webkit = /WebKit/i.test(ua);
  return iOS && webkit && !/CriOS/i.test(ua);
};

const isInStandaloneMode = () => ('standalone' in window.navigator) && (window.navigator.standalone);

export default class AddToHomeScreenButton {
  constructor({
    prompt, installed, fnt, x = 0, y = 0, fntSize = 30, iosToolTipImage = null,
  }) {
    this.x = x;
    this.y = y;
    this.fnt = fnt;
    this.fntSize = fntSize;

    this.text = '\uf019';
    this.prompt = prompt;

    this.isIos = isIos();
    this.isIosSafari = isIosSafari();
    if (this.isIos) {
      this.installed = isIos() && isInStandaloneMode();
      this.showIosToolTip = false;
      this.iosToolTipImage = iosToolTipImage;
    } else {
      this.installed = installed;
    }
  }

  get preventDraw() {
    // Don't draw if already installed or
    // if on iOS not in safari
    // (install only possible through safari afaik)
    return this.installed || (this.isIos && !this.isIosSafari);
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
    if (this.preventDraw) return false;

    const onX = abs(clickX - this.x) < this.width / 2;
    const onY = abs(clickY - this.y) < this.height / 2;
    return onX && onY;
  }

  defaultClickEvent() {
    if (this.prompt) {
      this.prompt.prompt();

      this.prompt.userChoice.then((choiceResult) => {
        if (choiceResult.outcome === 'accepted') {
          this.installed = true;
        }
      });
    }
  }

  clickEvent(clickX, clickY) {
    if (this.preventDraw) return;

    if (this.clicked(clickX, clickY)) {
      if (this.isIos) {
        this.showIosToolTip = true;
      } else {
        this.defaultClickEvent();
      }
    } else {
      this.showIosToolTip = false;
    }
  }

  drawIosToolTip() {
    if (!this.showIosToolTip || !this.iosToolTipImage) return;

    let imgW;
    let imgH;
    const maxW = width * 0.75;
    if (this.iosToolTipImage.width > maxW) {
      imgW = maxW;
      imgH = this.iosToolTipImage.height * (imgW / this.iosToolTipImage.width);
    } else {
      imgW = this.iosToolTipImage.width;
      imgH = this.iosToolTipImage.height;
    }

    push();
    imageMode(CENTER);
    const adjY = -(imgH / 2) * 1.05;
    image(this.iosToolTipImage, width / 2, height + adjY, imgW, imgH);
    pop();
  }

  draw() {
    if (this.preventDraw) return;

    push();
    noStroke();
    fill(128);
    ellipse(this.x, this.y * 1.0075, this.fntSize * 1.5);
    pop();

    push();
    fill(25);
    textFont(this.fnt);
    textSize(this.fntSize);
    textAlign(CENTER, CENTER);
    text(this.text, this.x, this.y);
    pop();

    this.drawIosToolTip();
  }
}
