import AsyncStorage from '@react-native-async-storage/async-storage';

export const setLocalStorage = async (key: string, value: any) => {
    const stringValue = typeof value === 'string' ? value : JSON.stringify(value);
    await AsyncStorage.setItem(key, stringValue);
}

export const getLocalStorage = async (key: string) => {
    const result = await AsyncStorage.getItem(key);
    return result ? JSON.parse(result) : null;
}

export const clearLocalStorage = async () => {
    await AsyncStorage.clear();
}

// Medicine-specific storage functions
export const saveMedicine = async (medicine: any) => {
    try {
        const existingMedicines = await getLocalStorage('medicines') || [];
        const updatedMedicines = [...existingMedicines, medicine];
        await setLocalStorage('medicines', updatedMedicines);
        return true;
    } catch (error) {
        console.log('Error saving medicine:', error);
        return false;
    }
}

export const getMedicines = async () => {
    try {
        return await getLocalStorage('medicines') || [];
    } catch (error) {
        console.log('Error getting medicines:', error);
        return [];
    }
}

export const updateMedicine = async (medicineId: string, updatedMedicine: any) => {
    try {
        const medicines = await getMedicines();
        const updatedMedicines = medicines.map((med: any) => 
            med.id === medicineId ? { ...med, ...updatedMedicine } : med
        );
        await setLocalStorage('medicines', updatedMedicines);
        return true;
    } catch (error) {
        console.log('Error updating medicine:', error);
        return false;
    }
}

export const deleteMedicine = async (medicineId: string) => {
    try {
        const medicines = await getMedicines();
        const filteredMedicines = medicines.filter((med: any) => med.id !== medicineId);
        await setLocalStorage('medicines', filteredMedicines);
        return true;
    } catch (error) {
        console.log('Error deleting medicine:', error);
        return false;
    }
}