"use client";
import Image from "next/image";
import { useEffect } from "react";

const PackagesNew = (props: any) => {
  return (
    <>
      {/* <div className="grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-6 xl:grid-cols-4 2xl:gap-7.5 mb-4">
        {plans.data.map((plan: PackagesProps) => (
            <Packages key={plan.id} {...plan} />
        ))}
      </div> */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-6 xl:grid-cols-3 2xl:gap-7.5">
        {/* Plan 1 */}
        <div className="group relative bg-white dark:bg-black rounded-lg shadow-solid-10 dark:shadow-none border border-stroke dark:border-black p-7.5 xl:p-12.5">
          <h2 className="mb-5 text-[32px] font-bold text-black dark:text-white">
            Explorer Plan
          </h2>
          <p className="mb-4 pb-4 text-base text-body-color dark:text-dark-6">
            Domain investors venturing into the realm of trademarks.
          </p>
          <h2
            className="mb-5 text-[52px] font-bold text-black dark:text-white rounded-md text-center"
            style={{ background: "#DBEAFE", padding: "1.5rem 1rem 1rem" }}
          >
            <span>Free</span>
            <span className="text-base font-medium text-body-color dark:text-dark-6 ml-1">
              Forever
            </span>
          </h2>
          <div className="inline-flex mb-1.5">
            <Image
              className="mx-auto pt-1"
              style={{ height: "18px", width: "15px" }}
              width={0}
              height={0}
              src={"https://cdn.vnoc.com/desc/dntrademark/dn-check.png"}
              alt="Check Icon"
            />
            <h6 className="text-black dark:text-white font-medium text-1xl mb-0 ml-2">
              Free 25 domains
            </h6>
          </div>
          <br></br>
          <div className="inline-flex mb-1.5">
            <Image
              className="mx-auto pt-1"
              style={{ height: "18px", width: "15px" }}
              width={0}
              height={0}
              src={"https://cdn.vnoc.com/desc/dntrademark/dn-check.png"}
              alt="Check Icon"
            />
            <h6 className="text-black dark:text-white font-medium text-1xl mb-0 ml-2">
              For Starters:
            </h6>
          </div>
          <p className="text-primary font-medium">Benefits:</p>
          <div
            aria-label="purchase this plan"
            className="inline-flex1 items-center gap-2.5 text-dark dark:text-white dark:hover:text-primary font-medium transition-all duration-300 mb-1.5"
          >
            <svg
              className="inline-flex mr-1"
              width="14"
              height="14"
              viewBox="0 0 14 14"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M10.4767 6.16701L6.00668 1.69701L7.18501 0.518677L13.6667 7.00034L7.18501 13.482L6.00668 12.3037L10.4767 7.83368H0.333344V6.16701H10.4767Z"
                fill="currentColor"
              />
            </svg>
            <b>Trademark Notifications:</b> Stay informed on trademarks related
            to your domains.
          </div>
          <div
            aria-label="purchase this plan"
            className="inline-flex1 items-center gap-2.5 text-dark dark:text-white dark:hover:text-primary font-medium transition-all duration-300 mb-1.5"
          >
            <svg
              className="inline-flex mr-1"
              width="14"
              height="14"
              viewBox="0 0 14 14"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M10.4767 6.16701L6.00668 1.69701L7.18501 0.518677L13.6667 7.00034L7.18501 13.482L6.00668 12.3037L10.4767 7.83368H0.333344V6.16701H10.4767Z"
                fill="currentColor"
              />
            </svg>
            <b>Basic Analytics:</b> Track key insights on your domains.
          </div>
          <div
            aria-label="purchase this plan"
            className="inline-flex1 items-center gap-2.5 text-dark dark:text-white dark:hover:text-primary font-medium transition-all duration-300 mb-1.5"
          >
            <svg
              className="inline-flex mr-1"
              width="14"
              height="14"
              viewBox="0 0 14 14"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M10.4767 6.16701L6.00668 1.69701L7.18501 0.518677L13.6667 7.00034L7.18501 13.482L6.00668 12.3037L10.4767 7.83368H0.333344V6.16701H10.4767Z"
                fill="currentColor"
              />
            </svg>
            <b>Community Access:</b> Engage with fellow domain enthusiasts.
          </div>
          <p className="text-primary font-medium">Ideal For:</p>
          <div
            aria-label="purchase this plan"
            className="inline-flex1 items-center gap-2.5 text-dark dark:text-white dark:hover:text-primary font-medium transition-all duration-300 mb-1.5"
          >
            <svg
              className="inline-flex mr-1"
              width="14"
              height="14"
              viewBox="0 0 14 14"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M10.4767 6.16701L6.00668 1.69701L7.18501 0.518677L13.6667 7.00034L7.18501 13.482L6.00668 12.3037L10.4767 7.83368H0.333344V6.16701H10.4767Z"
                fill="currentColor"
              />
            </svg>
            Individual domain investors exploring the world of trademarks.
          </div>
          <p className="text-primary font-medium mb-5.5">$0.10 cents in excess of 25</p>
          <div className="mb-5">&nbsp;</div>
          <Image
            className="mx-auto"
            style={{ position: "absolute", right: "5px", top: "0px" }}
            width={100}
            height={100}
            src={
              "https://cdn.vnoc.com/desc/dntrademark/dn-monitor-lizard-1.png"
            }
            alt="Plan Image 1"
          />
          {props.package.package_id === 1 && (
            <button
              type="submit"
              className="block w-full rounded-md border border-primary bg-primary p-3 text-center text-base font-medium text-white transition hover:bg-opacity-90"
              style={{
                position: "absolute",
                right: "0",
                bottom: "35px",
                left: "0",
                margin: "30px auto 0",
                width: "255px",
              }}
            >
              Current
            </button>
          )}          
        </div>
        {/* End plan 1 */}

        {/* Plan 2 */}
        <div className="group relative bg-white dark:bg-black rounded-lg shadow-solid-10 dark:shadow-none border border-stroke dark:border-black p-7.5 xl:p-12.5">
          <h2 className="mb-5 text-[32px] font-bold text-black dark:text-white">
            Professional Plan
          </h2>
          <p className="mb-4 pb-4 text-base text-body-color dark:text-dark-6">
            Devoted individual domain investors committed to their endeavors.
          </p>
          <h2
            className="mb-5 text-[52px] font-bold text-black dark:text-white rounded-md text-center"
            style={{ background: "#DBEAFE", padding: "1.5rem 1rem 1rem" }}
          >
            <span>$99</span>
            <span className="text-base font-medium text-body-color dark:text-dark-6">
              / year
            </span>
          </h2>
          <div className="inline-flex mb-1.5">
            <Image
              className="mx-auto pt-1"
              style={{ height: "18px", width: "15px" }}
              width={0}
              height={0}
              src={"https://cdn.vnoc.com/desc/dntrademark/dn-check.png"}
              alt="Check Icon"
            />
            <h6 className="text-black dark:text-white font-medium text-1xl mb-0 ml-2">
              Free 2000 Domains
            </h6>
          </div>
          <br></br>
          <div className="inline-flex mb-1.5">
            <Image
              className="mx-auto pt-1"
              style={{ height: "18px", width: "15px" }}
              width={0}
              height={0}
              src={"https://cdn.vnoc.com/desc/dntrademark/dn-check.png"}
              alt="Check Icon"
            />
            <h6 className="text-black dark:text-white font-medium text-1xl mb-0 ml-2">
              For Individuals:
            </h6>
          </div>
          <p className="text-primary font-medium">
            Everything in Explorer, Plus:
          </p>
          <div
            aria-label="purchase this plan"
            className="inline-flex1 items-center gap-2.5 text-dark dark:text-white dark:hover:text-primary font-medium transition-all duration-300 mb-1.5"
          >
            <svg
              className="inline-flex mr-1"
              width="14"
              height="14"
              viewBox="0 0 14 14"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M10.4767 6.16701L6.00668 1.69701L7.18501 0.518677L13.6667 7.00034L7.18501 13.482L6.00668 12.3037L10.4767 7.83368H0.333344V6.16701H10.4767Z"
                fill="currentColor"
              />
            </svg>
            <b>
              Advanced Trademark Notifications:Advanced Trademark Notifications:
            </b>{" "}
            Comprehensive notifications for nuanced insights.
          </div>
          <div
            aria-label="purchase this plan"
            className="inline-flex1 items-center gap-2.5 text-dark dark:text-white dark:hover:text-primary font-medium transition-all duration-300 mb-1.5"
          >
            <svg
              className="inline-flex mr-1"
              width="14"
              height="14"
              viewBox="0 0 14 14"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M10.4767 6.16701L6.00668 1.69701L7.18501 0.518677L13.6667 7.00034L7.18501 13.482L6.00668 12.3037L10.4767 7.83368H0.333344V6.16701H10.4767Z"
                fill="currentColor"
              />
            </svg>
            <b>Priority Support:</b> Fast-track assistance from our support
            team.
          </div>
          <p className="text-primary font-medium">Ideal For:</p>
          <div
            aria-label="purchase this plan"
            className="inline-flex1 items-center gap-2.5 text-dark dark:text-white dark:hover:text-primary font-medium transition-all duration-300 mb-1.5"
          >
            &nbsp;&nbsp;
            <svg
              className="inline-flex mr-1"
              width="14"
              height="14"
              viewBox="0 0 14 14"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M10.4767 6.16701L6.00668 1.69701L7.18501 0.518677L13.6667 7.00034L7.18501 13.482L6.00668 12.3037L10.4767 7.83368H0.333344V6.16701H10.4767Z"
                fill="currentColor"
              />
            </svg>
            Small to medium-sized teams requiring advanced features.            
          </div>          
          <p className="text-primary font-medium mb-5.5">$.08 cents/domain in excess of 2000</p>
          <Image
            className="mx-auto"
            style={{ position: "absolute", right: "5px", top: "0px" }}
            width={100}
            height={100}
            src={
              "https://cdn.vnoc.com/desc/dntrademark/dn-monitor-lizard-2.png"
            }
            alt="Plan Image 2"
          />
          {props.package.package_id === 2 ? (
            <button
              type="submit"
              className="block w-full rounded-md border border-primary bg-primary p-3 text-center text-base font-medium text-white transition hover:bg-opacity-90"
              style={{
                position: "absolute",
                right: "0",
                bottom: "35px",
                left: "0",
                margin: "30px auto 0",
                width: "255px",
              }}
            >
              Current
            </button>
          ) : (
            <a
              href="/checkout/2"
              type="submit"
              className="block w-full rounded-md border border-stroke dark:border-dark-3 bg-transparent p-3 text-center text-base font-medium text-primary transition hover:border-primary hover:bg-primary hover:text-white"
              style={{
                position: "absolute",
                right: "0",
                bottom: "35px",
                left: "0",
                margin: "30px auto 0",
                width: "255px",
              }}
            >
              Activate
            </a>
          )}
        </div>
        {/* End plan 2 */}

        {/* Plan 3 */}
        <div className="group relative bg-white dark:bg-black rounded-lg shadow-solid-10 dark:shadow-none border border-stroke dark:border-black p-7.5 xl:p-12.5">
          <h2 className="mb-5 text-[32px] font-bold text-black dark:text-white">
            Enterprise Plan
          </h2>
          <p className="mb-4 pb-4 text-base text-body-color dark:text-dark-6">
            Corporations efficiently handling large and diverse domain
            portfolios.
          </p>
          <h2
            className="mb-5 text-[52px] font-bold text-black dark:text-white rounded-md text-center"
            style={{ background: "#DBEAFE", padding: "1.5rem 1rem 1rem" }}
          >
            <span>$199</span>
            <span className="text-base font-medium text-body-color dark:text-dark-6">
              / year
            </span>
          </h2>
          <div className="inline-flex mb-1.5">
            <Image
              className="mx-auto pt-1"
              style={{ height: "18px", width: "15px" }}
              width={0}
              height={0}
              src={"https://cdn.vnoc.com/desc/dntrademark/dn-check.png"}
              alt="Check Icon"
            />
            <h6 className="text-black dark:text-white font-medium text-1xl mb-0 ml-2">
              Free 4000 Domains
            </h6>
          </div>
          <br></br>
          <div className="inline-flex mb-1.5">
            <Image
              className="mx-auto pt-1"
              style={{ height: "18px", width: "15px" }}
              width={0}
              height={0}
              src={"https://cdn.vnoc.com/desc/dntrademark/dn-check.png"}
              alt="Check Icon"
            />
            <h6 className="text-black dark:text-white font-medium text-1xl mb-0 ml-2">
              For Corporations:
            </h6>
          </div>
          <p className="text-primary font-medium">
            Dedicated Account Manager: A designated expert for personalized
            support.
          </p>
          <p className="text-primary font-medium">
            API Access: Integrate DNTrademark.com with your existing systems.
          </p>
          <p className="text-primary font-medium">Ideal For:</p>
          <div
            aria-label="purchase this plan"
            className="inline-flex1 items-center gap-2.5 text-dark dark:text-white dark:hover:text-primary font-medium transition-all duration-300 mb-1.5"
          >
            <svg
              className="inline-flex mr-1"
              width="14"
              height="14"
              viewBox="0 0 14 14"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M10.4767 6.16701L6.00668 1.69701L7.18501 0.518677L13.6667 7.00034L7.18501 13.482L6.00668 12.3037L10.4767 7.83368H0.333344V6.16701H10.4767Z"
                fill="currentColor"
              />
            </svg>
            Corporations managing extensive domain portfolios.
          </div>
          <p className="text-primary font-medium mb-5.5">$.06 cents/domain in excess of 4000</p>
          <Image
            className="mx-auto"
            style={{ position: "absolute", right: "5px", top: "0px" }}
            width={100}
            height={100}
            src={
              "https://cdn.vnoc.com/desc/dntrademark/dn-monitor-lizard-3b.png"
            }
            alt="Plan Image 3"
          />
          {props.package.package_id === 3 ? (
            <button
              type="submit"
              className="block w-full rounded-md border border-primary bg-primary p-3 text-center text-base font-medium text-white transition hover:bg-opacity-90"
              style={{
                position: "absolute",
                right: "0",
                bottom: "35px",
                left: "0",
                margin: "30px auto 0",
                width: "255px",
              }}
            >
              Current
            </button>
          ) : (
            <a
              href="/checkout/3"
              type="submit"
              className="block w-full rounded-md border border-stroke dark:border-dark-3 bg-transparent p-3 text-center text-base font-medium text-primary transition hover:border-primary hover:bg-primary hover:text-white"
              style={{
                position: "absolute",
                right: "0",
                bottom: "35px",
                left: "0",
                margin: "30px auto 0",
                width: "255px",
              }}
            >
              Activate
            </a>
          )}
        </div>
        {/* End plan 3 */}
      </div>
    </>
  );
};

export default PackagesNew;
