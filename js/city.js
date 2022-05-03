const debugMode = false;

const canvas = document.getElementById('area');
const context = canvas.getContext('2d');
//const heightRatio = 1;
//canvas.height = canvas.width * heightRatio;

// Variáveis globais
const SCREEN_WIDTH = 20;
const SCREEN_HEIGHT = 20;
const TALE_SIZE = 1;
const RUAS_EXTRAS = 2;
const INDICES_ENTRADAS = [4, 5, 6, 7, 8];
const TAMANHOS_RUAS = [4, 7, 10, 13, 16, 19];
const QUADRANTES = ['A', 'B', 'C', 'D'];

// Estrutura da cidade
let cidade = {
  lado1: new Array(SCREEN_HEIGHT/2),
  lado2: new Array(SCREEN_HEIGHT/2),
  lado3: new Array(SCREEN_WIDTH/2),
  lado4: new Array(SCREEN_WIDTH/2),
  lado5: new Array(SCREEN_HEIGHT/2),
  lado6: new Array(SCREEN_HEIGHT/2),
  lado7: new Array(SCREEN_WIDTH/2),
  lado8: new Array(SCREEN_WIDTH/2),
  terreno: {},
  ruas: {
    x: {},
    y: {}
  }
}

// Matriz do terreno (HEIGHT x WIDTH)
cidade.terreno = new Array(SCREEN_HEIGHT);
for (var i = 0; i < SCREEN_HEIGHT; i++) {
  cidade.terreno[i] = new Array(SCREEN_WIDTH);
  for (var j = 0; j < SCREEN_WIDTH; j++) {
    cidade.terreno[i][j] = 0;
  }
}

//////////////////////////////////////////////////////////////////////////////
var quadranteFerrovia = sorteia([0, 1, 2, 3]);
var indiceFerrovia = sorteia(INDICES_ENTRADAS);

iniciarRuasFerrovias(quadranteFerrovia, indiceFerrovia, RUAS_EXTRAS);
continuarRuasFerrovias(reordena(TAMANHOS_RUAS));
completaFerrovia(quadranteFerrovia, indiceFerrovia);
exibeTerreno(completaRuas(transpose(cidade.terreno)));
//////////////////////////////////////////////////////////////////////////////

