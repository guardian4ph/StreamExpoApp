const formatResponderStatus = (status: string): string => {
  switch (status) {
    case "enroute":
      return "ENROUTE";
    case "medicalFacility":
      return "MEDICAL FACILITY";
    case "onscene":
      return "ARRIVED";
    case "rtb":
      return "RETURN TO BASE";
    case "close":
      return "RESOLVED";
    default:
      return status.toUpperCase();
  }
};

export default formatResponderStatus;
