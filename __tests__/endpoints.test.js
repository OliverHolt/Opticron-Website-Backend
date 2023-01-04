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
                  toilet_name: "Public Toilet",
                  address: "1 Main Street, London",
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
                },
              ],
            },
          },
          "GET /api/reviews": {
            description: "serves an array of all reviews of all toilets",
            queries: [],
            exampleResponse: {
              articles: [
                {
                  body: "Example review",
                  author: "ExampleUser",
                  created_at: 1527695953341,
                },
              ],
            },
          },
        });
      });
  });
});

describe("/api/:toilet_id/reviews", () => {
  test("GET:200, responds with array of reviews by toilet id", () => {
    return request(app)
      .get("/api/toilets/a/reviews")
      .expect(200)
      .then(({ body }) => {
        expect(body.reviews).toBeSortedBy("created_at", {
          descending: true,
        });
      });
  });
});

describe("/api/toilets/:toilet_id/reviews", () => {
  test("GET:201, responds with posted review", () => {
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

describe("/api/toilets", () => {
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
  test("error for existing toilet", () => {
    const newToilet = {
      place_id: "a",
      name: "poopr",
      formatted_address: "1 shit st",
      business_status: "OPERATIONAL",
    };
    return request(app)
      .post("/api/toilets")
      .send(newToilet)
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Toilet already exists");
      });
  });
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
// describe("/api/topics", () => {
//   test("GET:200, an array of topic objects, each of which should have a 'slug' and a 'description' property", () => {
//     return request(app)
//       .get("/api/topics")
//       .expect(200)
//       .then((response) => {
//         expect(response.body.topics).toEqual(expect.any(Array));
//         expect(response.body.topics).not.toHaveLength(0);
//         response.body.topics.forEach((topic) => {
//           expect(Object.keys(topic)).toEqual(
//             expect.arrayContaining(["slug", "description"])
//           );
//         });
//       });
//   });
// });

// describe("/api/articles", () => {
//   test("GET:200, an array of article objects, with the correct properties", () => {
//     return request(app)
//       .get("/api/articles")
//       .expect(200)
//       .then((response) => {
//         expect(response.body.articles).toEqual(expect.any(Array));
//         expect(response.body.articles).not.toHaveLength(0);
//         expect(response.body.articles).toBeSortedBy("created_at", {
//           descending: true,
//         });
//         response.body.articles.forEach((article) => {
//           expect(Object.keys(article)).toEqual(
//             expect.arrayContaining([
//               "author",
//               "title",
//               "article_id",
//               "topic",
//               "created_at",
//               "votes",
//               "comment_count",
//             ])
//           );
//         });
//       });
//   });
//   test("GET:200, array of articles is sorted by DESCENDING date (created_at) by default ", () => {
//     return request(app)
//       .get("/api/articles")
//       .expect(200)
//       .then((response) => {
//         expect(response.body.articles).toBeSortedBy("created_at", {
//           descending: true,
//         });
//       });
//   });
//   test("GET:200, can sort articles by specified sort_by value", () => {
//     return request(app)
//       .get("/api/articles?sort_by=author&order=ASC")
//       .expect(200)
//       .then((response) => {
//         expect(response.body.articles).toBeSortedBy("author");
//       });
//   });
//   test("GET:400, invalid sort_by query", () => {
//     return request(app)
//       .get("/api/articles?sort_by=nonsense")
//       .expect(400)
//       .then((response) => {
//         expect(response.body.msg).toBe("invalid sort query");
//       });
//   });
//   test("GET:400, invalid order_by query", () => {
//     return request(app)
//       .get("/api/articles?sort_by=author&order=nonsense")
//       .expect(400)
//       .then((response) => {
//         expect(response.body.msg).toBe("invalid sort query");
//       });
//   });
//   test("GET:200, can filter articles by topic", () => {
//     return request(app)
//       .get("/api/articles?topic=cats")
//       .expect(200)
//       .then((response) => {
//         expect(response.body.articles.length).toBe(1);
//         response.body.articles.forEach((article) => {
//           expect(article.topic).toBe("cats");
//         });
//       });
//   });
//   test("GET:200, can filter by valid topic even if no articles exist for it", () => {
//     return request(app)
//       .get("/api/articles?topic=paper")
//       .expect(200)
//       .then((response) => {
//         expect(response.body.msg).toBe("No articles with this topic yet!");
//       });
//   });
//   test("GET:400, invalid filter query", () => {
//     return request(app)
//       .get("/api/articles?topic=999")
//       .expect(400)
//       .then((response) => {
//         expect(response.body.msg).toBe("invalid filter query");
//       });
//   });
// });

// describe("/api/articles/:article_id", () => {
//   test("GET:200, responds with an array of articles matching given article_id", () => {
//     return request(app)
//       .get("/api/articles/1")
//       .expect(200)
//       .then(({ body }) => {
//         expect(body.article.length).not.toBe(0);
//         body.article.forEach((article) => {
//           expect(article).toEqual(
//             expect.objectContaining({
//               author: expect.any(String),
//               title: expect.any(String),
//               article_id: 1,
//               body: expect.any(String),
//               topic: expect.any(String),
//               created_at: expect.any(String),
//               votes: expect.any(Number),
//               // comment_count: expect.any(Number),
//             })
//           );
//         });
//       });
//   });
//   test("GET:200, responds with an array of articles matching given article_id INCLUDING COMMENT COUNT", () => {
//     return request(app)
//       .get("/api/articles/1")
//       .expect(200)
//       .then(({ body }) => {
//         expect(body.article.length).not.toBe(0);
//         body.article.forEach((article) => {
//           expect(article).toEqual(
//             expect.objectContaining({
//               comment_count: expect.any(Number),
//             })
//           );
//         });
//       });
//   });
//   test("GET:404, sends an appropriate error message when given a non-existent article_id", () => {
//     return request(app)
//       .get("/api/articles/99999")
//       .expect(404)
//       .then(({ body }) => {
//         expect(body.msg).toBe("article not found!");
//       });
//   });
//   test("GET:400, sends an appropriate error message when given an invalid article_id", () => {
//     return request(app)
//       .get("/api/articles/not-an-id")
//       .expect(400)
//       .then(({ body }) => {
//         expect(body.msg).toBe("Bad request");
//       });
//   });
//   test("PATCH:200, should increase the votes for a given article and return the article", () => {
//     const newVote = 2;
//     const increaseVotes = {
//       inc_votes: newVote,
//     };
//     return request(app)
//       .patch("/api/articles/1")
//       .send(increaseVotes)
//       .expect(200)
//       .then(({ body }) => {
//         expect(body.article).toMatchObject({
//           author: expect.any(String),
//           title: expect.any(String),
//           article_id: 1,
//           body: expect.any(String),
//           topic: expect.any(String),
//           created_at: expect.any(String),
//           votes: 102,
//         });
//       });
//   });
//   test("PATCH:400, sends an appropriate error message when given a non-existent article_id", () => {
//     const newVote = 2;
//     const increaseVotes = {
//       inc_votes: newVote,
//     };
//     return request(app)
//       .patch("/api/articles/99999")
//       .send(increaseVotes)
//       .expect(404)
//       .then(({ body }) => {
//         expect(body.msg).toBe("Not found");
//       });
//   });
//   test("PATCH:400, sends an appropriate error message when given an invalid article_id", () => {
//     const newVote = 2;
//     const increaseVotes = {
//       inc_votes: newVote,
//     };
//     return request(app)
//       .patch("/api/articles/not-an-id")
//       .send(increaseVotes)
//       .expect(400)
//       .then(({ body }) => {
//         expect(body.msg).toBe("Bad request");
//       });
//   });
//   test("PATCH:400, sends an appropriate error message when body is missing required fields", () => {
//     const increaseVotes = {};
//     return request(app)
//       .patch("/api/articles/1")
//       .send(increaseVotes)
//       .expect(400)
//       .then(({ body }) => {
//         expect(body.msg).toBe("Bad request");
//       });
//   });
//   test("PATCH:400, sends an appropriate error message when body is incorrect data type", () => {
//     const newVote = "hello";
//     const increaseVotes = {
//       inc_votes: newVote,
//     };
//     return request(app)
//       .patch("/api/articles/1")
//       .send(increaseVotes)
//       .expect(400)
//       .then(({ body }) => {
//         expect(body.msg).toBe("Bad request");
//       });
//   });
// });

// describe("/api/articles/:article_id/comments", () => {
//   test("GET:200, responds with an array of comments matching a given article_id", () => {
//     return request(app)
//       .get("/api/articles/1/comments")
//       .expect(200)
//       .then(({ body }) => {
//         expect(body.comments.length).not.toBe(0);
//         expect(body.comments).toBeSortedBy("created_at", {
//           descending: true,
//         });
//         body.comments.forEach((comment) => {
//           expect(comment).toMatchObject({
//             comment_id: expect.any(Number),
//             body: expect.any(String),
//             article_id: 1,
//             author: expect.any(String),
//             votes: expect.any(Number),
//             created_at: expect.any(String),
//           });
//         });
//       });
//   });
//   test("GET:200, sends an empty array when an article has no comments ", () => {
//     return request(app)
//       .get("/api/articles/2/comments")
//       .expect(200)
//       .then(({ body }) => {
//         expect(body.comments).toEqual([]);
//       });
//   });
//   test("GET:404, sends an appropriate error message when given a non-existent article_id", () => {
//     return request(app)
//       .get("/api/articles/99999/comments")
//       .expect(404)
//       .then(({ body }) => {
//         expect(body.msg).toBe("article not found!");
//       });
//   });
//   test("GET:400, sends an appropriate error message when given an invalid article_id", () => {
//     return request(app)
//       .get("/api/articles/not-an-id/comments")
//       .expect(400)
//       .then(({ body }) => {
//         expect(body.msg).toBe("Bad request");
//       });
//   });
//   test("POST:201 inserts a new comment to the correct article and sends back the new comment", () => {
//     const newComment = {
//       body: "lol nice",
//       username: "icellusedkars",
//     };
//     return request(app)
//       .post("/api/articles/1/comments")
//       .send(newComment)
//       .expect(201)
//       .then(({ body }) => {
//         expect(body.comment).toMatchObject({
//           comment_id: expect.any(Number),
//           body: expect.any(String),
//           article_id: 1,
//           author: expect.any(String),
//           votes: expect.any(Number),
//           created_at: expect.any(String),
//         });
//       });
//   });
//   test("POST:400 responds with an appropriate error message when provided with an invalid username (no username)", () => {
//     return request(app)
//       .post("/api/articles/1/comments")
//       .send({
//         body: "lol nice",
//       })
//       .expect(400)
//       .then((response) => {
//         expect(response.body.msg).toBe("Bad request");
//       });
//   });
//   test("POST:404 responds with an appropriate error message when provided with an invalid username", () => {
//     return request(app)
//       .post("/api/articles/1/comments")
//       .send({
//         body: "lol nice",
//         username: "Mr Nobody",
//       })
//       .expect(404)
//       .then((response) => {
//         expect(response.body.msg).toBe("Not found!");
//       });
//   });
//   test("POST:400 responds with an appropriate error message when provided with an invalid comment", () => {
//     return request(app)
//       .post("/api/articles/1/comments")
//       .send({
//         body: 12345,
//         username: "icellusedkars",
//       })
//       .expect(400)
//       .then((response) => {
//         expect(response.body.msg).toBe("Bad request");
//       });
//   });
//   test("POST:404, sends an appropriate error message when given a non-existent article_id", () => {
//     const newComment = {
//       body: "lol nice",
//       username: "icellusedkars",
//     };
//     return request(app)
//       .post("/api/articles/999/comments")
//       .send(newComment)
//       .expect(404)
//       .then(({ body }) => {
//         expect(body.msg).toBe("Not found!");
//       });
//   });
//   test("POST:400, sends an appropriate error message when given an invalid article_id", () => {
//     return request(app)
//       .get("/api/articles/not-an-id/comments")
//       .expect(400)
//       .then(({ body }) => {
//         expect(body.msg).toBe("Bad request");
//       });
//   });
// });

describe("/api/users", () => {
  test("GET:200, an array of objects, each of which should have a username, name and avatar_url", () => {
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

// describe("/api/comments/:comment_id", () => {
//   test("DELETE:204, delete the specified comment", () => {
//     return request(app).delete("/api/comments/3").expect(204);
//   });
//   test("DELETE:404, responds with an appropriate error message when given a non-existent comment_id", () => {
//     return request(app)
//       .delete("/api/comments/99999")
//       .expect(404)
//       .then((response) => {
//         expect(response.body.msg).toBe("Unable to delete non-existent comment");
//       });
//   });
//   test("DELETE:400, responds with an appropriate error message when given a invalid comment_id", () => {
//     return request(app)
//       .delete("/api/comments/not-a-comment")
//       .expect(400)
//       .then((response) => {
//         expect(response.body.msg).toBe("Bad request");
//       });
//   });
// });
