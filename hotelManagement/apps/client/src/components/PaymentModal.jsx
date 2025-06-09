import { useState } from "react";
import { FaCreditCard } from "react-icons/fa";
import {
  CardNumberElement,
  useStripe,
  useElements,
  CardExpiryElement,
  CardCvcElement,
} from "@stripe/react-stripe-js";
import { roomBookPayment } from "../services/Payment";
import { toast } from "react-hot-toast";

const PaymentModal = ({
  paymentModalShow,
  setPaymentModalShow,
  selectedRoom,
}) => {
  const [loading, setLoading] = useState(false);
  const stripe = useStripe();
  const elements = useElements();

  const CARD_ELEMENT_OPTIONS = {
    style: {
      base: {
        fontSize: "16px",
        color: "#495057",
        "::placeholder": {
          color: "#ced4da",
        },
      },
      invalid: {
        color: "#e85746",
      },
    },
  };
  if (!paymentModalShow) return null;

  const handlePayment = async (event) => {
    event.preventDefault();
    if (!stripe || !elements) {
      toast.error("Stripe is not loaded");
      return;
    }

    setLoading(true);
    const cardElement = elements.getElement(CardNumberElement);

    if (!cardElement) {
      toast.error("Payment card element not found");
      setLoading(false);
      return;
    }

    const data = {
      userId: selectedRoom?.userId?._id,
      amount: selectedRoom?.amount,
    };

    const response = await roomBookPayment(data);
    if (response.success) {
      toast.success(response.message);
      setPaymentModalShow(false);
    } else {
      toast.error(response.message);
    }
    console.log(data, "BOOKING DATA");
  };

  return (
    <div className="fixed inset-0 bg-gray-500/50 flex justify-center items-center z-50">
      <div className="bg-white rounded-lg shadow-md p-6 w-full max-w-sm">
        <div className="flex justify-between items-center">
          <h3 className="text-lg">
            Pay amount of Rs. {selectedRoom?.amount} to Radha-Krishna Hotel
          </h3>
          <button
            onClick={() => setPaymentModalShow(false)}
            className="text-gray-700 hover:text-gray-900"
          >
            X
          </button>
        </div>
        <p className="mb-4 text-[12px] text-[#808080]">
          Please enter your credit card details to complete the payment for
          <strong className="text-black capitalize">
            {" "}
            {selectedRoom?.roomType}.
          </strong>
        </p>
        <h3 className="text-lg mb-4 text-center">Pay with Card</h3>

        {/* Credit Card Logos */}
        <div className="flex justify-center gap-2 mb-4">
          <img src="/visa.png" alt="Visa" className="w-12 h-8" />
          <img src="/master.png" alt="MasterCard" className="w-12 h-8" />
          <img src="/mastro.png" alt="Maestro" className="w-12 h-8" />
          <img src="/discover.png" alt="Discover" className="w-12 h-8" />
        </div>

        {/* Payment Form */}
        <form onSubmit={handlePayment}>
          {/* Card Number Field */}
          <div className="mb-5 text-left">
            <label
              htmlFor="card-number"
              className="block text-sm text-gray-700 mb-2"
            >
              Card Number
            </label>
            <div className="flex items-center border border-gray-300 rounded-md p-2">
              <CardNumberElement
                id="card-number"
                options={CARD_ELEMENT_OPTIONS}
              />
              <FaCreditCard className="ml-2 text-gray-700 text-xl" />
            </div>
          </div>

          {/* Expiry Date and CVV Fields */}
          <div className="flex justify-between mb-5">
            <div className="w-1/2">
              <label
                htmlFor="exp-date"
                className="block text-sm text-gray-700 mb-2"
              >
                Exp Date
              </label>
              <div className="border border-gray-300 rounded-md p-2">
                <CardExpiryElement
                  id="exp-date"
                  options={CARD_ELEMENT_OPTIONS}
                />
              </div>
            </div>

            <div className="w-1/2">
              <label htmlFor="cvv" className="block text-sm text-gray-700 mb-2">
                CVV
              </label>
              <div className="border border-gray-300 rounded-md p-2">
                <CardCvcElement id="cvv" options={CARD_ELEMENT_OPTIONS} />
              </div>
            </div>
          </div>

          {/* Payment Button */}
          <button
            type="submit"
            disabled={!stripe || loading}
            className="w-full py-3 bg-blue-800 text-white rounded-md text-lg cursor-pointer mt-5 transition-all hover:bg-purple-700"
          >
            {loading ? (
              <>
                <div
                  className="spinner-border text-light mr-3"
                  style={{ width: "1.2rem", height: "1.2rem" }}
                  role="status"
                >
                  {/* <span className="visually-hidden">Loading...</span> */}
                </div>
                Processing...
              </>
            ) : (
              `Pay ${selectedRoom?.amount}`
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default PaymentModal;
