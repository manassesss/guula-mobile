import { IconButton, Paragraph,Checkbox,List } from 'react-native-paper';
import Header_Back from '../Componentes/Header_Back'
import { Text, View, StyleSheet, Image } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native'
import { ScrollView } from 'react-native-gesture-handler';
import React, { useState,useEffect } from 'react';
import UserContext from '../../../providers/UserProvider';
import api_users from '../../services/api_users';
import FavoriteProvider from '../../../providers/FavoriteProvider';
import SnackbarComponent from '../Componentes/Snackbar';
import CheckboxList from "rn-checkbox-list";
import Alert from '../Componentes/Alert';

const styles = StyleSheet.create({
    row: {
        flexDirection: 'row-reverse',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingVertical: 2,
        paddingHorizontal: 8,
      },
      row2: {
        flexDirection: 'row',
        justifyContent:"center",
      },
      textCheck:{
        flex: 1, 
        flexWrap: 'wrap',
        fontSize: 18,
        marginLeft: 5
      },
    titleAndFavouriteContent: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between'
    },
    recipeName: {
		color: "#545454",
		fontSize: 26,
		fontFamily: 'Poppins_400Regular',
		marginTop:5,
        width: '75%',
        flex:1
    },
    recipeFavouriteIcon: {
        padding: 0,
        margin: 0
    },
    recipeInfo: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-evenly'
    },
    recipeTitles: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 10,
        fontFamily: 'Poppins_400Regular',
    },
    recipeScroll: {
        flex: 1
    },
    recipeView: {
        padding: 10
    },
    recipeIcons: {
        margin: 0,
        padding: 0
    },
    recipeIconsAndInfo: {
        alignItems: 'center'
    },
    recipeInfoColor: {
        color: "#545454",
        fontFamily: 'Poppins_400Regular'
    },
    recipeTitleText: {
        color: "#545454",
        fontSize: 20,
        fontFamily: 'Poppins_700Bold'
    }
})


