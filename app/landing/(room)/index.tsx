import {Image, SafeAreaView, StyleSheet, Text, View} from "react-native";
import React from "react";
import {EmergencyContacts} from "@/assets/data/emergencyContacts";
import {TouchableOpacity} from "react-native";
import {useRouter} from "expo-router";

export default function SelectEmergency() {
  const router = useRouter();

  const handleClickEmergency = (contact: {name: string; roomId: string}) => {
    router.push({
      pathname: "/landing/(room)/loadingCall",
      params: {
        emergencyType: contact.name,
        roomId: contact.roomId,
      },
    });
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.centerContainer}>
        <View style={styles.grid}>
          {EmergencyContacts.map((contact) => (
            <TouchableOpacity
              key={contact.id}
              style={styles.gridItem}
              onPress={() => handleClickEmergency(contact)}>
              <Image
                source={contact.icon}
                style={styles.icon}
                resizeMode="contain"
              />
              <Text style={styles.label}>{contact.name}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f3f5f5",
    padding: 20,
  },
  centerContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  grid: {
    width: "100%",
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-evenly",
    gap: 10,
  },
  gridItem: {
    width: "42%",
    aspectRatio: 1,
    backgroundColor: "#1B4965",
    borderRadius: 15,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  icon: {
    width: "80%",
    height: "60%",
    marginBottom: 10,
  },
  label: {
    color: "white",
    fontSize: 16,
    fontWeight: "500",
  },
});
