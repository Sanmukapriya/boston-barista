import { useState, useEffect, useRef } from "react";
import styles from "./CheckoutForm.module.css";
import { Button, Form, Input, Select } from "antd";
import { useDispatch, useSelector } from "react-redux";
import {
  setModifiedPrice,
  setCheckoutDetails,
  setQuantity,
} from "../../redux/slices/checkoutSlice";
import emailjs from "emailjs-com";
import { useLocation } from "react-router-dom";

const CheckoutForm = () => {
  const dispatch = useDispatch();
  const finalValues = useRef({});
  const { search } = useLocation();
  const params = new URLSearchParams(search);
  const status = params.get("status"); 

  const productDetails = useSelector((state) => state.checkout.productDetails);

  const [quantity, setQuantityLocal] = useState(productDetails.quantity || 1);

  const apiURL = "http://localhost:5000";

  const capitalizeFirst = (str) =>
    str ? str.charAt(0).toUpperCase() + str.slice(1) : "";

  // Update quantity in Redux whenever it changes
  useEffect(() => {
    dispatch(setQuantity(quantity));
    dispatch(setModifiedPrice(quantity));
  }, [quantity]);

  // Handle form submission
  const handleCheckout = async (values) => {
    finalValues.current = {
      ...values,
      product: capitalizeFirst(productDetails.name),
      price: Number(productDetails.price),
      singlePrice: Number(productDetails.singlePrice || productDetails.price),
      quantity: Number(quantity),
    };

    // Save checkout details in Redux
    dispatch(setCheckoutDetails(finalValues.current));

    try {
      // Send invoice email
      await emailjs.send(
        "service_92agsh9",
        "template_m0jhnzs",
        {
          customerName: finalValues.current.customerName,
          email: finalValues.current.email,
          price: finalValues.current.price,
          order_id: Math.floor(Math.random() * 1000000),
          orders: [
            {
              product: finalValues.current.product,
              quantity: finalValues.current.quantity,
              address: finalValues.current.address,
              phone: finalValues.current.phone,
              paymentMethod: finalValues.current.paymentMethod,
              singlePrice: finalValues.current.singlePrice,
            },
          ],
        },
        "eUkpqIWqKgo5r0hDV"
      );

      console.log("Invoice sent to email successfully!");
    } catch (error) {
      console.error("Error sending email:", error);
    }

    handlePayment();
  };

  // Handle Stripe payment
  const handlePayment = async () => {
    try {
      const response = await fetch(`${apiURL}/create-checkout-session`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ details: finalValues.current }),
      });

      const session = await response.json();

      if (session.url) {
        // Redirect to Stripe Checkout
        window.location.assign(session.url);
      } else {
        console.error("Stripe session creation failed:", session);
        alert("Failed to create Stripe payment session.");
      }
    } catch (error) {
      console.error("Payment initialization error:", error);
      alert("Error initializing payment.");
    }
  };

  return (
    <div className={`${styles.checkout} section`}>
      {status ? (
        <>
          {status === "success" && (
            <h4 style={{ textAlign: "center" }}>
              Payment successful! <br />Order confirmation email sent.
            </h4>
          )}
          {status === "cancel" && (
            <h2 style={{ textAlign: "center" }}>
              Payment failed or cancelled.
            </h2>
          )}
          {status === "pending" && (
            <h4 style={{ textAlign: "center" }}>
              Order placed. <br />Payment will be collected on delivery.
            </h4>
          )}
        </>
      ) : (
        <div className={styles.checkoutForm}>
          <Form
            layout="vertical"
            onFinish={handleCheckout}
            initialValues={{
              product: capitalizeFirst(productDetails.name),
              quantity: productDetails.quantity || 1,
            }}
          >
            <Form.Item name="product">
              <Input readOnly placeholder="Product" />
            </Form.Item>

            <Form.Item
              name="quantity"
              rules={[
                { required: true, message: "Please enter quantity" },
                {
                  validator: async (_, value) => {
                    if (!value) return;
                    const num = Number(value);
                    if (isNaN(num)) throw new Error("Value must be a number");
                    if (num < 1)
                      throw new Error("Quantity must be at least 1");
                  },
                },
              ]}
            >
              <Input
                value={quantity}
                onChange={(e) => setQuantityLocal(Number(e.target.value))}
                placeholder="Quantity"
              />
            </Form.Item>

            <Form.Item>
              <Input
                readOnly
                placeholder="Price"
                value={`$ ${Number(
                  (productDetails.singlePrice || productDetails.price) * quantity
                ).toFixed(2)}`}
              />
            </Form.Item>

            <Form.Item
              name="customerName"
              rules={[{ required: true, message: "Please enter your name" }]}
            >
              <Input placeholder="Your Name" />
            </Form.Item>

            <Form.Item
              name="email"
              rules={[
                {
                  required: true,
                  type: "email",
                  message: "Please enter a valid email",
                },
              ]}
            >
              <Input placeholder="Email Address" />
            </Form.Item>

            <Form.Item
              name="phone"
              rules={[{ required: true, message: "Please enter your phone number" }]}
            >
              <Input placeholder="Phone Number" />
            </Form.Item>

            <Form.Item
              name="address"
              rules={[{ required: true, message: "Please enter your address" }]}
            >
              <Input.TextArea placeholder="Address" rows={3} />
            </Form.Item>

            <Form.Item
              name="paymentMethod"
              rules={[{ required: true, message: "Select a payment method" }]}
            >
              <Select placeholder="Select Payment Method">
                <Select.Option value="UPI">UPI</Select.Option>
                <Select.Option value="Card">Credit/Debit Card</Select.Option>
                <Select.Option value="Cash On Delivery">Cash on Delivery</Select.Option>
              </Select>
            </Form.Item>

            <Form.Item>
              <Button type="primary" htmlType="submit" block>
                Place Order
              </Button>
            </Form.Item>
          </Form>
        </div>
      )}
    </div>
  );
};

export default CheckoutForm;