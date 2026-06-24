const mongoose = require("mongoose");

exports.uploadFile = async (req, res) => {
try {
if (!req.file) {
return res.status(400).json({
message: "No file uploaded",
});
}

```
const bucket = new mongoose.mongo.GridFSBucket(
  mongoose.connection.db,
  {
    bucketName: "uploads",
  }
);

const uploadStream = bucket.openUploadStream(
  req.file.originalname
);

uploadStream.end(req.file.buffer);

uploadStream.on("finish", () => {
  res.status(201).json({
    message: "File uploaded successfully",
    filename: uploadStream.filename,
    id: uploadStream.id,
  });
});

uploadStream.on("error", (err) => {
  res.status(500).json({
    message: err.message,
  });
});
```

} catch (err) {
res.status(500).json({
message: err.message,
});
}
};

exports.getFile = async (req, res) => {
try {
const bucket = new mongoose.mongo.GridFSBucket(
mongoose.connection.db,
{
bucketName: "uploads",
}
);

```
const files = await mongoose.connection.db
  .collection("uploads.files")
  .find({ filename: req.params.filename })
  .toArray();

if (!files.length) {
  return res.status(404).json({
    message: "File not found",
  });
}

bucket.openDownloadStreamByName(req.params.filename).pipe(res);
```

} catch (err) {
res.status(500).json({
message: err.message,
});
}
};

exports.deleteFile = async (req, res) => {
try {
const file = await mongoose.connection.db
.collection("uploads.files")
.findOne({
filename: req.params.filename,
});

```
if (!file) {
  return res.status(404).json({
    message: "File not found",
  });
}

const bucket = new mongoose.mongo.GridFSBucket(
  mongoose.connection.db,
  {
    bucketName: "uploads",
  }
);

await bucket.delete(file._id);

res.json({
  message: "File deleted successfully",
});
```

} catch (err) {
res.status(500).json({
message: err.message,
});
}
};
