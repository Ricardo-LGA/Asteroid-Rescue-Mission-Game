const FPS = 30; // Frames per Seecond ***Testar mais de 30 depois.
//
const LASER_MAX = 10; // Número máximo de "lasers" na tela ao mesmo tempo
const LASER_SPD = 700; // Velocidade dos "lasers" em pixels por segundo
const LASER_DIST = 0.7 // Distância máxima "lasers" podem viajar, fração da Screen Width
const LASER_EXPLODE_DUR = 0.1; // Duração da explosão do laser e segundos
//
const ROID_PTS_LGE = 20; // Pontos adquiridos do asteroide large
const ROID_PTS_MED = 50; // Pontos adquiridos do asteroide medium
const ROID_PTS_SML = 100; // Pontos adquiridos do asteroide small
const ROID_JAG = 0.4; // Irregularidade de polígonos dos asteroides // 0 = nenhum / 1 = muito irregular
const ROID_NUM = 15; // Número inicial de asteroides
const ROID_SIZE = 100; // Tamanho inicial em pixels dos asteroides
const ROID_SPD = 50; // Velocidade inicial dos asteroides em pixels por segundo
const ROID_VERT = 10; // Número médio de vértices em cada asteroide
//
const ASTRO_PTS = 50;
const CIRCLE_NUM = 1;
let CIRCLE_SIZE = 65;
//
const FRICTION = 0.8; // Fricção do espaço // 0 = sem fricção / 1 = muita fricção
const SHIP_EXPLODE_DUR = 0.3; // Duração da explosão da nave
const SHIP_BLINK_DUR = 0.1; // Duração da nave invulnerável(piscando) em segundos
const SHIP_INV_DUR = 6; // Duração em segundos da invisibilidade da nave após explosão
const SHIP_SIZE = 65; // Altura da nave em pixels.
const SHIP_THRUST = 2.0; // Aceleração da nave em pixels por segundo(5 + 5 + 5 + 5... Enquanto segurar a tecla W)
const TURN_SPEED = 120; // Velocidade de curvas, em graus por segundo.
//
const SHOW_BOUNDING = true; // Mostrar ou esconder a área de colisão de asteroides com a nave
//
const TEXT_FADE_TIME = 2 // Efeito Fade no texto em segundos
const TEXT_SIZE = 40 // Altura da fonte em pixels
const GAME_LIVES = 3 // Número de vidas inicial
//
const SAVE_KEY_SCORE = "highscore"  // Chave de save para o best score

/** @type {HTMLCanvasElement} */
let canv = document.querySelector("#projectCanvas");
let context = canv.getContext("2d");
let context2 = canv.getContext("2d");


let astronaut = new Image();
astronaut.src = 'assets/images/astro3.png'

window.onload = function () {
  context.fillStyle = "black";
  context.fillRect(0, 0, canv.width, canv.height);
}

function drawImage(src,x,y,w,h) {
context.drawImage(src,x,y,w,h);
}

// Configurar parametros de jogo
let level, lives, circles, roids, score, scoreHigh, ship, text, textAlpha;
newGame();


// Configurando Nave(objeto):


// {
//     x: canv.width / 2,
//     y: canv.height / 2,
//     r: SHIP_SIZE / 3.5,
//     a: Math.random() * 90 * Math.PI, // Converter para "Radians" // 0º é para direita, 90º é para cima
//     //Math.random usado para que a posição da nave nunca seja igual quando o jogo começar.
//     explodeTime: 0,
//     rot: 0, // Rotacionar
//     thrusting: false,
//     thrust: {
//         x: 0,
//         y: 0 // Isso faz com que mesmo que deixes de pressionar para frente vai continuar a avançar naquela
//         // mesma direção.
//     }
// };

// Configurando os asteroides




// Configurando addEventListener para detectar movimentos

document.addEventListener("keydown", keyDown);
document.addEventListener("keyup", keyUp);

// Loop para animações:

setInterval(update, 1000 / FPS);




