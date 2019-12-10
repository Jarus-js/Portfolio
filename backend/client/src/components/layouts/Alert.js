import React from "react";
import { connect } from "react-redux";

const Alert = ({ alerts }) => {
  //props bata tala mapState bata pass vako props destructure gareko
  return (
    <>
      {alerts !== null &&
        alerts.length > 0 &&
        alerts.map(alert => {
          return (
            <div key={alert.id} className={`alert alert-${alert.alertType}`}>
              {alert.msg}
            </div>
          );
        })}
    </>
  );
};

const mapStateToProps = state => {
  return {
    alerts: state.alert //array
  };
};

export default connect(mapStateToProps)(Alert);


