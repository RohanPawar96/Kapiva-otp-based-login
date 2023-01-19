import React, { useState } from "react";
import ReactFlagsSelect from "react-flags-select";
import {
  Button,
  Container,
  Fade,
  Grid,
  TextField,
  Typography,
} from "@mui/material";
import { LoadingButton } from "@mui/lab";
import iconRightArrow from "./Assets/Images/icon-right-arrow.png";

function Home() {
  const [country, setCountry] = useState("IN");
  const [loading, setLoading] = useState(false);

  return (
    <div className="main">
      <p className="page-heading-otp">LOGIN</p>
      <div className="background-box">
        <Container maxWidth={"xl"} className="box">
          <Typography
            className="heading-page"
            style={{
              fontStyle: "normal",
              fontWeight: "600",
              fontSize: "24px",
              lineHeight: "120%",
              textAlign: "center",
            }}
          >
            <>Welcome to Kapiva!</>
            <br /> Enter your mobile number and we will send you an OTP for
            verification.
          </Typography>
          <Grid width={"100%"} spacing={2} mb={"104px"}>
            <Grid xs={12} mt={2}></Grid>
            <Grid xs={12} mt={2}>
              <ReactFlagsSelect
                selected={country}
                disabled
                onSelect={(e) => setCountry(e)}
                style={{
                  border: "1px solid rgba(128, 160, 60, 1)",
                  backgound: "rgba(255,255,255,0)",
                  height: "62px !important",
                }}
              />
            </Grid>
            <Grid xs={12} mt={2}>
              <TextField
                id="outlined-basic"
                //   label="Outlined"
                placeholder="Enter Number"
                variant="outlined"
                fullWidth={true}
                // style={{ border: "1px solid rgba(128, 160, 60, 1)" }}
                type={"number"}
                //   onChange={(e) => checkInput(e.target.value)}
                //   error={error}
                inputProps={{ maxLength: 10, typeof: "number" }}
              />
            </Grid>
          </Grid>
          <div className="circle">
            <LoadingButton
              variant="contained"
              loading={loading}
              style={{
                height: "80px",
                width: "80px",
                borderRadius: "50% 50% 50% 50%",
                bottom: "-8%",
                backgroundColor: "rgba(128, 160, 60, 1)",
              }}
              // disabled={mailOTP === "" && mailOTP.length <= 6 ? false : true}
              type="submit"
              // onClick={() => verifyEmailOtp()}
            >
              {loading === false ? (
                <img
                  style={{ zIndex: "99999" }}
                  src={iconRightArrow}
                  alt="Sumbit"
                />
              ) : (
                ""
              )}
            </LoadingButton>
          </div>
        </Container>
      </div>
    </div>
  );
}

export default Home;
