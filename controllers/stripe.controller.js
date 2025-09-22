import Stripe from "stripe";
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export const createCheckoutSession = async (req, res) => {
  try {
    // Accept priceId from request body, fallback to default if not provided
    const { priceId } = req.body;
    const usedPriceId = "price_1S5ZMlKbr1zIcQbh6vTqcocM";
    // const usedPriceId = priceId || "price_1S5ZMlKbr1zIcQbh6vTqcocM";

    const session = await stripe.checkout.sessions.create({
      mode: "subscription",
      payment_method_types: ["card"],
      line_items: [
        {
          price: usedPriceId,
          quantity: 1,
        },
      ],
      success_url:
        "http://localhost:5173/success?session_id={CHECKOUT_SESSION_ID}",
      cancel_url: "http://localhost:5173/cancel",
    });

    res.json({ url: session.url });
  } catch (err) {
    console.error("Error creating checkout session:", err);
    res.status(500).json({ error: err.message });
  }
};

export const checkoutSession = async (req, res) => {
  try {
    const session = await stripe.checkout.sessions.retrieve(req.params.id, {
      expand: ["subscription"], // expand subscription object
    });

    res.json({
      id: session.id,
      customer: session.customer,
      subscriptionId: session.subscription?.id || null,
      subscriptionStatus: session.subscription?.status || null,
      paymentStatus: session.payment_status,
    });
  } catch (err) {
    console.error("Error fetching checkout session:", err);
    res.status(500).json({ error: err.message });
  }
};
