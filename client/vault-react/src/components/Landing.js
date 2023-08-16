import vaultlanding from "../images/vault-landing-1.png";

function Landing() {
  return (
    <div className="container-fluid">
      <h2 className="display-5"> </h2>
      <div className="my-4 text-center">
        <img
          src={vaultlanding}
          className="background-image"
          alt="Vault- an app for budgeting that wont break the bank with a piggy bank cartoon"
        />
      </div>
    </div>
  );
}

export default Landing;