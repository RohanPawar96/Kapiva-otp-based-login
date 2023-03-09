import React from "react";
import ReactFlagsSelect from "react-flags-select";
// import { MuiOtpInput } from "mui-one-time-password-input";
// import OtpInput from "react-otp-input";
import OtpInput from "react18-input-otp";
import { Grid, TextField, Fade, InputAdornment } from "@mui/material";
import { LoadingButton } from "@mui/lab";
import { auth, firebase } from "../Assets/js/firebase";
// import iconRightArrow from "../Assets/Images/icon-right-arrow.png";
import axios from "axios";
import PopUp from "./PopUp";
// import AccountCircle from "@mui/icons-material/AccountCircle";

const OTPForm = ({
  mobileOTPScenario,
  setMobileOTPScenario,
  setShowOtp,
  showOtp,
  server,
  setLoadingScreen,
  prevPageURL,
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
  // eslint-disable-next-line
  const [showForm, setShowForm] = React.useState(false);
  const [open, setOpen] = React.useState(false);
  const [message, setMessage] = React.useState("");
  const [showResendOTP, setShowResendOTP] = React.useState(false);

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
          setError("Please enter valid number");
        }
      } else {
        setError("Please enter valid number");
      }
    } else if (e.length > 10) {
      setError("Please enter 10 digit mobile number");
    } else {
      setError(" ");
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
      setNameError("Please enter full Name.");
    } else if (patternName.test(e.target.value)) {
      console.log("Name", patternName.test(e.target.value));
      setValues({ ...values, [e.target.name]: e.target.value });

      setNameError("");
    } else {
      setNameError("Please enter your valid full name.");
    }
  };

  const submitOtp = (e) => {
    e.preventDefault();
    console.log("calling submitOTP");
    // showOtp(true);
    if (number.length === 0) {
      setError("Please Enter valid Number");
    } else {
      setLoading(true);
      let verify = new firebase.auth.RecaptchaVerifier("recaptcha-container", {
        size: "invisible",
        callback: (response) => {
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
          window.mobileOTPSent = true;
          if (e.target.outerText === "Resend OTP") {
            // console.log("resend");
            setShowResendOTP(true);
            window.resendMobileOTP = true;
          }
          // console.log("code sent");
        })
        .catch((err) => {
          alert(err);
          setError(err);
          window.mobileOTPSent = false;
          window.location.reload();
        });
    }
  };

  const verifyOtp = (e) => {
    e.preventDefault();
    setLoading(true);
    if (otp === "" || otpTrack === "") {
      setError("Please Enter OTP");
      setLoading(false);
    } else {
      // setError(false);
      otpTrack
        .confirm(otp)
        .then((result) => {
          // console.log("success", result);
          window.mobileOTPVerify = true;
          setLoading(false);
          setError("");
          setOtp("");
          setMobileOTPScenario(false);
          checkUser();
        })
        .catch((err) => {
          setOtp("");
          window.mobileOTPVerify = false;
          setError("Invalid OTP");
          setLoading(false);
        });
    }
  };

  const checkUser = () => {
    const data = `{
        "mobile": "${number}",
        "prevpage": "${prevPageURL}"
    }`;
    axios("https://kapiva.app/api/kapiva_otp_login.php", {
      // axios("http://localhost/test/kapiva_otp_login.php", {
      method: "POST",
      params: { serve: `${server}` },
      headers: {
        "Content-Type": "application/json",
        Cookie: "PHPSESSID=8vvm4tuven8d1i9cgv9a6v3rvu",
      },
      data: data,
    }).then((resp) => {
      if (resp.data.status === 200) {
        setLoadingScreen(true);
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
    event.preventDefault();
    if (values.fullName !== "" && values.email !== "") {
      setLoading(true);
      console.log(values);
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

      console.log(payload);
      axios("https://kapiva.app/api/user_autosignup.php", {
        method: "POST",
        params: { p: "create_user", serve: `${server}` },
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
    } else {
      if (values.fullName === "") {
        setNameError("Please enter valid fullname");
      }
      if (values.email === "") {
        setEmailError("Please enter valid email");
      }
    }
  };

  const verifyEmail = (e) => {
    axios
      .get(
        `https://kapiva.app/api/verify_email.php?device_platform=${device_platform}&email=${
          values.email
        }&mobile=${number}&user_name=${values.fullName.split(" ")[0]}`
      )
      // .get(
      //   `https://kapiva.app/api/verify_email.php?device_platform=${device_platform}&email=pawarrohan030@gmail.com&mobile=9845178656&user_name=Santosh`
      // )
      .then((response) => {
        console.log(response);
        // const status = response.data.status;
        setOpen(false);
        setShowOtp(true);
        window.emailOTPSent = true;
        if (e.target.outerText === "Resend OTP") {
          console.log("resend");
          setShowResendOTP(true);
          window.emailOTPResend = true;
        }

        // if (status === 400) {
        //   alert(response.data.message);
        // } else {
        //   alert(response.data.message);
        // }
      });
  };

  const verifyEmailOtp = (e) => {
    e.preventDefault();
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
      console.log(response.data.status);
      if (response.data.status === 400) {
        window.emailOTPVerify = false;
        setEmailOTPError(response.data.message);
      } else if (response.data.status === 200) {
        window.emailOTPVerify = true;
        updateUser();
      }
    });
  };

  // console.log(mailOTPError);

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
      params: { p: "update_user", serve: `${server}` },
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

  const handleOTPChange = (e) => {
    setOtp(e);
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
        setShowResendOTP={setShowResendOTP}
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
      <form
        onSubmit={(e) => {
          if (mobileOTPScenario === false) {
            if (otpTrack !== "") {
              verifyOtp(e);
            } else {
              submitOtp(e);
            }
          } else {
            if (otp === "") {
              resgisterUser(e);
            } else {
              verifyEmailOtp(e);
            }
          }
        }}
      >
        <Grid width={"100%"} spacing={2} className="formHeight">
          {mobileOTPScenario === false ? (
            <>
              {showOtp === false ? (
                <>
                  <Grid xs={12} mt={2}>
                    <ReactFlagsSelect
                      selected={country}
                      disabled
                      onSelect={(e) => setCountry(e)}
                      style={{ padding: "0px 10px" }}
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
                      autoFocus
                      style={{
                        width: "90%",
                        margin: "0 5%",
                        padding: "0",
                        fontFamily: "FontAwesome",
                        height: "62px",
                        // border: "1.5px solid rgba(128, 160, 60, 1)",
                        borderRadius: "5px",
                      }}
                      type="number"
                      onChange={(e) => checkInput(e.target.value)}
                      error={error}
                      maxLength={10}
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
                        inputProps: {},
                        style: { fontFamily: "Jost" },
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
                  <Grid xs={12}>
                    <OtpInput
                      value={otp}
                      onChange={(e) => {
                        handleOTPChange(e);
                        setError("");
                        setLoading(false);
                        setShowResendOTP(false);
                      }}
                      numInputs={6}
                      shouldAutoFocus={true}
                      containerStyle={"otp-box"}
                      // separator={<span> </span>}
                      isInputNum={true}
                      inputStyle={"otp-field"}
                      errorStyle={"otp-error"}
                      hasErrored={error}
                      autoComplete={true}
                    />
                    {/* <OtpInput
                      width={"100%"}
                      value={otp}
                      onChange={(e) => {
                        handleOTPChange(e);
                        setError("");
                        setLoading(false);
                        setShowResendOTP(false);
                      }}
                      autoComplete="one-time-code"
                      // TextFieldsProps={{
                      //   placeholder: "-",
                      //   type: "number",
                      //   InputProps: {
                      //     inputProps: { style: { fontFamily: "Jost" } },
                      //   },
                      // }}
                      length={6}
                      mt={"30px"}
                      mb={"10px"}
                      // error={true}
                      error={error === "" ? true : false}
                    /> */}
                    {error !== "" && !showResendOTP ? (
                      <Fade in={error}>
                        <p
                          className="error"
                          style={{ position: "relative", textAlign: "center" }}
                        >
                          {error}
                        </p>
                      </Fade>
                    ) : (
                      ""
                    )}
                    {showResendOTP ? (
                      <Fade in={showResendOTP}>
                        <p
                          className="error"
                          style={{
                            position: "relative",
                            textAlign: "Center",
                            color: "black",
                          }}
                        >
                          OTP resent successfully
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
                      onClick={(e) => submitOtp(e)}
                    >
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
                  <Grid xs={12}>
                    <TextField
                      id="outlined-basic"
                      //   label="Outlined"
                      placeholder="Enter Full Name"
                      name="fullName"
                      variant="outlined"
                      autoFocus
                      type={"text"}
                      // fullWidth={true}
                      style={{
                        width: "90%",
                        margin: "0 5%",
                        padding: "0",
                        fontFamily: "FontAwesome",
                        borderRadius: "5px",
                        height: "62px",
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
                        inputProps: { style: { fontFamily: "Jost" } },
                      }}
                    />
                    {nameError !== "" ? (
                      <Fade in={nameError !== ""}>
                        <p className="error" style={{ position: "relative" }}>
                          {nameError}
                        </p>
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
                        inputProps: { style: { fontFamily: "Jost" } },
                      }}
                    />
                    {emailError !== "" ? (
                      <Fade
                        in={emailError !== ""}
                        style={{ position: "relative" }}
                      >
                        <p className="error">{emailError}</p>
                      </Fade>
                    ) : (
                      ""
                    )}
                  </Grid>
                </>
              ) : (
                <>
                  <Grid xs={12}>
                    <OtpInput
                      value={otp}
                      onChange={(e) => {
                        handleOTPChange(e);
                        setError("");
                        setEmailError("");
                        setLoading(false);
                        setShowResendOTP(false);
                      }}
                      numInputs={6}
                      shouldAutoFocus={true}
                      containerStyle={"otp-box"}
                      // separator={<span> </span>}
                      isInputNum={true}
                      inputStyle={"otp-field"}
                      errorStyle={"otp-error"}
                      hasErrored={mailOTPError !== ""}
                      autoComplete={true}
                    />
                    {/* <MuiOtpInput
                      width={"100%"}
                      value={otp}
                      onChange={(e) => {
                        setOtp(e);
                        setError("");
                        setEmailError("");
                        setLoading(false);
                        setShowResendOTP(false);
                      }}
                      TextFieldsProps={{
                        placeholder: "-",
                        InputProps: {
                          inputProps: { style: { fontFamily: "Jost" } },
                        },
                      }}
                      length={6}
                      mt={"30px"}
                      mb={"10px"}
                      // error={true}
                      error={error === "" ? true : false}
                    /> */}
                    {mailOTPError !== "" && !showResendOTP ? (
                      <Fade in={mailOTPError !== ""}>
                        <p className="error" style={{ position: "relative" }}>
                          {mailOTPError}
                        </p>
                      </Fade>
                    ) : (
                      ""
                    )}
                    {showResendOTP ? (
                      <Fade in={showResendOTP}>
                        <p
                          className="error"
                          style={{
                            position: "relative",
                            color: "black",
                            textAlign: "Center",
                          }}
                        >
                          OTP resend successfully
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
                      onClick={(e) =>
                        mobileOTPScenario === false
                          ? submitOtp(e)
                          : verifyEmail(e)
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
            disabled={error !== "" || mailOTPError !== "" ? true : false}
            type="submit"
            onClick={() => {
              // eslint-disable-next-line no-lone-blocks
              {
                // eslint-disable-next-line no-unused-expressions
                // if (mobileOTPScenario === false) {
                //   if (otpTrack !== "") {
                //     verifyOtp();
                //   } else {
                //     submitOtp();
                //   }
                // } else {
                //   if (otp === "") {
                //     resgisterUser();
                //   } else {
                //     verifyEmailOtp();
                //   }
                // }
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
      </form>
    </>
  );
};

export default OTPForm;
