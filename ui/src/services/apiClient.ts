/**
 * Mock transport. Every service calls `mockRequest` today; when the backend
 * is ready, replace this with a real `fetch` wrapper (base URL, auth headers,
 * error mapping) and the services keep the same signatures.
 */
const MOCK_LATENCY_MS = 450;

export function mockRequest<T>(data: T, latency = MOCK_LATENCY_MS): Promise<T> {
  return new Promise((resolve) => {
    // structuredClone so callers can never mutate the mock source
    setTimeout(() => resolve(structuredClone(data)), latency);
  });
}
