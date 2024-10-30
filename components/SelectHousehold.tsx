import React, { useCallback, useEffect, useState } from 'react';
import { List } from 'react-native-paper';
import { useAppDispatch, useAppSelector } from '../store/hook';
import { getHouseholds } from '../store/households/action';
import { setCurrentHousehold } from '../store/households/reducer';
import {
  selectHouseholdError,
  selectHouseholdLoading,
  selectHouseholds,
} from '../store/households/selectors';
import { Household } from '../types/Household';
import { ActivityIndicator } from 'react-native-paper';
import { selectCurrentHousehold } from '../store/households/selectors';

export default function SelectHousehold() {
  const dispatch = useAppDispatch();
  const households = useAppSelector(selectHouseholds) || [];
  const isLoading = useAppSelector(selectHouseholdLoading);
  const error = useAppSelector(selectHouseholdError);
  const [expanded, setExpanded] = useState(false);
  const currentHousehold: Household | null = useAppSelector(
    selectCurrentHousehold,
  );

  const fetchHouseholds = useCallback(() => {
    dispatch(getHouseholds()).catch((error) => {
      console.error('Failed to fetch households:', error);
    });
  }, [dispatch]);

  const handlePress = useCallback(
    (household: Household) => {
      if (household?.id) {
        dispatch(setCurrentHousehold(household));
      }
      setExpanded(false);
    },
    [dispatch],
  );

  useEffect(() => {
    fetchHouseholds();
  }, [fetchHouseholds]);

  const handleAccordionPress = () => {
    setExpanded(!expanded);
  };

  const title = currentHousehold
    ? `Hushåll: ${currentHousehold.name}`
    : 'Välj hushåll';

  return (
    <List.Section>
      <List.Accordion
        title={title}
        expanded={expanded}
        onPress={handleAccordionPress}>
        {isLoading ? (
          <ActivityIndicator />
        ) : error ? (
          <List.Item title="Fel vid hämtning av hushåll" />
        ) : (
          households.map((household) => (
            <List.Item
              key={household.id}
              title={household.name}
              onPress={() => handlePress(household)}
            />
          ))
        )}
      </List.Accordion>
    </List.Section>
  );
}
