const PaymentStrategy = require('./paymentStrategy');

class CreditCardPaymentStrategy extends PaymentStrategy {
  constructor({ endpoint } = {}) {
    super();
    this.endpoint = endpoint || 'https://fakepayment.onrender.com/payments';
    this.apiKey = process.env.PAYMENT_API_KEY || null;
  }

  async processPayment(paymentDetails) {
    // paymentDetails should include amount, currency, cardToken, etc.
    try {
      const headers = { 'Content-Type': 'application/json' };
      if (this.apiKey) headers['Authorization'] = `Bearer ${this.apiKey}`;

      // Build a whitelist payload to send to the gateway (avoid unexpected fields)
      const allowed = ['full-name', 'card-number', 'expiration-month', 'expiration-year', 'cvv', 'cvc', 'currency', 'amount'];
      const pd = paymentDetails || {};
      const payloadToSend = {};
      // map common keys to gateway keys
      if (pd['full-name'] || pd.fullName || pd.name) payloadToSend['full-name'] = pd['full-name'] || pd.fullName || pd.name;
      if (pd['card-number'] || pd.cardNumber || pd.number) payloadToSend['card-number'] = pd['card-number'] || pd.cardNumber || pd.number;
      if (pd['expiration-month'] || pd.expirationMonth || pd.expMonth) payloadToSend['expiration-month'] = pd['expiration-month'] || pd.expirationMonth || pd.expMonth;
      if (pd['expiration-year'] || pd.expirationYear || pd.expYear) payloadToSend['expiration-year'] = pd['expiration-year'] || pd.expirationYear || pd.expYear;
      if (pd.cvv || pd.cvc) payloadToSend['cvv'] = pd.cvv || pd.cvc;
      if (pd.currency) payloadToSend['currency'] = pd.currency;
      if (pd.amount) payloadToSend['amount'] = pd.amount;

      // include description if provided or set a default (some gateways require it)
      payloadToSend.description = pd.description || pd.desc || `Order payment`;

      // ensure amount is present if provided separately
      // sanitized log
      try {
        const logPayload = Object.assign({}, payloadToSend);
        if (logPayload['card-number']) {
          const raw = String(logPayload['card-number']);
          logPayload['card-number'] = raw.length > 4 ? raw.slice(0, 2) + '...' + raw.slice(-4) : '****';
        }
        if (logPayload.cvv) logPayload.cvv = '***';
        console.error('Payment request (sanitized, whitelist):', JSON.stringify(logPayload));
      } catch (logErr) {
        console.error('Could not sanitize paymentDetails for log:', logErr);
      }

      const res = await fetch(this.endpoint, {
        method: 'POST',
        headers,
        body: JSON.stringify(payloadToSend)
      });
      const json = await res.json();
      // The fakepayment API returns an object — we treat success when status==='success' or http ok
      if (res.ok && (json.status === 'success' || json.success === true)) {
        return { success: true, data: json };
      }
      return { success: false, data: json };
    } catch (err) {
      return { success: false, error: err };
    }
  }
}

module.exports = CreditCardPaymentStrategy;
