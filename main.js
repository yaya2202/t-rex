var gameOver, gameOver_img, restart, restart_img;
var tRex, tRex_img, tRex_collided;
var chao, chao_img;
var chao2;
var jump, die, point;
var nuvem, nuvem_img;
var placar = 0;
var textPlacar;
var cacto1, cacto2, cacto3, cacto4, cacto5, cacto6;
var grupoNuvens, grupoCactos;

var PLAY = 1;
var END = 0;
var gameState = PLAY;

//carregar os arquivos
function preload(){
    tRex_img = loadAnimation("trex1.png", "trex3.png", "trex4.png");
    tRex_collided = loadAnimation("trex_collided.png");
    chao_img = loadImage("ground2.png"); 
    jump = loadSound("jump.mp3");
    die = loadSound("die.mp3");
    point = loadSound("checkpoint.mp3");
    nuvem_img = loadImage("cloud.png");
    cacto1 = loadImage("obstacle1.png");
    cacto2 = loadImage("obstacle2.png");
    cacto3 = loadImage("obstacle3.png");
    cacto4 = loadImage("obstacle4.png");
    cacto5 = loadImage("obstacle5.png");
    cacto6 = loadImage("obstacle6.png");
    gameOver_img = loadImage("gameOver.png");
    restart_img = loadImage("restart.png");
}

//criar sprites e propriedades
function setup(){
    createCanvas(600,200);

    chao2 = createSprite(300,195,600,10);
    chao2.visible = false;

    tRex = createSprite(50,160,20,70);
    tRex.addAnimation("correndo", tRex_img);
    tRex.addAnimation("collided", tRex_collided);
    tRex.scale = 0.6;

    chao = createSprite(300,180);
    chao.addImage(chao_img);
    chao.velocityX = -4;

    gameOver = createSprite(300,30);
    gameOver.addImage(gameOver_img);
    gameOver.scale = 0.8;
    restart = createSprite(300,70);
    restart.scale = 0.6;
    restart.addImage(restart_img);

    grupoNuvens = new Group();
    grupoCactos = new Group();
}   

function draw(){
    background("white");

    if(gameState === PLAY){
        gameOver.visible = false;
        restart.visible = false;
        placar += Math.round(frameCount/60);
        if(placar>0 && placar%100 === 0){
            point.play();
        }
        //pulo  
        if(tRex.y > 150 && (keyDown("up")||keyDown("space"))){
            tRex.velocityY = -10;
            jump.play();
        }
         //gravidade
         tRex.velocityY += 0.5;
         criacaoNuvem();
         gerarCacto();
        if(tRex.collide(grupoCactos)){
            die.play();
            gameState = END;
        }
    }else if(gameState === END){
        gameOver.visible = true;
        restart.visible = true;
        chao.velocityX = 0;
        grupoCactos.setVelocityXEach(0);
        grupoCactos.setLifetimeEach(-1);
        grupoNuvens.setVelocityXEach(0);
        grupoNuvens.setLifetimeEach(-1);
        tRex.velocityY = 0;       
        tRex.velocityX = 0;       
        tRex.changeAnimation("collided");             
    }

    //chao infinito
    if(chao.x < 0){
        chao.x = chao.width/2;
    }

    console.log(tRex.y);
   

    tRex.collide(chao2);    
    //zeros do placar
    textPlacar = "00";
    textSize(12);
    textFont("arial Black");
    if(placar >= 10 && placar < 100){
        textPlacar = "000";
    }else if(placar >= 100 && placar < 1000){
        textPlacar = "00";
    }else if(placar >= 1000 && placar < 10000){
        textPlacar = "0";
    }else if(placar >= 10000){
        textPlacar = "";
    }else{
        textPlacar = "0000";
    }
    text("Pontuação: " + textPlacar + placar, 470,30);
    drawSprites();  
}

function criacaoNuvem(){
    if(frameCount%60 === 0){
    nuvem = createSprite(600,random(20,60));
    nuvem.addImage(nuvem_img);
    nuvem.scale = 0.7;
    nuvem.velocityX = -2;
    //mudando profundidade/camadas de nuvem do tRex
    nuvem.depth = tRex.depth;
    tRex.depth += 1;
    grupoNuvens.add(nuvem);
    nuvem.lifetime = 300;
  }
}

function gerarCacto(){
    if(frameCount%60 === 0){
        var cacto = createSprite(600,160);
        cacto.scale = 0.7;
        cacto.velocityX = -4;
        var num = Math.round(random(1,6));

        switch(num){
            case 1: cacto.addImage(cacto1);
              break;
            case 2: cacto.addImage(cacto2);
              break;
            case 3: cacto.addImage(cacto3);
              break;
            case 4: cacto.addImage(cacto4);
              break;
            case 5: cacto.addImage(cacto5);
              break;
            case 6: cacto.addImage(cacto6);
             cacto.scale = 0.3;
              break;
            default:break;    
        }
        cacto.lifetime = 150;
        grupoCactos.add(cacto);
    }
}

