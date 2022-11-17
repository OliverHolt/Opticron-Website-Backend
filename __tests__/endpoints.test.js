const app = require("../app.js");
const request = require("supertest");
const db = require("../db/connection.js");
const seed = require("../db/seeds/seed.js");
const allData = require("../db/data/test-data/index.js");

beforeEach(() => seed(allData));
afterAll(() => db.end());

describe("/api/topics", () => {
  test("GET:200, an array of topic objects, each of which should have a 'slug' and a 'description' property", () => {
    return request(app)
      .get("/api/topics")
      .expect(200)
      .then((response) => {
        expect(response.body.topics).toEqual(expect.any(Array));
        expect(response.body.topics).not.toHaveLength(0);
        response.body.topics.forEach((topic) => {
          expect(Object.keys(topic)).toEqual(
            expect.arrayContaining(["slug", "description"])
          );
        });
      });
  });
});

describe("/api/articles", () => {
  test("GET:200, an array of article objects, with the correct properties", () => {
    return request(app)
      .get("/api/articles")
      .expect(200)
      .then((response) => {
        expect(response.body.articles).toEqual(expect.any(Array));
        expect(response.body.articles).not.toHaveLength(0);
        expect(response.body.articles).toBeSortedBy("created_at", {
          descending: true,
        });
        response.body.articles.forEach((article) => {
          expect(Object.keys(article)).toEqual(
            expect.arrayContaining([
              "author",
              "title",
              "article_id",
              "topic",
              "created_at",
              "votes",
              "comment_count",
            ])
          );
        });
      });
  });
});

describe("/api/articles/:article_id", () => {
  test("GET:200, responds with an array of articles matching given article_id", () => {
    return request(app)
      .get("/api/articles/1")
      .expect(200)
      .then(({ body }) => {
        expect(body.article.length).not.toBe(0);
        body.article.forEach((article) => {
          expect(article).toMatchObject({
            author: expect.any(String),
            title: expect.any(String),
            article_id: 1,
            body: expect.any(String),
            topic: expect.any(String),
            created_at: expect.any(String),
            votes: expect.any(Number),
          });
        });
      });
  });
  test("GET:404, sends an appropriate error message when given a non-existent article_id", () => {
    return request(app)
      .get("/api/articles/99999")
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("article not found!");
      });
  });
  test("GET:400, sends an appropriate error message when given an invalid article_id", () => {
    return request(app)
      .get("/api/articles/not-an-id")
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Bad request");
      });
  });
  test("PATCH:200, should increase the votes for a given article and return the article", () => {
    const newVote = 2;
    const increaseVotes = {
      inc_votes: newVote,
    };
    return request(app)
      .patch("/api/articles/1")
      .send(increaseVotes)
      .expect(200)
      .then(({ body }) => {
        expect(body.article).toMatchObject({
          author: expect.any(String),
          title: expect.any(String),
          article_id: 1,
          body: expect.any(String),
          topic: expect.any(String),
          created_at: expect.any(String),
          votes: 102,
        });
      });
  });
  test("PATCH:400, sends an appropriate error message when given a non-existent article_id", () => {
    const newVote = 2;
    const increaseVotes = {
      inc_votes: newVote,
    };
    return request(app)
      .patch("/api/articles/99999")
      .send(increaseVotes)
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("Not found");
      });
  });
  test("PATCH:400, sends an appropriate error message when given an invalid article_id", () => {
    const newVote = 2;
    const increaseVotes = {
      inc_votes: newVote,
    };
    return request(app)
      .patch("/api/articles/not-an-id")
      .send(increaseVotes)
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Bad request");
      });
  });
  test("PATCH:400, sends an appropriate error message when body is missing required fields", () => {
    const increaseVotes = {};
    return request(app)
      .patch("/api/articles/1")
      .send(increaseVotes)
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Bad request");
      });
  });
  test("PATCH:400, sends an appropriate error message when body is incorrect data type", () => {
    const newVote = "hello";
    const increaseVotes = {
      inc_votes: newVote,
    };
    return request(app)
      .patch("/api/articles/1")
      .send(increaseVotes)
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Bad request");
      });
  });
});

describe("/api/articles/:article_id/comments", () => {
  test("GET:200, responds with an array of comments matching a given article_id", () => {
    return request(app)
      .get("/api/articles/1/comments")
      .expect(200)
      .then(({ body }) => {
        expect(body.comments.length).not.toBe(0);
        expect(body.comments).toBeSortedBy("created_at", {
          descending: true,
        });
        body.comments.forEach((comment) => {
          expect(comment).toMatchObject({
            comment_id: expect.any(Number),
            body: expect.any(String),
            article_id: 1,
            author: expect.any(String),
            votes: expect.any(Number),
            created_at: expect.any(String),
          });
        });
      });
  });
  test("GET:200, sends an empty array when an article has no comments ", () => {
    return request(app)
      .get("/api/articles/2/comments")
      .expect(200)
      .then(({ body }) => {
        expect(body.comments).toEqual([]);
      });
  });
  test("GET:404, sends an appropriate error message when given a non-existent article_id", () => {
    return request(app)
      .get("/api/articles/99999/comments")
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("article not found!");
      });
  });
  test("GET:400, sends an appropriate error message when given an invalid article_id", () => {
    return request(app)
      .get("/api/articles/not-an-id/comments")
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Bad request");
      });
  });
  test("POST:201 inserts a new comment to the correct article and sends back the new comment", () => {
    const newComment = {
      body: "lol nice",
      username: "icellusedkars",
    };
    return request(app)
      .post("/api/articles/1/comments")
      .send(newComment)
      .expect(201)
      .then(({ body }) => {
        expect(body.comment).toMatchObject({
          comment_id: expect.any(Number),
          body: expect.any(String),
          article_id: 1,
          author: expect.any(String),
          votes: expect.any(Number),
          created_at: expect.any(String),
        });
      });
  });
  test("POST:400 responds with an appropriate error message when provided with an invalid username (no username)", () => {
    return request(app)
      .post("/api/articles/1/comments")
      .send({
        body: "lol nice",
      })
      .expect(400)
      .then((response) => {
        expect(response.body.msg).toBe("Bad request");
      });
  });
  test("POST:404 responds with an appropriate error message when provided with an invalid username", () => {
    return request(app)
      .post("/api/articles/1/comments")
      .send({
        body: "lol nice",
        username: "Mr Nobody",
      })
      .expect(404)
      .then((response) => {
        expect(response.body.msg).toBe("Not found!");
      });
  });
  test("POST:400 responds with an appropriate error message when provided with an invalid comment", () => {
    return request(app)
      .post("/api/articles/1/comments")
      .send({
        body: 12345,
        username: "icellusedkars",
      })
      .expect(400)
      .then((response) => {
        expect(response.body.msg).toBe("Bad request");
      });
  });
  test("POST:404, sends an appropriate error message when given a non-existent article_id", () => {
    const newComment = {
      body: "lol nice",
      username: "icellusedkars",
    };
    return request(app)
      .post("/api/articles/999/comments")
      .send(newComment)
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("Not found!");
      });
  });
  test("POST:400, sends an appropriate error message when given an invalid article_id", () => {
    return request(app)
      .get("/api/articles/not-an-id/comments")
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Bad request");
      });
  });
});

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
            expect.arrayContaining(["username", "name", "avatar_url"])
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
