const AWS = require("aws-sdk");
let s3 = new AWS.S3();

exports.handler = (event, context, callback) => {
  let recieved_request = JSON.stringify(event.img);
  let recieved_request_imageId = JSON.stringify(event.imageID);
  let recieved_request_ext = JSON.stringify(event.fileExt);
  let recieved_request_folder = JSON.stringify(event.folder);

  recieved_request = recieved_request.slice(1, -1);
  let filePath =
    recieved_request_imageId +
    "." +
    recieved_request_ext.replace('"', "").replace('"', "");
  let buffer = Buffer.from(
    recieved_request.replace(/^data:image\/\w+;base64,/, ""),
    "base64"
  );

  let params = {
    Key: filePath,
    Body: buffer,
    ContentEncoding: "base64",
    ContentType: "image/jpeg",
    Bucket: "react-ap-ocr-images",
  };

  s3.upload(params, function (err, data) {
    if (err) {
      callback(err, null);
    } else {
      let res = {
        statusCode: 200,
        headers: {
          "Content-Type": "application/json",
        },
      };
      res.body = "File Uploaded";
      callback(null, res);
    }
  });
};
