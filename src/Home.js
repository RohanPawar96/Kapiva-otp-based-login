import React from "react";
import { Container } from "@mui/material";
import OTPForm from "./Container/OTPForm";

function Home() {
  const [mobileOTPScenario, setMobileOTPScenario] = React.useState(false);
  const [showOtp, setShowOtp] = React.useState(false);
  const server = "st";

  return (
    <>
      <div className="main">
        <p className="page-heading-otp">
          {!mobileOTPScenario
            ? showOtp === true
              ? "OTP Verification"
              : "Login"
            : showOtp === true
            ? "OTP Verification"
            : "SignUp"}
        </p>
        <div className="background-box">
          <Container maxWidth={"xl"} className="box">
            <center>
              <OTPForm
                mobileOTPScenario={mobileOTPScenario}
                setMobileOTPScenario={setMobileOTPScenario}
                showOtp={showOtp}
                setShowOtp={setShowOtp}
                server={server}
              />
            </center>
          </Container>
        </div>
      </div>
      <div className="static-content">
        <div className="kapiva-app-detail">
          <div className="logo">
            <img
              src="https://store-5h8rqg02f8.mybigcommerce.com/content/otp-login/Images/Kapiva-logo.png"
              alt="logo"
            />
          </div>
          <div className="content">
            <p className="heading">
              Kapiva app is <span className="pink">LIVE!</span>
            </p>
            <p className="description">
              Download & Signup, to get <span className="bold">Rs. 200</span>{" "}
              instant cashback
            </p>
          </div>
          <div className="buttons">
            <a href="https://kapiva.app.link/2gIK0Lu1Lvb">
              <img
                src="https://store-5h8rqg02f8.mybigcommerce.com/content/otp-login/Images/Mobile-app-store-badge-ios.svg"
                alt="IOS"
              />
            </a>
            <a href="https://kapiva.app.link/2StSfOvfltb">
              <img
                src="https://store-5h8rqg02f8.mybigcommerce.com/content/otp-login/Images/Mobile-app-store-badge-android.svg"
                alt="Android"
              />
            </a>
          </div>
        </div>
        <hr />
        <div className="kapiva-app-offers">
          <div className="content">
            <p className="heading">What makes the Kapiva App special?</p>
            <p className="description">
              Download the app and avail exclusive offers curated for you.
            </p>
          </div>
          <div className="images">
            <div className="card">
              <img
                src="https://store-5h8rqg02f8.mybigcommerce.com/content/otp-login/Images/img-exclusive-rewards.png"
                alt="."
              />
              <p className="image-name">Exclusive Rewards</p>
            </div>
            <div className="card">
              <img
                src="https://store-5h8rqg02f8.mybigcommerce.com/content/otp-login/Images/img-faster-checkout.png"
                alt="."
              />
              <p className="image-name">Faster Checkout</p>
            </div>
            <div className="card">
              <img
                src="https://store-5h8rqg02f8.mybigcommerce.com/content/otp-login/Images/img-instant-tracking.png"
                alt="."
              />
              <p className="image-name">Instant Tracking</p>
            </div>
            <div className="card">
              <img
                src="https://store-5h8rqg02f8.mybigcommerce.com/content/otp-login/Images/img-easy-navigation.png"
                alt="."
              />
              <p className="image-name">Easy Navigation</p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Home;