function createAsteroidBelt() {
  roids = [];
  let x, y;
  for (let i = 0; i < ROID_NUM + level; i++) {
      // random asteroid location (not touching spaceship)
      do {
          x = Math.floor(Math.random() * canv.width);
          y = Math.floor(Math.random() * canv.height);
      } while (distBetweenPoints(ship.x, ship.y, x, y) < ROID_SIZE * 2 + ship.r);
      roids.push(newAsteroid(x, y, Math.ceil(ROID_SIZE / 2)));
  }
}

function destroyAsteroid(index) {
  let x = roids[index].x;
  let y = roids[index].y;
  let r = roids[index].r;

  // Dividir asteroides se for necessário
  if (r == Math.ceil(ROID_SIZE / 2)) { // Asteroide Grande/Large
      roids.push(newAsteroid(x, y, Math.ceil(ROID_SIZE / 4)));
      roids.push(newAsteroid(x, y, Math.ceil(ROID_SIZE / 4)));
      score += ROID_PTS_LGE
  } else if (r == Math.ceil(ROID_SIZE / 4)) { // Asteroide Médio 
      roids.push(newAsteroid(x, y, Math.ceil(ROID_SIZE / 8)));
      roids.push(newAsteroid(x, y, Math.ceil(ROID_SIZE / 8)));
      score += ROID_PTS_MED
  } else {
    score += ROID_PTS_SML
  }

  // Checar pontuação máxima

    if (score > scoreHigh) {
      scoreHigh = score;
      localStorage.setItem(SAVE_KEY_SCORE, scoreHigh);
    }
    

  // Destruir o asteroide
  roids.splice(index, 1);

  // Novo level sem nenhum asteroide
  if (roids.length == 0) {
      level++;
      newLevel();
  }
}

function destroyCircle(index) {
  let xc = circles[index].xc;
  let yc = circles[index].yc;
  let rc = circles[index].rc;
  
  if (distBetweenPointsCircle(ship.x, ship.y, circles[index].xc, circles[index].yc) <
  ship.r + circles[index].rc) {
    circles.splice(index, 1);
    
    
    } if (circles.length == 0) {
      level++;
      newLevel();
   }    
  } 




  // for (let icc = 0; icc < circles.length; icc++) {
  //   if (
  //     distBetweenPointsCircle(ship.x, ship.y, circles[icc].xc, circles[icc].yc) <
  //     ship.r + circles[icc].rc
  //   ) {
  //     context.fillStyle = "#40E0D0";
  //     circles[icc].xc, circles[icc].yc = circles - 1
  //     context.fill();
  //     console.log('Você salvou o astronauta!')

  //     // context.fillStyle = "#40E0D0";
  //     // circles[icc].xc, circles[icc].yc = circles - 1
  //     // context.fill()
  //     // Perguntar por que fazer o comando acima sumiu com os círculos
  //     // Estava a tentar fazer fill individualmente para cada circulo
  //     // Se colocar este if fora do desenho só pisca o primeiro gerado
  //     // Se colocar este if dentro do desenho piscam os 3 ao mesmo tempo
     

  //   }
  // }





function distBetweenPoints(x1, y1, x2, y2) {
  return Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));
}



function createCircle() {
  
  circles = [];
  let xc, yc;
  for (let i = 0; i < CIRCLE_NUM + level; i++) {
    // Asteroide vai nascer em lugar random(sem tocar na nave)
    do {
      xc = Math.floor(Math.random() * canv.width * 0.95 + 45);
      yc = Math.floor(Math.random() * canv.height * 0.79 + 159);
    } while (distBetweenPointsCircle(ship.x, ship.y, xc, yc) < CIRCLE_SIZE * 2 + ship.r);
    circles.push(newCircle(xc, yc));
  }
  
}

function distBetweenPointsCircle(x2, y2, x3, y3) {
  return Math.sqrt(Math.pow(x3 - x2, 2) + Math.pow(y3 - y2, 2));
}

