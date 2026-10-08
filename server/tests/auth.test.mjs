import request from "supertest";
import express from "express";
import cookieParser from "cookie-parser";

import * as dotenv from "dotenv";

import authRoutes from "../routes/authRoutes.js";
import { sql } from "../config/NeonClient.js"; // ! Should simulate the db
import errorHandler from "../middlewares/errorHandler.js";

dotenv.config();

const app = express();

app.use(express.json());
app.use(cookieParser());
app.use("/api/auth", authRoutes);
app.use(errorHandler);

let authCookie;

afterAll(async () => {
  await sql`DELETE FROM users`;
});

/**
 * * Testing the auth routes
 */
describe("Auth Routes", () => {
  /**
   * ! This user is being used if you want the program to return good results
   */
  const testUser = {
    email: "jest@example.com",
    email_confirmation: "jest@example.com",
    password: "123456",
    first_name: "Jest",
    last_name: "User",
    birth_date: "1990-04-12",
    phone: "+359876305026",
    city: "Sofia",
    address: "Example Street 10",
    postal_code: "1000",
    country: "BG",
  };
  const testUserFailed = {
    ...testUser,
    email: "not-an-email",
    password: "1456",
  };

  /**
   * ! Testing the register route
   */

  // ~DONE
  it("Should FAIL to register user with invalid credentials", async () => {
    /**
     * ! It fails because of the wrong email
     */
    const res = await request(app)
      .post("/api/auth/register")
      .send(testUserFailed);

    //console.log("🔍 Error Response Body1:", JSON.stringify(res.body, null, 2));

    expect(res.statusCode).toBe(400);
    expect(res.body.error).toBeDefined();
    expect(res.body.error.name).toBe("BadRequestError");
    expect(res.body.error.message).toBe("Validation failed");

    const expectedFields = ["email", "password"];
    const errorDetails = res.body.error.details;

    expectedFields.forEach((field) => {
      const hasError = errorDetails.some((e) => e.path === field);
      if (hasError) {
        const msg = errorDetails.find((e) => e.path === field).msg;
        expect(typeof msg).toBe("string");
        expect(msg.length).toBeGreaterThan(0);
      }
    });
  });

  // ~DONE
  it("Should SUCCESSFULLY register a user", async () => {
    const res = await request(app).post("/api/auth/register").send(testUser);

    //console.log("🔍 Success Response Body:", res.body);

    expect(res.statusCode).toBe(201);
    expect(res.body).toBeDefined();
    expect(res.body.user).toBeDefined();
    expect(res.body.user.email).toBe(testUser.email);
  });

  /**
   * ! Testing the login route
   */

  // ~DONE
  it("Should FAIL to login user with invalid credentials but cover the validation", async () => {
    const res = await request(app).post("/api/auth/login").send({
      email: "nonexistent@example.com",
      password: "wrongPassword",
    });

    //console.log("🔍 Error Response Body:", JSON.stringify(res.body, null, 2));

    expect(res.statusCode).toBe(400);
    expect(res.body).toBeDefined();
    expect(res.body.error).toBeDefined();
    expect(res.body.error.name).toBe("BadRequestError");
    expect(res.body.error.message).toBe("Invalid credentials");
  });

  // ~DONE
  it("Should SUCCESSFULLY login user, and check if the authentication token is provided", async () => {
    await request(app).post("/api/auth/register").send(testUser);
    const res = await request(app).post("/api/auth/login").send({
      email: testUser.email,
      password: testUser.password,
    });

    //console.log("🔍 Headers:", res.headers);

    expect(res.statusCode).toBe(200);
    expect(res.body.user).toBeDefined();
    expect(res.body.user.email).toBe(testUser.email);

    const cookies = res.headers["set-cookie"];
    expect(cookies).toBeDefined();
    expect(cookies[0]).toMatch(/auth_token=.*HttpOnly/);

    authCookie = cookies[0];
  });

  /**
   * ! Testing the protected route
   */

  // ~DONE
  it("Should FAIL to access protected route without authentication", async () => {
    const res = await request(app).get("/api/auth/protected");

    // console.log(
    //   "🔍 Protected Access Response:",
    //   JSON.stringify(res.body, null, 2)
    // );

    expect(res.statusCode).toBe(401); // Or 403 depending on your error class
    expect(res.body).toBeDefined();

    if (res.body.error) {
      expect(res.body.error.name).toBe("UnauthorizedError");
      expect(res.body.error.message).toMatch(/no token/i);
    } else {
      expect(res.body.message).toMatch(/no token/i);
    }
  });

  // ~DONE
  it("Should SUCCESSFULLY access protected route with authentication", async () => {
    const res = await request(app)
      .get("/api/auth/protected")
      .set("Cookie", authCookie); // ✅ Use the saved auth_token

    // console.log(
    //   "🔐 Protected Route Success Response:",
    //   JSON.stringify(res.body, null, 2)
    // );

    expect(res.statusCode).toBe(200);
    expect(res.body).toBeDefined();
    expect(res.body.message).toBe("Access granted!");
    expect(res.body.user).toBeDefined();
    expect(res.body.user).toHaveProperty("email", testUser.email);
  });

  /**
   * ! Testing the logout route
   */

  // ~DONE
  it("Should FAIL to logout without authentication", async () => {
    const res = await request(app).post("/api/auth/logout");

    // console.log(
    //   "❌ Logout Without Token Response:",
    //   JSON.stringify(res.body, null, 2)
    // );

    expect(res.statusCode).toBe(401); // assuming UnauthorizedError is thrown
    expect(res.body).toBeDefined();

    if (res.body.error) {
      expect(res.body.error.name).toBe("UnauthorizedError");
      expect(res.body.error.message).toMatch(/no token/i);
    } else {
      expect(res.body.message).toMatch(/no token/i);
    }
  });

  // ~DONE
  it("Should SUCCESSFULLY logout with authentication", async () => {
    const res = await request(app)
      .post("/api/auth/logout")
      .set("Cookie", authCookie);

    // console.log(
    //   "✅ Logout With Token Response:",
    //   JSON.stringify(res.body, null, 2)
    // );

    expect(res.statusCode).toBe(200);
    expect(res.body).toBeDefined();
    expect(res.body.message).toBe("Logout successful");
  });
});
