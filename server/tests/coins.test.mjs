import request from "supertest";
import { randomUUID } from "crypto";

import express from "express";
import cookieParser from "cookie-parser";

import * as dotenv from "dotenv";

import coinRoutes from "../routes/coinRoutes.js";
import authRoutes from "../routes/authRoutes.js";
import { sql } from "../config/NeonClient.js"; // ! Should simulate the db
import errorHandler from "../middlewares/errorHandler.js";

dotenv.config();

const app = express();

app.use(express.json());
app.use(cookieParser());
app.use("/api/auth", authRoutes);
app.use("/api/coins", coinRoutes);
app.use(errorHandler);

let authCookie;

const testUser = {
  email: "coin@test.com",
  email_confirmation: "coin@test.com",
  password: "123456",
  first_name: "Coin",
  last_name: "Tester",
  birth_date: "1990-04-12",
  phone: "+359876305026",
  city: "Sofia",
  address: "Example Street 10",
  postal_code: "1000",
  country: "BG",
};

const logErrorResponse = (res, label = "💥 Error Response") => {
  console.log(`${label}:`, JSON.stringify(res.body, null, 2));
};

beforeAll(async () => {
  await request(app).post("/api/auth/register").send(testUser);

  const res = await request(app).post("/api/auth/login").send({
    email: testUser.email,
    password: testUser.password,
  });

  const cookies = res.headers["set-cookie"];
  authCookie = cookies?.[0];
});

afterAll(async () => {
  await sql`DELETE FROM coins`;
});

