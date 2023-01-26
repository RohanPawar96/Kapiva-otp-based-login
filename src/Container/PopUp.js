import * as React from "react";
import Button from "@mui/material/Button";
import Modal from "@mui/material/Modal";
import { Fade } from "@mui/material";
import axios from "axios";

export default function PopUp({
  open,
  setOpen,
  message,
  values,
  number,
  setShowOtp,
  device_platform,
}) {
  const handleClose = () => setOpen(false);

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
        // const status = response.data.status;
        setOpen(false);
        setShowOtp(true);

        // if (status === 400) {
        //   alert(response.data.message);
        // } else {
        //   alert(response.data.message);
        // }
      });
  };

  return (
    <>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Fade in={open} exit={!open}>
          <div className="popup-box">
            <h2 className="popup-title">Verify your email</h2>
            <p className="popup-desc">{message}</p>

            <div style={{ display: "flex", justifyContent: "end" }}>
              <Button
                variant="text"
                style={{ fontSize: "14px", fontStyle: "unset" }}
                onClick={() => verifyEmail()}
              >
                Verify Email
              </Button>
              <Button
                variant="text"
                style={{ fontSize: "14px", fontStyle: "normal" }}
                onClick={handleClose}
              >
                Cancel
              </Button>
            </div>
          </div>
        </Fade>
      </Modal>
    </>
  );
}
