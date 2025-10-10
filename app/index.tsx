import { useFocusEffect, useRouter } from "expo-router";
import React, { useState } from "react";
import { Button, FlatList, Text, View } from "react-native";
import { deleteNote, getNotes } from "../src/db/notes";

export default function HomeScreen() {
  const[notes,setNotes]=useState<any[]>([])//estado para armazenar as notas
  const router = useRouter()//Hook de navegação do Expo Router

  //useFocusEffect executa sempre que a tela volta a ser foco
  useFocusEffect(
    React.useCallback(()=>{
      setNotes(getNotes()) //Carregar as notas do banco de dados local
    },[])
  )

  //Função para deletar a nota
  function handleDelete(id:number){
    deleteNote(id) //Remove do banco a nota pelo id passando no parametro
    setNotes(getNotes()) //Atualiza a lista
  }
  return (
    <View
      style={{flex: 1,padding:20}}
    >
     <Button title="Adicionar Nota"
        onPress={()=>router.push('/add')}
     /> 

     <FlatList 
        data={notes}
        renderItem={({item})=>(
          <View style={{
            borderBottomWidth:1,
            padding:10,
            marginBottom:5
          }}>
            <Text style={{fontWeight:'bold',fontSize:16}}>
              {item.title} - {item.id}
            </Text>

            <View style={{flexDirection:'row',marginTop:5}}>
                <Button title="Editar"/>
                <View style={{width:10}}/>
                <Button title="Deletar" 
                   onPress={()=>handleDelete(item.id)}
                />           
            </View>
          </View>
        )}
     />
    </View>
  );
}
