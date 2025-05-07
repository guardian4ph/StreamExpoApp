import {View, StyleSheet, Image, Text, TouchableOpacity} from "react-native";
import React from "react";
import {useIncident} from "@/context/IncidentContext";
import {useAuthStore} from "@/context/useAuthStore";
import {useGetUserInfo} from "@/hooks/useGetUserInfo";
import {useRouter} from "expo-router";

export default function ID() {
  const {user_id, token} = useAuthStore();
  const {incidentState} = useIncident();
  const {userInfo} = useGetUserInfo();
  const router = useRouter();

  const rating = userInfo?.rating || 0;

  return (
    <View style={styles.wrapper}>
      <View style={styles.idCard}>
        <View style={styles.qrContainer}>
          <Image
            source={require("@/assets/images/sampleQR.png")}
            style={styles.qrCode}
          />
        </View>

        {/* rank and rating */}
        <View style={styles.infoRow}>
          <View style={styles.rankContainer}>
            <Text style={styles.rankTitle}>"{userInfo?.rank || "Angel"}"</Text>
            <Text style={styles.rankSubtitle}>Rank</Text>
          </View>
          <View style={styles.reviewsContainer}>
            <View style={styles.starsContainer}>
              {[1, 2, 3, 4, 5].map((star) => (
                <Text
                  key={star}
                  style={[
                    styles.starIcon,
                    star <= rating ? styles.filledStar : styles.emptyStar,
                  ]}>
                  ★
                </Text>
              ))}
            </View>
            <Text style={styles.reviewsText}>Reviews</Text>
          </View>
        </View>

        {/* user profiiel */}
        <TouchableOpacity
          style={styles.profileContainer}
          onPress={() => router.push("/landing/profile")}>
          <View style={styles.avatarContainer}>
            <Image
              source={
                userInfo?.profilePicture
                  ? {uri: userInfo.profilePicture}
                  : require("@/assets/images/avatar.png")
              }
              style={styles.avatar}
            />
          </View>
          <View style={styles.userInfoContainer}>
            <Text style={styles.userName}>
              {userInfo?.firstName}&nbsp;{userInfo?.lastName}
            </Text>
            <Text style={styles.userLocation}>
              {userInfo?.address}, {userInfo?.barangay}, {userInfo?.city}
            </Text>
          </View>
        </TouchableOpacity>

        {/* for debugging */}
        <View style={styles.debugContainer}>
          <Text style={styles.label}>
            User ID: <Text style={styles.value}>{user_id || "N/A"}</Text>
          </Text>
          <Text style={styles.label}>
            Token:
            <Text style={styles.value} numberOfLines={1} ellipsizeMode="tail">
              {token ? `${token.substring(0, 15)}...` : "N/A"}
            </Text>
          </Text>
          <Text style={styles.label}>
            Incident Type:
            <Text style={styles.value}>
              {incidentState?.emergencyType || "N/A"}
            </Text>
          </Text>
          <Text style={styles.label}>
            Incident ID:
            <Text style={styles.value} numberOfLines={1} ellipsizeMode="tail">
              {incidentState?.incidentId
                ? `${incidentState.incidentId.substring(0, 15)}...`
                : "N/A"}
            </Text>
          </Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
  },

  idCard: {
    width: "100%",
    maxWidth: 350,
    backgroundColor: "#fff",
    borderRadius: 10,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "#ddd",
  },

  qrContainer: {
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
    backgroundColor: "#fff",
  },

  qrCode: {
    width: 200,
    height: 200,
  },

  infoRow: {
    flexDirection: "row",
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: "#ddd",
  },

  rankContainer: {
    flex: 1,
    padding: 15,
    alignItems: "center",
    justifyContent: "center",
    borderRightWidth: 1,
    borderColor: "#ddd",
  },

  rankTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#2c5282",
  },

  rankSubtitle: {
    fontSize: 14,
    color: "#666",
  },

  reviewsContainer: {
    flex: 1,
    padding: 15,
    alignItems: "center",
    justifyContent: "center",
  },

  starsContainer: {
    flexDirection: "row",
  },

  starIcon: {
    fontSize: 16,
    marginHorizontal: 1,
  },

  filledStar: {
    color: "gold",
  },

  emptyStar: {
    color: "#ddd",
  },

  reviewsText: {
    fontSize: 14,
    color: "#666",
  },

  profileContainer: {
    flexDirection: "row",
    padding: 15,
    backgroundColor: "#2c5282", // Dark blue background as shown in the image
  },

  avatarContainer: {
    marginRight: 15,
  },

  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    borderWidth: 2,
    borderColor: "#fff",
  },

  userInfoContainer: {
    flex: 1,
    justifyContent: "center",
  },

  userName: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#fff",
  },

  userLocation: {
    fontSize: 14,
    color: "#fff",
    opacity: 0.8,
  },

  debugContainer: {
    padding: 10,
    backgroundColor: "rgba(200, 200, 200, 0.1)",
    display: "flex",
  },

  label: {
    fontSize: 10,
    color: "#555",
    fontWeight: "bold",
  },

  value: {
    fontSize: 10,
    color: "#777",
    marginBottom: 4,
    fontWeight: "normal",
  },
});
