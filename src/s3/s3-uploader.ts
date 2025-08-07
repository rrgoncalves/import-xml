import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import * as fs from 'fs';

import { EnvConfig } from '../core/config/env-config';

export interface S3UploaderConfig {
  endpoint: string;
  region: string;
  accessKeyId: string;
  secretAccessKey: string;
  bucket: string;
  forcePathStyle?: boolean; // true para MinIO e compatíveis
}

export class S3Uploader {
  private client: S3Client;

  private bucket: string;

  static fromEnv(envPath = '.env'): S3Uploader {
    const env = new EnvConfig(envPath);
    return new S3Uploader({
      endpoint: env.get('S3_ENDPOINT') ?? '',
      region: env.get('S3_REGION') ?? '',
      accessKeyId: env.get('S3_ACCESS_KEY') ?? '',
      secretAccessKey: env.get('S3_SECRET_KEY') ?? '',
      bucket: env.get('S3_BUCKET') ?? '',
      forcePathStyle: env.get('S3_FORCE_PATH_STYLE', 'false') === 'true',
    });
  }

  constructor(private config: S3UploaderConfig) {
    this.bucket = config.bucket;
    this.client = new S3Client({
      region: config.region,
      endpoint: config.endpoint,
      credentials: {
        accessKeyId: config.accessKeyId,
        secretAccessKey: config.secretAccessKey,
      },
      forcePathStyle: config.forcePathStyle ?? false,
    });
  }

  async uploadFile(localPath: string, remoteKey: string): Promise<string> {
    const fileStream = fs.createReadStream(localPath);
    const command = new PutObjectCommand({
      Bucket: this.bucket,
      Key: remoteKey,
      Body: fileStream,
    });
    await this.client.send(command);
    return `${this.config.endpoint.replace(/\/$/, '')}/${
      this.bucket
    }/${remoteKey}`;
  }

  async uploadJsonObject(obj: unknown, remoteKey: string): Promise<string> {
    const jsonString = JSON.stringify(obj);
    const command = new PutObjectCommand({
      Bucket: this.bucket,
      Key: remoteKey,
      Body: jsonString,
      ContentType: 'application/json',
    });
    await this.client.send(command);
    return `${this.config.endpoint.replace(/\/$/, '')}/${
      this.bucket
    }/${remoteKey}`;
  }
}

// Exemplo de uso:
// const uploader = new S3Uploader({
//   endpoint: 'http://localhost:9000',
//   region: 'us-east-1',
//   accessKeyId: 'minioadmin',
//   secretAccessKey: 'minioadmin',
//   bucket: 'meu-bucket',
//   forcePathStyle: true // para MinIO
// });
// uploader.uploadFile('/caminho/arquivo.txt', 'pasta/arquivo.txt').then(console.log);
