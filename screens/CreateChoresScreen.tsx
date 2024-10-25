import React, { useState } from 'react';
import { View, Text, TextInput, Button, FlatList, StyleSheet } from 'react-native';

interface Task {
    id: string;
    value: string;
}

export default function CreateTaskView() {
    // State för att hålla inmatad text och listan med sysslor
    const [text, setText] = useState<string>('');  // Typen för text är string
    const [tasks, setTasks] = useState<Task[]>([]);  // Typen för tasks är en array av Task-objekt

    // Funktion för att lägga till en ny syssla
    const addTask = () => {
        if (text.length > 0) {
            const newTask: Task = { id: tasks.length.toString(), value: text };
            setTasks([...tasks, newTask]);
            setText(''); // Tömmer inmatningsfältet efter att sysslan har lagts till
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Skapa en ny syssla</Text>

            {/* TextInput för att skriva in en syssla */}
            <TextInput
                style={styles.input}
                placeholder="Ange en syssla..."
                onChangeText={setText}
                value={text}
            />

            {/* Button för att lägga till sysslan */}
            <Button title="Lägg till syssla" onPress={addTask} />

            {/* Lista över sysslor */}
            <FlatList
                data={tasks}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => (
                    <View style={styles.taskItem}>
                        <Text>{item.value}</Text>
                    </View>
                )}
            />
        </View>
    );
}

// Styles för layouten
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        padding: 20,
        justifyContent: 'center',
    },
    title: {
        fontSize: 24,
        marginBottom: 20,
        textAlign: 'center',
    },
    input: {
        borderWidth: 1,
        borderColor: '#ccc',
        padding: 10,
        marginBottom: 20,
        borderRadius: 5,
    },
    taskItem: {
        padding: 10,
        backgroundColor: '#f9f9f9',
        borderBottomWidth: 1,
        borderBottomColor: '#ddd',
        marginTop: 10,
    },
});
