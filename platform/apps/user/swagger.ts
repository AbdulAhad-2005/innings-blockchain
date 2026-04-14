// swagger.ts — OpenAPI spec generator
import swaggerJSDoc from "swagger-jsdoc";

export const swaggerSpec = swaggerJSDoc({
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Innings Blockchain Platform API",
      version: "1.0.0",
      description:
        "REST API for the Innings Blockchain Platform. Auth routes use JWT Bearer tokens. " +
        "After logging in, copy the returned token and click 'Authorize' above to test protected routes.",
    },
    servers: [
      {
        url: "http://localhost:3000",
        description: "Local development server",
      },
    ],
    tags: [
      {
        name: "Auth",
        description:
          "Registration, login, logout, and current-user endpoints for all user roles (admin, customer, brand).",
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
          description:
            "Paste the JWT token returned from POST /api/auth/login. Format: Bearer <token>",
        },
      },
      schemas: {
        Error: {
          type: "object",
          properties: {
            error: {
              type: "string",
              example: "Something went wrong.",
            },
          },
        },
      },
    },
  },
  apis: ["./app/api/**/*.ts", "./app/api/**/*.tsx"],
});