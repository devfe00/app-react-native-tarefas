import React, { useState } from 'react';
import { 
  View, 
  Text, 
  TextInput, 
  TouchableOpacity, 
  StyleSheet, 
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView
} from 'react-native';

const AdicionarTarefaScreen = ({ navigation }) => {
  const [titulo, setTitulo] = useState('');
  const [dataConclusao, setDataConclusao] = useState('');
  
  // Valida o formato da data (DD/MM/AAAA)
  const validarFormatoData = (data) => {
    const regex = /^(\d{1,2})\/(\d{1,2})\/(\d{4})$/;
    if (!regex.test(data)) return false;
    
    const [, dia, mes, ano] = data.match(regex);
    // Verifica se o mês está entre 1 e 12
    if (parseInt(mes) < 1 || parseInt(mes) > 12) return false;
    
    // Verifica se o dia é válido para o mês
    const diasNoMes = new Date(parseInt(ano), parseInt(mes), 0).getDate();
    if (parseInt(dia) < 1 || parseInt(dia) > diasNoMes) return false;
    
    return true;
  };
  
  // Verifica se a data está no futuro
  const validarDataFutura = (data) => {
    if (!validarFormatoData(data)) return false;
    
    const [dia, mes, ano] = data.split('/').map(num => parseInt(num, 10));
    const dataTarefa = new Date(ano, mes - 1, dia);
    dataTarefa.setHours(0, 0, 0, 0); // Zera as horas para comparar apenas as datas
    
    const hoje = new Date();
    hoje.setHours(0, 0, 0, 0);
    
    return dataTarefa >= hoje;
  };
  
  // Formata a entrada de data conforme o usuário digita
  const formatarDataInput = (texto) => {
    // Remove todos os caracteres que não são dígitos
    const digitos = texto.replace(/\D/g, '');
    
    // Formata conforme o padrão DD/MM/AAAA
    let dataFormatada = '';
    if (digitos.length > 0) {
      // Adiciona o dia
      dataFormatada = digitos.substring(0, Math.min(2, digitos.length));
      
      // Adiciona o mês
      if (digitos.length > 2) {
        dataFormatada += '/' + digitos.substring(2, Math.min(4, digitos.length));
      }
      
      // Adiciona o ano
      if (digitos.length > 4) {
        dataFormatada += '/' + digitos.substring(4, Math.min(8, digitos.length));
      }
    }
    
    setDataConclusao(dataFormatada);
  };
  
  const adicionarTarefa = () => {
    // Valida os campos
    if (!titulo.trim()) {
      Alert.alert('Erro', 'Por favor, digite um título para a tarefa.');
      return;
    }
    
    if (!dataConclusao.trim()) {
      Alert.alert('Erro', 'Por favor, digite uma data de conclusão.');
      return;
    }
    
    if (!validarFormatoData(dataConclusao)) {
      Alert.alert('Erro', 'A data deve estar no formato DD/MM/AAAA.');
      return;
    }
    
    if (!validarDataFutura(dataConclusao)) {
      Alert.alert('Erro', 'Data de conclusão não pode ser no passado.');
      return;
    }
    
    // Se passou por todas as validações, cria a nova tarefa
    const novaTarefa = {
      titulo,
      dataConclusao,
      concluida: false,
    };
    
    // Retorna para a tela anterior com a nova tarefa
    navigation.navigate('ListaTarefas', { tarefa: novaTarefa });
  };
  
  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <Text style={styles.header}>Adicionar Nova Tarefa</Text>
        
        <View style={styles.form}>
          <Text style={styles.label}>Título da Tarefa:</Text>
          <TextInput
            style={styles.input}
            placeholder="Digite o título da tarefa"
            value={titulo}
            onChangeText={setTitulo}
          />
          
          <Text style={styles.label}>Data de Conclusão:</Text>
          <TextInput
            style={styles.input}
            placeholder="DD/MM/AAAA"
            value={dataConclusao}
            onChangeText={formatarDataInput}
            keyboardType="numeric"
            maxLength={10}
          />
          <Text style={styles.helpText}>
            A data deve ser no formato DD/MM/AAAA e não pode ser no passado.
          </Text>
          
          <View style={styles.botoesContainer}>
            <TouchableOpacity
              style={[styles.botao, styles.botaoCancelar]}
              onPress={() => navigation.goBack()}
            >
              <Text style={styles.botaoTexto}>Cancelar</Text>
            </TouchableOpacity>
            
            <TouchableOpacity
              style={[styles.botao, styles.botaoSalvar]}
              onPress={adicionarTarefa}
            >
              <Text style={styles.botaoTexto}>Salvar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  scrollContainer: {
    flexGrow: 1,
    padding: 20,
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
    color: '#007bff',
  },
  form: {
    backgroundColor: '#ffffff',
    padding: 20,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#212529',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ced4da',
    borderRadius: 5,
    padding: 12,
    fontSize: 16,
    marginBottom: 15,
    backgroundColor: '#f8f9fa',
  },
  helpText: {
    fontSize: 12,
    color: '#6c757d',
    marginBottom: 20,
    fontStyle: 'italic',
  },
  botoesContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  botao: {
    flex: 1,
    padding: 15,
    borderRadius: 5,
    alignItems: 'center',
    marginHorizontal: 5,
  },
  botaoCancelar: {
    backgroundColor: '#6c757d',
  },
  botaoSalvar: {
    backgroundColor: '#28a745',
  },
  botaoTexto: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
});

export default AdicionarTarefaScreen;