function drawShip(x, y, a, colour = "slategrey") {
    
      context.strokeStyle = colour; // Cor da linha
      context.lineWidth = SHIP_SIZE / 15; // Largura da linha

      // Fazendo o triângulo da nave

      context.beginPath(); // Caminho > Mover cursor para onde queremos começar
      context.moveTo(

        // Parte da frente da nave:
        // X Ship = Centro da Nave / R Ship = Raio da Nave
        x + (4 / 3) * ship.r * Math.cos(a), // Coseno = Horizonte
        y - (4 / 3) * ship.r * Math.sin(a) // Seno = vertical > Sinal negativo representa para cima.
      );
      context.lineTo(
        // Parte traseira esquerda da nave

        x - ship.r * ((2 / 3) * Math.cos(a) + Math.sin(a)),
        y + ship.r * ((2 / 3) * Math.sin(a) - Math.cos(a))
      );
      context.lineTo(
        // Parte traseira direita da nave

        x - ship.r * ((2 / 3) * Math.cos(a) - Math.sin(a)),
        y + ship.r * ((2 / 3) * Math.sin(a) + Math.cos(a))
      );

      context.closePath(); // Fechar o triângulo que estava assim: /_
      context.stroke(); // Desenhar linhas
}

function explodeShip() {
  ship.explodeTime = Math.ceil(SHIP_EXPLODE_DUR * FPS); // Ceil faz com que o número seja arredondado p/ cima.
  // context.fillStyle = "lime"
  // context.strokeStyle = "lime"
  // context.beginPath()
  // context.arc(ship.x, ship.y, ship.r, 0, Math.PI * 2, false)
  // context.fill();
  // context.stroke();
}

function gameOver() {
  ship.dead = true;
  text = "Game Over";
  textAlpha = 1.0; 
}

function keyDown(/** @type {KeyboardEvent} */ ev) {

  if (ship.dead) {
    return;
  }

  switch (ev.keyCode) {
    // Apagar Best Score
    case 76: 
    localStorage.removeItem("highscore");
    break;
    // 180 * PI é porque o TURN_SPEED está em graus.
    // Função para ter ação quando a tecla for pressionada.
    case 32: // Atirar o laser, barra de espaço
      shootLaser();
      break;
    case 87: // Ir para frente, tecla W
      ship.thrusting = true;
      break;
    case 65: // Ir para esquerda, tecla A
      ship.rot = ((TURN_SPEED / 180) * Math.PI) / FPS;
      break;
    case 68: // Ir para direita, tecla D
      ship.rot = ((-TURN_SPEED / 180) * Math.PI) / FPS;
      break;
  }
}

function keyUp(/** @type {KeyboardEvent} */ ev) {

  if (ship.dead) {
    return;
  }

  switch (ev.keyCode) {
    // Função para parar de ter ação quando a tecla deixar de ser pressionada.
    case 32: // Se deixar de pressionar a barra de espaço, pode atirar novamente
      ship.canShoot = true;
      break;
    case 87: // Ir para frente, tecla W
      ship.thrusting = false;
      break;
    case 65: // Ir para esquerda, tecla A
      ship.rot = 0;
      break;
    case 68: // Ir para direita, tecla D
      ship.rot = 0;
      break;
  }
}


function newCircle (xc, yc) {
  let circle = {
    ac: Math.random() * Math.PI * 2, // Ângulo randômico, em Radians
    offsc: [],
    rc: CIRCLE_SIZE / 2, // Raio do asteroide, que vai mudar quando atiramos
    // vert: Math.random() * ROID_VERT + 7,
    vertc: Math.floor(Math.random() *1 ),
    // Vert de vértices

    xc: xc,
    yc: yc,
    // xvc: ((Math.random() * ROID_SPD) / FPS) * (Math.random() < 0.5 ? 1 : -1),
    // yvc: ((Math.random() * ROID_SPD) / FPS) * (Math.random() < 0.5 ? 1 : -1),

  };

  // populate the offsets array
  for (let i = 0; i < circle.vertc; i++) {
    circle.offsc.push(Math.random() * 1);
  }

  return circle;
}



