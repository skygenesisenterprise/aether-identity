'use client';

import * as React from 'react';
import SwaggerUI from 'swagger-ui-react';
import 'swagger-ui-react/swagger-ui.css';

interface SwaggerDocumentationProps {
  spec?: any;
  url?: string;
}

export const SwaggerDocumentation: React.FC<SwaggerDocumentationProps> = ({ 
  spec, 
  url = '/api/swagger.json' 
}) => {
  return (
    <div className="w-full h-screen">
      <SwaggerUI 
        url={url}
        spec={spec}
        docExpansion="list"
        defaultModelsExpandDepth={2}
        defaultModelExpandDepth={2}
        tryItOutEnabled={true}
        displayRequestDuration={true}
        filter={true}
        showExtensions={true}
        showCommonExtensions={true}
        deepLinking={true}

        layout="BaseLayout"
        supportedSubmitMethods={[
          'get',
          'post',
          'put',
          'delete',
          'patch'
        ]}
        onComplete={() => {
          console.log('Swagger UI loaded');
        }}
      />
    </div>
  );
};

export default SwaggerDocumentation;