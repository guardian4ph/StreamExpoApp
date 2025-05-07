import {ImageSourcePropType} from "react-native";

type Message = {
  id: number;
  thumbnail: ImageSourcePropType;
  title: string;
  category: string;
  timestamp: string;
  description: string;
};

export default Message;
