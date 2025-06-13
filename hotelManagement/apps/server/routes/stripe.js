const express = require("express");
const router = express.Router();
const Payment = require("../models/paymentModel");
const stripe = require("stripe")(process.env.API_STRIPE_SECRET_KEY);

console.log(process.env.API_STRIPE_SECRET_KEY); // Check if it's being loaded correctly

router.post("/create-payment-intent", async (req, res) => {
  try {
    const { roomType, amount, userId } = req.body; // Get the room type, amount, and userId

    if (!roomType || !amount || !userId) {
      return res.status(400).json({
        status: "error",
        message: "Missing required fields",
      });
    }

    // Create a Stripe payment intent to get the PaymentIntent ID
    const paymentIntent = await stripe.paymentIntents.create({
      amount: amount * 100, // Convert amount to cents
      currency: "usd", // Or any other currency
      metadata: { roomType, userId },
    });

    if (!paymentIntent.id) {
      return res.status(400).json({
        status: "error",
        message: "Stripe PaymentIntent ID is missing.",
      });
    }

    // Create a new payment record in the database (store pending status first)
    const payment = new Payment({
      userId,
      roomType,
      amount,
      status: "pending", // Initially set the status to "pending"
      stripePaymentIntentId: paymentIntent.id, // Assign the PaymentIntent ID at creation
    });

    // Save the payment object with the PaymentIntent ID
    await payment.save();

    // Send the client secret to the frontend to complete the payment
    res.status(200).json({
      status: "success",
      clientSecret: paymentIntent.client_secret,
      paymentIntentId: paymentIntent.id,
      message: "Payment intent created successfully",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      status: "error",
      message: "Server error",
    });
  }
});

module.exports = router;