// Cria pontos iniciais das ruas e ferrovias
function iniciarRuasFerrovias(quadranteFerrovia, indiceFerrovia, numRuasExtras) {
  
  // Quadrante A (ruas da borda)
  cidade.terreno[SCREEN_WIDTH- 2][2] = 2;
  cidade.terreno[SCREEN_WIDTH - 2][1] = 2;
  cidade.terreno[SCREEN_WIDTH - 3][1] = 2;
  
  // Quadrante B (ruas da borda)
  cidade.terreno[2][1] = 2;
  cidade.terreno[1][1] = 2;
  cidade.terreno[1][2] = 2;
  
  // Quadrante C (ruas da borda)
  cidade.terreno[1][SCREEN_HEIGHT - 3] = 2;
  cidade.terreno[1][SCREEN_HEIGHT - 2] = 2;
  cidade.terreno[2][SCREEN_HEIGHT - 2] = 2;
  
  // Quadrante D (ruas da borda)
  cidade.terreno[SCREEN_WIDTH - 3][SCREEN_HEIGHT - 2] = 2;
  cidade.terreno[SCREEN_WIDTH - 2][SCREEN_HEIGHT - 2] = 2;
  cidade.terreno[SCREEN_WIDTH - 2][SCREEN_HEIGHT - 3] = 2;
 
  // Quadrante A (ruas internas)
  if (QUADRANTES[quadranteFerrovia] == "A") {
 
    // Ferrovias (1 e 4)
    cidade.lado1[indiceFerrovia] = -1;
    cidade.lado4[indiceFerrovia] = -1;

    // Ruas opostas (2 e 5)
    var indiceRua = sorteia(INDICES_ENTRADAS);
    cidade.lado2[indiceRua] = 2;
    cidade.lado5[sorteiaDepois(indiceRua)] = 2;
  
    // Ruas opostas (3 e 8)
    indiceRua = sorteia(INDICES_ENTRADAS);
    cidade.lado3[indiceRua] = 2;
    cidade.lado8[sorteiaDepois(indiceRua)] = 2;
  
    // Rua oposta à ferrovia 1 (6)
    cidade.lado6[sorteiaDepois(indiceFerrovia)] = 2;
  
    // Rua oposta à ferrovia 4 (8)
    cidade.lado7[sorteiaDepois(indiceFerrovia)] = 2;

  }
  
  // Quadrante B (ruas internas)
  if (QUADRANTES[quadranteFerrovia] == "B") {
 
    // Ferrovias (2 e 7)
    cidade.lado2[indiceFerrovia] = -1;
    cidade.lado7[indiceFerrovia] = -1;

    // Ruas opostas (1 e 6)
    var indiceRua = sorteia(INDICES_ENTRADAS);
    cidade.lado1[indiceRua] = 2;
    cidade.lado6[sorteiaDepois(indiceRua)] = 2;
  
    // Ruas opostas (3 e 8)
    indiceRua = sorteia(INDICES_ENTRADAS);
    cidade.lado3[indiceRua] = 2;
    cidade.lado8[sorteiaDepois(indiceRua)] = 2;
  
    // Rua oposta à ferrovia 2 (5)
    cidade.lado5[sorteiaDepois(indiceFerrovia)] = 2;
  
    // Rua oposta à ferrovia 7 (4)
    cidade.lado4[sorteiaDepois(indiceFerrovia)] = 2;

  }
  
  // Quadrante C (ruas internas)
  if (QUADRANTES[quadranteFerrovia] == "C") {
 
    // Ferrovias (5 e 8)
    cidade.lado5[indiceFerrovia] = -1;
    cidade.lado8[indiceFerrovia] = -1; 

    // Ruas opostas (1 e 6)
    var indiceRua = sorteia(INDICES_ENTRADAS);
    cidade.lado1[indiceRua] = 2;
    cidade.lado6[sorteiaDepois(indiceRua)] = 2;
  
    // Ruas opostas (4 e 7)
    indiceRua = sorteia(INDICES_ENTRADAS);
    cidade.lado4[indiceRua] = 2;
    cidade.lado7[sorteiaDepois(indiceRua)] = 2;
  
    // Rua oposta à ferrovia 5 (2)
    cidade.lado2[sorteiaDepois(indiceFerrovia)] = 2;
  
    // Rua oposta à ferrovia 8 (3)
    cidade.lado3[sorteiaDepois(indiceFerrovia)] = 2;

  }

  // Quadrante D (ruas internas)
  if (QUADRANTES[quadranteFerrovia] == "D") {
 
    // Ferrovias (6 e 3)
    cidade.lado6[indiceFerrovia] = -1;
    cidade.lado3[indiceFerrovia] = -1;

    // Ruas opostas (2 e 5)
    var indiceRua = sorteia(INDICES_ENTRADAS);
    cidade.lado2[indiceRua] = 2;
    cidade.lado5[sorteiaDepois(indiceRua)] = 2;
  
    // Ruas opostas (4 e 7)
    indiceRua = sorteia(INDICES_ENTRADAS);
    cidade.lado4[indiceRua] = 2;
    cidade.lado7[sorteiaDepois(indiceRua)] = 2;
  
    // Rua oposta à ferrovia 6 (1)
    cidade.lado1[sorteiaDepois(indiceFerrovia)] = 2;
  
    // Rua oposta à ferrovia 3 (8)
    cidade.lado8[sorteiaDepois(indiceFerrovia)] = 2;

  }
  
  // Ruas extras
  var sorteados = reordena([1, 2, 3, 4, 5, 6, 7, 8]); 
  for (var i = 0; i < numRuasExtras; i++) {
    
    if (sorteados[i] == 1) {
      cidade.terreno[SCREEN_WIDTH - 2][0] = 2;
      if (debugMode) {console.log("1 sorteado (rua extra)")};
    }
    
    if (sorteados[i] == 2) {
      cidade.terreno[1][0] = 2;
      if (debugMode) {console.log("2 sorteado (rua extra)")};
    }
    
    if (sorteados[i] == 3) {
      cidade.terreno[0][1] = 2;
      if (debugMode) {console.log("3 sorteado (rua extra)")};
    }
    
    if (sorteados[i] == 4) {
      cidade.terreno[0][SCREEN_HEIGHT - 2] = 2;
      if (debugMode) {console.log("4 sorteado (rua extra)")};
    }
    
    if (sorteados[i] == 5) {
      cidade.terreno[1][SCREEN_HEIGHT - 1] = 2;
      if (debugMode) {console.log("5 sorteado (rua extra)")};
    }
    
    if (sorteados[i] == 6) {
      cidade.terreno[SCREEN_WIDTH - 2][SCREEN_HEIGHT - 1] = 2;
      if (debugMode) {console.log("6 sorteado (rua extra)")};
    }
    
    if (sorteados[i] == 7) {
      cidade.terreno[SCREEN_WIDTH - 1][SCREEN_HEIGHT - 2] = 2;
      if (debugMode) {console.log("7 sorteado (rua extra)")};
    }
    
    if (sorteados[i] == 8) {
      cidade.terreno[SCREEN_WIDTH - 1][1] = 2;
      if (debugMode) {console.log("8 sorteado (rua extra)")};
    }

  }
}

