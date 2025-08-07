import * as path from "path";
import winston from "winston";
import "winston-daily-rotate-file";

const logDir = path.join(process.cwd(), "logs");

const transport = new winston.transports.DailyRotateFile({
  dirname: logDir,
  filename: "app-%DATE%.log",
  datePattern: "YYYY-MM-DD",
  zippedArchive: true,
  maxSize: "20m",
  maxFiles: "12", // mantém até 12 dias
  level: "info",
});

export const AppLogger = winston.createLogger({
  level: "info",
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.printf(
      ({ timestamp, level, message }) => `${timestamp} [${level}] ${message}`
    )
  ),
  transports: [transport],
});

// Exemplo de uso:
// AppLogger.info('Mensagem de log');
// AppLogger.error('Erro ocorrido');
