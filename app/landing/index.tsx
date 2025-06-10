import {View, StyleSheet, StatusBar} from "react-native";
import React from "react";
import AlertPost from "@/components/landing-components/AlertPost";

const Landing = () => {
  return (
    <View style={styles.container}>
      <StatusBar backgroundColor="#1B4965" barStyle="light-content" />
      <AlertPost />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    paddingHorizontal: 10,
  },
});

export default Landing;
