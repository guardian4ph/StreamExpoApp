import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import React, {useEffect} from "react";
import {Ionicons} from "@expo/vector-icons";
import {useGetUserInfo} from "@/hooks/useGetUserInfo";
import {useIncident} from "@/context/IncidentContext";

export default function Profile() {
  // const {clearIncident} = useIncident();

  // useEffect(() => {
  //   clearIncident!();
  // }, []);

  const {userInfo, loading, error} = useGetUserInfo();

  if (loading) {
    return (
      <View style={[styles.container, styles.centered]}>
        <ActivityIndicator size="large" color="#1B4965" />
      </View>
    );
  }

  if (error || !userInfo) {
    return (
      <View style={[styles.container, styles.centered]}>
        <Text style={styles.errorText}>
          {error || "Unable to load profile information"}
        </Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.placeholder} />
        <TouchableOpacity style={styles.editButton}>
          <Ionicons name="create-outline" size={24} color="#1B4965" />
        </TouchableOpacity>
      </View>

      <View style={styles.profileSection}>
        <Image
          source={require("@/assets/images/userAvatar.png")}
          style={styles.avatar}
        />
        <Text style={styles.name}>
          {userInfo.firstName} {userInfo.lastName}
        </Text>
        <Text style={styles.address}>
          {userInfo.address || "No address provided"}
          {userInfo.barangay && `, ${userInfo.barangay}`}
          {userInfo.city && `, ${userInfo.city}`}
        </Text>

        <View style={styles.statsContainer}>
          <View style={styles.reviewRow}>
            <Text style={styles.statLabel}>Review:</Text>
            <View style={styles.starsContainer}>
              {[1, 2, 3, 4, 5].map((_, index) => (
                <Ionicons key={index} name="star" size={20} color="#FFD700" />
              ))}
            </View>
          </View>
          <View style={styles.bottomRow}>
            <View style={styles.rankSection}>
              <Text style={styles.statLabel}>Rank:</Text>
              <Text style={styles.rankValue}>"Angel"</Text>
            </View>
            <View style={styles.divider} />
            <View style={styles.reportsSection}>
              <Text style={styles.statLabel}>Reports:</Text>
              <Text style={styles.statValue}>1k+</Text>
            </View>
          </View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  centered: {
    justifyContent: "center",
    alignItems: "center",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
  },
  placeholder: {
    width: 4,
  },
  editButton: {
    padding: 8,
    borderRadius: 20,
  },
  profileSection: {
    alignItems: "center",
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 60,
    marginBottom: 10,
  },
  name: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 8,
  },
  address: {
    fontSize: 14,
    color: "#666",
    textAlign: "center",
    paddingHorizontal: 30,
  },
  errorText: {
    color: "red",
    fontSize: 16,
    textAlign: "center",
    padding: 20,
  },
  statsContainer: {
    backgroundColor: "#1B4965",
    borderRadius: 10,
    padding: 15,
    marginTop: 15,
    width: "85%",
  },
  reviewRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
    marginBottom: 10,
  },
  bottomRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  rankSection: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  reportsSection: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    justifyContent: "flex-end",
  },
  statLabel: {
    color: "white",
    fontSize: 16,
  },
  starsContainer: {
    flexDirection: "row",
  },
  statValue: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
  rankValue: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },

  divider: {
    width: 1,
    height: "100%",
    backgroundColor: "white",
  },
  rankText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#1B4965",
    marginTop: 10,
  },
});
