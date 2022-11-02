import { connect } from "react-redux";
import withAuthProvider from "../../providers/withAuthProvider";

import History from "./History";

const mapStateToProps = (state) => {
  // const currentAddress = state?.main?.currentAddress;
  const currentProvider = state?.main?.currentProvider;
  return { currentProvider };
};

const mapDispatchToProps = () => ({});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withAuthProvider(History));
