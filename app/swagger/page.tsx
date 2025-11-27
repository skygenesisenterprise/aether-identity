import { SwaggerDocumentation } from '../components/swagger-documentation';

export default function SwaggerPage() {
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">
            API Documentation
          </h1>
          <p className="text-muted-foreground">
            Interactive API documentation for Aether Identity
          </p>
        </div>
        <div className="border rounded-lg overflow-hidden">
          <SwaggerDocumentation />
        </div>
      </div>
    </div>
  );
}