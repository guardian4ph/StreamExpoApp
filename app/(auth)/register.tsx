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
  TouchableWithoutFeedback,
} from "react-native";
import React, {useState} from "react";
import Spinner from "react-native-loading-spinner-overlay";
import {useAuth} from "@/context/AuthContext";
import {useRouter} from "expo-router";
import {ScrollView} from "react-native-gesture-handler";

const WIDTH = Dimensions.get("window").width;
const HEIGHT = Dimensions.get("window").height;

const Register = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [isAgree, setIsAgree] = useState(false);
  const {onRegister} = useAuth();
  const router = useRouter();

  const register = async () => {
    if (!isAgree) {
      Alert.alert("Error", "Please agree to the terms and conditions");
      return;
    }
    setLoading(true);
    try {
      const result = await onRegister!(email, password);
      console.log("Registration successful", result);
      router.replace("/");
    } catch (err) {
      Alert.alert("Error", "Registration Failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.container}>
      <StatusBar
        hidden={false}
        barStyle="default"
        backgroundColor="transparent"
        translucent
      />
      <Spinner visible={loading} />

      <ScrollView
        contentContainerStyle={styles.scrollContainer}
        showsVerticalScrollIndicator={false}>
        <Text style={styles.headerText}>Register an Account</Text>
        <Text style={styles.requiredText}>All fields are required</Text>

        <TextInput
          placeholder="First Name"
          style={styles.textField}
          placeholderTextColor="gray"
        />

        <TextInput
          placeholder="Last Name"
          style={styles.textField}
          placeholderTextColor="gray"
        />

        <TextInput
          placeholder="Email"
          value={email}
          onChangeText={setEmail}
          style={styles.textField}
          placeholderTextColor="gray"
          autoCapitalize="none"
          keyboardType="email-address"
        />

        <TextInput
          placeholder="Mobile Number"
          style={styles.textField}
          placeholderTextColor="gray"
          keyboardType="phone-pad"
        />

        <Text style={styles.passwordHint}>
          To create a strong password, it should be at least 8 characters long
          and ideally longer, incorporating a mix of uppercase and lowercase
          letters, numbers, and special characters
        </Text>

        <TextInput
          placeholder="Password"
          value={password}
          onChangeText={setPassword}
          style={styles.textField}
          placeholderTextColor="gray"
          secureTextEntry={true}
        />

        <TextInput
          placeholder="Confirm Password"
          style={styles.textField}
          placeholderTextColor="gray"
          secureTextEntry={true}
        />

        <TextInput
          placeholder="House No./ Bldg./ Unit No./ Street"
          style={styles.textField}
          placeholderTextColor="gray"
        />

        <TextInput
          placeholder="Barangay"
          style={styles.textField}
          placeholderTextColor="gray"
        />

        <TextInput
          placeholder="City"
          style={styles.textField}
          placeholderTextColor="gray"
        />

        <View style={styles.termsContainer}>
          <TouchableWithoutFeedback onPress={() => setIsAgree(!isAgree)}>
            <View style={styles.checkbox}>
              {isAgree && <View style={styles.checkboxInner} />}
            </View>
          </TouchableWithoutFeedback>
          <Text style={styles.termsText}>
            Agree with Terms and Condition, Terms of use, Privacy Policy, Use
            Policy
          </Text>
        </View>

        <TouchableOpacity onPress={register} style={styles.buttonLogin}>
          <Text style={styles.buttonText}>Register</Text>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  scrollContainer: {
    paddingTop: 80,
    paddingHorizontal: 30,
    paddingBottom: 20,
  },
  headerText: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#1B4965",
    textAlign: "center",
    marginBottom: 5,
  },
  requiredText: {
    fontSize: 12,
    color: "#666",
    textAlign: "center",
    marginBottom: 20,
  },
  textField: {
    height: 40,
    borderWidth: 1,
    borderRadius: 4,
    borderColor: "#ccc",
    padding: 8,
    marginBottom: 8,
    backgroundColor: "#fff",
  },
  passwordHint: {
    fontSize: 11,
    color: "#666",
    marginTop: 10,
    marginBottom: 15,
    lineHeight: 15,
  },
  termsContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 8,
  },
  checkbox: {
    width: 18,
    height: 18,
    borderWidth: 1,
    borderColor: "#1B4965",
    borderRadius: 3,
    marginRight: 8,
    justifyContent: "center",
    alignItems: "center",
  },
  checkboxInner: {
    width: 12,
    height: 12,
    backgroundColor: "#1B4965",
    borderRadius: 2,
  },
  termsText: {
    flex: 1,
    fontSize: 10,
    color: "#333",
  },
  buttonLogin: {
    backgroundColor: "#1B4965",
    paddingVertical: 10,
    borderRadius: 4,
    alignItems: "center",
    marginTop: 12,
    marginBottom: 15,
  },
  buttonText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "500",
  },
});

export default Register;
