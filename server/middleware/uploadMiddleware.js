const multer = require("multer")

const storage = multer.memoryStorage()

const allowedMimeTypes = [
  "application/pdf",

  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",

  "application/vnd.ms-excel",
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",

  "image/jpeg",
  "image/png",
  "image/webp",
]

const fileFilter = (
  req,
  file,
  callback
) => {
  if (
    allowedMimeTypes.includes(
      file.mimetype
    )
  ) {
    callback(null, true)
  } else {
    callback(
      new Error(
        "Only PDF, Word, Excel and image files are allowed."
      ),
      false
    )
  }
}

const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 10 * 1024 * 1024,
  },
})

module.exports = upload