
import { loadRazorpay } from '@/utils/razorpay';

interface PaymentOptions {
  amount: number; // in paisa (1 INR = 100 paisa)
  currency?: string;
  name: string;
  description: string;
  orderId?: string;
  email: string;
  contact?: string;
  successCallback: (response: any) => void;
  failureCallback?: (error: any) => void;
}

export const initiatePayment = async ({
  amount,
  currency = 'INR',
  name,
  description,
  orderId = 'order_' + Date.now(),
  email,
  contact = '',
  successCallback,
  failureCallback
}: PaymentOptions) => {
  try {
    // Load Razorpay script
    const Razorpay = await loadRazorpay();
    
    // Create a new instance of Razorpay
    const razorpayOptions = {
      key: 'rzp_test_yVDBqabM2BSjRW', // Test mode key
      amount: amount.toString(),
      currency,
      name,
      description,
      order_id: orderId,
      handler: function (response: any) {
        successCallback(response);
      },
      prefill: {
        email,
        contact
      },
      notes: {
        address: 'Healthcare App'
      },
      theme: {
        color: '#6558F5'
      }
    };

    const razorpayInstance = new Razorpay(razorpayOptions);
    razorpayInstance.open();
    
    razorpayInstance.on('payment.failed', function (response: any) {
      if (failureCallback) {
        failureCallback(response.error);
      }
    });
  } catch (error) {
    console.error('Razorpay payment error:', error);
    if (failureCallback) {
      failureCallback(error);
    }
  }
};
