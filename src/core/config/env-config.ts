import * as fs from 'fs';
import * as path from 'path';

export class EnvConfig {
  private config: Record<string, string> = {};

  constructor(envPath: string = '.env') {
    this.load(envPath);
  }

  private load(envPath: string) {
    const fullPath = path.isAbsolute(envPath) ? envPath : path.join(process.cwd(), envPath);
    if (!fs.existsSync(fullPath)) return;
    const lines = fs.readFileSync(fullPath, 'utf-8').split(/\r?\n/);
    for (const line of lines) {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith('#')) continue;
      const eqIdx = trimmed.indexOf('=');
      if (eqIdx === -1) continue;
      const key = trimmed.slice(0, eqIdx).trim();
      let value = trimmed.slice(eqIdx + 1).trim();
      if ((value.startsWith('"') && value.endsWith('"')) || (value.startsWith("'") && value.endsWith("'"))) {
        value = value.slice(1, -1);
      }
      this.config[key] = value;
    }
  }

  get(key: string, fallback?: string): string | undefined {
    return this.config[key] ?? fallback;
  }

  getAll(): Record<string, string> {
    return { ...this.config };
  }
}

// Exemplo de uso:
// const env = new EnvConfig();
// const s3Key = env.get('S3_ACCESS_KEY');
// const all = env.getAll();
