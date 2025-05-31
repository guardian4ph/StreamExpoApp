import {
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
  ScrollView,
  TextInput,
} from "react-native";
import React, {useState} from "react";
import {Ionicons} from "@expo/vector-icons";
import ProfileCollapsable from "@/components/landing-components/ProfileSections";
import {useFetchUserData} from "@/api/user/useFetchUserData";
import {useAuthStore} from "@/context/useAuthStore";

const Profile = () => {
  const [email, setEmail] = useState("");
  const [mobileNumber, setMobileNumber] = useState("");
  const [bloodType, setBloodType] = useState("");
  const [emergencyContact, setEmergencyContact] = useState("");
  const [relation, setRelation] = useState("");
  const [contactNumber, setContactNumber] = useState("");

  const [skills, setSkills] = useState("");
  const [preferredRole, setPreferredRole] = useState("");
  const [affiliation, setAffiliation] = useState("");

  const [hasMedicalConditions, setHasMedicalConditions] = useState(false);
  const [medicalConditions, setMedicalConditions] = useState("");
  const [takingMedications, setTakingMedications] = useState(false);
  const [medications, setMedications] = useState("");
  const [hasAllergies, setHasAllergies] = useState(false);
  const [allergies, setAllergies] = useState("");
  const [hasLimitations, setHasLimitations] = useState(false);
  const [limitations, setLimitations] = useState("");

  const {user_id} = useAuthStore();
  const {data: userInfo} = useFetchUserData(user_id || "");
  const rating = userInfo?.rating || 0;

  return (
    <ScrollView style={styles.container}>
      <View style={styles.profileHeader}>
        <View style={styles.avatarContainer}>
          <Image
            source={require("@/assets/images/userAvatar.png")}
            style={styles.avatar}
          />
          <TouchableOpacity style={styles.editIconContainer}>
            <Ionicons name="camera" size={20} color="#fff" />
          </TouchableOpacity>
        </View>

        <View style={styles.profileInfo}>
          <View style={styles.nameContainer}>
            <Text style={styles.profileName}>
              {userInfo?.firstName} {userInfo?.lastName}
            </Text>
            <TouchableOpacity>
              <Ionicons name="create-outline" size={20} color="#1B4965" />
            </TouchableOpacity>
          </View>
          <Text style={styles.location}>
            {userInfo?.address}, {userInfo?.barangay}, {userInfo?.city}
          </Text>
        </View>

        <View style={styles.ratingContainer}>
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
          <Text style={styles.ratingLabel}>"{userInfo?.rank}"</Text>
          <Text style={styles.reportsCount}>Reports: 1k+</Text>
        </View>
      </View>

      {/* CONTACT INFO */}
      <ProfileCollapsable title="Contact Information">
        <View style={styles.formGroup}>
          <Text style={styles.label}>Email</Text>
          <TextInput
            style={styles.input}
            value={email}
            onChangeText={setEmail}
            placeholder="Email"
          />
        </View>

        <View style={styles.formGroup}>
          <Text style={styles.label}>Mobile Number</Text>
          <TextInput
            style={styles.input}
            value={mobileNumber}
            onChangeText={setMobileNumber}
            placeholder="Mobile Number"
            keyboardType="phone-pad"
          />
        </View>

        <View style={styles.formGroup}>
          <Text style={styles.label}>Blood Type</Text>
          <View style={styles.dropdownContainer}>
            <TextInput
              style={styles.input}
              value={bloodType}
              onChangeText={setBloodType}
              placeholder="Blood Type"
            />
            <Ionicons
              name="chevron-down"
              size={20}
              color="#333"
              style={styles.dropdownIcon}
            />
          </View>
        </View>

        <View style={styles.formGroup}>
          <Text style={styles.label}>Emergency Contact Person</Text>
          <TextInput
            style={styles.input}
            value={emergencyContact}
            onChangeText={setEmergencyContact}
            placeholder="Emergency Contact Person"
          />
        </View>

        <View style={styles.formGroup}>
          <Text style={styles.label}>Relation</Text>
          <TextInput
            style={styles.input}
            value={relation}
            onChangeText={setRelation}
            placeholder="Relation"
          />
        </View>

        <View style={styles.formGroup}>
          <Text style={styles.label}>Contact Number</Text>
          <TextInput
            style={styles.input}
            value={contactNumber}
            onChangeText={setContactNumber}
            placeholder="Contact Number"
            keyboardType="phone-pad"
          />
        </View>
      </ProfileCollapsable>

      {/* USER INFO */}
      <ProfileCollapsable title="Volunteer-Specific Information">
        <View style={styles.formGroup}>
          <Text style={styles.label}>
            Skill and Certifications (e.g. first aide)
          </Text>
          <TextInput
            style={styles.input}
            value={skills}
            onChangeText={setSkills}
            placeholder="Skill and Certifications (e.g. first aide)"
          />
        </View>

        <View style={styles.formGroup}>
          <Text style={styles.label}>Preferred Role</Text>
          <TextInput
            style={styles.input}
            value={preferredRole}
            onChangeText={setPreferredRole}
            placeholder="Preferred Role"
          />
        </View>

        <View style={styles.formGroup}>
          <Text style={styles.label}>Affiliation (e.g Red Cross)</Text>
          <TextInput
            style={styles.input}
            value={affiliation}
            onChangeText={setAffiliation}
            placeholder="Affiliation (e.g Red Cross)"
          />
        </View>
      </ProfileCollapsable>

      {/* UPLOAD ID */}
      <ProfileCollapsable title="Upload Valid ID's">
        <View style={styles.uploadContainer}>
          <TouchableOpacity style={styles.uploadBox}>
            <View style={styles.uploadPlaceholder}>
              <Ionicons name="image-outline" size={40} color="#ccc" />
              <Text style={styles.uploadText}>Tap to add and browse</Text>
            </View>
          </TouchableOpacity>
        </View>
      </ProfileCollapsable>

      {/* MEDICAL CONCERENS */}
      <ProfileCollapsable title="Medical Concerns">
        <View style={styles.medicalFormGroup}>
          <Text style={styles.medicalLabel}>
            Do you have any existing medical conditions?
          </Text>
          <View style={styles.radioGroup}>
            <TouchableOpacity
              style={styles.radioOption}
              onPress={() => setHasMedicalConditions(false)}>
              <View
                style={[
                  styles.radioButton,
                  !hasMedicalConditions && styles.radioButtonSelected,
                ]}>
                {!hasMedicalConditions && (
                  <View style={styles.radioButtonInner} />
                )}
              </View>
              <Text style={styles.radioLabel}>None</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.radioOption}
              onPress={() => setHasMedicalConditions(true)}>
              <View
                style={[
                  styles.radioButton,
                  hasMedicalConditions && styles.radioButtonSelected,
                ]}>
                {hasMedicalConditions && (
                  <View style={styles.radioButtonInner} />
                )}
              </View>
              <Text style={styles.radioLabel}>Yes (please specify):</Text>
            </TouchableOpacity>
          </View>

          {hasMedicalConditions && (
            <TextInput
              style={styles.medicalInput}
              value={medicalConditions}
              onChangeText={setMedicalConditions}
              placeholder="Specify medical conditions"
              multiline
            />
          )}
        </View>

        <View style={styles.medicalFormGroup}>
          <Text style={styles.medicalLabel}>
            Are you currently taking any medications?
          </Text>
          <View style={styles.radioGroup}>
            <TouchableOpacity
              style={styles.radioOption}
              onPress={() => setTakingMedications(false)}>
              <View
                style={[
                  styles.radioButton,
                  !takingMedications && styles.radioButtonSelected,
                ]}>
                {!takingMedications && <View style={styles.radioButtonInner} />}
              </View>
              <Text style={styles.radioLabel}>No</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.radioOption}
              onPress={() => setTakingMedications(true)}>
              <View
                style={[
                  styles.radioButton,
                  takingMedications && styles.radioButtonSelected,
                ]}>
                {takingMedications && <View style={styles.radioButtonInner} />}
              </View>
              <Text style={styles.radioLabel}>
                Yes (please list medications)
              </Text>
            </TouchableOpacity>
          </View>

          {takingMedications && (
            <TextInput
              style={styles.medicalInput}
              value={medications}
              onChangeText={setMedications}
              placeholder="List medications"
              multiline
            />
          )}
        </View>

        <View style={styles.medicalFormGroup}>
          <Text style={styles.medicalLabel}>Do you have any allergies?</Text>
          <View style={styles.radioGroup}>
            <TouchableOpacity
              style={styles.radioOption}
              onPress={() => setHasAllergies(false)}>
              <View
                style={[
                  styles.radioButton,
                  !hasAllergies && styles.radioButtonSelected,
                ]}>
                {!hasAllergies && <View style={styles.radioButtonInner} />}
              </View>
              <Text style={styles.radioLabel}>No</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.radioOption}
              onPress={() => setHasAllergies(true)}>
              <View
                style={[
                  styles.radioButton,
                  hasAllergies && styles.radioButtonSelected,
                ]}>
                {hasAllergies && <View style={styles.radioButtonInner} />}
              </View>
              <Text style={styles.radioLabel}>
                Yes (please specify, e.g., food, medicine, insects)
              </Text>
            </TouchableOpacity>
          </View>

          {hasAllergies && (
            <TextInput
              style={styles.medicalInput}
              value={allergies}
              onChangeText={setAllergies}
              placeholder="Specify allergies"
              multiline
            />
          )}
        </View>

        <View style={styles.medicalFormGroup}>
          <Text style={styles.medicalLabel}>
            Do you have any physical limitations or injuries we should be aware
            of?
          </Text>
          <View style={styles.radioGroup}>
            <TouchableOpacity
              style={styles.radioOption}
              onPress={() => setHasLimitations(false)}>
              <View
                style={[
                  styles.radioButton,
                  !hasLimitations && styles.radioButtonSelected,
                ]}>
                {!hasLimitations && <View style={styles.radioButtonInner} />}
              </View>
              <Text style={styles.radioLabel}>No</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.radioOption}
              onPress={() => setHasLimitations(true)}>
              <View
                style={[
                  styles.radioButton,
                  hasLimitations && styles.radioButtonSelected,
                ]}>
                {hasLimitations && <View style={styles.radioButtonInner} />}
              </View>
              <Text style={styles.radioLabel}>Yes (please describe)</Text>
            </TouchableOpacity>
          </View>

          {hasLimitations && (
            <TextInput
              style={styles.medicalInput}
              value={limitations}
              onChangeText={setLimitations}
              placeholder="Describe limitations or injuries"
              multiline
            />
          )}
        </View>
      </ProfileCollapsable>

      <View style={styles.declarationContainer}>
        <View style={styles.checkboxRow}>
          <View style={styles.checkbox}>
            <Ionicons name="checkmark-circle" size={24} color="#1B4965" />
          </View>
          <Text style={styles.declarationText}>
            I hereby declare that all the information provided above is true,
            complete, and accurate to the best of my knowledge. I understand
            that any false or incomplete information may affect my participation
            in and use of GuardianPH App. I also consent to the use of this
            information solely for safety and coordination purposes in
            accordance with applicable data privacy laws.
          </Text>
        </View>

        <TouchableOpacity style={styles.saveButton}>
          <Text style={styles.saveButtonText}>Agree and Save</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

