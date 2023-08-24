import React from "react";
import "../styles/NotFound.css";
import Vault404 from "../images/Vault-404.gif";

function NotFound() {
  return (
    <section className="page_404">
      <div className="container">
        <div className="row">
          <div className="col-sm-12 ">
            <div className="col-sm-10 col-sm-offset-1  text-center">
              <div className="four_zero_four_bg"></div>
              <div>
                <img
                  src={Vault404}
                  alt="Vault- an app for budgeting that wont break the bank with a piggy bank cartoon"
                />
              </div>
              <p
                style={{
                  fontSize: "22px",
                  color: "#737373",
                  fontFamily: "times-new-roman",
                  fontWeight: "bold",
                  display: "flex",
                  justifyContent: "flex-start",
                  alignItems: "center",
                  paddingRight: "20px",
                  marginLeft: "20px",
                }}
              >
                The page you are looking for is not available!
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default NotFound;
