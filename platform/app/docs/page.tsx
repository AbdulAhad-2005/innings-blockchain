"use client";
// app/docs/page.tsx
// Renders the Swagger UI consuming the spec from /api/docs.

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
    <div className="swagger-container bg-white min-h-screen">
      <style jsx global>{`
        /* Reset some common conflicts with Tailwind */
        .swagger-ui .opblock .opblock-summary-description {
          color: #3b4151 !important;
        }
        .swagger-ui .info .title {
          color: #3b4151 !important;
        }
        .swagger-ui select {
          padding-right: 2rem !important;
        }
        /* Ensure the body of the doc stays light even if layout is dark */
        .swagger-container {
          --background: #ffffff;
          --foreground: #171717;
          background-color: white !important;
          color: #3b4151 !important;
        }
      `}</style>
      <SwaggerUI
        url="/api/docs"
        docExpansion="list"
        defaultModelsExpandDepth={-1}
        persistAuthorization
      />
    </div>
  );
}
