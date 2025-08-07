import { getDay, getMonth, getYear } from 'date-fns';
import { existsSync, mkdirSync, readFileSync, renameSync } from 'original-fs';
import * as path from 'path';
import { parseStringPromise } from 'xml2js';

import { AppLogger } from '../core/app-logger';
import { FormDataDto } from '../dto/form-data.dto';
import { JsonNfe } from '../dto/nfe.dto';
import { S3Uploader } from '../s3/s3-uploader';

export class XmlFileReader {
  private s3Upload: S3Uploader;

  constructor(private pastaBase: string, private formData: FormDataDto) {
    this.s3Upload = S3Uploader.fromEnv();
  }

  private read(filePath: string): string {
    if (!existsSync(filePath)) {
      AppLogger.error(`Arquivo não encontrado: ${filePath}`);
    }
    return readFileSync(filePath, 'utf-8');
  }

  async upload(filePath: string): Promise<void> {
    const content = this.read(filePath);
    let nfe: JsonNfe;
    // Verifica se o conteúdo é XML válido
    try {
      nfe = (await parseStringPromise(content, {
        explicitArray: false,
        ignoreAttrs: true,
      })) as JsonNfe;

      if (!nfe?.nfeProc) {
        AppLogger.info(`Arquivo não é um XML NFe válido: ${filePath}`);
        await this.moverArquivo(filePath);
      }
    } catch (err) {
      AppLogger.error(`Arquivo XML inválido: ${filePath} - ${err}`);
      await this.moverArquivo(filePath);
      return undefined;
    }

    // await this.s3Upload.uploadFile(
    //   filePath,
    //   `29154333000157/${path.basename(filePath)}`,
    // );

    delete nfe.nfeProc.NFe.Signature;
    delete nfe.nfeProc.protNFe;
    const fileParse = path.parse(filePath);
    await this.s3Upload.uploadJsonObject(
      nfe,
      `importacoes/#${this.formData.document}#${fileParse.name}.json`,
    );

    return this.moverArquivo(filePath);
  }

  async obterDiretorioDiario(): Promise<string> {
    const dataAtual = new Date();
    const pastaDiaria = `${this.pastaBase}/${getYear(dataAtual)}/${getMonth(
      dataAtual,
    )}/${getDay(dataAtual)}`;

    if (!existsSync(pastaDiaria)) {
      mkdirSync(pastaDiaria, { recursive: true });
    }

    return pastaDiaria;
  }

  async moverArquivo(filePath: string): Promise<void> {
    const diario = await this.obterDiretorioDiario();
    const mvFile = `${diario}/${path.basename(filePath)}`;
    return renameSync(filePath, mvFile);
  }
}

// Exemplo de uso:
// const reader = new XmlFileReader('/caminho/arquivo.xml');
// const conteudo = reader.read();
// console.log(conteudo);
