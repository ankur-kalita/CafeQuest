import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Image,
  Alert,
  ActivityIndicator,
  Switch,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { Ionicons } from '@expo/vector-icons';
import { cafesAPI, uploadAPI } from '../api';
import TagSelector from '../components/TagSelector';
import RatingInput from '../components/RatingInput';
import { COLORS, SIZES, SHADOWS } from '../constants/theme';
import { CAFE_STATUS } from '../constants/tags';

const AddCafeScreen = ({ navigation, route }) => {
  const editCafe = route.params?.cafe;
  const isEditing = !!editCafe;

  const [name, setName] = useState('');
  const [location, setLocation] = useState('');
  const [photo, setPhoto] = useState(null);
  const [rating, setRating] = useState(3);
  const [tags, setTags] = useState([]);
  const [notes, setNotes] = useState('');
  const [status, setStatus] = useState('visited');
  const [isPublic, setIsPublic] = useState(true);
  const [loading, setLoading] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);

  useEffect(() => {
    if (isEditing) {
      setName(editCafe.name);
      setLocation(editCafe.location);
      setPhoto(editCafe.photo);
      setRating(editCafe.rating);
      setTags(editCafe.tags || []);
      setNotes(editCafe.notes || '');
      setStatus(editCafe.status);
      setIsPublic(editCafe.isPublic);
    }
  }, [editCafe]);

  const pickImage = async (useCamera = false) => {
    try {
      const permissionResult = useCamera
        ? await ImagePicker.requestCameraPermissionsAsync()
        : await ImagePicker.requestMediaLibraryPermissionsAsync();

      if (!permissionResult.granted) {
        Alert.alert('Permission Required', 'Please grant access to continue.');
        return;
      }

      const result = useCamera
        ? await ImagePicker.launchCameraAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [4, 3],
            quality: 0.8,
            base64: true,
          })
        : await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [4, 3],
            quality: 0.8,
            base64: true,
          });

      if (!result.canceled && result.assets[0]) {
        const asset = result.assets[0];
        setUploadingImage(true);

        try {
          const base64Image = `data:image/jpeg;base64,${asset.base64}`;
          const uploadResponse = await uploadAPI.uploadBase64(base64Image);
          setPhoto(uploadResponse.data.url);
        } catch (error) {
          console.error('Upload error:', error);
          Alert.alert('Upload Failed', 'Could not upload image. Please try again.');
        } finally {
          setUploadingImage(false);
        }
      }
    } catch (error) {
      console.error('Image picker error:', error);
      Alert.alert('Error', 'Something went wrong while selecting the image.');
    }
  };

  const showImageOptions = () => {
    Alert.alert('Add Photo', 'Choose a source', [
      { text: 'Camera', onPress: () => pickImage(true) },
      { text: 'Gallery', onPress: () => pickImage(false) },
      { text: 'Cancel', style: 'cancel' },
    ]);
  };

  const handleTagPress = (tagId) => {
    setTags((prev) =>
      prev.includes(tagId) ? prev.filter((t) => t !== tagId) : [...prev, tagId]
    );
  };

  const handleSubmit = async () => {
    if (!name.trim()) {
      Alert.alert('Error', 'Please enter the cafe name');
      return;
    }

    if (!location.trim()) {
      Alert.alert('Error', 'Please enter the location');
      return;
    }

    setLoading(true);

    try {
      const cafeData = {
        name: name.trim(),
        location: location.trim(),
        photo: photo || '',
        rating,
        tags,
        notes: notes.trim(),
        status,
        isPublic,
        visitedAt: status === 'visited' ? new Date().toISOString() : null,
      };

      if (isEditing) {
        await cafesAPI.update(editCafe._id, cafeData);
        Alert.alert('Success', 'Cafe updated successfully!', [
          { text: 'OK', onPress: () => navigation.goBack() },
        ]);
      } else {
        await cafesAPI.create(cafeData);
        Alert.alert('Success', 'Cafe added to your collection!', [
          { text: 'OK', onPress: () => navigation.navigate('Home') },
        ]);
      }
    } catch (error) {
      Alert.alert('Error', error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
      >
        {/* Image Picker */}
        <TouchableOpacity
          style={styles.imageContainer}
          onPress={showImageOptions}
          disabled={uploadingImage}
        >
          {uploadingImage ? (
            <View style={styles.imagePlaceholder}>
              <ActivityIndicator size="large" color={COLORS.primary} />
              <Text style={styles.uploadingText}>Uploading...</Text>
            </View>
          ) : photo ? (
            <Image source={{ uri: photo }} style={styles.image} />
          ) : (
            <View style={styles.imagePlaceholder}>
              <Ionicons name="camera-outline" size={48} color={COLORS.textMuted} />
              <Text style={styles.imagePlaceholderText}>Add Photo</Text>
            </View>
          )}
          {photo && !uploadingImage && (
            <View style={styles.changePhotoBtn}>
              <Ionicons name="camera" size={16} color={COLORS.white} />
            </View>
          )}
        </TouchableOpacity>

        {/* Form Fields */}
        <View style={styles.form}>
          <Text style={styles.label}>Cafe Name *</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter cafe name"
            placeholderTextColor={COLORS.textMuted}
            value={name}
            onChangeText={setName}
          />

          <Text style={styles.label}>Location *</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter address or area"
            placeholderTextColor={COLORS.textMuted}
            value={location}
            onChangeText={setLocation}
          />

          <Text style={styles.label}>Rating</Text>
          <View style={styles.ratingContainer}>
            <RatingInput rating={rating} onRatingChange={setRating} size={36} />
          </View>

          <Text style={styles.label}>Status</Text>
          <View style={styles.statusContainer}>
            {CAFE_STATUS.map((s) => (
              <TouchableOpacity
                key={s.id}
                style={[styles.statusBtn, status === s.id && styles.statusBtnActive]}
                onPress={() => setStatus(s.id)}
              >
                <Text
                  style={[
                    styles.statusBtnText,
                    status === s.id && styles.statusBtnTextActive,
                  ]}
                >
                  {s.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          <Text style={styles.label}>Tags</Text>
          <TagSelector selectedTags={tags} onTagPress={handleTagPress} />

          <Text style={styles.label}>Notes</Text>
          <TextInput
            style={[styles.input, styles.textArea]}
            placeholder="Write your thoughts about this cafe..."
            placeholderTextColor={COLORS.textMuted}
            value={notes}
            onChangeText={setNotes}
            multiline
            numberOfLines={4}
            textAlignVertical="top"
          />

          <View style={styles.switchRow}>
            <View>
              <Text style={styles.switchLabel}>Share publicly</Text>
              <Text style={styles.switchDesc}>Others can see this in Discover</Text>
            </View>
            <Switch
              value={isPublic}
              onValueChange={setIsPublic}
              trackColor={{ false: COLORS.border, true: COLORS.accent }}
              thumbColor={isPublic ? COLORS.primary : COLORS.textMuted}
            />
          </View>

          <TouchableOpacity
            style={[styles.submitBtn, loading && styles.submitBtnDisabled]}
            onPress={handleSubmit}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color={COLORS.white} />
            ) : (
              <Text style={styles.submitBtnText}>
                {isEditing ? 'Update Cafe' : 'Add Cafe'}
              </Text>
            )}
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  scrollContent: {
    paddingBottom: 50,
  },
  imageContainer: {
    height: 220,
    backgroundColor: COLORS.accentLight,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  image: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  imagePlaceholder: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  imagePlaceholderText: {
    marginTop: 12,
    fontSize: SIZES.md,
    color: COLORS.textLight,
    fontWeight: '500',
  },
  uploadingText: {
    marginTop: 10,
    fontSize: SIZES.sm,
    color: COLORS.primary,
    fontWeight: '600',
  },
  changePhotoBtn: {
    position: 'absolute',
    bottom: 14,
    right: 14,
    backgroundColor: COLORS.primary,
    width: 42,
    height: 42,
    borderRadius: 21,
    justifyContent: 'center',
    alignItems: 'center',
    ...SHADOWS.small,
  },
  form: {
    padding: SIZES.padding,
  },
  label: {
    fontSize: SIZES.md,
    fontWeight: '700',
    color: COLORS.text,
    marginBottom: 10,
    marginTop: 18,
    letterSpacing: -0.2,
  },
  input: {
    backgroundColor: COLORS.white,
    borderRadius: SIZES.radiusLg,
    paddingHorizontal: 18,
    paddingVertical: 16,
    fontSize: SIZES.md,
    color: COLORS.text,
    ...SHADOWS.small,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  textArea: {
    minHeight: 110,
    paddingTop: 16,
    textAlignVertical: 'top',
  },
  ratingContainer: {
    backgroundColor: COLORS.white,
    borderRadius: SIZES.radiusLg,
    padding: 18,
    alignItems: 'center',
    ...SHADOWS.small,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  statusContainer: {
    flexDirection: 'row',
    gap: 14,
  },
  statusBtn: {
    flex: 1,
    paddingVertical: 14,
    backgroundColor: COLORS.white,
    borderRadius: SIZES.radiusLg,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: COLORS.border,
  },
  statusBtnActive: {
    borderColor: COLORS.primary,
    backgroundColor: COLORS.primary,
  },
  statusBtnText: {
    fontSize: SIZES.md,
    fontWeight: '600',
    color: COLORS.textLight,
  },
  statusBtnTextActive: {
    color: COLORS.white,
    fontWeight: '700',
  },
  switchRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: COLORS.white,
    borderRadius: SIZES.radiusLg,
    padding: 18,
    marginTop: 18,
    ...SHADOWS.small,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  switchLabel: {
    fontSize: SIZES.md,
    fontWeight: '600',
    color: COLORS.text,
  },
  switchDesc: {
    fontSize: SIZES.sm,
    color: COLORS.textMuted,
    marginTop: 4,
  },
  submitBtn: {
    backgroundColor: COLORS.primary,
    borderRadius: SIZES.radiusLg,
    paddingVertical: 18,
    alignItems: 'center',
    marginTop: 28,
    ...SHADOWS.medium,
  },
  submitBtnDisabled: {
    opacity: 0.7,
  },
  submitBtnText: {
    color: COLORS.white,
    fontSize: SIZES.lg,
    fontWeight: '700',
    letterSpacing: 0.3,
  },
});

export default AddCafeScreen;
