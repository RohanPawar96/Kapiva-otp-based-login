import React from "react";
import ReactFlagsSelect from "react-flags-select";
import { Button, Container, Fade, Grid, TextField } from "@mui/material";
import { LoadingButton } from "@mui/lab";

function Home() {
  const [country, setCountry] = React.useState("IN");

  return (
    <div className="main">
      <div className="background-box">
        <Container maxWidth={"xl"} className="box">
          <Grid width={"100%"} spacing={2}>
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
              loading={true}
              // disabled={mailOTP === "" && mailOTP.length <= 6 ? false : true}
              type="submit"
              // onClick={() => verifyEmailOtp()}
            >
              Submit OTP
            </LoadingButton>
          </div>
        </Container>
      </div>
    </div>
  );
}

export default Home;