// Prrenche ruas e ferrovias de acordo com sua extensão
function continuarRuasFerrovias(tamanho) {
  
  var indice = 0;
  
  // LADO 1
  if (cidade.lado1.indexOf(-1) > 0) {
    cidade.terreno[SCREEN_HEIGHT - 1 - cidade.lado1.indexOf(-1)][0] = -1;
    cidade.ruas.x[0] = 0;
    cidade.ruas.y[0] = 0;
    
    if (debugMode) {console.log("L1 (F) = " + cidade.lado1.indexOf(-1))};
    
  } else {
    if (cidade.lado1.indexOf(2) > 0) {
      for (var i = 0; i < tamanho[indice]; i++) {
        cidade.terreno[SCREEN_HEIGHT - 1 - cidade.lado1.indexOf(2)][i] = 2;
      }
      cidade.ruas.x[0] = tamanho[indice] - 1;
      cidade.ruas.y[0] = SCREEN_HEIGHT - 1 - cidade.lado1.indexOf(2);
      
      if (debugMode) {console.log("L1 (R) = " + cidade.lado1.indexOf(2) + " (tam = " + tamanho[indice] + ")  " + cidade.ruas.x[0] + " x " + cidade.ruas.y[0])};
      indice++;
    }
  }
  
  // LADO 2
  if (cidade.lado2.indexOf(-1) > 0) {
    cidade.terreno[cidade.lado2.indexOf(-1)][0] = -1;
    cidade.ruas.x[1] = 0;
    cidade.ruas.y[1] = 0;
    
    if (debugMode) {console.log("L2 (F) = " + cidade.lado2.indexOf(-1))};
    
  } else {
    if (cidade.lado2.indexOf(2) > 0) {
      for (var i = 0; i < tamanho[indice]; i++) {
        cidade.terreno[cidade.lado2.indexOf(2)][i] = 2;
      }
      cidade.ruas.x[1] = tamanho[indice] - 1;
      cidade.ruas.y[1] = cidade.lado2.indexOf(2);
      
      if (debugMode) {console.log("L2 (R) = " + cidade.lado2.indexOf(2) + " (tam = " + tamanho[indice] + ")  " + cidade.ruas.x[1] + " x " + cidade.ruas.y[1])};
      indice++;
    }
  }
  
  // LADO 3
  if (cidade.lado3.indexOf(-1) > 0) {
    cidade.terreno[0][cidade.lado3.indexOf(-1)] = -1;
    cidade.ruas.x[2] = 0;
    cidade.ruas.y[2] = 0;
    
    if (debugMode) {console.log("L3 (F) = " + cidade.lado3.indexOf(-1))};
    
  } else {
    if (cidade.lado3.indexOf(2) > 0) {
      for (var i = 0; i < tamanho[indice]; i++) {
        cidade.terreno[i][cidade.lado3.indexOf(2)] = 2;
      }   
      cidade.ruas.x[2] = cidade.lado3.indexOf(2);
      cidade.ruas.y[2] = tamanho[indice] - 1;
      
      if (debugMode) {console.log("L3 (R) = " + cidade.lado3.indexOf(2) + " (tam = " + tamanho[indice] + ")  " + cidade.ruas.x[2] + " x " + cidade.ruas.y[2])};
      indice++;
    }
  }
  
  // LADO 4
  if (cidade.lado4.indexOf(-1) > 0) {
    cidade.terreno[0][SCREEN_WIDTH - 1 - cidade.lado4.indexOf(-1)] = -1;
    cidade.ruas.x[3] = 0;
    cidade.ruas.y[3] = 0;
    
    if (debugMode) {console.log("L4 (F) = " + cidade.lado4.indexOf(-1))};
    
  } else {
    if (cidade.lado4.indexOf(2) > 0) {
      for (var i = 0; i < tamanho[indice]; i++) {
        cidade.terreno[i][SCREEN_WIDTH - 1 - cidade.lado4.indexOf(2)] = 2;
      }  
      cidade.ruas.x[3] = SCREEN_WIDTH - 1 - cidade.lado4.indexOf(2);
      cidade.ruas.y[3] = tamanho[indice] - 1;
      
      if (debugMode) {console.log("L4 (R) = " + cidade.lado4.indexOf(2) + " (tam = " + tamanho[indice] + ")  " + cidade.ruas.x[3] + " x " + cidade.ruas.y[3])};      
      indice++;
    }
  }

  // LADO 5
  if (cidade.lado5.indexOf(-1) > 0) {
    cidade.terreno[cidade.lado5.indexOf(-1)][SCREEN_WIDTH - 1] = -1;
    cidade.ruas.x[4] = 0;
    cidade.ruas.y[4] = 0;
    
    if (debugMode) {console.log("L5 (F) = " + cidade.lado5.indexOf(-1))};
    
  } else {
    if (cidade.lado5.indexOf(2) > 0) {
      for (var i = 0; i < tamanho[indice]; i++) {
        cidade.terreno[cidade.lado5.indexOf(2)][SCREEN_WIDTH - 1 - i] = 2;
      }   
      cidade.ruas.x[4] = SCREEN_WIDTH - tamanho[indice];
      cidade.ruas.y[4] = cidade.lado5.indexOf(2);
      
      if (debugMode) {console.log("L5 (R) = " + cidade.lado5.indexOf(2) + " (tam = " + tamanho[indice] + ")  " + cidade.ruas.x[4] + " x " + cidade.ruas.y[4])}; 
      indice++;
    }
  }
  
  // LADO 6
  if (cidade.lado6.indexOf(-1) > 0) {
    cidade.terreno[SCREEN_HEIGHT - 1 - cidade.lado6.indexOf(-1)][SCREEN_WIDTH - 1] = -1;
    cidade.ruas.x[5] = 0;
    cidade.ruas.y[5] = 0;
    
    if (debugMode) {console.log("L6 (F) = " + cidade.lado6.indexOf(-1))};
    
  } else {
    if (cidade.lado6.indexOf(2) > 0) {
      for (var i = 0; i < tamanho[indice]; i++) {
        cidade.terreno[SCREEN_HEIGHT - 1 - cidade.lado6.indexOf(2)][SCREEN_WIDTH - 1 - i] = 2;
      }  
      cidade.ruas.x[5] = SCREEN_WIDTH - tamanho[indice];
      cidade.ruas.y[5] = SCREEN_HEIGHT - 1 - cidade.lado6.indexOf(2);
      
      if (debugMode) {console.log("L6 (R) = " + cidade.lado6.indexOf(2) + " (tam = " + tamanho[indice] + ")  " + cidade.ruas.x[5] + " x " + cidade.ruas.y[5])}; 
      indice++;
    }
  }
  
  // LADO 7
  if (cidade.lado7.indexOf(-1) > 0) {
    cidade.terreno[SCREEN_HEIGHT - 1][SCREEN_WIDTH - 1 - cidade.lado7.indexOf(-1)] = -1;
    cidade.ruas.x[6] = 0;
    cidade.ruas.y[6] = 0;
    
    if (debugMode) {console.log("L7 (F) = " + cidade.lado7.indexOf(-1))};
    
  } else {
    if (cidade.lado7.indexOf(2) > 0) {
      for (var i = 0; i < tamanho[indice]; i++) {
        cidade.terreno[SCREEN_HEIGHT - 1 - i][SCREEN_WIDTH - 1 - cidade.lado7.indexOf(2)]  = 2;
      }
      cidade.ruas.x[6] = SCREEN_WIDTH - 1 - cidade.lado7.indexOf(2);
      cidade.ruas.y[6] = SCREEN_HEIGHT - tamanho[indice]; 
      
      if (debugMode) {console.log("L7 (R) = " + cidade.lado7.indexOf(2) + " (tam = " + tamanho[indice] + ")  " + cidade.ruas.x[6] + " x " + cidade.ruas.y[6])}; 
      indice++;
    }
  }
  
  // LADO 8
  if (cidade.lado8.indexOf(-1) > 0) {
    cidade.terreno[SCREEN_HEIGHT - 1][cidade.lado8.indexOf(-1)] = -1;
    cidade.ruas.x[7] = 0;
    cidade.ruas.y[7] = 0;
    
    if (debugMode) {console.log("L8 (F) = " + cidade.lado8.indexOf(-1))};
    
  } else {
    if (cidade.lado8.indexOf(2) > 0) {
      for (var i = 0; i < tamanho[indice]; i++) {
        cidade.terreno[SCREEN_HEIGHT - 1 - i][cidade.lado8.indexOf(2)]  = 2;
      }  
      cidade.ruas.x[7] = cidade.lado8.indexOf(2);
      cidade.ruas.y[7] = SCREEN_HEIGHT - tamanho[indice];
      
      if (debugMode) {console.log("L8 (R) = " + cidade.lado8.indexOf(2) + " (tam = " + tamanho[indice] + ")  " + cidade.ruas.x[7] + " x " + cidade.ruas.y[7])}; 
      indice++;
    }
  }
  
}

