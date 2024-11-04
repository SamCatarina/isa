#!/usr/bin/env python
# coding: utf-8

# In[1]:


import traceback
from flask import Flask, request, jsonify
from flask_cors import CORS
import pandas as pd
import random

app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": "*", "methods": ["GET", "POST", "PUT", "DELETE", "OPTIONS"], "allow_headers": ["Content-Type", "Authorization"]}})

@app.route('/ga_python', methods=['POST'])
def processar_json():
    try:
        dataset = pd.DataFrame(request.json)
        
        if dataset.empty:
            return jsonify({'error': 'Nenhum JSON enviado'}), 400



        # Verifique o tipo de dados antes da transformação
        print("Tipo de dados da coluna 'tags':", dataset['tags'].dtype)

        # Converta strings separadas por vírgulas em listas
        def convert_to_list(value):
            if isinstance(value, str):
                return value.split(',')
            return value

        dataset['tagCons'] = dataset['tagCons'].apply(convert_to_list)
        dataset['tags'] = dataset['tags'].apply(convert_to_list)

        


        # In[4]:


        def grupo_aleatorio(qtd_grupos,qtd_alunos):
            solucao = []
            for i in range(0,qtd_alunos):
                solucao.append(random.randint(1,qtd_grupos))
            return solucao

        def pop_inicial(tamanho_populacao,grupos,qtd_alunos):
            
            populacao_aleatoria = [] #inicial
            
            for i in range(0,tamanho_populacao):
                solucao = grupo_aleatorio(grupos,qtd_alunos)
                populacao_aleatoria.append(solucao)

            return populacao_aleatoria


        # In[5]:


        def sub_grupo(solucao,grupo):
            
            alunos_grupo_x = []
            
            for index,value in enumerate(solucao):
                if value == grupo:
                    alunos_grupo_x.append(index)
            
            return alunos_grupo_x


        # In[6]:


        # Função fitness para avaliar a qualidade de um grupo
        def fitness_grupo(grupo, df, qtd_grupos):
            conhecimento_complementar = 0 # conhecimento de um é a dificuldade de outro
            turno_compativel = 0
            fitness = 0

            # estudante index in df
            for estudante in grupo: 
                # colegas index in df
                for colega in grupo:
                    if df['aluno_id'][estudante] != df['aluno_id'][colega]:
                        for consolidado in df['tagCons'][estudante]:
                            if consolidado in df['tags'][colega]:
                                conhecimento_complementar += 1
                                
                        if df['turno'][estudante] == df['turno'][colega]:
                            turno_compativel += 1

            turno_compativel = turno_compativel/2
            
            tamanho_grupo_ideal = int(len(df)/qtd_grupos)
            diferenca_tamanho = abs(tamanho_grupo_ideal - len(grupo))
            
            fitness = (
                (conhecimento_complementar*0.3) + (turno_compativel*0.3)
                    ) - (diferenca_tamanho*0.4)
            #fitness = (conhecimento_complementar + turno_compativel) - diferenca_tamanho
            #print(fitness)
            
            if len(grupo) < tamanho_grupo_ideal-1:
                if len(grupo) < 2:
                    fitness = fitness - 50
                else:
                    fitness = fitness - 5
            if len(grupo) > tamanho_grupo_ideal+1:
                fitness = fitness - 5
            
            return fitness


        # In[7]:


        # fitness do individuo
        def fitness(solucao,grupos,df):
            
            fitness_individuo = 0
            
            for grupo in range(1,grupos+1):

                alunos_grupo_x = sub_grupo(solucao,grupo)
                fit_temp = fitness_grupo(alunos_grupo_x,df,grupos)
                fitness_individuo += fit_temp

            return fitness_individuo


        # In[8]:


        def fit_populacao(populacao,grupos,df):
            
            fitness_populacao = []

            for solucao in populacao:
                fitness_populacao.append(fitness(solucao,grupos,df))
                
            minimo = min(fitness_populacao)
            maximo = max(fitness_populacao)
            
            fitness_normalizado = []
            for value in fitness_populacao:
                x = (value - minimo)/(maximo - minimo)
                fitness_normalizado.append(x)
            
            return fitness_normalizado


        # In[9]:


        # identifica melhor individuo
        def elitismo(fitness_populacao):
            
            melhor_individuo_index = fitness_populacao.index(max(fitness_populacao))
            
            return melhor_individuo_index


        # In[ ]:


        '''
        def roleta(populacao, aptidoes): 
            
            soma_aptidoes = sum(aptidoes)
            escolha = random.uniform(0, soma_aptidoes)
            acumulado = 0
            
            selecionados = []
            
            selecionados.append(populacao[elitismo(aptidoes)])
            
            for i, aptidao in enumerate(aptidoes):
                acumulado += aptidao
                if acumulado >= escolha:
                    selecionados.append(populacao[i])
                    
            return selecionados
        '''


        # In[27]:


        def roleta(populacao, aptidoes): 
            
            selecionados = []
            selecionados.append(populacao[elitismo(aptidoes)])
            
            soma_aptidoes = sum(aptidoes)
            
            for indice, aptidao in enumerate(aptidoes):

                rand = random.random()

                if rand < aptidao:
                    selecionados.append(populacao[indice])
                    
            #print(len(selecionados))
            return selecionados


        # In[25]:


        '''
        populacao = pop_inicial(tamanho_populacao,grupos,qtd_alunos)
        fitness_populacao = fit_populacao(populacao,grupos,dataset)

        selecionados = roleta(populacao,fitness_populacao)
        '''


        # In[11]:


        def cruzamento_ponto_unico(pai1, pai2):
            assert len(pai1) == len(pai2), "Os pais devem ter o mesmo comprimento"
            ponto_corte = random.randint(1, len(pai1) - 1)
            filho1 = pai1[:ponto_corte] + pai2[ponto_corte:]
            filho2 = pai2[:ponto_corte] + pai1[ponto_corte:]
            return filho1, filho2


        # In[12]:


        def mutacao(individuo, taxa_mutacao):
            for i in range(len(individuo)):
                if random.random() < taxa_mutacao:
                    individuo[i] = random.randint(1, 5)
            return individuo


        # In[13]:


        def gerar_nova_populacao(populacao_temporaria, tamanho_populacao, 
                                taxa_cruzamento, taxa_mutacao):
            
            nova_populacao = []
            
            while len(nova_populacao) < tamanho_populacao:
                pai1, pai2 = random.sample(populacao_temporaria, 2)
                
                if random.random() < taxa_cruzamento:
                    filho1, filho2 = cruzamento_ponto_unico(pai1, pai2)
                else:
                    filho1, filho2 = pai1, pai2
                
                filho1 = mutacao(filho1, taxa_mutacao)
                filho2 = mutacao(filho2, taxa_mutacao)
                
                nova_populacao.append(filho1)
                if len(nova_populacao) < tamanho_populacao:
                    nova_populacao.append(filho2)
            
            return nova_populacao


        # # Start

        # In[14]:


        grupos = 5
        tamanho_populacao = 100
        qtd_alunos = len(dataset)

        tx_crossover = 0.75
        tx_mutacao = 0.01

        # gera populacao inicial
        populacao = pop_inicial(tamanho_populacao,grupos,qtd_alunos)


        # In[28]:


        epocas = 0
        while epocas < 50:
            # calcula fitness da populacao
            fitness_populacao = fit_populacao(populacao,grupos,dataset)
            # selecao por roleta
            selecionados = roleta(populacao,fitness_populacao)
            nova_populacao = gerar_nova_populacao(selecionados, tamanho_populacao, 
                                tx_crossover, tx_mutacao)
            populacao = nova_populacao
            
            epocas += 1


        # In[29]:


        fitness_populacao = fit_populacao(populacao,grupos,dataset)
        melhor_indice = elitismo(fitness_populacao)
        print("Melhor fitness: {}".format(fitness_populacao[melhor_indice]))
        print("Melhor indivíduo: {}".format(populacao[melhor_indice]))


        # # visualizar melhor indivíduo

        # In[17]:


        def elementos_por_grupo(individuo,grupos,df):
            for i in range(1,grupos+1):
                print("\nGrupo {}".format(i))
                grupo = sub_grupo(individuo,i)
        
                for estudante in grupo:
                    print(df.loc[estudante])


        # In[18]:


        elementos_por_grupo(populacao[melhor_indice],grupos,dataset)

        melhor_solucao = populacao[melhor_indice]
        # In[ ]:
        def organizar_grupos(solucao, df):
            grupos = {}
            for grupo in range(1, max(solucao) + 1):
                grupos[grupo] = df.loc[sub_grupo(solucao, grupo)].to_dict(orient='records')
            return grupos

        grupos_formados = organizar_grupos(melhor_solucao, dataset)

        return jsonify(grupos_formados)

    
    except Exception as e:
        print("traceback:", traceback.format_exc())
        return jsonify({'error': str(e)}), 500




if __name__ == '__main__':
    app.run(debug=True)
