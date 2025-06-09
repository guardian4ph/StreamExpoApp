import {
  View,
  Text,
  FlatList,
  Image,
  StyleSheet,
  SafeAreaView,
} from "react-native";
import React from "react";
import {useGetMessages} from "@/api/messages/useFetchMessages";
import {useAuthStore} from "@/context/useAuthStore";
import {Message} from "@/types/Message";
import formatDate from "@/utils/FormatDate";

const Messages = () => {
  const {user_id} = useAuthStore();
  const {data: messages, isLoading, error} = useGetMessages(user_id || "");

  const renderItem = ({item: item}: {item: Message}) => (
    <View style={styles.messageContainer}>
      <View style={styles.messageHeader}>
        <Image source={{uri: item.image}} style={styles.thumbnail} />
        <View style={styles.headerTextContainer}>
          <Text style={styles.title}>{item.title}</Text>
          <View style={styles.categoryContainer}>
            <Text
              style={[
                styles.category,
                item.type === "Warning / Critical Notification" &&
                  styles.warning,
              ]}>
              {item.type}
            </Text>
            <Text style={styles.timestamp}>{formatDate(item.createdAt)}</Text>
          </View>
          <Text
            numberOfLines={2}
            ellipsizeMode="tail"
            style={styles.description}>
            {item.message}
          </Text>
        </View>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <FlatList
        data={messages}
        renderItem={renderItem}
        keyExtractor={(item) => item._id}
        showsVerticalScrollIndicator={false}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  messageContainer: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#e0e0e0",
  },
  messageHeader: {
    flexDirection: "row",
  },
  thumbnail: {
    width: 50,
    height: 50,
    marginRight: 10,
  },
  headerTextContainer: {
    flex: 1,
  },
  title: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#1B4965",
  },
  categoryContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 2,
  },
  category: {
    fontSize: 12,
    color: "#1B4965",
  },
  warning: {
    color: "red",
  },
  timestamp: {
    fontSize: 12,
    color: "#666",
  },
  description: {
    fontSize: 14,
    color: "#333",
    marginTop: 5,
  },
  bottomBar: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    height: 60,
    backgroundColor: "#1B4965",
    borderTopWidth: 1,
    borderTopColor: "#ddd",
  },
  navButton: {
    alignItems: "center",
  },
  navText: {
    color: "#fff",
    fontSize: 12,
  },
  composeButton: {
    backgroundColor: "#e63946",
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 20,
  },
  composeText: {
    color: "#fff",
    fontWeight: "bold",
  },
});

export default Messages;