// Completa a ferrovia de ponta a ponta
function completaFerrovia(quadranteFerrovia, indiceFerrovia) {
  if (QUADRANTES[quadranteFerrovia] == "A"){
    var j = 0;
    for (var i = SCREEN_WIDTH - 1 - indiceFerrovia - 1; i > 0; i--) {
      j++;
      cidade.terreno[i][j] = -1;
    }
  }
  if (QUADRANTES[quadranteFerrovia] == "B"){
    var j = 0;
    for (var i = indiceFerrovia + 1; i < SCREEN_HEIGHT; i++) {
      j++;
      cidade.terreno[i][j] = -1;
    }
  }
  if (QUADRANTES[quadranteFerrovia] == "C"){
    var j = SCREEN_HEIGHT - 1;
    for (var i = indiceFerrovia + 1; i < SCREEN_WIDTH; i++) {
      j--;
      cidade.terreno[i][j] = -1;
    }
  }
  if (QUADRANTES[quadranteFerrovia] == "D"){
    var j = SCREEN_HEIGHT - 1;
    for (var i = SCREEN_WIDTH - 1 - indiceFerrovia - 1; i > 0; i--) {
      j--;
      cidade.terreno[i][j] = -1;
    }
  }
}

// Completa cada rua até encontrar outra
function completaRuas(matriz) {

  // Ruas internas
  for (var n = 0; n < 8; n++) {
    
    var esquerda = {
      x: null,
      y: null
    };
    var direita = {
      x: null,
      y: null
    };
    var frente = {
      x: null,
      y: null
    };
    
    if (cidade.ruas.x[n] > 0 && cidade.ruas.y[n] > 0)  {
      
      if (n == 0 || n == 1) {
        if (debugMode) {console.log(`Entrou na rua ${n+1}`)};
                
        frente.x = cidade.ruas.x[n] + 1;      
        esquerda.x = cidade.ruas.x[n];
        direita.x = cidade.ruas.x[n];
        
        frente.y = cidade.ruas.y[n];      
        esquerda.y = cidade.ruas.y[n] - 1;
        direita.y = cidade.ruas.y[n] + 1;
        
        for (var i = 0; i < SCREEN_WIDTH; i++) {
          
          // chegou no limite
          if (frente.x == SCREEN_WIDTH - 1) {
            if (matriz[direita.x][direita.y] <= 0) {
              if (matriz[direita.x][direita.y] == 0) {matriz[direita.x][direita.y] = 3};
              if (debugMode) {console.log("...horario: " + direita.x + " x " + direita.y)};
              direita.y++;
              while (matriz[direita.x][direita.y] <= 0) {
                if (debugMode) {console.log("...horario: " + direita.x + " x " + direita.y)};
                if (matriz[direita.x][direita.y] == 0) {matriz[direita.x][direita.y] = 3};
                direita.y++;
              }
            }
          } else {
            if (matriz[esquerda.x][esquerda.y] <= 0 && matriz[direita.x][direita.y] <= 0 && matriz[frente.x][frente.y] <= 0) {
              if (matriz[frente.x][frente.y] == 0) {matriz[frente.x][frente.y] = 3};
              if (debugMode) {console.log("...andou: " + frente.x + " x " + frente.y)};
              frente.x++;
              esquerda.x++;
              direita.x++;
            } else {
              if (debugMode) {console.log(`Saiu da rua ${n+1}`)};
              break;
            }
          }
        }
      }
   
      if (n == 2 || n == 3) {
        if (debugMode) {console.log(`Entrou na rua ${n+1}`)};
        
        frente.x = cidade.ruas.x[n];      
        esquerda.x = cidade.ruas.x[n] + 1;
        direita.x = cidade.ruas.x[n] - 1;
        
        frente.y = cidade.ruas.y[n] + 1;      
        esquerda.y = cidade.ruas.y[n];
        direita.y = cidade.ruas.y[n];
        
        for (var i = 0; i < SCREEN_HEIGHT; i++) {
          
          // chegou no limite
          if (frente.y == SCREEN_HEIGHT - 1) {
            if (matriz[direita.x][direita.y] <= 0) {
              if (matriz[direita.x][direita.y] == 0) {matriz[direita.x][direita.y] = 3};
              if (debugMode) {console.log("...horario: " + direita.x + " x " + direita.y)};
              direita.x--;
              while (matriz[direita.x][direita.y] <= 0) {
                if (debugMode) {console.log("...horario: " + direita.x + " x " + direita.y)};
                if (matriz[direita.x][direita.y] == 0) {matriz[direita.x][direita.y] = 3};
                direita.x--;
              }
            }
          } else {
            if (matriz[esquerda.x][esquerda.y] <= 0 && matriz[direita.x][direita.y] <= 0 && matriz[frente.x][frente.y] <= 0) {
              if (matriz[frente.x][frente.y] == 0) {matriz[frente.x][frente.y] = 3};
              if (debugMode) {console.log("...andou: " + frente.x + " x " + frente.y)};
              frente.y++;
              esquerda.y++;
              direita.y++;
            } else {
              if (debugMode) {console.log(`Saiu da rua ${n+1}`)};
              break;
            }
          }
        }
      }
     
      if (n == 4 || n == 5) {
        if (debugMode) {console.log(`Entrou na rua ${n+1}`)};
                
        frente.x = cidade.ruas.x[n] - 1;      
        esquerda.x = cidade.ruas.x[n];
        direita.x = cidade.ruas.x[n];
        
        frente.y = cidade.ruas.y[n];      
        esquerda.y = cidade.ruas.y[n] + 1;
        direita.y = cidade.ruas.y[n] - 1;
        
        for (var i = 0; i < SCREEN_WIDTH; i++) {
          
          // chegou no limite
          if (frente.x == 0) {
            if (matriz[direita.x][direita.y] <= 0) {
              if (matriz[direita.x][direita.y] == 0) {matriz[direita.x][direita.y] = 3};
              if (debugMode) {console.log("...horario: " + direita.x + " x " + direita.y)};
              direita.y--;
              while (matriz[direita.x][direita.y] <= 0) {
                if (debugMode) {console.log("...horario: " + direita.x + " x " + direita.y)};
                if (matriz[direita.x][direita.y] == 0) {matriz[direita.x][direita.y] = 3};
                direita.y--;
              }
            }
          } else {
            if (matriz[esquerda.x][esquerda.y] <= 0 && matriz[direita.x][direita.y] <= 0 && matriz[frente.x][frente.y] <= 0) {
              if (matriz[frente.x][frente.y] == 0) {matriz[frente.x][frente.y] = 3};
              if (debugMode) {console.log("...andou: " + frente.x + " x " + frente.y)};
              frente.x--;
              esquerda.x--;
              direita.x--;
            } else {
              if (debugMode) {console.log(`Saiu da rua ${n+1}`)};
              break;
            }
          }
        }
      }
   
      if (n == 6 || n == 7) {
        if (debugMode) {console.log(`Entrou na rua ${n+1}`)};
        
        frente.x = cidade.ruas.x[n];      
        esquerda.x = cidade.ruas.x[n] - 1;
        direita.x = cidade.ruas.x[n] + 1;
        
        frente.y = cidade.ruas.y[n] - 1;      
        esquerda.y = cidade.ruas.y[n];
        direita.y = cidade.ruas.y[n];
        
        for (var i = 0; i < SCREEN_HEIGHT; i++) {
          
          // chegou no limite
          if (frente.y == 0) {
            if (matriz[direita.x][direita.y] <= 0) {
              if (matriz[direita.x][direita.y] == 0) {matriz[direita.x][direita.y] = 3};
              if (debugMode) {console.log("...horario: " + direita.x + " x " + direita.y)};
              direita.x++;
              while (matriz[direita.x][direita.y] <= 0) {
                if (debugMode) {console.log("...horario: " + direita.x + " x " + direita.y)};
                if (matriz[direita.x][direita.y] == 0) {matriz[direita.x][direita.y] = 3};
                direita.x++;
              }
            }
          } else {
            if (matriz[esquerda.x][esquerda.y] <= 0 && matriz[direita.x][direita.y] <= 0 && matriz[frente.x][frente.y] <= 0) {
              if (matriz[frente.x][frente.y] == 0) {matriz[frente.x][frente.y] = 3};
              if (debugMode) {console.log("...andou: " + frente.x + " x " + frente.y)};
              frente.y--;
              esquerda.y--;
              direita.y--;
            } else {
              if (debugMode) {console.log(`Saiu da rua ${n+1}`)};
              break;
            }
          }
        }
      }        
    } else {
      if (debugMode) {console.log(`Entrada ${n+1} tem ferrovia`)};
    }
  }
  
  // Ruas do canto
  var borda = {
    x: null,
    y: null
  };
  
  // Borda 1
  borda.x = 1;      
  borda.y = SCREEN_HEIGHT - 4;          
  while (matriz[borda.x][borda.y] <= 0) {
    if (matriz[borda.x][borda.y] == 0) {matriz[borda.x][borda.y] = 4};
   if (debugMode) {console.log("...borda: " + borda.x + " x " + borda.y)};
    borda.y--;
  }
  if (debugMode) {console.log("Borda 1: OK")};
    
  // Borda 2
  borda.x = 1;      
  borda.y = 3;          
  while (matriz[borda.x][borda.y] <= 0) {
    if (matriz[borda.x][borda.y] == 0) {matriz[borda.x][borda.y] = 4};
    if (debugMode) {console.log("...borda: " + borda.x + " x " + borda.y)};
    borda.y++;
  }
  if (debugMode) {console.log("Borda 2: OK")};
            
  // Borda 3
  borda.x = 3;      
  borda.y = 1;          
  while (matriz[borda.x][borda.y] <= 0) {
    if (matriz[borda.x][borda.y] == 0) {matriz[borda.x][borda.y] = 4};
    if (debugMode) {console.log("...borda: " + borda.x + " x " + borda.y)};
    borda.x++;
  }
  if (debugMode) {console.log("Borda 3: OK")};      
  
  // Borda 4
  borda.x = SCREEN_HEIGHT - 4;      
  borda.y = 1;          
  while (matriz[borda.x][borda.y] <= 0) {
    if (matriz[borda.x][borda.y] == 0) {matriz[borda.x][borda.y] = 4};
    if (debugMode) {console.log("...borda: " + borda.x + " x " + borda.y)};
    borda.x--;
  }
  if (debugMode) {console.log("Borda 4: OK")};      
    
  // Borda 5
  borda.x = SCREEN_WIDTH - 2;      
  borda.y = 3;          
  while (matriz[borda.x][borda.y] <= 0) {
    if (matriz[borda.x][borda.y] == 0) {matriz[borda.x][borda.y] = 4};
    if (debugMode) {console.log("...borda: " + borda.x + " x " + borda.y)};
    borda.y++;
  }
  if (debugMode) {console.log("Borda 5: OK")};    
  
  // Borda 6
  borda.x = SCREEN_WIDTH - 2;      
  borda.y = SCREEN_HEIGHT - 4;          
  while (matriz[borda.x][borda.y] <= 0) {
    if (matriz[borda.x][borda.y] == 0) {matriz[borda.x][borda.y] = 4};
    if (debugMode) {console.log("...borda: " + borda.x + " x " + borda.y)};
    borda.y--;
  }
  if (debugMode) {console.log("Borda 6: OK")};  
  
  // Borda 7
  borda.x = SCREEN_WIDTH - 4;      
  borda.y = SCREEN_HEIGHT - 2;          
  while (matriz[borda.x][borda.y] <= 0) {
    if (matriz[borda.x][borda.y] == 0) {matriz[borda.x][borda.y] = 4};
    if (debugMode) {console.log("...borda: " + borda.x + " x " + borda.y)};
    borda.x--;
  }
  if (debugMode) {console.log("Borda 7: OK")};  
  
  // Borda 8
  borda.x = 3;      
  borda.y = SCREEN_HEIGHT - 2;          
  while (matriz[borda.x][borda.y] <= 0) {
    if (matriz[borda.x][borda.y] == 0) {matriz[borda.x][borda.y] = 4};
    if (debugMode) {console.log("...borda: " + borda.x + " x " + borda.y)};
    borda.x++;
  }
  if (debugMode) {console.log("Borda 8: OK")};  
 
  return matriz;
}

