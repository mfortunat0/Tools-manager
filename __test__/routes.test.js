const request = require("supertest");
const jwt = require("jsonwebtoken");
const app = require("../src/server");
const { mongoose, toolsModel, usersModel } = require("../database/schema");
const key = process.env.JWT_KEY;

beforeAll(() => {
  new toolsModel({
    title: "title",
    link: "link",
    description: "description",
    tags: ["item1"]
  }).save();

  new usersModel({
    login: "test2",
    password: "test2"
  }).save();
});

afterAll(async () => {
  mongoose.connection.db.dropDatabase();
  mongoose.disconnect();
});

describe("Test router tools", () => {
  test("post", async () => {
    const data = await request(app)
      .post("/tools")
      .send({
        title: "title2",
        link: "link2",
        description: "description2",
        tags: ["item2"]
      });
    expect(data.statusCode).toEqual(201);
  });

  test("get all", async () => {
    const data = await request(app).get("/tools");
    expect(data.statusCode).toEqual(200);
  });

  test("get by parameter", async () => {
    const data = await request(app).get("/tools?tag=item1");
    expect(data.statusCode).toEqual(200);
  });

  test("get by id", async () => {
    const result = await toolsModel.findOne();
    const data = await request(app).get(`/tools/${result._id}`);
    expect(data.statusCode).toBe(200);
  });

  test("put by id", async () => {
    const result = await toolsModel.findOne();
    const data = await request(app)
      .get(`/tools/${result._id}`)
      .send({
        title: "title3",
        link: "link3",
        description: "description3",
        tags: ["item3"]
      });
    expect(data.statusCode).toEqual(200);
  });

  test("delete", async () => {
    const result = await toolsModel.find();
    const data = await request(app).delete(`/tools/${result[0]._id}`);
    expect(data.statusCode).toBe(204);
  });
});

describe("Test router register", () => {
  test("post", async () => {
    const data = await request(app)
      .post("/register")
      .send({
        login: "test",
        password: "test"
      });
    expect(data.statusCode).toEqual(200);
  });
});

describe("Test router login", () => {
  test("post", async () => {
    const data = await request(app)
      .post("/login")
      .send({
        login: "test2",
        password: "test2"
      });
    const result = await usersModel.findOne();
    const jwt_id = await jwt.verify(data.body, key);
    expect(jwt_id.id).toEqual(result._id.toString());
  });
});
