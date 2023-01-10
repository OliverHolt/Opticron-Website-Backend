const app = require("../app.js");
const request = require("supertest");
const db = require("../db/connection.js");
const seed = require("../db/seeds/seed.js");
const allData = require("../db/data/test-data/index.js");
const { expect } = require("@jest/globals");

beforeEach(() => seed(allData));
afterAll(() => db.end());

describe("/api", () => {
  test("shows all the available endpoints of the api", () => {
    return request(app)
      .get("/api")
      .expect(200)
      .then((response) => {
        expect(response.body).toMatchObject({
          "GET /api": {
            description:
              "serves up a json representation of all the available endpoints of the api",
          },
          "GET /api/toilets": {
            description: "serves an array of all toilets",
            queries: [],
            exampleResponse: {
              toilets: [
                {
                  place_id: "ChIJHU4KKBWPcUgRlC0duA5KlBA",
                  name: "St George's Public Toilets",
                  formatted_address:
                    "197 Lyndale Rd, Bristol BS5 7AA, United Kingdom",
                  business_status: "OPERATIONAL",
                },
              ],
            },
          },
          "GET /api/users": {
            description: "serves an array of all users",
            queries: [],
            exampleResponse: {
              users: [
                {
                  username: "example_username",
                  email: "example@example.com",
                  avatar_url: "https://example.com/image_source.jpg",
                  password:
                    "2cf24dba5fb0a30e26e83b2ac5b9e29e1b161e5c1fa7425e73043362938b9824",
                },
              ],
            },
          },
          "GET /api/reviews": {
            description: "serves an array of all reviews of all toilets",
            queries: [],
            exampleResponse: {
              reviews: [
                {
                  review_id: 1,
                  body: "Example review here",
                  toilet_id: "a",
                  author: "example_username",
                  votes: 0,
                  created_at: "2020-05-21T23:19:00.000Z",
                },
              ],
            },
          },
          "GET /api/toilets/:toilet_id/reviews": {
            description: "serves an array of all reviews for a specific toilet",
            queries: [],
            exampleResponse: {
              reviews: [
                {
                  review_id: 1,
                  body: "Example review here",
                  toilet_id: "a",
                  author: "example_username",
                  votes: 0,
                  created_at: "2020-05-21T23:19:00.000Z",
                },
              ],
            },
          },
          "POST /api/toilets": {
            description: "posts a new toilet to the database",
            queries: [
              "place_id",
              "name",
              "formatted_address",
              "business_status",
            ],
            exampleResponse: {
              toilets: [
                {
                  place_id: "ChIJHU4KKBWPcUgRlC0duA5KlBA",
                  name: "St George's Public Toilets",
                  formatted_address:
                    "197 Lyndale Rd, Bristol BS5 7AA, United Kingdom",
                  business_status: "OPERATIONAL",
                },
              ],
            },
          },
          "POST /api/users": {
            description: "posts a new user to the database",
            queries: ["username", "email", "passowrd"],
            exampleResponse: {
              toilets: [
                {
                  username: "example_username",
                  email: "example@example.com",
                  avatar_url: "https://example.com/image_source.jpg",
                  password:
                    "2cf24dba5fb0a30e26e83b2ac5b9e29e1b161e5c1fa7425e73043362938b9824",
                },
              ],
            },
          },
          "POST /api/toilets/:toilet_id/reviews": {
            description: "posts a review for a specific toilet",
            queries: ["body", "toilet_id", "username"],
            exampleResponse: {
              reviews: [
                {
                  review_id: 1,
                  body: "Example review here",
                  toilet_id: "a",
                  author: "example_username",
                  votes: 0,
                  created_at: "2020-05-21T23:19:00.000Z",
                },
              ],
            },
          },
        });
      });
  });
});

describe("/api/users", () => {
  test("GET:200, an array of user objects with the correct properties", () => {
    return request(app)
      .get("/api/users")
      .expect(200)
      .then((response) => {
        expect(response.body.users).toEqual(expect.any(Array));
        expect(response.body.users).not.toHaveLength(0);
        response.body.users.forEach((user) => {
          expect(Object.keys(user)).toEqual(
            expect.arrayContaining([
              "username",
              "email",
              "avatar_url",
              "password",
            ])
          );
        });
      });
  });
});

