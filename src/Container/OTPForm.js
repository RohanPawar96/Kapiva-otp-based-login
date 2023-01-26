import React from "react";
import ReactFlagsSelect from "react-flags-select";
import { MuiOtpInput } from "mui-one-time-password-input";
import {
  Grid,
  TextField,
  Fade,
  Button,
  InputAdornment,
  rgbToHex,
} from "@mui/material";
import { LoadingButton } from "@mui/lab";
import { auth, firebase } from "../Assets/js/firebase";
import iconRightArrow from "../Assets/Images/icon-right-arrow.png";
import axios from "axios";
import PopUp from "./PopUp";
import AccountCircle from "@mui/icons-material/AccountCircle";

const OTPForm = ({
  mobileOTPScenario,
  setMobileOTPScenario,
  setShowOtp,
  showOtp,
}) => {
  const [country, setCountry] = React.useState("IN");
  const [number, setNumber] = React.useState("");
  const [otp, setOtp] = React.useState("");
  const [error, setError] = React.useState("");
  const [nameError, setNameError] = React.useState("");
  const [emailError, setEmailError] = React.useState("");
  const [mailOTPError, setEmailOTPError] = React.useState("");
  const [loading, setLoading] = React.useState(false);
  const [otpTrack, setOtptrack] = React.useState("");
  const [showForm, setShowForm] = React.useState(false);
  const [open, setOpen] = React.useState(false);
  const [message, setMessage] = React.useState("");

  const device_platform = "web";
  const [values, setValues] = React.useState({
    fullName: "",
    email: "",
  });
  const patternNumber = new RegExp("^[5-9][0-9]{9}$");
  const patternName = new RegExp(
    "(^[A-Za-z]{1,16})([ ]{0,1})([A-Za-z]{1,16})?([ ]{0,1})?([A-Za-z]{1,16})?([ ]{0,1})?([A-Za-z]{1,16})"
  );
  const patternEmail = new RegExp(
    "^(?=.{1,64}@)[A-Za-z0-9_+-]+(\\.[A-Za-z0-9_+-]+)*@[^-][A-Za-z0-9-]+(\\.[A-Za-z0-9-]+)*(\\.[A-Za-z]{2,})$"
  );

  const checkInput = (e) => {
    setNumber(e);
    if (e === "") {
      setError("Please enter your number");
    } else if (e.length === 10) {
      if (isFinite(e)) {
        console.log(patternNumber.test(e));
        if (patternNumber.test(e)) {
          setError("");
        } else {
          setError("Please Enter valid Number");
        }
      } else {
        setError("Please Enter valid Number");
      }
    } else {
      setError("Please enter valid number");
    }
  };

  const checkEmail = (e) => {
    if (e.target.value === "") {
      setEmailError("Please enter your email");
    } else {
      if (patternEmail.test(e.target.value)) {
        console.log(patternEmail.test(e.target.value));
        setEmailError("");
        setValues({ ...values, [e.target.name]: e.target.value });
      } else {
        setEmailError("Please enter your valid email");
      }
    }
  };

  const checkName = (e) => {
    console.log(otp);
    // setOtp("");
    if (e.target.value === "") {
      setNameError("Please Enter Full Name.");
    } else if (patternName.test(e.target.value)) {
      console.log("Name", patternName.test(e.target.value));
      setValues({ ...values, [e.target.name]: e.target.value });

      setNameError("");
    } else {
      setNameError("Please enter your valid full name.");
    }
  };

  const submitOtp = () => {
    console.log("calling submitOTP");
    // showOtp(true);
    if (number.length === 0) {
      setError("Please Enter valid Number");
    } else {
      setLoading(true);
      let verify = new firebase.auth.RecaptchaVerifier("recaptcha-container", {
        size: "invisible",
        callback: (response) => {
          console.log(response);
          // reCAPTCHA solved, allow signInWithPhoneNumber.
          // ...
        },
      });
      const OtpNumber = "+91" + number;
      //   console.log("Verification", verify);
      auth
        .signInWithPhoneNumber(OtpNumber, verify)
        .then((result) => {
          // console.log(result);
          setLoading(false);
          setShowOtp(true);
          setOtptrack(result);
          // console.log("code sent");
        })
        .catch((err) => {
          alert(err);
          setError(err);
          window.location.reload();
        });
    }
  };

  const verifyOtp = () => {
    setLoading(true);
    if (otp === "" || otpTrack === "") {
      setError("Please Enter OTP");
      setLoading(false);
    } else {
      // setError(false);
      otpTrack
        .confirm(otp)
        .then((result) => {
          console.log("success", result);
          setLoading(false);
          setError("");
          setOtp("");
          setMobileOTPScenario(false);
          checkUser();
        })
        .catch((err) => {
          setOtp("");
          setError("Invalid OTP");
          setLoading(false);
        });
    }
  };

  const checkUser = () => {
    const data = `{
        "mobile": "${number}"
    }`;
    axios("https://kapiva.app/api/kapiva_otp_login.php", {
      // axios("http://localhost/test/kapiva_otp_login.php", {
      method: "POST",
      params: { serve: "st" },
      headers: {
        "Content-Type": "application/json",
        Cookie: "PHPSESSID=8vvm4tuven8d1i9cgv9a6v3rvu",
      },
      data: data,
    }).then((resp) => {
      // console.log("Response", resp);
      // const status = resp.data;
      console.log(resp.data);
      if (resp.data.status === 200) {
        console.log(resp.data.data);
        window.location.href = resp.data.data;
      } else if (resp.data.status === 400) {
        setMobileOTPScenario(true);
        setShowForm(true);
        setShowOtp(false);
      }
      // console.log(JSON.stringify(resp));
    });
  };

  const resgisterUser = (event) => {
    setLoading(true);
    console.log(values);
    var payload = `{
      "first_name": "${values.fullName.split(" ")[0]}",
      "last_name": "${values.fullName.split(" ")[1]}",
      "email": "${values.email}",
      "mobile": "${number}",
      "device_platform": "${device_platform}"
    }`;

    console.log(payload);
    axios("https://kapiva.app/api/user_autosignup.php", {
      method: "POST",
      params: { p: "create_user", serve: "st" },
      headers: {
        "Content-Type": "application/json",
        Cookie: "PHPSESSID=8vvm4tuven8d1i9cgv9a6v3rvu",
      },
      data: payload,
    })
      .then((response) => {
        console.log(response.data);
        const status = response.data.status;
        if (status === 200) {
          checkUser();
          setLoading(false);
        } else if (status === 201) {
          // alert(response.data.message);
          setMessage(response.data.message);
          setOpen(true);
          setLoading(false);
        }
      })
      .catch((err) => {
        console.log(err);
        setLoading(false);
      });
    event.preventDefault();
  };

  const verifyEmailOtp = () => {
    const payload = {
      user_name: values.fullName.split(" ")[0],
      email: values.email,
      mobile: number,
      email_otp: otp,
    };
    console.log(typeof payload);
    axios("https://kapiva.app/api/verify_email_otp.php", {
      method: "POST",
      params: { p: "verify_email_otp" },
      data: payload,
    }).then((response) => {
      console.log(response.data);
      const status = response.data.status;
      if (status === 400) {
        setEmailOTPError(response.data.message);
      } else if (status === 200) {
        updateUser();
      }
    });
  };

  const updateUser = () => {
    var payload = `{
      "first_name": "${values.fullName.split(" ")[0]}",
      "last_name": "${
        values.fullName.split(" ")[1] === ""
          ? " "
          : values.fullName.split(" ")[1]
      }",
      "email": "${values.email}",
      "mobile": "${number}",
      "device_platform": "${device_platform}"
    }`;

    console.log(typeof payload);
    axios("https://kapiva.app/api/user_autosignup.php", {
      method: "POST",
      params: { p: "update_user", serve: "st" },
      headers: {
        "Content-Type": "application/json",
        Cookie: "PHPSESSID=8vvm4tuven8d1i9cgv9a6v3rvu",
      },
      data: payload,
    }).then((response) => {
      console.log(response);
      if (response.data.status === 200) {
        checkUser();
      } else alert(response.data.message);
    });
  };
  return (
    <>
      <PopUp
        open={open}
        setOpen={setOpen}
        message={message}
        values={values}
        number={number}
        setShowOtp={setShowOtp}
        device_platform={device_platform}
      />
      <p className="heading-page">
        {mobileOTPScenario === false ? (
          <>
            {showOtp === false ? (
              <>
                <span className="pink">Welcome to Kapiva!</span>
                <br /> Enter your mobile number and we will send you an OTP for
                verification.
              </>
            ) : (
              <>
                Verify your phone number using the OTP sent to the number{" "}
                <span className="pink" style={{ fontSize: "20px" }}>
                  +91-{number}
                </span>
              </>
            )}
          </>
        ) : (
          <>
            {showOtp === false ? (
              <>
                <span className="pink">Welcome!</span>
                <br />
                Create your account for a seamless experience
              </>
            ) : (
              <>
                Verify your email using the OTP sent to the email{" "}
                <span className="pink" style={{ fontSize: "20px" }}>
                  {values.email}
                </span>
              </>
            )}
          </>
        )}
      </p>
      <Grid width={"100%"} spacing={2} mb={"80px"}>
        {mobileOTPScenario === false ? (
          <>
            {showOtp === false ? (
              <>
                <Grid xs={12} mt={2}>
                  <ReactFlagsSelect
                    selected={country}
                    disabled
                    onSelect={(e) => setCountry(e)}
                    // components={{
                    //   DropdownIndicator: () => null,
                    //   IndicatorSeparator: () => null,
                    // }}
                  />
                </Grid>

                <Grid xs={12} mt={2}>
                  <TextField
                    id="outlined-basic"
                    //   label="Outlined"
                    placeholder="Mobile Number"
                    name="number"
                    variant="outlined"
                    style={{
                      width: "90%",
                      margin: "0 5%",
                      padding: "0",
                      fontFamily: "FontAwesome",
                      // border: "1.5px solid rgba(128, 160, 60, 1)",
                      borderRadius: "5px",
                    }}
                    type={"number"}
                    onChange={(e) => checkInput(e.target.value)}
                    error={error}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <img
                            src="https://store-5h8rqg02f8.mybigcommerce.com/content/otp-login/Images/icon-phone.png"
                            alt=""
                            width={"30px"}
                            height={"30px"}
                          />
                        </InputAdornment>
                      ),
                    }}
                    inputProps={{
                      maxLength: 10,
                    }}
                  />
                  <div id="recaptcha-container"></div>

                  {error !== "" ? (
                    <Fade in={error}>
                      <p className="error">{error}</p>
                    </Fade>
                  ) : (
                    ""
                  )}
                </Grid>
              </>
            ) : (
              <>
                <Grid xs={12} mb={"20px"}>
                  <MuiOtpInput
                    width={"100%"}
                    value={otp}
                    onChange={(e) => {
                      setOtp(e);
                      setError("");
                      setLoading(false);
                    }}
                    length={6}
                    mt={"30px"}
                    mb={"10px"}
                    // error={true}
                    error={error === "" ? true : false}
                  />
                  {error !== "" ? (
                    <Fade in={error}>
                      <p className="error">{error}</p>
                    </Fade>
                  ) : (
                    ""
                  )}
                  <div id="recaptcha-container"></div>
                </Grid>
                <Grid
                  xs={12}
                  display={"flex"}
                  justifyContent={"center"}
                  gap={"2%"}
                  alignItems={"baseline"}
                >
                  <p className="resend-otp-content">Didn’t receive an OTP?</p>
                  <p className="resend-otp pink" onClick={() => submitOtp()}>
                    Resend OTP
                  </p>
                </Grid>
              </>
            )}
          </>
        ) : (
          <>
            {showOtp === false ? (
              <>
                <Grid xs={12} mt={2}>
                  <TextField
                    id="outlined-basic"
                    //   label="Outlined"
                    placeholder="Enter Full Name"
                    name="fullName"
                    variant="outlined"
                    type={"text"}
                    // fullWidth={true}
                    style={{
                      width: "90%",
                      margin: "0 5%",
                      padding: "0",
                      fontFamily: "FontAwesome",
                      borderRadius: "5px",
                    }}
                    onChange={(e) => checkName(e)}
                    error={nameError !== ""}
                    inputProps={{ typeof: "text" }}
                    required
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <img
                            src="https://store-5h8rqg02f8.mybigcommerce.com/content/otp-login/Images/icon-user.png"
                            alt=""
                            width={"30px"}
                            height={"30px"}
                          />
                        </InputAdornment>
                      ),
                    }}
                  />
                  {nameError !== "" ? (
                    <Fade in={nameError !== ""}>
                      <p className="error">{nameError}</p>
                    </Fade>
                  ) : (
                    ""
                  )}
                </Grid>

                <Grid xs={12} mt={2}>
                  <TextField
                    id="outlined-basic"
                    //   label="Outlined"
                    placeholder="Enter Email"
                    name="email"
                    variant="outlined"
                    type={"email"}
                    // fullWidth={true}
                    style={{
                      width: "90%",
                      margin: "0 5%",
                      padding: "0",
                      fontFamily: "FontAwesome",
                      borderRadius: "5px",
                    }}
                    onChange={(e) => checkEmail(e)}
                    error={emailError !== ""}
                    // inputProps={{ maxLength: 10, typeof: "text" }}
                    required
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <img
                            src="https://store-5h8rqg02f8.mybigcommerce.com/content/otp-login/Images/icon-mail.png"
                            width={"30px"}
                            height={"24px"}
                            alt=""
                          />
                        </InputAdornment>
                      ),
                    }}
                  />
                  {emailError !== "" ? (
                    <Fade in={emailError !== ""}>
                      <p className="error">{emailError}</p>
                    </Fade>
                  ) : (
                    ""
                  )}
                </Grid>
              </>
            ) : (
              <>
                <Grid xs={12} mb={"20px"}>
                  <MuiOtpInput
                    width={"100%"}
                    value={otp}
                    onChange={(e) => {
                      setOtp(e);
                      setError("");
                      setLoading(false);
                    }}
                    length={6}
                    mt={"30px"}
                    mb={"10px"}
                    // error={true}
                    error={error === "" ? true : false}
                  />
                  {error !== "" ? (
                    <Fade in={error}>
                      <p
                        style={{
                          margin: "1% 0 1% 0",
                          color: "red",
                          width: "100%",
                          textAlign: "center",
                        }}
                      >
                        {error}
                      </p>
                    </Fade>
                  ) : (
                    ""
                  )}
                  <div id="recaptcha-container"></div>
                </Grid>
                <Grid
                  xs={12}
                  display={"flex"}
                  justifyContent={"center"}
                  gap={"2%"}
                  alignItems={"baseline"}
                >
                  <p className="resend-otp-content">Didn’t receive an OTP?</p>
                  <p
                    className="resend-otp pink"
                    onClick={() =>
                      mobileOTPScenario === false
                        ? submitOtp()
                        : resgisterUser()
                    }
                  >
                    Resend OTP
                  </p>
                </Grid>
              </>
            )}
          </>
        )}
      </Grid>
      <div className="circle">
        <LoadingButton
          variant="contained"
          loading={loading}
          style={{
            bottom: "-8%",
            backgroundColor: `${
              error !== "" ? "rgb(0,0,0,0.3)" : "rgba(128, 160, 60, 1)"
            }`,
          }}
          disabled={error !== "" ? true : false}
          type="submit"
          onClick={() => {
            // eslint-disable-next-line no-lone-blocks
            {
              // eslint-disable-next-line no-unused-expressions

              if (mobileOTPScenario === false) {
                if (otpTrack !== "") {
                  verifyOtp();
                } else {
                  submitOtp();
                }
              } else {
                if (otp === "") {
                  resgisterUser();
                } else {
                  verifyEmailOtp();
                }
              }
            }
          }}
        >
          {loading === false ? (
            <img
              style={{ zIndex: "99999" }}
              src="https://store-5h8rqg02f8.mybigcommerce.com/content/otp-login/Images/icon-right-arrow.png"
              alt="Sumbit"
            />
          ) : (
            ""
          )}
        </LoadingButton>
      </div>
    </>
  );
};

export default OTPForm;
