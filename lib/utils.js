/**
 * Reconstructs the original URL of the request.
 *
 * This function builds a URL that corresponds the original URL requested by the
 * client, including the protocol (http or https) and host.
 *
 * If the request passed through any proxies that terminate SSL, the
 * `X-Forwarded-Proto` header is used to detect if the request was encrypted to
 * the proxy, assuming that the proxy has been flagged as trusted.
 *
 * @param {http.IncomingMessage} req
 *   Incoming request to Express.
 *   `req.app` is inspected for `trust proxy` setting.
 * @param {object} [options]
 * @param {boolean} [options.proxy]
 *   Force treating the request as coming through a trusted proxy.
 *   If falsey, Express `trust proxy` setting is used
 * @return {String}
 *   Fully constructed URL of the request
 * @api private
 */
function originalURL(req, { proxy } = {}) {
  /** Automatically honor trust proxy from Express app */
  const trustProxy = proxy ?? (req.app?.get && req.app.get('trust proxy'));

  /** Protocol from  `x-forwarded-proto` header */
  const proto = req.headers['x-forwarded-proto']?.split(/\s*,\s*/)[0].toLowerCase();
  /** TLS is enabled or not */
  const tls = req.connection?.encrypted || (trustProxy && proto === 'https');

  /**
   * Determines protocol of request
   *
   * @remarks
   *  - If `connection.encrypted` is truthy then use `https`
   *  - If `trustProxy` is set, then check that leftmost value of `x-forwarded-proto` header is `https`
   *  - Otherwise, protocol is `http`
   */
  const protocol = tls ? 'https' : 'http';

  /** Determine host */
  const host = (trustProxy && req.headers['x-forwarded-host']) || req.headers.host || 'localhost';

  /** URL path if it exists */
  const path = req.url || '';

  return `${protocol}://${host}${path}`;
}

module.exports = { originalURL };