import { Button, Container, Fade, Grid, TextField } from "@mui/material";
import ReactFlagsSelect from "react-flags-select";
import { MuiOtpInput } from "mui-one-time-password-input";
import React from "react";
import { LoadingButton } from "@mui/lab";
import { auth, firebase } from "../Assets/js/firebase";
import axios from "axios";

export default function Home() {
  const [country, setCountry] = React.useState("IN");
  const [number, setNumber] = React.useState("");
  const [otp, setOtp] = React.useState("");
  const [error, setError] = React.useState("");
  const [nameError, setNameError] = React.useState("");
  const [emailError, setEmailError] = React.useState("");
  const [mailOTP, setMailOTP] = React.useState("");
  const [mailOTPError, setEmailOTPError] = React.useState("");
  const patternNumber = new RegExp("^[5-9][0-9]{9}$");
  const patternName = new RegExp(
    "(^[A-Za-z]{1,16})([ ]{0,1})([A-Za-z]{1,16})?([ ]{0,1})?([A-Za-z]{1,16})?([ ]{0,1})?([A-Za-z]{1,16})a"
  );
  const patternEmail = new RegExp(
    "^(?=.{1,64}@)[A-Za-z0-9_+-]+(\\.[A-Za-z0-9_+-]+)*@[^-][A-Za-z0-9-]+(\\.[A-Za-z0-9-]+)*(\\.[A-Za-z]{2,})$"
  );
  const [loading, setLoading] = React.useState(false);
  const [showOtp, setShowOtp] = React.useState(false);
  const [otpTrack, setOtptrack] = React.useState("");
  const [showForm, setShowForm] = React.useState(false);
  const device_platform = "web";

  const [values, setValues] = React.useState({
    fullName: "",
    email: "",
  });

  const checkInput = (e) => {
    setNumber(e);
    if (e === "") {
      setError("Fullname field required");
    } else {
      if (isFinite(e)) {
        if (patternNumber.test(e)) {
          console.log(patternNumber.test(e));
          setError("");
        } else {
          setError("Please Enter valid Number");
        }
      } else {
        setError("Please Enter valid Number");
      }
    }
  };

  const checkEmail = (e) => {
    if (e.target.value === "") {
      setEmailError("Email field required");
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
    if (otp === null || otpTrack === null) {
      setError("Please Enter OTP");
    } else {
      // setError(false);
      otpTrack
        .confirm(otp)
        .then((result) => {
          console.log("success", result);
          setLoading(false);
          setError("");
          // setOtptrack(result);
          checkUser();
        })
        .catch((err) => {
          setError(err);
          setLoading(false);
        });
    }
  };

  const checkUser = () => {
    const data = `{
        "mobile": "${number}"
    }`;
    // axios("https://kapiva.app/api/kapiva_otp_login.php", {
    axios("http://localhost/test/kapiva_otp_login.php", {
      method: "POST",
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
        setValues({ fullName: "", email: "" });
        setNumber("");
        setOtp("");
        setOtptrack("");
        setMailOTP("");
      } else if (resp.data.status === 400) {
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
      params: { p: "create_user", serve: "pr" },
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
          alert(response.data.message);
          verifyEmail();
          setLoading(false);
        }
      })
      .catch((err) => {
        console.log(err);
        setLoading(false);
      });
    event.preventDefault();
  };

  const verifyEmail = () => {
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
        const status = response.data.status;
        setShowOtp(true);

        if (status === 400) {
          alert(response.data.message);
        } else {
          alert(response.data.message);
        }
      });
  };

  const verifyEmailOtp = () => {
    console.log(mailOTP);
    const payload = {
      user_name: values.fullName.split(" ")[0],
      email: values.email,
      mobile: number,
      email_otp: mailOTP,
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
      "last_name": "${values.fullName.split(" ")[1]}",
      "email": "${values.email}",
      "mobile": "${number}",
      "device_platform": "${device_platform}"
    }`;

    console.log(typeof payload);
    axios("https://kapiva.app/api/user_autosignup.php", {
      method: "POST",
      params: { p: "update_user", serve: "pr" },
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
    <div
      className="main"
      style={{
        width: "80%",
        margin: "0 10%",
      }}
    >
      <Container
        maxWidth="xl"
        sx={{
          border: "1px solid black",
          // height: "400px",
        }}
      >
        <h1>Otp LOGIN</h1>
        <Grid container spacing={2}>
          {showForm === false ? (
            <>
              <Grid xs={12}>
                <ReactFlagsSelect
                  selected={country}
                  disabled
                  onSelect={(e) => setCountry(e)}
                />
              </Grid>
              <Grid xs={12} mt={2}>
                <TextField
                  id="outlined-basic"
                  //   label="Outlined"
                  placeholder="Enter Number"
                  variant="outlined"
                  type={number}
                  fullWidth={true}
                  onChange={(e) => checkInput(e.target.value)}
                  error={error}
                  inputProps={{ maxLength: 10, typeof: "number" }}
                />
                {/* {error} */}
                {error !== ""
                  ? (console.log(error),
                    (
                      <Fade in={error}>
                        <p style={{ margin: "1% 0", color: "red" }}>{error}</p>
                      </Fade>
                    ))
                  : ""}
              </Grid>
              {showOtp === true && showForm === false ? (
                // <Fade in={showOtp}>
                <>
                  <Grid xs={12} paddingLeft={"20%"} paddingRight={"20%"} mt={6}>
                    <MuiOtpInput
                      width={"100%"}
                      value={otp}
                      onChange={(e) => setOtp(e)}
                      length={6}
                    />
                    <Button variant="outlined"></Button>
                  </Grid>
                  <Grid xs={12}>
                    <Button variant="text">Resend OTP</Button>
                  </Grid>
                </>
              ) : (
                // </Fade>
                ""
              )}
              <div id="recaptcha-container"></div>

              <Grid xs={12} mt={2} mb={5}>
                <LoadingButton
                  variant="contained"
                  loading={loading}
                  disabled={error !== "" ? true : false}
                  onClick={() =>
                    showOtp === false ? submitOtp() : verifyOtp()
                  }
                >
                  Submit
                </LoadingButton>
              </Grid>
            </>
          ) : (
            <form style={{ width: "100%" }} onSubmit={resgisterUser}>
              <Grid xs={12} mt={4}>
                <TextField
                  id="outlined-basic"
                  //   label="Outlined"
                  placeholder="Enter Full Name"
                  name="fullName"
                  variant="outlined"
                  type={"text"}
                  fullWidth={true}
                  onChange={(e) => checkName(e)}
                  error={nameError !== ""}
                  required
                  inputProps={{ typeof: "text" }}
                />
                {nameError !== "" ? (
                  <Fade in={nameError !== ""}>
                    <p style={{ margin: "1% 0", color: "red" }}>{nameError}</p>
                  </Fade>
                ) : (
                  ""
                )}
              </Grid>
              <Grid xs={12} mt={4}>
                <TextField
                  id="outlined-basic"
                  //   label="Outlined"
                  placeholder="Enter Email"
                  name="email"
                  variant="outlined"
                  type={"email"}
                  fullWidth={true}
                  onChange={(e) => checkEmail(e)}
                  error={emailError !== ""}
                  // inputProps={{ maxLength: 10, typeof: "text" }}
                  required
                />
                {emailError !== "" ? (
                  <Fade in={emailError !== ""}>
                    <p style={{ margin: "1% 0", color: "red" }}>{emailError}</p>
                  </Fade>
                ) : (
                  ""
                )}
              </Grid>
              <Grid xs={12} mt={2} mb={5}>
                <LoadingButton
                  variant="contained"
                  loading={loading}
                  disabled={
                    nameError !== "" && emailError !== "" ? true : false
                  }
                  type="submit"
                  // onClick={() =>
                  //   showOtp === false ? submitOtp() : verifyOtp()
                  // }
                >
                  Submit
                </LoadingButton>
              </Grid>
            </form>
          )}
          {showOtp === true && showForm === true ? (
            // <Fade in={showOtp}>
            <>
              <Grid xs={12} paddingLeft={"20%"} paddingRight={"20%"} mt={6}>
                <MuiOtpInput
                  width={"100%"}
                  value={mailOTP}
                  onChange={(e) => {
                    setMailOTP(e);
                    setEmailOTPError("");
                  }}
                  length={6}
                />
              </Grid>
              <Grid xs={12} mt={2} mb={5}>
                {mailOTPError !== "" ? (
                  <Fade in={mailOTPError !== ""}>
                    <p style={{ margin: "1% 0", color: "red" }}>
                      {mailOTPError}
                    </p>
                  </Fade>
                ) : (
                  ""
                )}
              </Grid>
              <Grid xs={12} mt={2} mb={5}>
                <LoadingButton
                  variant="contained"
                  loading={loading}
                  disabled={
                    mailOTP !== "" && mailOTPError === "" ? false : true
                  }
                  type="submit"
                  onClick={() => verifyEmailOtp()}
                >
                  Submit OTP
                </LoadingButton>
              </Grid>
            </>
          ) : (
            ""
          )}
        </Grid>
      </Container>
    </div>
  );
}