function newAsteroid(x, y, r) {
  let lvlMulti = 1 + 0.3 * level;
  let roid = {
    a: Math.random() * Math.PI * 2, // Ângulo randômico, em Radians
    offs: [],
    r: r, // Raio do asteroide, que vai mudar quando atiramos
    // vert: Math.random() * ROID_VERT + 7,
    vert: Math.floor(Math.random() * (ROID_VERT + 1) + ROID_VERT / 2),
    // Vert de vértices

    x: x,
    y: y,
    xv: ((Math.random() * ROID_SPD) * lvlMulti / FPS) * (Math.random() < 0.5 ? 1 : -1),
    yv: ((Math.random() * ROID_SPD) * lvlMulti / FPS) * (Math.random() < 0.5 ? 1 : -1),

  };

  // populate the offsets array
  for (let i = 0; i < roid.vert; i++) {
    roid.offs.push(Math.random() * ROID_JAG * 2 + 1 - ROID_JAG);
  }

  return roid;
}

function newGame() {
  level = 0;
  lives = GAME_LIVES;
  score = 0;
  ship = newShip();

  // Pegar o valor do BEST SCORE do local storage
  let scoreStr =  scoreHigh = localStorage.getItem(SAVE_KEY_SCORE);
  if (scoreStr == null) {
    scoreHigh = 0;
  } else {
    scoreHigh = parseInt(scoreStr);
  }

  newLevel()
}

function newLevel() {
  text = "Level " + (level + 1);
  textAlpha = 2.0;
  createCircle(); 
  createAsteroidBelt();
}

function newShip() {
  return {
    x: canv.width / 2,
    y: canv.height / 2,
    r: SHIP_SIZE / 3.5,
    a: Math.random() * 90 * Math.PI, // Converter para "Radians" // 0º é para direita, 90º é para cima
    //Math.random usado para que a posição da nave nunca seja igual quando o jogo começar.
    blinkNum: Math.ceil(SHIP_INV_DUR / SHIP_BLINK_DUR),
    blinkTime: Math.ceil(SHIP_BLINK_DUR * FPS),
    canShoot: true,
    dead: false,
    explodeTime: 0,
    lasers: [],
    rot: 0, // Rotacionar
    thrusting: false,
    thrust: {
      x: 0,
      y: 0, // Isso faz com que mesmo que deixes de pressionar para frente vai continuar a avançar naquela
      // mesma direção.
    },
  };
}

function shootLaser() {
  // Criar o objeto "laser"
  if(ship.canShoot && ship.lasers.length < LASER_MAX) {
    ship.lasers.push({ // Atirar da parte da frente da nave
      x: ship.x + (4 / 3) * ship.r * Math.cos(ship.a), 
      y: ship.y - (4 / 3) * ship.r * Math.sin(ship.a),
      xv: LASER_SPD * Math.cos(ship.a) / FPS,
      yv: -LASER_SPD * Math.sin(ship.a) / FPS,
      dist: 0,
      explodeTime: 0
    });
  }

  // Prevenir que continue a atirar
  ship.canShoot = false;
}


