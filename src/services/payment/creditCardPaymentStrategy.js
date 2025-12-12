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

      // Debug: log outgoing payload (without logging the API key)
      try { console.log('Payment request (no key):', JSON.stringify(paymentDetails)); } catch(e){}

      // Add timeout using AbortController
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 10000); // 10s

      const res = await fetch(this.endpoint, {
        method: 'POST',
        headers,
        body: JSON.stringify(paymentDetails),
        signal: controller.signal
      });
      clearTimeout(timeout);
      const json = await res.json();

      // Debug: log response
      try { console.log('Payment response status:', res.status, 'body:', JSON.stringify(json)); } catch(e){}
      // The fakepayment API returns an object — we treat success when status==='success' or http ok
      if (res.ok && (json.status === 'success' || json.success === true)) {
        return { success: true, data: json };
      }
      return { success: false, data: json };
    } catch (err) {
      // If aborted due to timeout, provide clearer message
      if (err.name === 'AbortError') return { success: false, error: new Error('Payment request timed out') };
      return { success: false, error: err };
    }
  }
}

module.exports = CreditCardPaymentStrategy;