export default Profile;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  profileHeader: {
    padding: 20,
    backgroundColor: "#fff",
    alignItems: "center",
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  avatarContainer: {
    position: "relative",
    marginBottom: 10,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    borderWidth: 2,
    borderColor: "#1B4965",
  },
  editIconContainer: {
    position: "absolute",
    bottom: 0,
    right: 0,
    backgroundColor: "#1B4965",
    borderRadius: 15,
    width: 30,
    height: 30,
    justifyContent: "center",
    alignItems: "center",
  },
  profileInfo: {
    alignItems: "center",
    marginBottom: 10,
  },
  nameContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 5,
  },
  profileName: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#1B4965",
    marginRight: 5,
  },
  location: {
    fontSize: 14,
    color: "#666",
  },
  ratingContainer: {
    alignItems: "center",
  },
  starsContainer: {
    flexDirection: "row",
    marginBottom: 5,
  },
  starIcon: {
    fontSize: 16,
    marginHorizontal: 2,
  },
  filledStar: {
    color: "gold",
  },

  emptyStar: {
    color: "#ddd",
  },
  ratingLabel: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#1B4965",
  },
  reportsCount: {
    fontSize: 14,
    color: "#666",
  },
  formGroup: {
    marginBottom: 15,
  },
  label: {
    fontSize: 14,
    marginBottom: 5,
    color: "#333",
  },
  input: {
    height: 40,
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 5,
    paddingHorizontal: 10,
  },
  dropdownContainer: {
    position: "relative",
  },
  dropdownIcon: {
    position: "absolute",
    right: 10,
    top: 10,
  },
  uploadContainer: {
    alignItems: "center",
    justifyContent: "center",
    marginVertical: 10,
  },
  uploadBox: {
    width: "100%",
    height: 150,
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 5,
    borderStyle: "dashed",
    alignItems: "center",
    justifyContent: "center",
  },
  uploadPlaceholder: {
    alignItems: "center",
    justifyContent: "center",
  },
  uploadText: {
    marginTop: 10,
    color: "#666",
  },
  medicalFormGroup: {
    marginBottom: 20,
  },
  medicalLabel: {
    fontSize: 14,
    marginBottom: 10,
    color: "#333",
  },
  radioGroup: {
    marginBottom: 10,
  },
  radioOption: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  radioButton: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#1B4965",
    marginRight: 10,
    justifyContent: "center",
    alignItems: "center",
  },
  radioButtonSelected: {
    borderColor: "#1B4965",
  },
  radioButtonInner: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: "#1B4965",
  },
  radioLabel: {
    fontSize: 14,
    color: "#333",
  },
  medicalInput: {
    height: 60,
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 5,
    paddingHorizontal: 10,
    textAlignVertical: "top",
    paddingTop: 10,
  },
  declarationContainer: {
    padding: 15,
  },
  checkboxRow: {
    flexDirection: "row",
    marginBottom: 20,
  },
  checkbox: {
    marginRight: 10,
  },
  declarationText: {
    flex: 1,
    fontSize: 12,
    color: "#666",
    lineHeight: 18,
  },
  saveButton: {
    backgroundColor: "#1B4965",
    padding: 15,
    borderRadius: 5,
    alignItems: "center",
  },
  saveButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});
