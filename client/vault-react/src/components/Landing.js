import vaultlanding from "../images/vault-landing-2.jpeg";

function Landing() {
  return (
    <div className="container-fluid">
      <h2 className="display-5"> </h2>
      <div className="my-4 text-center">
        <img
          className="background-image"
          src={vaultlanding}
          alt="Vault- an app for budgeting that wont break the bank with a piggy bank cartoon"
        />
      </div>
    </div>
  );
}

export default Landing;
