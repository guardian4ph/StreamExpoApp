import {
  View,
  Text,
  FlatList,
  Image,
  StyleSheet,
  SafeAreaView,
  RefreshControl,
} from "react-native";
import React, { useCallback } from "react";
import { useFocusEffect } from "@react-navigation/native";
import { useGetMessages } from "@/api/messages/useFetchMessages";
import { useAuthStore } from "@/context/useAuthStore";
import { Message } from "@/types/Message";
import formatDate from "@/utils/FormatDate";
import moment from "moment";

const Messages = () => {
  const { user_id } = useAuthStore();

  const timeDifference = (item) => {
    var current = new Date();
    var formatDate = new Date(item);

    var minutes = 60 * 1000;
    var hours = minutes * 60;
    var days = hours * 24;
    var months = days * 30;
    var years = days * 365;

    var elapsed = current - formatDate;

    if (elapsed < minutes) {
      return Math.round(elapsed / 1000) + " seconds ago";
    } else if (elapsed < hours) {
      return Math.round(elapsed / minutes) + " minutes ago";
    } else if (elapsed < days) {
      return Math.round(elapsed / hours) + " hours ago";
    } else if (elapsed < months) {
      return Math.round(elapsed / days) + " days ago";
    } else if (elapsed < years) {
      return Math.round(elapsed / months) + " months ago";
    } else {
      return Math.round(elapsed / years) + " years ago";
    }
  };

  const {
    data: messages,
    // isLoading,
    // error,
    refetch,
    isRefetching,
  } = useGetMessages(user_id || "");

  useFocusEffect(
    useCallback(() => {
      refetch();
    }, [refetch])
  );

  const renderItem = ({ item: item }: { item: Message }) => (
    <View style={styles.messageContainer}>
      <View style={styles.messageHeader}>
        <Image
          source={{ uri: item.image }}
          style={styles.thumbnail}
          defaultSource={require("@/assets/images/Button.png")}
        />
        <View style={styles.headerTextContainer}>
          <Text style={styles.title}>{item.title}</Text>
          <View style={styles.categoryContainer}>
            <Text
              style={[
                styles.category,
                item.type === "Warning / Critical Notification" &&
                  styles.warning,
              ]}
            >
              {item.type}
            </Text>
            {/* <Text style={styles.timestamp}>{formatDate(item.createdAt)}</Text> */}
            <Text style={styles.timestamp}>
              {/* {moment(item.createdAt).format("MM /D/YY").toLocaleString()}{" "}
              {" | "} */}
              {timeDifference(item.createdAt)}
            </Text>
          </View>
          <Text
            numberOfLines={2}
            ellipsizeMode="tail"
            style={styles.description}
          >
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
        refreshControl={
          <RefreshControl
            refreshing={isRefetching}
            onRefresh={refetch}
            colors={["#215a75"]}
            tintColor="#215a75"
          />
        }
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
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  thumbnail: {
    width: 50,
    height: 50,
    marginRight: 10,
    borderRadius: 100,
    borderWidth: 3, // Border thickness
    borderColor: "#ddd",
    backgroundColor: "#fff",
  },
  headerTextContainer: {
    flex: 1,
  },
  title: {
    fontSize: 14,
    fontWeight: "500",
    color: "#215a75",
    textTransform: "uppercase",
  },
  categoryContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 2,
  },
  category: {
    fontSize: 10,
    fontWeight: 200,
    color: "#333",
  },
  warning: {
    color: "red",
  },
  timestamp: {
    fontSize: 8,
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
    backgroundColor: "#215a75",
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
