const baseUrl = import.meta.env.VITE_BASE_URL;
import { loadStripe } from "@stripe/stripe-js";

// Initialize Stripe
const stripePromise = loadStripe(
  import.meta.env.VITE_API_STRIPE_PUBLISHABLE_KEY
);

export const createPaymentIntent = async (amount, roomType, userId) => {
  try {
    const response = await fetch(`${baseUrl}create-payment-intent`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ amount, roomType, userId }),
    });

    const { clientSecret } = await response.json();

    return clientSecret; // Return the client secret to the caller
  } catch (error) {
    throw new Error("Error creating payment intent: " + error.message);
  }
};

export const handlePayment = async (clientSecret, cardElement) => {
  try {
    const stripe = await stripePromise;

    const { error, paymentIntent } = await stripe.confirmCardPayment(
      clientSecret,
      {
        payment_method: {
          card: cardElement, // Stripe Element for the credit card
        },
      }
    );

    if (error) {
      throw new Error("Payment failed: " + error.message);
    }

    return paymentIntent; // Return the payment intent on success
  } catch (error) {
    throw new Error("Payment error: " + error.message);
  }
};

export const getPaymentStatus = (id) => {
  return fetch(`${baseUrl}payment/user-payments/${id}`, {
    method: "GET",
    credentials: "include",
  })
    .then((response) => response.json())
    .catch((error) => console.error(error));
};
