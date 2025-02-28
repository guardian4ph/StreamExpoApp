import {
  View,
  Text,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  TextInput,
  TouchableOpacity,
  Dimensions,
  StatusBar,
  Alert,
} from "react-native";
import React, { useState } from "react";
import Spinner from "react-native-loading-spinner-overlay";
import Colors from "@/constants/Colors";
import { useAuth } from "@/context/AuthContext";

const WIDTH = Dimensions.get("window").width;
const HEIGHT = Dimensions.get("window").height;

const index = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const { onLogin, onLogout, onRegister } = useAuth();

  const logIn = async () => {
    setLoading(true);
    try {
      const result = await onLogin!(email, password);
      console.log("~ file: index.tsx:31 ~ login ~ result", result);
    } catch (err) {
      Alert.alert("Error", "Login Failed");
    } finally {
      setLoading(false);
    }
  };

  const register = async () => {
    setLoading(true);
    try {
      const result = await onRegister!(email, password);
      console.log("~ file: index.tsx:43 ~ login ~ result", result);
    } catch (err) {
      Alert.alert("Error", "Register Failed");
    } finally {
      setLoading(false);
    }
  };
  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.container}
    >
      <StatusBar
        hidden={false}
        barStyle="default"
        backgroundColor="transparent"
        translucent
      />
      <Spinner visible={loading} />
      <Text style={styles.header}>GuardianPH</Text>
      <Text style={styles.subHeader}>
        Emergency Response at your Fingertips
      </Text>
      <TextInput
        autoCapitalize="none"
        placeholder="juandelacruz@mail.com"
        value={email}
        onChangeText={setEmail}
        style={styles.textField}
        placeholderTextColor="gray"
      />
      <TextInput
        value={password}
        placeholder="password"
        onChangeText={setPassword}
        style={styles.textField}
        placeholderTextColor="gray"
        secureTextEntry={true}
      />

      <TouchableOpacity onPress={logIn} style={styles.buttonLogin}>
        <Text style={styles.buttonText}>Log In</Text>
      </TouchableOpacity>

      <Text style={styles.registerText}>Don't have an account?</Text>
      <TouchableOpacity onPress={register} style={styles.buttonRegister}>
        <Text style={styles.registerButton}>Register</Text>
      </TouchableOpacity>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    paddingHorizontal: WIDTH > HEIGHT ? "40%" : 30,
    justifyContent: "center",
  },
  header: {
    textAlign: "center",
    fontSize: 20,
    color: Colors.primary,
  },
  subHeader: {
    fontSize: 10,
    fontWeight: "100",
    textAlign: "center",
    paddingBottom: 20,
    color: Colors.primary,
  },
  registerText: {
    textAlign: "center",
    fontSize: 10,
    color: Colors.primary,
    margin: 10,
  },
  textField: {
    marginVertical: 4,
    height: 50,
    borderWidth: 1,
    borderRadius: 4,
    borderColor: "#333",
    padding: 10,
  },
  buttonLogin: {
    marginTop: 30,
    backgroundColor: "#215a75", // Blue color
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5, // Android shadow
  },
  buttonRegister: {
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5, // Android shadow
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  registerButton: {
    color: "#215a75",
    fontSize: 16,
    fontWeight: 200,
  },
});

export default index;
