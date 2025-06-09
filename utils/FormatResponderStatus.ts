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
    default:
      return status.toUpperCase();
  }
};

export default formatResponderStatus;
