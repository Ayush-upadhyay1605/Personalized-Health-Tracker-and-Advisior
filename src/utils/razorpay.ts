
/**
 * Utility function to load the Razorpay script dynamically
 */
export const loadRazorpay = (): Promise<any> => {
  return new Promise((resolve, reject) => {
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.onload = () => {
      resolve(window.Razorpay);
    };
    script.onerror = () => {
      reject(new Error('Razorpay SDK failed to load'));
    };
    
    document.body.appendChild(script);
  });
};

// Extend the Window interface to include Razorpay
declare global {
  interface Window {
    Razorpay: any;
  }
}