export default function RecipeScreen() {
    let [checked, setChecked] = useState(0);
    const [totalIngredientes, settotalIngredientes] = useState(0);
    const navigation = useNavigation();

    async function favoritarReceita() {
        const data = {
            receita_id: recipe.id
        };

        if (!favoritou) {
            const response = await api_users.post('favorites', data, {
                headers: {
                    Authorization: user.id,
                }
            })
                .catch(function (error) {
                    Alert.alert(error)
                });
            if (response.status == 200) {
                setReceitas([...receitas, ...[recipe]]);
                setTotalReceitas(Number(totalReceitas)+1);
                setSnackbarContent("Receita adicionada aos favoritos!")
                setShowSnackbar(true);
                setFavoritou(true);
            }
        }
        else {
            const response = await api_users.delete(`favorites/${recipe.id}`, {
                headers: {
                    Authorization: user.id,
                }
            })
                .catch(function (error) {
                    Alert.alert(error)
                });
            if (response.status == 204) {
                setReceitas(receitas.filter(e => e.id != recipe.id));
                setTotalReceitas(String(Number(totalReceitas)-1));
                setSnackbarContent("Receita removida dos favoritos!")
                setShowSnackbar(true);
                setFavoritou(false);
            }
        }
    }
    
  //useEffect( () => {favoritarReceita()}, []);

    function renderIgredientes(ingredientes){
        var indice = 0;

        var lista = ingredientes.split("\n");

        var lista_dict = []

        for(let i = 0; i < lista.length; i++){
            if(lista[i] == "" || lista[i] == " ")
                indice = i
            else{
                lista_dict.push({id:i,name:lista[i]})
            }
        }

        return (
            <CheckboxList    
                selectedListItems={[]}
                theme="orange"
                listItems={lista_dict}
                listItemStyle={{ borderBottomColor: '#eee', borderBottomWidth: 1 }}
                
/>

        )
    }

    function renderPreparo(Preparo){
        var indice = 0;
        var cont = 1;
        var lista = Preparo.split("\n")


         if(lista[0].includes("MODO DE PREPARO" ))
            lista.splice(0,1);
         
        for(let i = 0; i < lista.length; i++){
            if(lista[i].includes("Gostou" ) || lista[i].includes("gostou")|| lista[i].includes("Procurando")
            || lista[i] == "" || lista[i] == ""){
                if (indice == 0)
                    indice = i       
            }  
            
        }

        if(indice !== 0 )
            lista.splice(indice,lista.length - indice);

        const listPreparo = lista.map((prep, index) =>
                <View key={index} style={styles.row2} >
                    <Text style={{color:"#626262",fontSize: 20,fontFamily: 'Poppins_700Bold',marginRight:3} }>{cont++}  </Text>
                    <Text style={{color:"#626262",fontSize: 17,flexWrap: 'wrap',flex: 1,marginBottom:10}}>{prep}  </Text>
                </View>
                        
        );
                        
        return listPreparo
    }

    useEffect(() => {
        Image.getSize(recipe.imagem, (width, height) => { setSource({ width: width, height: height }); });
        if((recipe.imagem).includes("daninoce")){
            setFonte("Dani Noce");
        }else if((recipe.imagem).includes("ltmcdn.")){
            setFonte("Tudo Receitas");
        }else if((recipe.imagem).includes("anamariabrogui")){
            setFonte("Ana Maria Brogui");
        }else if((recipe.imagem).includes("img.itdg")){
            setFonte("Tudo Gostoso");
        }
    }, [])

    const navegation = useNavigation();
    const route = useRoute();
    const { user, setUser } = React.useContext(UserContext);
    const [source, setSource] = useState('');
    const [recipe, setRecipe] = useState(route.params.recipe);
    const { receitas, setReceitas, totalReceitas, setTotalReceitas } = React.useContext(FavoriteProvider);
    const [favoritou, setFavoritou] = useState(receitas.some(e => e.id === recipe.id));
    const [showSnackbar, setShowSnackbar] = useState(false);
    const [snackbarContent, setSnackbarContent] = useState('');
    const dificuldade = {"Dificuldade elevada":"Dificil", "Dificuldade m??dia":"M??dia", "Dificuldade baixa":"F??cil"   }
    const [alert, setAlert] = useState({
        visible: false,
        content: '',
        title: ''
    });
    const [fonte, setFonte] = useState("");
    
    return (
        <>
            <Header_Back />
            <ScrollView style={styles.recipeScroll}>
                <Image source={{ uri: recipe.imagem }} style={{ aspectRatio: source ? source.width / source.height : 1, width: '100%', height: null }} resizeMode='contain' />
                <View style={styles.recipeView}>
                    <View style={styles.titleAndFavouriteContent}>
                        <Text style={styles.recipeName}>{String(recipe.titulo).toUpperCase()}</Text>
                        <IconButton style={styles.recipeFavouriteIcon}
                            icon="heart"
                            color={favoritou ? "red" : "#d9d9d9"}
                            size={30}
                            animated={true}
                            onPress={() => {
                                user.loggedIn ? favoritarReceita() : 
                                setAlert({
                                    visible: true,
                                    content: '?? preciso estar logado para favoritar suas receitas!',
                                    title: 'Aten????o',
                                })
                            }}
                        />
                    </View>
                    <View style={styles.recipeInfo}>
                        <View style={styles.recipeIconsAndInfo}>
                            <IconButton style={styles.recipeIcons}
                                icon="clock-outline"
                                color="#ff914d"
                                size={25}
                            />
                            <Text style={styles.recipeInfoColor}> {recipe.tempo_preparo}</Text>
                        </View>
                        <View style={styles.recipeIconsAndInfo}>
                            <IconButton style={styles.recipeIcons}
                                icon="silverware"
                                color="#ff914d"
                                size={25}
                            />
                            <Text style={styles.recipeInfoColor}> {recipe.rendimento}</Text>
                        </View>
                        <View style={styles.recipeIconsAndInfo}>
                            <IconButton style={styles.recipeIcons}
                                icon="poll"
                                color="#ff914d"
                                size={25}
                            />
                            <Text style={styles.recipeInfoColor}>{dificuldade[recipe.dificuldade]}</Text>
                        </View>
                    </View>
                    <View style={styles.recipeTitles}>
                        <IconButton style={styles.recipeIcons}
                                icon="chef-hat"
                                color="#ff914d"
                                size={25}
                            />
                        <Text style={styles.recipeTitleText}> Ingredientes</Text>
                    </View>
                    <View>

                        {renderIgredientes(recipe.ingredientes)}
                    </View>
                    <View style={styles.recipeTitles}>
                            <IconButton style={styles.recipeIcons}
                                icon="blender"
                                color="#ff914d"
                                size={25}
                            />
                        <Text style={styles.recipeTitleText}>Modo de Preparo</Text>
                    </View>
                    <View>
                        {renderPreparo(recipe.modo_preparo)}

                    </View>
                    <View style={{
                        marginLeft: 5,
                    }}>
                        <Text style={{
                            color: "#595959",
                            fontSize: 11,
                            fontFamily: "Poppins_400Regular",
                        }}>Fonte: {fonte}</Text>
                    </View>
                </View>

            </ScrollView>
         {showSnackbar && <SnackbarComponent visible={showSnackbar} setVisible={setShowSnackbar} content={snackbarContent} />}
         {alert.visible && <Alert alert={alert} setAlert={setAlert}/>}
        </>
    );
}