import { INestApplication } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

export class Swagger {
  constructor(private readonly app: INestApplication) {}
  buildDocument() {
    const option = this.createOption('Noghteh khat API Description');
    const document = SwaggerModule.createDocument(this.app, option);
    SwaggerModule.setup('api-docs', this.app, document);

    // const authOption = this.createOption('auth');
    // this.createDocument(AuthModule, 'auth', authOption);

    // const fileOption = this.createOption('file');
    // this.createDocument(FileModule, 'file', fileOption);

    // const professorOption = this.createOption('professor');
    // this.createDocument(ProfessorModule, 'professor', professorOption);
  }

  private createOption(moduleName: string) {
    return new DocumentBuilder()
      .addBearerAuth()
      .setTitle(`${moduleName}`)
      .setDescription(` Document`)
      .setVersion('1.0')
      .build();
  }

  private createDocument(module: any, moduleName: string, option: any) {
    const document = SwaggerModule.createDocument(this.app, option, {
      include: [module],
    });

    SwaggerModule.setup(`api-docs/${moduleName}`, this.app, document);
  }
}
