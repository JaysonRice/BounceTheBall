export const readSpriteSheet = (spriteSheet, spriteData) => {
    const { frames } = spriteData;
    const animation = [];
    for (let i = 0; i < frames.length; i += 1) {
        const pos = frames[i].position;
        const img = spriteSheet.get(pos.x, pos.y, pos.w, pos.h);
        animation.push(img);
    }

    return animation;
};