describe("Coin Routes", () => {
  /**
   * & PUBLIC ROUTES
   * ! Testing getCoins route
   */

  it("01. Should return an array of coins", async () => {
    const res = await request(app).get("/api/coins");

    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  /**
   * ! Testing getCoin route
   */

  it("02. Should return a coin", async () => {
    let createdCoinId;

    const createRes = await request(app)
      .post("/api/coins")
      .set("Cookie", authCookie)
      .send({
        name: "Test Coin",
        photo_url: "https://example.com/coin.jpg",
        price: 9.99,
        monarch: "Tester I",
        year: 2020,
        country: "Montenegro",
        price_value: "Medium",
        currency: "EUR",
        composition_metal: "Gold",
        weight: "7g",
        diameter: "20mm",
        shape: "Round",
        technique: "Pressed",
        denomination: "1 Tester",
        lettering: "TEST",
        script: "Latin",
        mintage: 1000,
        mint_place: "Podgorica",
        coin_grading: "AU",
        number: "TEST-2020-001",
      });

    createdCoinId = createRes.body.coin.id;

    const res = await request(app).get(`/api/coins/${createdCoinId}`);

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty("name", "Test Coin");
  });

  it("03. Should return a 404 error for a non-existing coin", async () => {
    const res = await request(app).get(
      "/api/coins/00000000-0000-0000-0000-000000000000"
    );

    expect(res.statusCode).toBe(404);
    expect(res.body.error || res.body.message).toBeDefined();
  });

  /**
   * & PROTECTED ROUTES
   * ! Testing createCoin route
   */

  it("04. Should create a coin with valid data and authentication", async () => {
    const coinData = {
      name: "Valid Coin",
      photo_url: "https://example.com/valid.jpg",
      price: 99.99,
      monarch: "Queen Test",
      year: 1999,
      country: "Serbia",
      price_value: "High",
      currency: "RSD",
      composition_metal: "Silver",
      weight: "15g",
      diameter: "30mm",
      shape: "Oval",
      technique: "Pressed",
      denomination: "50",
      lettering: "VALID",
      script: "Latin",
      mintage: 3000,
      mint_place: "ValidMint",
      coin_grading: "AU",
      number: "VAL-001",
    };

    const res = await request(app)
      .post("/api/coins")
      .set("Cookie", authCookie)
      .send(coinData);

    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty("coin");
    expect(res.body.coin).toHaveProperty("name", "Valid Coin");
  });
  it("05. Should FAIL to create a coin without authentication", async () => {
    const res = await request(app).post("/api/coins").send({
      name: "Unauth Coin",
      photo_url: "https://example.com/unauth.jpg",
      price: 12.5,
      year: 2020,
      country: "Bulgaria",
      currency: "BGN",
    });
    expect(res.statusCode).toBe(401);
    expect(res.body.error.name).toBe("UnauthorizedError");
  });

  it("06. Should FAIL to create a coin with invalid data", async () => {
    /**
     * * Invalid data means: (1) Missing required fields, (2) Invalid data types, (3) Invalid values
     */
    const invalidCoin = {
      // Missing required fields

      photo_url: "not-a-url",
      price: "not-a-number",
      year: 1800,
      currency: "",
      country: "Narnia",
    };

    const res = await request(app)
      .post("/api/coins")
      .set("Cookie", authCookie)
      .send(invalidCoin);

    //console.log("💥 Error Response:", JSON.stringify(res.body, null, 2));

    expect(res.statusCode).toBe(400);
    expect(res.body.error).toBeDefined();
    expect(res.body.error.name).toBe("BadRequestError");

    const details = res.body.error.details;

    expect(Array.isArray(details)).toBe(true);
    expect(details.length).toBeGreaterThanOrEqual(3); // Expect multiple errors

    expect(details).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ path: "name" }),
        // expect.objectContaining({ path: "photo_url" }),
        // expect.objectContaining({ path: "price" }),
        // expect.objectContaining({ path: "year" }),
        // expect.objectContaining({ path: "currency" }),
        // expect.objectContaining({ path: "country" }),
      ])
    );
  });

  /**
   * ! Testing updateCoin route
   */

  it("07. Should update a coin with valid data and authentication", async () => {
    const createRes = await request(app)
      .post("/api/coins")
      .set("Cookie", authCookie)
      .send({
        name: "1 Leva",
        photo_url: "https://example.com/image.jpg",
        price: 25.5,
        year: 1920,
        currency: "BGN",
        country: "Bulgaria",
      });

    const coinId = createRes.body.coin.id;

    const res = await request(app)
      .put(`/api/coins/${coinId}`)
      .set("Cookie", authCookie)
      .send({
        price: 35.99,
        monarch: "Boris III",
      });

    expect(res.statusCode).toBe(200);
    expect(res.body).toBeDefined();
    expect(res.body.message).toBe("Coin updated successfully");
    expect(res.body.coin.price).toBe("35.99");
    expect(res.body.coin.monarch).toBe("Boris III");
  });

  it("08. Should FAIL to update a coin without authentication", async () => {
    const createRes = await request(app)
      .post("/api/coins")
      .set("Cookie", authCookie)
      .send({
        name: "1 Leva",
        photo_url: "https://example.com/image.jpg",
        price: 25.5,
        year: 1920,
        currency: "BGN",
        country: "Bulgaria",
      });

    const coinId = createRes.body.coin.id;

    const res = await request(app).put(`/api/coins/${coinId}`).send({
      price: 100,
    });

    expect(res.statusCode).toBe(401);
    expect(res.body).toBeDefined();
    expect(res.body.message || res.body.error.message).toMatch(
      /access denied/i
    );
  });
  it("09. Should FAIL to update a coin with invalid data", async () => {
    const createRes = await request(app)
      .post("/api/coins")
      .set("Cookie", authCookie)
      .send({
        name: "1 Leva",
        photo_url: "https://example.com/image.jpg",
        price: 25.5,
        year: 1920,
        currency: "BGN",
        country: "Bulgaria",
      });

    const coinId = createRes.body.coin.id;

    const res = await request(app)
      .put(`/api/coins/${coinId}`)
      .set("Cookie", authCookie)
      .send({
        year: 1500,
        price: "free",
      });

    //logErrorResponse(res);

    expect(res.statusCode).toBe(400);
    expect(res.body.error).toBeDefined();
    expect(res.body.error.name).toBe("BadRequestError");

    const details = res.body.error.details;
    expect(Array.isArray(details)).toBe(true);
    expect(details).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ path: "year" }),
        expect.objectContaining({ path: "price" }),
      ])
    );
  });

  /**
   * ! Testing deleteCoin route
   */

  it("10. Should delete a coin with valid ID and authentication", async () => {
    const newCoin = {
      name: "Delete Me Coin",
      photo_url: "https://delete-me.jpg",
      price: 10,
      year: 2000,
      currency: "BGN",
      country: "Bulgaria",
    };

    const createRes = await request(app)
      .post("/api/coins")
      .set("Cookie", authCookie)
      .send(newCoin);

    const coinId = createRes.body.coin.id;

    const res = await request(app)
      .delete(`/api/coins/${coinId}`)
      .set("Cookie", authCookie);

    expect(res.statusCode).toBe(200);
    expect(res.body.message).toBe("Coin deleted successfully");
    expect(res.body).toHaveProperty("id", coinId);
  });
  it("11. Should FAIL to delete an existing coin without authentication", async () => {
    const newCoin = {
      name: "Private Coin",
      photo_url: "https://fail-auth.jpg",
      price: 12,
      year: 1999,
      currency: "BGN",
      country: "Bulgaria",
    };

    const createRes = await request(app)
      .post("/api/coins")
      .set("Cookie", authCookie)
      .send(newCoin);

    const coinId = createRes.body.coin.id;

    const res = await request(app).delete(`/api/coins/${coinId}`);

    //logErrorResponse(res);
    expect(res.statusCode).toBe(401);
    expect(res.body).toBeDefined();
    expect(res.body.message || res.body.error?.message).toMatch(/no token/i);
  });
  it("12. Should FAIL to delete a coin with invalid UUID", async () => {
    const res = await request(app)
      .delete("/api/coins/invalid-uuid")
      .set("Cookie", authCookie);

    //logErrorResponse(res);
    expect(res.statusCode).toBe(400);
    expect(res.body.error).toBeDefined();
    expect(res.body.error.message).toMatch("Validation failed");
  });
  it("13. Should FAIL to delete a coin with invalid ID but valid UUID", async () => {
    const fakeId = randomUUID();

    const res = await request(app)
      .delete(`/api/coins/${fakeId}`)
      .set("Cookie", authCookie);

    //logErrorResponse(res);
    expect(res.statusCode).toBe(404);
    expect(res.body.error).toBeDefined();
    expect(res.body.error.message).toMatch("Coin not found for deletion");
  });
});
