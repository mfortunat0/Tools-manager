if (!process.env.NODE_ENV) {
  require("dotenv").config();
}
const express = require("express");
const jwt = require("jsonwebtoken");
const { toolsModel, usersModel } = require("../database/schema");
const router = express.Router();

const middleware_jwt = async (req, res, next) => {
  try {
    const key = process.env.JWT_KEY;
    if (req.headers.authorization) {
      const token = req.headers.authorization.split(" ")[1];

      jwt.verify(token, key, (error, id) => {
        if (error) {
          res.status(401).json();
        } else {
          req.user = id;
          next();
        }
      });
    } else {
      const { login, password } = req.body;
      const result = await usersModel.findOne({ login, password });
      if (result.login && result.password) {
        const hash = await jwt.sign({ id: result._id }, key, {
          expiresIn: "1d",
        });
        res.status(200).json(hash);
      } else {
        res.status(400).json();
      }
    }
  } catch (error) {
    res.status(400).json();
  }
};

router.post("/login", middleware_jwt, async (req, res) => {
  try {
    const result = await usersModel.findById(req.user.id);
    res.status(200).json(result);
  } catch (error) {
    res.status(204).json();
  }
});

router.post("/register", async (req, res) => {
  try {
    const { login, password } = req.body;
    const data = new usersModel({ login, password });
    data.save();
    res.status(200).json();
  } catch (error) {
    res.status(400).json();
  }
});

router.get("/tools", async (req, res) => {
  try {
    if (req.query.tag) {
      const result = await toolsModel.find({ tags: { $in: req.query.tag } });

      if (result.length > 0) {
        res.status(200).json(result);
      } else {
        res.status(204).json();
      }
    } else {
      const result = await toolsModel.find();

      if (result.length > 0) {
        res.status(200).json(result);
      } else {
        res.status(204).json();
      }
    }
  } catch (error) {
    res.status(204).json();
  }
});

router.get("/tools/:id", async (req, res) => {
  try {
    const result = await toolsModel.findById(req.params.id);
    res.status(200).json(result);
  } catch (err) {
    res.status(204).json();
  }
});

router.post("/tools", async (req, res) => {
  try {
    const { title, link, description, tags } = req.body;
    if ((title, link, description, tags)) {
      const data = new toolsModel({
        title,
        link,
        description,
        tags,
      });
      data.save();
      res.status(201).json(data);
    } else {
      res.status(400).json();
    }
  } catch (error) {
    res.status(400).json();
  }
});

router.put("/tools/:id", async (req, res) => {
  try {
    const { title, link, description, tags } = req.body;
    const result = await toolsModel.updateOne(
      { _id: req.params.id },
      { title, link, description, tags }
    );
    if (result.nModified > 0) {
      res.status(202).json();
    } else {
      res.status(400).json();
    }
  } catch (err) {
    res.status(400).json();
  }
});

router.delete("/tools/:id", async (req, res) => {
  try {
    const result = await toolsModel.deleteOne({ _id: req.params.id });
    if (result.deletedCount > 0) {
      res.status(204).json();
    } else {
      res.status(400).json();
    }
  } catch (err) {
    res.status(400).json();
  }
});

module.exports = router;
