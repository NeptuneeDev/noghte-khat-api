import { INestApplication } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import Module from 'module';
import { AuthModule } from 'src/modules/auth/auth.module';
import { FileModule } from 'src/modules/file/file.module';
import { ProfessorModule } from 'src/modules/professor/professor.module';

export class Swagger {
  constructor(private readonly app: INestApplication) {}
  buildDocument() {
    const authOption = this.createOption('auth');
    this.createDocument(AuthModule, 'auth', authOption);

    const fileOption = this.createOption('file');
    this.createDocument(FileModule, 'file', fileOption);

    const professorOption = this.createOption('professor');
    this.createDocument(ProfessorModule, 'professor', professorOption);
  }

  private createOption(moduleName: string) {
    return new DocumentBuilder()
      .addBearerAuth()
      .setTitle(`${moduleName}`)
      .setDescription(`${moduleName} Document`)
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
