import React, { useState } from 'react';
import { View, Text, Button, FlatList, StyleSheet } from 'react-native';

const ListaTarefasScreen = ({ route, navigation }) => {
  const [tarefas, setTarefas] = useState(route.params ? [route.params.tarefa] : []);

  const marcarComoConcluida = (index) => {
    const updatedTarefas = [...tarefas];
    updatedTarefas[index].concluida = !updatedTarefas[index].concluida;
    setTarefas(updatedTarefas);
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={tarefas}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item, index }) => (
          <View style={styles.tarefa}>
            <Text>{item.titulo}</Text>
            <Text>{item.dataConclusao}</Text>
            <Text>Status: {item.concluida ? 'Concluída' : 'Pendente'}</Text>
            <Button title="Marcar como concluída" onPress={() => marcarComoConcluida(index)} />
          </View>
        )}
      />
      <Button title="Adicionar Tarefa" onPress={() => navigation.navigate('AdicionarTarefa')} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  tarefa: {
    marginBottom: 20,
    padding: 10,
    borderWidth: 1,
  },
});

export default ListaTarefasScreen;
