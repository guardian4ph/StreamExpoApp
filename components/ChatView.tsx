import {View, Text} from "react-native";
import React, {useEffect, useState} from "react";
import {StreamChat} from "stream-chat";
import {useAuth} from "../context/AuthContext";
import {
  Channel,
  Chat,
  DefaultStreamChatGenerics,
  MessageInput,
  MessageList,
} from "stream-chat-expo";
import {Channel as ChannelType} from "stream-chat";

const STREAM_KEY = process.env.EXPO_PUBLIC_STREAM_ACCESS_KEY;

type Props = {
  channelId: string;
};

const ChatView = ({channelId}: Props) => {
  console.log("🚀 ~ ChatView ~ channelId :", channelId);

  const chatClient = StreamChat.getInstance(STREAM_KEY!);
  const {authState} = useAuth();
  const [channel, setChannel] = useState<
    ChannelType<DefaultStreamChatGenerics> | undefined
  >(undefined);

  useEffect(() => {
    const connectToChannel = async () => {
      const user = {
        id: authState?.user_id!,
        image: require("@/assets/images/userAvatar.png"),
      };

      await chatClient.connectUser(user, authState?.token!);
      const channel = chatClient.channel("messaging", channelId);

      setChannel(channel);
      await channel.watch();
    };

    console.log("Chat Chanel", channel);
    console.log("Chat CLient", chatClient);
    connectToChannel();

    // Cleanup
    return () => {
      channel?.stopWatching();
      chatClient.disconnectUser();
    };
  }, []);

  return (
    <>
      {chatClient && channel ? (
        <Chat client={chatClient}>
          <Channel channel={channel}>
            <MessageList />
            <MessageInput />
          </Channel>
        </Chat>
      ) : (
        <View>
          <Text>Loading Chat...</Text>
        </View>
      )}
    </>
  );
};

export default ChatView;
