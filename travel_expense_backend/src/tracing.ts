import { NodeSDK } from '@opentelemetry/sdk-node';
import { getNodeAutoInstrumentations } from '@opentelemetry/auto-instrumentations-node';
import { OTLPTraceExporter } from '@opentelemetry/exporter-trace-otlp-grpc';
import { diag, DiagConsoleLogger, DiagLogLevel } from '@opentelemetry/api';

// Diagnostic logging for OTel debugging if needed
diag.setLogger(new DiagConsoleLogger(), DiagLogLevel.INFO);

const traceExporter = new OTLPTraceExporter({
  url: process.env.OTEL_EXPORTER_OTLP_ENDPOINT || 'http://localhost:4317',
});

export const otelSDK = new NodeSDK({
  traceExporter,
  instrumentations: [getNodeAutoInstrumentations()],
});

// Graceful shutdown of tracing
process.on('SIGTERM', () => {
  otelSDK.shutdown()
    .then(() => console.log('Tracing terminated successfully'))
    .catch((error) => console.log('Error terminating tracing', error))
    .finally(() => process.exit(0));
});
