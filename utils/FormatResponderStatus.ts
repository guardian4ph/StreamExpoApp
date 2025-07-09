const formatResponderStatus = (status: string | null | undefined): string => {
  if (!status) {
    return "UNKNOWN";
  }

  switch (status.toLowerCase()) {
    case "enroute":
      return "ENROUTE";
    case "facility":
      return "FACILITY";
    case "onscene":
      return "ARRIVED";
    case "rtb":
      return "RETURN TO BASE";
    default:
      return status.toUpperCase();
  }
};

export default formatResponderStatus;
