if (!process.env.NODE_ENV) {
  require("dotenv").config();
}
const mongoose = require("mongoose");

mongoose.connect(process.env.MONGO_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const toolSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    link: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    tags: {
      type: Array,
      required: true,
    },
  },
  {
    versionKey: false,
  }
);

const usersSchema = new mongoose.Schema(
  {
    login: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
  },
  {
    versionKey: false,
  }
);

const toolsModel = mongoose.model("tools", toolSchema);
const usersModel = mongoose.model("users", usersSchema);

module.exports = { toolsModel, mongoose, usersModel };
