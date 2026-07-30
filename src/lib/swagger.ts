import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

export const configureSwagger = (app) => {
  const swaggerConfig = new DocumentBuilder()
    .setTitle('SCHOOL-PAY API V3')
    .setDescription('Comprehensive documentation for the SCHOOL-PAY API')
    .setVersion('3.0')
    .addBearerAuth(
      { type: 'http', scheme: 'bearer', bearerFormat: 'JWT' },
      'jwt',
    )
    .addTag('SCHOOL-PAY Docs', 'Documentation for the SCHOOL-PAY API endpoints')
    .setExternalDoc('Postman Collection', '/documentation-json')
    .build();

  const documentFactory = () =>
    SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup('./documentation', app, documentFactory);
};
