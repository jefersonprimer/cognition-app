import { View, ScrollView } from 'react-native';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';

const messages = [
  {
    id: '1',
    title: 'Bem-vindo à nova versão!',
    date: '26 de Setembro, 2025',
    content: 'Olá! Esta é a primeira mensagem do sistema. Com esta nova funcionalidade, você receberá notícias sobre atualizações, dicas e melhorias diretamente aqui.'
  },
  {
    id: '2',
    title: 'Funcionalidade de Lixeira Adicionada',
    date: '26 de Setembro, 2025',
    content: 'Agora, quando você deleta uma nota, ela é movida para a lixeira. Você pode restaurá-la ou apagá-la permanentemente acessando a lixeira através do menu na tela Home.'
  },
    {
    id: '3',
    title: 'Busca de Notas',
    date: '26 de Setembro, 2025',
    content: 'A nova aba "Busca" permite que você encontre suas notas rapidamente, pesquisando por palavras no título ou na descrição.'
  }
];

export default function MessagesScreen() {
  return (
    <ThemedView style={{ flex: 1 }}>
      <ScrollView style={{ paddingHorizontal: 16 }}>
        <ThemedText type="title" style={{ marginTop: 40, marginBottom: 24 }}>Mural de Avisos</ThemedText>
        {messages.reverse().map((message) => (
          <View 
            key={message.id}
            className="border border-gray-200 dark:border-gray-700 p-4 rounded-lg mb-4 bg-white dark:bg-gray-800 shadow-sm"
          >
            <ThemedText type="subtitle">{message.title}</ThemedText>
            <ThemedText style={{ fontSize: 12, color: 'gray', marginVertical: 8 }}>{message.date}</ThemedText>
            <ThemedText>{message.content}</ThemedText>
          </View>
        ))}
      </ScrollView>
    </ThemedView>
  );
}
