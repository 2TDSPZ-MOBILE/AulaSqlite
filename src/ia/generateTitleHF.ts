//Importar o axios para realizar requisições HTTP
import axios from "axios"

//Token do Huggin Face
const HF_API_KEY = process.env.EXPO_PUBLIC_HF_API_KEY

export async function generateTitleFromContentHF(content:string){
    //Se o conteúdo estiver vazio, retorna uma string vazia
    if(!content.trim()) return "";

    try{
        //Ocorrerá a requisção POST para a API
        //Estamos utilizando o modelo 'facebook/bart-large-cnn'
        const response = await axios.post("https://api-inference.huggingface.co/models/facebook/bart-large-cnn",//Url do modelo
            {
                //input é o texto que será processado
                inputs:content,
                //Parameters são configurações adicionais do modelo
                parameters:{
                    max_length:20,      //Tamanho máximo do título gerado
                    min_length:10,       //Tamanho mínimo
                    do_sample:false,    //caso true, gera variações aleatórias
                    early_stopping:true //Encerra geração assim que o modelo achar adequado.
                }
            },
            {
                //Cabeçalho da requisição
                headers:{
                    Authorization:`Bearer ${HF_API_KEY}`,//Autenticação
                    "Content-Type":"application/json", //Tipo do conteúdo
                }
            }
        )

        //O modelo em questão retorna um array resultados
        const generatedText = response.data?.[0]?.summary_text || response.data?.[0]?.generated_text || ""

        return generatedText.trim() //.trim remove espaços em branco na esquerda e da direita do texto

    }catch(error){
        console.log("Erro Hugging Face IA", error)
        return ""
    }

}