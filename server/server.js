// Existing imports ...
import express from "express";
import Stripe from "stripe";
import cors from "cors";
import bodyParser from "body-parser";
import dotenv from "dotenv";

dotenv.config();
const app = express();
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

app.use(cors());
app.use(express.json());

// Webhook needs raw body
app.use("/webhook", bodyParser.raw({ type: "application/json" }));

let ordersDB = {}; // Simulated DB for demo

app.post("/create-checkout-session", async (req, res) => {
  const { details } = req.body;
  try {
    let session;

    if (details.paymentMethod === "Card") {
      // Only create Stripe session for supported online payment
      session = await stripe.checkout.sessions.create({
        payment_method_types: ["card"],
        line_items: [
          {
            price_data: {
              currency: "usd",
              product_data: { name: details.product },
              unit_amount: Math.round(details.singlePrice * 100), // in cents
            },
            quantity: details.quantity,
          },
        ],
        mode: "payment",
        success_url: `http://localhost:5173/checkout?status=success`,
        cancel_url: `http://localhost:5173/checkout?status=cancel`,
      });
    } else {
      // For COD or unsupported methods, skip Stripe
      return res.json({
        url: `http://localhost:5173/checkout?status=pending`,
      });
    }

    res.json({ url: session.url });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

// Stripe webhook
app.post("/webhook", (req, res) => {
  const sig = req.headers["stripe-signature"];
  let event;

  try {
    event = stripe.webhooks.constructEvent(
      req.body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (err) {
    console.error("Webhook signature verification failed.", err.message);
    return res.sendStatus(400);
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object;
    console.log("Payment successful for session:", session.id);

    if (ordersDB[session.id]) {
      ordersDB[session.id].status = "paid";
      // Here you can trigger email confirmation, DB update, etc.
    }
  }

  res.json({ received: true });
});

// API to fetch order status by session_id
app.get("/order-status/:session_id", (req, res) => {
  const { session_id } = req.params;
  const order = ordersDB[session_id];
  if (order) res.json({ status: order.status });
  else res.status(404).json({ error: "Order not found" });
});

app.listen(5000, () => console.log("Server running on port 5000"));
