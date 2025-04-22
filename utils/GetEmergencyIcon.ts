const GetEmergencyIcon = (type: string) => {
  switch (type) {
    case "Medical":
      return require("@/assets/images/emergencyMedical.png");
    case "Police":
      return require("@/assets/images/emergencyPolice.png");
    case "Fire":
      return require("@/assets/images/emergencyFire.png");
    case "General":
      return require("@/assets/images/emergencyGeneral.png");
    default:
      return require("@/assets/images/emergencyGeneral.png");
  }
};

export default GetEmergencyIcon;
