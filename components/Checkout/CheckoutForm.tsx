"use client"
import { useStripe, useElements, CardElement } from '@stripe/react-stripe-js';
import CardSection from './CardSection';
import { FaCircleNotch } from 'react-icons/fa6'

// Docs:: https://stripe.com/docs/payments/accept-a-payment-charges?client=react

async function stripeTokenHandler(token: any) {
  const paymentData = { token: token.id };

  // Use fetch to send the token ID and any other payment data to your server.
  // https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API/Using_Fetch
  const response = await fetch('/charge', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(paymentData),
  });

  // Return and display the result of the charge.
  return response.json();
}

export default function CheckoutForm() {
  const stripe = useStripe();
  const elements = useElements();

  const handleSubmit = async (event: any) => {
    // We don't want to let default form submission happen here,
    // which would refresh the page.
    event.preventDefault();

    if (!stripe || !elements) {
      // Stripe.js hasn't yet loaded.
      // Make  sure to disable form submission until Stripe.js has loaded.
      return;
    }

    const card = elements.getElement(CardElement);
    if(card){
      const result = await stripe.createToken(card);

      if (result.error) {
        // Show error to your customer.
        console.log(result.error.message);
      } else {
        // Send the token to your server.
        // This function does not exist yet; we will define it in the next step.
        stripeTokenHandler(result.token);
      }
    }
  };

  return (
    <>
      <div className='max-w-full xl:max-w-[50%] mx-auto flex w-full flex-col space-y-10'>
        <div className="flex w-full border-l-6 border-[#009ef7] bg-[#f1faff] bg-opacity-[15%] dark:bg-[#f1faff] px-7 py-8 shadow-md  md:p-9">
          <div className="mr-5 flex h-9 w-full max-w-[36px] items-center justify-center rounded-lg bg-[#009ef7]">
            <svg width="16" height="12" viewBox="0 0 16 12" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M15.2984 0.826822L15.2868 0.811827L15.2741 0.797751C14.9173 0.401867 14.3238 0.400754 13.9657 0.794406L5.91888 9.45376L2.05667 5.2868C1.69856 4.89287 1.10487 4.89389 0.747996 5.28987C0.417335 5.65675 0.417335 6.22337 0.747996 6.59026L0.747959 6.59029L0.752701 6.59541L4.86742 11.0348C5.14445 11.3405 5.52858 11.5 5.89581 11.5C6.29242 11.5 6.65178 11.3355 6.92401 11.035L15.2162 2.11161C15.5833 1.74452 15.576 1.18615 15.2984 0.826822Z" fill="white" stroke="white"></path>
            </svg>
          </div>
          <div className="w-full">
            <h5 className="mb-3 text-lg font-bold text-black dark:text-[#009ef7]">
              Payment Success
            </h5>
            <p className="text-base leading-relaxed text-body">
              Lorem Ipsum is simply dummy text of the printing and
              typesetting industry.
            </p>
          </div>
        </div>
        <div className=' rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark'>
          <div className="border-b border-stroke px-7 py-4 dark:border-strokedark">
            <h3 className="font-medium text-black dark:text-white">
              Order Summary
            </h3>
          </div>
          <div className="p-4 md:p-6 xl:p-9">
            <h3 className="text-black dark:text-white font-bold text-3xl xl:text-title-xxl mb-0">
              $198.88
              <span className="text-regular text-[rgb(117_118_147)] dark:text-manatee inline leading-[55px] text-lg">
                /month
              </span>
            </h3>
            <h4 className="text-black dark:text-white font-medium text-2xl mb-2.5">
              Package D
            </h4>
            <p className='text-[rgb(117_118_147)]'>Good for 2001 to 4000 Domains</p>
          </div>
        </div>
        <div className="rounded-sm border border-stroke py-6 px-7.5 shadow-default dark:border-strokedark dark:bg-boxdark">
          <div className='checkoutCard'>
            <form onSubmit={handleSubmit}>
              <div className='mb-4'>
                <CardSection />
              </div>
              <button className='inline-flex w-full items-center justify-center rounded-md bg-primary py-3 px-10 text-center font-medium text-white hover:bg-opacity-90 lg:px-8 xl:px-10' disabled={!stripe}>
                <FaCircleNotch className="fa-spin mr-2" />
                Pay
              </button>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}