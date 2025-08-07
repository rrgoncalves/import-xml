import * as fs from 'fs';
import * as path from 'path';
import { parseStringPromise } from 'xml2js';
import { AppLogger } from '../core/app-logger';

export class XmlFileReader {

  private read(filePath: string): string {
    const file = path.resolve(filePath);
    if (!fs.existsSync(file)) {
      AppLogger.error(`Arquivo não encontrado: ${file}`)
    }
    return fs.readFileSync(file, 'utf-8');
  }

  async upload(filePath: string): Promise<any> {

    const xml = await parseStringPromise(this.read(filePath));

    console.log(xml);
    




    return xml;
  }
}

// Exemplo de uso:
// const reader = new XmlFileReader('/caminho/arquivo.xml');
// const conteudo = reader.read();
// console.log(conteudo);
