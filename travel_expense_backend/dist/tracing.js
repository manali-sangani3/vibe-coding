"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.otelSDK = void 0;
const sdk_node_1 = require("@opentelemetry/sdk-node");
const auto_instrumentations_node_1 = require("@opentelemetry/auto-instrumentations-node");
const exporter_trace_otlp_grpc_1 = require("@opentelemetry/exporter-trace-otlp-grpc");
const api_1 = require("@opentelemetry/api");
api_1.diag.setLogger(new api_1.DiagConsoleLogger(), api_1.DiagLogLevel.INFO);
const traceExporter = new exporter_trace_otlp_grpc_1.OTLPTraceExporter({
    url: process.env.OTEL_EXPORTER_OTLP_ENDPOINT || 'http://localhost:4317',
});
exports.otelSDK = new sdk_node_1.NodeSDK({
    traceExporter,
    instrumentations: [(0, auto_instrumentations_node_1.getNodeAutoInstrumentations)()],
});
process.on('SIGTERM', () => {
    exports.otelSDK.shutdown()
        .then(() => console.log('Tracing terminated successfully'))
        .catch((error) => console.log('Error terminating tracing', error))
        .finally(() => process.exit(0));
});
//# sourceMappingURL=tracing.js.map