// Mostra o terreno completo na tela
function exibeTerreno(matriz) {
  
  for (var i = 0; i < SCREEN_HEIGHT; i++) {
    for (var j = 0; j < SCREEN_WIDTH; j++) {
      if (matriz[i][j] == -1) {
        context.fillStyle = 'red';
      } else {
        if (matriz[i][j] == 2) {
          context.fillStyle = 'blue';
        } else {
          if (matriz[i][j] == 3) {
            //context.fillStyle = 'black';
            context.fillStyle = 'blue';
          } else {
            if (matriz[i][j] == 4) {
              //context.fillStyle = 'green';
              context.fillStyle = 'blue';
            } else {
              context.fillStyle = 'yellow';
            }
          }
        }
      }
      context.fillRect(i, j, TALE_SIZE, TALE_SIZE);
    }
  }
  if (debugMode) {
    console.log(cidade.terreno);
  }
}

function sorteia(o) {
  for (var j, x, i = o.length; i; j = Math.floor(Math.random() * i), x = o[--i], o[i] = o[j], o[j] = x);
  return o[0];
}

function reordena(o) {
  for (var j, x, i = o.length; i; j = Math.floor(Math.random() * i), x = o[--i], o[i] = o[j], o[j] = x);
  return o;
}

function sorteiaDepois(num) {
  var sorteado = -1;
  if (num == 4) {
    sorteado = sorteia([4, 6, 7, 8]);
  }
  if (num == 5) {
    sorteado = sorteia([5, 7, 8]);
  }
  if (num == 6) {
    sorteado = sorteia([4, 6, 8]);
  }
  if (num == 7) {
    sorteado = sorteia([4, 5, 7]);
  }
  if (num == 8) {
    sorteado = sorteia([4, 5, 6, 8]);
  }
  return sorteado;
}

function transpose(matrix) {
  return Object.keys(matrix[0])
    .map(colNumber => matrix.map(rowNumber => rowNumber[colNumber]));
}
