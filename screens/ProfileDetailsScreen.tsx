import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { MaterialTopTabScreenProps } from '@react-navigation/material-top-tabs';
import React, { useCallback } from 'react';
import { SafeAreaView, ScrollView, View } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { Card, Surface, Text } from 'react-native-paper';
import { TabProfileParamsList } from '../navigators/TopTabsNavigatorProfile';
import { initialAvatars } from '../store/avatars/state';
import { useAppDispatch } from '../store/hook';
import { setCurrentProfile } from '../store/profiles/reducer';
import { globalStyles } from '../themes/styles';
import { Profile } from '../types/profile';

type Props = MaterialTopTabScreenProps<TabProfileParamsList, 'DetailsProfile'>;

export default function ProfileDetailsScreen({ navigation, route }: Props) {
  const dispatch = useAppDispatch();
  const profile = route.params?.profile;
  const selectedAvatar = initialAvatars.find((a) => a.id === profile?.avatarId);

  // Extracted render functions for icons
  const renderLeftIcon = () => (
    <Text style={globalStyles.avatarIcon}>{selectedAvatar?.icon}</Text>
  );
  const renderRightIcon = () => (
    <MaterialIcons name="edit" size={24} color="black" />
  );
  const handlePress = useCallback(
    (profile: Profile) => {
      if (profile?.id) {
        dispatch(setCurrentProfile(profile));
        navigation.navigate('EditProfile', { profile: profile });
      }
    },
    [dispatch, navigation],
  );

  if (!profile) {
    return (
      <View style={globalStyles.container}>
        <Text>No profile data available</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={globalStyles.container}>
      <ScrollView keyboardShouldPersistTaps="handled">
        <Surface style={globalStyles.surface}>
          <Card style={globalStyles.card}>
            <Card.Title
              title={profile?.name ?? 'No Name'}
              titleStyle={globalStyles.title}
              left={renderLeftIcon}
              subtitle={profile?.isOwner ? 'Owner' : 'Member'}
              subtitleStyle={globalStyles.subtitle}
            />

            <TouchableOpacity
              style={globalStyles.cardTouchable}
              onPress={() => handlePress(profile)}>
              <Card style={globalStyles.innerCard}>
                <Card.Title
                  title={profile?.name ?? 'Profile Name'}
                  titleStyle={globalStyles.title}
                  subtitle={profile?.isOwner ? 'Owner' : 'Member'}
                  left={renderLeftIcon}
                  right={renderRightIcon}
                />
              </Card>
            </TouchableOpacity>
          </Card>
        </Surface>
      </ScrollView>
    </SafeAreaView>
  );
}