describe("/api/reviews", () => {
  test("GET:200, an array of review objects with the correct properties", () => {
    return request(app)
      .get("/api/reviews")
      .expect(200)
      .then((response) => {
        expect(response.body.topics).toEqual(expect.any(Array));
        expect(response.body.topics).not.toHaveLength(0);
        response.body.topics.forEach((review) => {
          expect(Object.keys(review)).toEqual(
            expect.arrayContaining([
              "review_id",
              "body",
              "toilet_id",
              "author",
              "votes",
              "created_at",
            ])
          );
        });
      });
  });
});

describe("/api/toilets", () => {
  test("GET:200, an array of toilet objects with the correct properties", () => {
    return request(app)
      .get("/api/toilets")
      .expect(200)
      .then((response) => {
        expect(response.body.topics).toEqual(expect.any(Array));
        expect(response.body.topics).not.toHaveLength(0);
        response.body.topics.forEach((toilet) => {
          expect(Object.keys(toilet)).toEqual(
            expect.arrayContaining([
              "place_id",
              "name",
              "formatted_address",
              "business_status",
            ])
          );
        });
      });
  });

  test("POST:201, responds with posted toilet", () => {
    const newToilet = {
      place_id: "e",
      name: "pooprscoopr",
      formatted_address: "2 shit st",
      business_status: "OPERATIONAL",
    };
    return request(app)
      .post("/api/toilets")
      .send(newToilet)
      .expect(201)
      .then(({ body }) => {
        expect(body.toilet).toMatchObject({
          place_id: "e",
          name: "pooprscoopr",
          formatted_address: "2 shit st",
          business_status: "OPERATIONAL",
        });
      });
  });
  //   test("error for existing toilet", () => {
  //     const newToilet = {
  //       place_id: "a",
  //       name: "poopr",
  //       formatted_address: "1 shit st",
  //       business_status: "OPERATIONAL",
  //     };
  //     return request(app)
  //       .post("/api/toilets")
  //       .send(newToilet)
  //       .expect(400)
  //       .then(({ body }) => {
  //         expect(body.msg).toBe("Toilet already exists");
  //       });
  //   });
});
describe("POST users", () => {
  test("POST:201, respond with insertedUser", () => {
    const newUser = {
      username: "DarthShan",
      email: "darsshan.p@gmail.com",
      password: "password",
    };
    return request(app)
      .post("/api/users")
      .send(newUser)
      .expect(201)
      .then((res) => {
        expect(res.body).toMatchObject({
          username: expect.any(String),
          email: expect.any(String),
          password: expect.any(String),
        });
      });
  });
});

describe("/api/nonsense", () => {
  test("GET:404, sends an appropriate error message when given an invalid route", () => {
    return request(app)
      .get("/api/nonsense")
      .expect(404)
      .then((response) => {
        expect(response.body.msg).toBe("Route not found!");
      });
  });
});

describe("/api/toilets/:toilet_id/reviews", () => {
  test("GET:200, responds with array of reviews by toilet id", () => {
    return request(app)
      .get("/api/toilets/a/reviews")
      .expect(200)
      .then(({ body }) => {
        expect(body.reviews).toBeSortedBy("created_at", {
          descending: true,
        });
        body.reviews.forEach((review) => {
          expect(Object.keys(review)).toEqual(
            expect.arrayContaining([
              "review_id",
              "body",
              "toilet_id",
              "author",
              "votes",
              "created_at",
            ])
          );
        });
      });
  });
});

describe("/api/toilets/:toilet_id/reviews", () => {
  test("POST:201, responds with posted review", () => {
    const newComment = {
      body: "lol nice",
      username: "test1",
    };
    return request(app)
      .post("/api/toilets/b/reviews")
      .send(newComment)
      .expect(201)
      .then(({ body }) => {
        expect(body.review).toMatchObject({
          review_id: expect.any(Number),
          body: expect.any(String),
          toilet_id: "b",
          author: expect.any(String),
          votes: expect.any(Number),
          created_at: expect.any(String),
        });
      });
  });
});
