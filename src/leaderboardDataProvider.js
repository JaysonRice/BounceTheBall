export const gotData = (data) => {
    const scores = data.val();
    const keys = Object.keys(scores);

    keys.forEach(k => {
        let name = scores[k].name;
        let score = scores[k].score;
        return (name, score)
    });
}

export const errData = (err) => {
    console.log('Error!');
    console.log(err);
}