import OrderModel from "../models/Order.model.js";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

const placeOrder = async (req, res) => {
  try {
    const userId = req.user?.id; // from verifyJWT
    if (!userId)
      return res
        .status(401)
        .json({ success: false, message: "User not authenticated" });

    const { items, address, amount } = req.body;

    if (!items || !items.length)
      return res
        .status(400)
        .json({ success: false, message: "Cart is empty" });

    // Prepare order items
    const orderItems = items.map((item) => ({
      itemId: item._id || item.itemId || "static-" + Math.random().toString(36).substring(2),
      name: item.name,
      price: item.price,
      quantity: item.quantity || 1,
    }));

    // Save order to DB
    const order = await OrderModel.create({
      userId,
      items: orderItems,
      address,
      amount,
    });

    // Stripe line items
    const line_items = orderItems.map((item) => ({
      price_data: {
        currency: "inr",
        product_data: { name: item.name },
        unit_amount: item.price * 100,
      },
      quantity: item.quantity,
    }));




    // Stripe checkout session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      mode: "payment",
      line_items,
      success_url: `${process.env.FRONTENDURL}/verify?success=true&orderId=${order._id}`,
      cancel_url: `${process.env.FRONTENDURL}/verify?success=false&orderId=${order._id}`,
      metadata: { orderId: order._id.toString() },
    });

    res.status(201).json({
      success: true,
      message: "Order placed successfully",
      data: { sessionUrl: session.url },
    });
  } catch (error) {
    console.error("PlaceOrder Error:", error);
    res.status(500).json({
      success: false,
      message: error.message || "Internal server error",
    });
  }

};

const verifyOrder = async (req,res) => {
    const {orderId, success} = req.body;
    try {
      if(success == "true") {
        await OrderModel.findByIdAndUpdate(orderId, {payment : true});
        res.json({
          success : true,
          message : "Paid"
        })
      } 
      else {
        await OrderModel.findByIdAndDelete(orderId);
        res.json({
          success : false,
          message : "Not paid",
        })
      }
    } catch (error) {
      console.log(error);
      res.json({
        success : false,
        message : "Error"
      })
    }
  };

 



export {placeOrder, verifyOrder}