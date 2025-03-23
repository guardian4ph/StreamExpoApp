import {SafeAreaView, StyleSheet, Text, View, Image} from "react-native";
import React, {useEffect, useState} from "react";
import {useLocalSearchParams} from "expo-router";
import getEmergencyIcon from "@/utils/getIcon";
import formatTime from "@/utils/FormatTime";
import {Ionicons} from "@expo/vector-icons";

export default function RoomVerification() {
  const {emergencyType, roomId} = useLocalSearchParams();
  const [timer, setTimer] = useState<number>(0);
  const [startTime] = useState<number>(Date.now());
  const [isVerified, setIsVerified] = useState<boolean>(false);

  // useEffect(() => {
  //   const interval = setInterval(() => {
  //     const elapsedTime = Math.floor((Date.now() - startTime) / 1000);
  //     setTimer(elapsedTime);
  //   }, 1000);

  //   return () => clearInterval(interval);
  // }, [startTime]);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.innerContainer}>
        {/* Emergency Type Section with Timer */}
        <View style={styles.incidentCard}>
          <View style={styles.headerSection}>
            <View style={styles.headerRow}>
              <Image
                source={getEmergencyIcon(emergencyType as string)}
                resizeMode="contain"
                style={styles.medicalIcon}
              />
              <View style={styles.headerText}>
                <View style={styles.idSection}>
                  <Text style={styles.idLabel}>ID:</Text>
                  <Text style={styles.idNumber}>25-03-11-0000</Text>
                </View>
                <Text style={styles.incidentType}>
                  {emergencyType} Incident
                </Text>
                <Text style={styles.address}>
                  A.S. Fortuna St, Mandaue City
                </Text>
              </View>
            </View>
          </View>
          <View style={styles.timerSection}>
            <Text style={styles.timerText}>RECEIVED : {formatTime(timer)}</Text>
          </View>
        </View>
        {/* Verification Status with Dispatch Operator Details */}
        <View style={styles.incidentCard}>
          <View style={styles.headerSection}>
            <View style={styles.headerRow}>
              <Image
                source={require("@/assets/images/banner-icon.png")}
                resizeMode="contain"
                style={styles.logoImage}
              />
              <View style={styles.headerText}>
                <View style={styles.statusRow}>
                  <View>
                    <Text style={styles.verification}>
                      {isVerified ? "VERIFIED" : "UNVERIFIED"}
                    </Text>
                    <Text style={styles.address}>Incident Status</Text>
                  </View>
                </View>
              </View>
            </View>
          </View>
          <View style={styles.subHeading}>
            <Text style={{color: "white", textAlign: "center"}}>
              Sending nearest asset at the incident location...
            </Text>
          </View>
          <View style={styles.headerSection}>
            <View style={styles.headerRow}>
              <Image
                source={require("@/assets/images/avatar.jpg")}
                resizeMode="contain"
                style={styles.logoImage}
              />
              <View style={styles.headerText}>
                <View style={styles.statusRow}>
                  <View>
                    <Text
                      style={{
                        color: "#1B4965",
                        fontWeight: "bold",
                        fontSize: 18,
                      }}>
                      nameOperator
                    </Text>
                    <Text>Dispatch Operator</Text>
                  </View>
                  <View style={styles.iconContainer}>
                    <Ionicons name="mail" size={30} color="#1B4965" />
                    <Ionicons name="videocam-sharp" size={30} color="#1B4965" />
                  </View>
                </View>
              </View>
            </View>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  innerContainer: {
    display: "flex",
    flexDirection: "column",
    gap: 10,
    width: "100%",
    padding: 30,
  },
  incidentCard: {
    backgroundColor: "white",
    borderRadius: 10,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  headerSection: {
    padding: 15,
  },
  idSection: {
    flexDirection: "row",
    gap: 5,
    marginBottom: 5,
  },
  idLabel: {
    fontSize: 16,
    fontWeight: "500",
  },
  idNumber: {
    fontSize: 16,
  },
  incidentType: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#4287f5",
    marginBottom: 5,
  },
  verification: {
    fontSize: 24,
    fontWeight: "bold",
    color: "red",
    marginBottom: 5,
  },
  address: {
    fontSize: 14,
    color: "#666",
  },
  timerSection: {
    backgroundColor: "#ff6b6b",
    padding: 10,
  },
  timerText: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
    textAlign: "center",
  },
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 15,
  },
  medicalIcon: {
    width: 50,
    height: 50,
  },
  headerText: {
    flex: 1,
  },
  logoImage: {
    width: 50,
    height: 50,
  },

  subHeading: {
    padding: 20,
    backgroundColor: "#1B4965",
  },
  statusRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  iconContainer: {
    flexDirection: "row",
    gap: 15,
  },
});