function update() {
  let blinkOn = ship.blinkNum % 2 == 0;
  let exploding = ship.explodeTime > 0;

  // Desenhar o espaço

  context.fillStyle = "black";
  context.fillRect(0, 0, canv.width, canv.height);

  // Avançar com a nave

  if (ship.thrusting && !ship.dead) {
    ship.thrust.x += (SHIP_THRUST * Math.cos(ship.a)) / FPS;
    ship.thrust.y -= (SHIP_THRUST * Math.sin(ship.a)) / FPS;

    // Propulsor desenho // COPIAR TODA A ÁREA DA NAVE TRIANGULAR JÁ DESENHADA E POR DENTRO DO THRUST
    if (!exploding && blinkOn) {
      context.fillStyle = "#FF4500";
      context.strokeStyle = "yellow";
      context.lineWidth = SHIP_SIZE / 30;

      context.beginPath();
      context.moveTo(
        // PROPULSOR - Esquerda traseira

        ship.x - ship.r * ((2 / 3) * Math.cos(ship.a) + 0.5 * Math.sin(ship.a)),
        ship.y + ship.r * ((2 / 3) * Math.sin(ship.a) - 0.5 * Math.cos(ship.a))
      );
      context.lineTo(
        // PROPULSOR - Centro traseira

        ship.x - ((ship.r * 6) / 3) * Math.cos(ship.a),
        ship.y + ((ship.r * 6) / 3) * Math.sin(ship.a)
      );
      context.lineTo(
        // PROPULSOR - Direita traseira

        ship.x - ship.r * ((2 / 3) * Math.cos(ship.a) - 0.5 * Math.sin(ship.a)),
        ship.y + ship.r * ((2 / 3) * Math.sin(ship.a) + 0.5 * Math.cos(ship.a))
      );

      context.closePath();
      context.fill();
      context.stroke();
    }
  } else {
    ship.thrust.x -= (FRICTION * ship.thrust.x) / FPS;
    ship.thrust.y -= (FRICTION * ship.thrust.y) / FPS;
  }

  // Desenhar a nave(triangular)

  if (!exploding) {
    if (blinkOn && !ship.dead) {
      drawShip(ship.x, ship.y, ship.a)
    }

    // Configurar nave piscando após explosão

    if (ship.blinkNum > 0) {
      // Reduzir tempo da nave piscando

      ship.blinkTime--;

      // Reduzir número de vezes que a nave pisca

      if (ship.blinkTime == 0) ship.blinkTime = Math.ceil(SHIP_BLINK_DUR * FPS);
      ship.blinkNum--;
    }
  } else {
    // Desenhar a explosão.
    context.fillStyle = "darkred";
    context.beginPath();
    context.arc(ship.x, ship.y, ship.r * 1.7, 0, Math.PI * 2, false);
    context.fill();
    context.fillStyle = "red";
    context.beginPath();
    context.arc(ship.x, ship.y, ship.r * 1.4, 0, Math.PI * 2, false);
    context.fill();
    context.fillStyle = "orange";
    context.beginPath();
    context.arc(ship.x, ship.y, ship.r * 1.1, 0, Math.PI * 2, false);
    context.fill();
    context.fillStyle = "yellow";
    context.beginPath();
    context.arc(ship.x, ship.y, ship.r * 0.8, 0, Math.PI * 2, false);
    context.fill();
    context.fillStyle = "white";
    context.beginPath();
    context.arc(ship.x, ship.y, ship.r * 0.5, 0, Math.PI * 2, false);
    context.fill();
  }

  //Colisão Nave

  

  // Desenhar lasers

  for (var i = 0; i < ship.lasers.length; i++) {
    if (ship.lasers[i].explodeTime == 0) {
        context.fillStyle = "slategrey";
        context.beginPath();
        context.arc(ship.lasers[i].x, ship.lasers[i].y, SHIP_SIZE / 15, 0, Math.PI * 2, false);
        context.fill();
    } else {
      // Desenhar explosão
      context.fillStyle = "orangered";
      context.beginPath();
      context.arc(ship.lasers[i].x, ship.lasers[i].y, ship.r * 1.75, 0, Math.PI * 2, false);
      context.fill();
      context.fillStyle = "yellow";
      context.beginPath();
      context.arc(ship.lasers[i].x, ship.lasers[i].y, ship.r * 1.2, 0, Math.PI * 2, false);
      context.fill();
      context.fillStyle = "white";
      context.beginPath();
      context.arc(ship.lasers[i].x, ship.lasers[i].y, ship.r * 0.75, 0, Math.PI * 2, false);
      context.fill();
    }
  }

 // Detectar "laser" hit nos asteroides

 let ax, ay, lx, ly; 
 for (let i = roids.length -1; i >= 0; i--) {
  //  Pegar a propriedade dos asteroides 
  ax = roids[i].x;
  ay = roids[i].y;
  ar = roids[i].r;

  // Loop nos "lasers"
  for ( let j = ship.lasers.length -1; j >=0; j--) {
    // Pegar as propriedades dos "lasers"
    lx = ship.lasers[j].x;
    ly= ship.lasers[j].y;
    
    // Detectar os hits

    if(ship.lasers[j].explodeTime == 0 && distBetweenPoints(ax, ay, lx, ly) < ar) {
    
      // Destruir o asteroide e ativar a explosão do laser
      destroyAsteroid(i);
      ship.lasers[j].explodeTime = Math.ceil(LASER_EXPLODE_DUR * FPS);
      break;
    }
  }
 }




  // Desenhar os circulos
 
  let ac, rc, xc, yc, offsc, vertc;
  for (let ic = 0; ic < circles.length; ic++) {
    context.strokeStyle = "#40E0D0";
    context.lineWidth = SHIP_SIZE / 25;
    
    // Pegar as propriedades dos asteroides

    

    ac = circles[ic].ac;
    rc = circles[ic].rc;
    xc = circles[ic].xc;
    yc = circles[ic].yc;
    offsc = circles[ic].offsc;
    vertc = circles[ic].vertc;

    // Desenhar caminho

    context.beginPath();
    // context.arc(Math.floor(Math.random()*(555)+1) , Math.floor(Math.random()*(822)+1),
    // Math.floor(Math.random()*(20)+1), 0 ,2*Math.PI); 
    // context.stroke();
    // context.moveTo(
    //   xc + rc * offsc[0] * Math.cos(ac), // Ponto inicial vai ser o ponto x(centro do asteroide) somado com o raio multiplicado pelo
    //   yc + rc * offsc[0] * Math.sin(ac) //  coseno/seno do ângulo
    // );

    // Desenhar o polígono
    // Fazer Loop por cima do número de vértices

    // for (let jc = 1; jc < vertc; jc++) {
    //   context.lineTo(
    //     xc + rc * offsc[jc] * Math.cos(ac + (jc * Math.PI * 2) / vertc),
    //     yc + rc * offsc[jc] * Math.sin(ac + (jc * Math.PI * 2) / vertc)
    //   );
    // }
    //context.arc(xc, yc, rc, 0, Math.PI * 2, false);
    context.drawImage(astronaut, xc - 25, yc - 35, 55, 65 );
    // astro3
    // context.drawImage(astronaut, xc - 35, yc - 39, 55, 75 );
    context.stroke();
    
    

    }

    // Mostrar círculo verde de hit-scan do astronauta

    // if (SHOW_BOUNDING) {
    //   context.strokeStyle = "lime";
    //   context.beginPath();
    //   context.arc(xc, yc, rc, 0, Math.PI * 2, false);
    //   context.stroke();
    // }
  



    if (!exploding) {
      if (ship.blinkNum == 0 && !ship.dead) {
        for (let icc = 0; icc < circles.length; icc++) {
          if (
            distBetweenPointsCircle(ship.x, ship.y, circles[icc].xc, circles[icc].yc) <
            ship.r + circles[icc].rc
          ) {
            // circles[icc].xc, circles[icc].yc = circles - 1
            
            circles.splice(icc, 1)
            score += ASTRO_PTS 

            if (score > scoreHigh) {
              scoreHigh = score;
              localStorage.setItem(SAVE_KEY_SCORE, scoreHigh);
            }    


           if (circles.length == 0) {
                level++;
                newLevel();
                }    
            console.log('Você salvou um astronauta!')

            // context.fillStyle = "#40E0D0";
            // circles[icc].xc, circles[icc].yc = circles - 1
            // context.fill()
            // Perguntar por que fazer o comando acima sumiu com os círculos
            // Estava a tentar fazer fill individualmente para cada circulo
            // Se colocar este if fora do desenho só pisca o primeiro gerado
            // Se colocar este if dentro do desenho piscam os 3 ao mesmo tempo
          //   if (circles.length == 0) {
          //     level++;
          //     newLevel();
          //  }    
          // circles.splice(index, 1)
      //   }
      //   if (circles.length == 0) {
      //     level++;
      //     newLevel();
      //  }    



          }
        }
      }
  
      // Rotacionar a nave
  
      ship.a += ship.rot;
  
      // Mover a nave
  
      ship.x += ship.thrust.x;
      ship.y += ship.thrust.y;
    } else {
      ship.explodeTime--;
  
      if (ship.explodeTime == 0) {
        lives--;
        if (lives == 0) {
          gameOver()
        } else {
          ship = newShip();
        }
      }
    }
  


  // Desenhar os asteroides

  let a, r, x, y, offs, vert;
  for (let i = 0; i < roids.length; i++) {
    context.strokeStyle = "slategrey";
    context.lineWidth = SHIP_SIZE / 50;

    // Pegar as propriedades dos asteroides

    a = roids[i].a;
    r = roids[i].r;
    x = roids[i].x;
    y = roids[i].y;
    offs = roids[i].offs;
    vert = roids[i].vert;

    // Desenhar caminho

    context.beginPath();
    // context.arc(Math.floor(Math.random()*(555)+1) , Math.floor(Math.random()*(822)+1),
    // Math.floor(Math.random()*(20)+1), 0 ,2*Math.PI); 
    // context.stroke();
    context.moveTo(
      x + r * offs[0] * Math.cos(a), // Ponto inicial vai ser o ponto x(centro do asteroide) somado com o raio multiplicado pelo
      y + r * offs[0] * Math.sin(a) //  coseno/seno do ângulo
    );

    // Desenhar o polígono
    // Fazer Loop por cima do número de vértices

    for (let j = 1; j < vert; j++) {
        context.lineTo(
          x + r * offs[j] * Math.cos(a + (j * Math.PI * 2) / vert),
          y + r * offs[j] * Math.sin(a + (j * Math.PI * 2) / vert)
        );
      }

    context.closePath();
    context.stroke();

    

    // Mover os asteroides

    roids[i].x += roids[i].xv;
    roids[i].y += roids[i].yv;

    // Lidar com os cantos do mapa (asteroides) (mesmo código da nave, só trocando ship por roids)

    if (roids[i].x < 0 - roids[i].r) {
      roids[i].x = canv.width + roids[i].r;
    } else if (roids[i].x > canv.width + roids[i].r) {
      roids[i].x = 0 - roids[i].r;
    }
    if (roids[i].y < 0 - roids[i].r) {
      roids[i].y = canv.height + roids[i].r;
    } else if (roids[i].y > canv.height + roids[i].r) {
      roids[i].y = 0 - roids[i].r;
    }
  }

    // Mover os lasers 

    for(let i = ship.lasers.length -1; i >= 0; i--) {

      // Checar a distância de viagem
      if (ship.lasers[i].dist > LASER_DIST * canv.width) {
        ship.lasers.splice(i, 1);
        continue; 
      }

      // Lidar com explosão

      if(ship.lasers[i].explodeTime > 0) {
        ship.lasers[i].explodeTime--

        // Destruir o laser depois da duração terminar
        if(ship.lasers[i].explodeTime == 0) {
          ship.lasers.splice(i, 1);
          continue;
        }

      } else {
        // Mover laser
        ship.lasers[i].x += ship.lasers[i].xv;
        ship.lasers[i].y += ship.lasers[i].yv;

        // Calcular a distância de viagem dos "lasers"
        ship.lasers[i].dist += Math.sqrt(Math.pow(ship.lasers[i].xv, 2) + Math.pow(ship.lasers[i].yv, 2));
       }

      // Lidar com cantos do mapa 
      if (ship.lasers[i].x < 0) {
        ship.lasers[i].x = canv.width;
      } else if (ship.lasers[i].x > canv.width) {
        ship.lasers[i].x = 0;
      }
      if (ship.lasers[i].y < 0) {
        ship.lasers[i].y = canv.height;
      } else if (ship.lasers[i].y > canv.height) {
        ship.lasers[i].y = 0;
      }
    }
  
   // Desenhar o texto do jogo
   if (textAlpha >= 0) {
     context.textAlign = "center"
     context.textBaseline = "middle"
     context.fillStyle = "rgba(255,255,255, " + textAlpha + ")";
     context.font = "small-caps " + TEXT_SIZE + "px dejavu sans mono"
     context.fillText(text, canv.width / 2, canv.height * 0.75);
     textAlpha -= (1.0 / TEXT_FADE_TIME / FPS); 
   } else if (ship.dead) {
     newGame();
   }

   // Desenhar as vidas
   let lifeColour;
   for (i = 0; i < lives; i++) {
     lifeColour = exploding && i == lives - 1 ? "red" : "slategrey";
     drawShip(SHIP_SIZE + i * SHIP_SIZE * 0.9, SHIP_SIZE, 0.5 * Math.PI, lifeColour);
   }

   // Desenhar a pontuação

     context.textAlign = "right"
     context.textBaseline = "middle"
     context.fillStyle = "slategrey";
     context.font = TEXT_SIZE + "px dejavu sans mono"
     context.fillText(score, canv.width - SHIP_SIZE / 1, SHIP_SIZE);

     context.textAlign = "center" 
     context.textBaseline = "left"
     context.fillStyle = "slategrey";
     context.font = (TEXT_SIZE * 0.70) + "px dejavu sans mono"
     context.fillText("LEVEL: " + (level + 1), canv.width / 2, 110);

     // Desenhar a pontuação máxima

     context.textAlign = "center"
     context.textBaseline = "middle"
     context.fillStyle = "slategrey";
     context.font = (TEXT_SIZE * 0.75)+ "px dejavu sans mono"
     context.fillText("BEST SCORE: " + scoreHigh, canv.width / 2, SHIP_SIZE);



  //Checar colisão de asteroides

  
  if (!exploding) {
    if (ship.blinkNum == 0 && !ship.dead) {
      for (let i = 0; i < roids.length; i++) {
        if (
          distBetweenPoints(ship.x, ship.y, roids[i].x, roids[i].y) <
          ship.r + roids[i].r 
        ) {
          explodeShip();
          destroyAsteroid(i);
          break;
        }
      }
    }

    // Rotacionar a nave

    ship.a += ship.rot;

    // Mover a nave

    ship.x += ship.thrust.x;
    ship.y += ship.thrust.y;
  } else {
    ship.explodeTime--;

    if (ship.explodeTime == 0) {
      ship = newShip();
    }
  }



  
    // Lidar com os cantos do mapa

    // X
  if (ship.x < 0 - ship.r) {
    ship.x = canv.width + ship.r;
  } else if (ship.x > canv.width + ship.r) {
    ship.x = 0 - ship.r;
  }
    // Y
  if (ship.y < 0 - ship.r) {
    ship.y = canv.height + ship.r;
  } else if (ship.y > canv.height + ship.r) {
    ship.y = 0 - ship.r;
  }

    // Mover os asteroides

  for (let i = 0; i < roids.length; i++) {
    roids[i].x += roids[i].xv;
    roids[i].y += roids[i].yv;

    // Lidar com os cantos do mapa (asteroides) (mesmo código da nave, só trocando ship por roids)

    if (roids[i].x < 0 - roids[i].r) {
      roids[i].x = canv.width + roids[i].r;
    } else if (roids[i].x > canv.width + roids[i].r) {
      roids[i].x = 0 - roids[i].r;
    }
    if (roids[i].y < 0 - roids[i].r) {
      roids[i].y = canv.height + roids[i].r;
    } else if (roids[i].y > canv.height + roids[i].r) {
      roids[i].y = 0 - roids[i].r;
    }
  }

  // Centro do triângulo // Opcional ***
  // context.fillStyle = "red"
  // context.fillRect(ship.x - 1, ship.y -1, 2, 2)
  
}
