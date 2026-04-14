// services/authService.ts
// Core authentication business logic — registration, login, and profile fetching.
// Handles routing to the correct Mongoose model based on the user's role.

import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { connectDB } from "@/lib/db";
import AdminUser from "@/models/AdminUser";
import BrandUser from "@/models/BrandUser";
import CustomerUser from "@/models/CustomerUser";
import { JWTPayload, UserRole } from "@/lib/authMiddleware";

const SALT_ROUNDS = 12;
const TOKEN_EXPIRY = "7d";

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/**
 * Returns the Mongoose model that corresponds to the given role.
 */
function getModelForRole(role: UserRole) {
  switch (role) {
    case "admin":
      return AdminUser;
    case "customer":
      return CustomerUser;
    case "brand":
      return BrandUser;
    default:
      throw new Error(`Unknown role: '${role}'. Must be 'admin', 'customer', or 'brand'.`);
  }
}

// ---------------------------------------------------------------------------
// Register
// ---------------------------------------------------------------------------

export interface RegisterPayload {
  name: string;
  email: string;
  password: string;
  role: UserRole;
  // Customer-specific
  walletAddress?: string;
  // Admin-specific role label (not to be confused with the UserRole field)
  adminRole?: string;
  [key: string]: unknown;
}

/**
 * Registers a new user under the correct collection based on their role.
 * Hashes the password before saving.
 * Throws if the email is already registered for that role.
 */
export async function registerUser(data: RegisterPayload) {
  await connectDB();

  const { role, password, name, email, ...extras } = data;
  const Model = getModelForRole(role);

  const existing = await Model.findOne({ email: email.toLowerCase() });
  if (existing) {
    throw new Error(`An account with email '${email}' already exists for role '${role}'.`);
  }

  const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);

  // Build the document — AdminUser requires a role field (admin sub-role label)
  const doc: Record<string, unknown> = {
    name,
    email: email.toLowerCase(),
    password: hashedPassword,
    ...extras,
  };

  // AdminUser model has its own `role` field (e.g. "superadmin", "moderator")
  if (role === "admin") {
    doc.role = extras.adminRole ?? "admin";
  }

  const user = await Model.create(doc);

  return {
    id: user._id,
    name: user.name,
    email: user.email,
    role,
  };
}

// ---------------------------------------------------------------------------
// Login
// ---------------------------------------------------------------------------

export interface LoginPayload {
  email: string;
  password: string;
  role: UserRole;
}

/**
 * Validates credentials and returns a signed JWT token on success.
 * The token payload includes the user's id, email, name, and role so the
 * middleware can verify the role without a DB round-trip.
 */
export async function loginUser(data: LoginPayload) {
  await connectDB();

  const { email, password, role } = data;
  const Model = getModelForRole(role);

  const user = await Model.findOne({ email: email.toLowerCase() });
  if (!user) {
    // Keep the error message intentionally vague to prevent user enumeration
    throw new Error("Invalid email or password.");
  }

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    throw new Error("Invalid email or password.");
  }

  if (!process.env.JWT_SECRET) {
    throw new Error("JWT_SECRET environment variable is not set.");
  }

  const payload: JWTPayload = {
    userId: user._id.toString(),
    email: user.email,
    name: user.name,
    role,
  };

  const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: TOKEN_EXPIRY });

  return {
    token,
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      role,
    },
  };
}

// ---------------------------------------------------------------------------
// Get current user
// ---------------------------------------------------------------------------

/**
 * Fetches a user document by ID from the correct collection.
 * Strips the password field from the result.
 */
export async function getUserById(userId: string, role: UserRole) {
  await connectDB();

  const Model = getModelForRole(role);
  const user = await Model.findById(userId).select("-password");

  if (!user) {
    throw new Error("User not found.");
  }

  return user;
}
