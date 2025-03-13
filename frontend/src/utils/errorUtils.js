/**
 * Maps Razorpay error codes to user-friendly messages
 * @param {string} errorCode - The error code from Razorpay
 * @returns {string} A user-friendly error message
 */
export const getRazorpayErrorMessage = (errorCode) => {
  const errorMessages = {
    BAD_REQUEST_ERROR: "The payment request was invalid. Please try again.",
    GATEWAY_ERROR: "There was an issue with the payment gateway. Please try again later.",
    SERVER_ERROR: "Our server encountered an error. Please try again later.",
    PAYMENT_CANCELED: "You canceled the payment process.",
    NETWORK_ERROR: "Network connection issues detected. Please check your internet connection.",
    DEFAULT: "Something went wrong with your payment. Please try again."
  };
  
  return errorMessages[errorCode] || errorMessages.DEFAULT;
};

/**
 * Analyzes the payment error and returns appropriate actions
 * @param {Object} error - The error object
 * @returns {Object} Action recommendations and error details
 */
export const analyzePaymentError = (error) => {
  // Determine if error is retryable
  const isRetryable = !(error?.message?.includes('verification failed') || 
                        error?.message?.includes('invalid signature'));
  
  // Determine recommended action
  let recommendedAction = isRetryable ? 'retry' : 'contact_support';
  
  // For certain errors, recommend checking order status instead
  if (error?.message?.includes('network') || error?.message?.includes('timeout')) {
    recommendedAction = 'check_status';
  }
  
  return {
    isRetryable,
    recommendedAction,
    errorDetails: error
  };
};