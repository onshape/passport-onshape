import { describe, it, expect } from 'vitest';
import { originalURL } from '../lib/utils';

function makeReq({
  url = '/path',
  host = 'example.com',
  forwardedHost,
  forwardedProto,
  encrypted = false,
  trustProxy = false,
} = {}) {
  return {
    url,
    headers: {
      host,
      ...(forwardedHost && { 'x-forwarded-host': forwardedHost }),
      ...(forwardedProto && { 'x-forwarded-proto': forwardedProto }),
    },
    connection: { encrypted },
    app: {
      get: (key) => key === 'trust proxy' && trustProxy,
    },
  };
}

describe('utils.originalURL() Tests', () => {
  it('returns http URL for non-proxy, non-TLS request', () => {
    const req = makeReq();
    expect(originalURL(req)).toBe('http://example.com/path');
  });

  it('returns https URL when connection is encrypted', () => {
    const req = makeReq({ encrypted: true });
    expect(originalURL(req)).toBe('https://example.com/path');
  });

  it('uses forwarded proto + forwarded host when trust proxy is enabled', () => {
    const req = makeReq({
      forwardedProto: 'https',
      forwardedHost: 'proxy.com',
      trustProxy: true,
    });
    expect(originalURL(req)).toBe('https://proxy.com/path');
  });

  it('supports multiple values in x-forwarded-proto (uses first)', () => {
    const req = makeReq({
      forwardedProto: 'https, http',
      forwardedHost: 'proxy.com',
      trustProxy: true,
    });
    expect(originalURL(req)).toBe('https://proxy.com/path');
  });

  it('falls back to http when trust proxy enabled but no forwarded proto', () => {
    const req = makeReq({
      forwardedHost: 'proxy.com',
      trustProxy: true,
    });
    expect(originalURL(req)).toBe('http://proxy.com/path');
  });

  it('falls back to req.headers.host when forwarded-host missing', () => {
    const req = makeReq({
      forwardedProto: 'https',
      trustProxy: true,
    });
    expect(originalURL(req)).toBe('https://example.com/path');
  });

  it('ignores forwarded headers if trust proxy is false', () => {
    const req = makeReq({
      forwardedProto: 'https',
      forwardedHost: 'proxy.com',
      trustProxy: false,
    });
    expect(originalURL(req)).toBe('http://example.com/path');
  });

  it('handles missing req.url gracefully', () => {
    const req = makeReq();
    delete req.url;
    expect(originalURL(req)).toBe('http://example.com');
  });

  it('respects options.proxy override even if app trust proxy is false', () => {
    const req = makeReq({
      forwardedProto: 'https',
      forwardedHost: 'proxy.com',
      trustProxy: false,
    });
    expect(originalURL(req, { proxy: true })).toBe('https://proxy.com/path');
  });
});