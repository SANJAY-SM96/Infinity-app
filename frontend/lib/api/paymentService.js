import api from './apiClient';

export const paymentService = {
  stripe: {
    createPaymentIntent: (data) => api.post('/payments/stripe/create-payment-intent', data),
    confirmPayment: (data) => api.post('/payments/stripe/confirm-payment', data)
  },
  razorpay: {
    getKey: () => api.get('/payments/razorpay/key'),
    createOrder: (data) => api.post('/payments/razorpay/create-order', data),
    verifyPayment: (data) => api.post('/payments/razorpay/verify-payment', data)
  }
};
