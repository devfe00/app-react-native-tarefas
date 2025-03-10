import React, { useState } from 'react';
import { TextInput, Button, Text, View, StyleSheet, Alert } from 'react-native';
import { z } from 'zod';

// Validação com Zod
const tarefaSchema = z.object({
  titulo: z.string().min(3, 'Título deve ter no mínimo 3 caracteres'),
  dataConclusao: z.string().refine(val => new Date(val) >= new Date(), 'Data de conclusão não pode ser no passado'),
});

const AdicionarTarefaScreen = ({ navigation }) => {
  const [titulo, setTitulo] = useState('');
  const [descricao, setDescricao] = useState('');
  const [dataConclusao, setDataConclusao] = useState('');

  const handleSubmit = () => {
    const result = tarefaSchema.safeParse({ titulo, descricao, dataConclusao });

    if (!result.success) {
      Alert.alert('Erro', result.error.errors[0].message);
      return;
    }

    // Aqui você pode salvar os dados ou enviar para uma lista
    // Por enquanto, só navegamos para a tela de lista de tarefas
    navigation.navigate('ListaTarefas', { tarefa: { titulo, descricao, dataConclusao, concluida: false } });
  };

  return (
    <View style={styles.container}>
      <TextInput
        placeholder="Título da Tarefa"
        value={titulo}
        onChangeText={setTitulo}
        style={styles.input}
      />
      <TextInput
        placeholder="Descrição"
        value={descricao}
        onChangeText={setDescricao}
        style={styles.input}
      />
      <TextInput
        placeholder="Data de Conclusão"
        value={dataConclusao}
        onChangeText={setDataConclusao}
        style={styles.input}
        keyboardType="numeric"
      />
      <Button title="Adicionar Tarefa" onPress={handleSubmit} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
  },
  input: {
    borderBottomWidth: 1,
    marginBottom: 10,
    padding: 10,
  },
});

export default AdicionarTarefaScreen;
