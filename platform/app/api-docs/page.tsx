"use client";
// app/api-docs/page.tsx
// Renders the Swagger UI consuming the spec from /api/docs.
// swagger-ui-react requires a client component (it uses browser-only APIs).

import dynamic from "next/dynamic";
import "swagger-ui-react/swagger-ui.css";

// Dynamically import SwaggerUI to avoid SSR issues
const SwaggerUI = dynamic(() => import("swagger-ui-react"), {
  ssr: false,
  loading: () => (
    <div style={{ display: "flex", justifyContent: "center", padding: "4rem", fontFamily: "sans-serif" }}>
      Loading API documentation...
    </div>
  ),
});

export default function ApiDocsPage() {
  return (
    <div>
      <SwaggerUI
        url="/api/docs"
        docExpansion="list"
        defaultModelsExpandDepth={-1}
        persistAuthorization
      />
    </div>
  );
}
