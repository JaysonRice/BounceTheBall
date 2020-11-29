export function uuid() {
  return ([1e7] + -1e3 + -4e3 + -8e3 + -1e11).replace(/[018]/g, (c) => (c ^ crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> c / 4).toString(16));
}

export function writeDynamoRecord(docClient, record) {
  const scoreRecord = {
    TableName: 'bounceTheBallScores',
    Item: record,
  };

  docClient.put(scoreRecord, (err, data) => {
    if (err) {
      console.log('error writing to dynamodb');
      console.log(err);
    } else {
      console.log('no error writing to dynamodb');
    }
  });
}
