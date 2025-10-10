import React,{useState,useEffect} from 'react'
import{View,TextInput,Button,Alert} from 'react-native'
import{useRouter,useLocalSearchParams} from 'expo-router'

//Importa funções do banco SQLite
import{getNotes,updateNote} from "../../src/db/notes"

//Define a interface Note para tipar as notas
interface Note{
    id:number
    title:string
    content:string
    createAt:string
}

export default function EditNoteScreen(){
    const params = useLocalSearchParams<{id:string}>()
    const router = useRouter()

    const[title,setTitle]=useState("")
    const[content,setContent]=useState("")

    useEffect(()=>{
        if(!params.id) return //Se não tiver o id, não faz nada

        const note = (getNotes() as Note[])
            .find(n=>n.id===Number(params.id))
        
        //Se encontrou a nota, preenche os estados
        if(note){
            setTitle(note.title)
            setContent(note.content)
        }
    },[params.id])

    //Função chamada ao clicar em atualizar nota
function handleUpdate(){
    if(!title.trim()){
        Alert.alert("Atenção","Digite um título")
        return
    }

    //Atualizar a nota no SQLite
    updateNote(Number(params.id),title,content)

    //Voltar para a tela anterior(index)
    router.back()
}
    return(
        <View style={{flex:1,padding:20}}> 
            <TextInput 
                placeholder='Título' 
                value={title}
                onChangeText={(value)=>setTitle(value)}
                style={{
                borderWidth:1,padding:10,marginBottom:10,
                borderRadius:6
                }}            
            />
        
            <TextInput 
                placeholder='Conteúdo'
                value={content}
                onChangeText={(value)=>setContent(value)}
                multiline
                style={{
                borderWidth:1,padding:10,height:120,
                borderRadius:6
                }} 
                    />
                    <Button title='Atualizar' onPress={handleUpdate}/>
                </View>
    )
}
