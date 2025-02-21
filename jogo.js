// Definimos as variaveis que indicam as dimensões da tela
const larguraJogo = 700;
const alturaJogo = 850;

//Configuramos no Phaser a altura e largura oir meio da variavel definida acima
const config = {
    type: Phaser.AUTO,
    width: larguraJogo,
    height: alturaJogo,

    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 300},
            debug: true
        }
    },

    scene: {
        preload: preload,
        create: create,
        update: update
    }
};

// Configuramos a classe Phaser.Game, indicando o objeto "config"
const game = new Phaser.Game(config);

//Set das funcoes
var alien;
var teclado;
var fogo;
var plataforma;
var moeda;
var placar;
var pontuacao = 0;
var plataformas = [];

function preload() { //Preload das imagens
    this.load.image('background', 'assets/bg.png');

    this.load.image('player' , 'assets/alienigena.png');
    
    this.load.image('turbo_nave' , 'assets/turbo.png');

    this.load.image('plataforma_tijolo' , 'assets/tijolos.png');

    this.load.image('moeda' , 'assets/moeda.png');
}

function create() {

    // Executamos a função "create" que adiciona todos os itens uma unica vez
    this.add.image(larguraJogo/2, alturaJogo/2, 'background');

    //Adicionar o sprite do fogo ; Ele vem antes do alien para que fique fisicamente "atras" do alien na tela
    fogo = this.add.sprite(0, 0, 'turbo_nave');
    fogo.setVisible(false); // Adiciono ele e deixo como nao visivel ainda
    
    //Add da spritte do alien, adicionando a fisica (terá que ser considerada a gravidade e as colisões)
    alien = this.physics.add.sprite(larguraJogo/2, 0, 'player');
    alien.setCollideWorldBounds(true);//Colisão do alien com as bordas da tela

    teclado = this.input.keyboard.createCursorKeys();
    
    plataformas.push(this.physics.add.staticImage(larguraJogo / 2, alturaJogo / 2, 'plataforma_tijolo'));
    plataformas.push(this.physics.add.staticImage(larguraJogo / 2 + 156, alturaJogo / 2, 'plataforma_tijolo'));



    //Add da fisica da moeda, da sua colisão com as bordas do mundo, do efeito quicar no solo e as suas colisões com as duas plataformas
    moeda = this.physics.add.sprite(larguraJogo/2, 0, 'moeda');
    moeda.setCollideWorldBounds(true);
    moeda.setBounce(0.7);

    plataformas.forEach(plataforma => {
        this.physics.add.collider(alien, plataforma);
        this.physics.add.collider(moeda, plataforma);
    });
    
    //Add do placar no topo da tela 
    placar = this.add.text(50, 50, 'Moedas:' + pontuacao, { fontSize: '45px', fill: '#495613'});
    
    //Função function() definida dentro da funcao overlap, entre o alien e a moeda, faz com a moeda suma quando em contato com o alien e faca o contador aumentar
    this.physics.add.overlap(alien, moeda, function(){

        moeda.setVisible(false);
        var posicaoMoeda_y = Phaser.Math.RND.between(50, 650);
        moeda.setPosition(posicaoMoeda_y, 100);
        pontuacao ++;
        placar.setText('Moedas:'+ pontuacao);
        moeda.setVisible(true);
    });
}

function update() {

    //Add da velocidade e da direcao com base na tecla pressionada
    if(teclado.left.isDown){
        alien.setVelocityX(-150);
    }

    else if (teclado.right.isDown){
        alien.setVelocityX(150);
    }

    else{
        alien.setVelocityX(0);
    }

    if(teclado.up.isDown){
        alien.setVelocityY(-300);
        ativarTurbo();
    }
    else if(teclado.down.isDown){ //Quando for pressionada a ceta para baixo, o fogo nao aparece embaixo do alien e ele desce em uma velocidade
        alien.setVelocityY(300);
        semTurbo();
    }
    else{
        semTurbo();
    }
    fogo.setPosition(alien.x, alien.y + alien.height/2); //Set a posição do fogo em relacao ao alien

}

//Funções para padronizar o set da visibilidade do fogo
function ativarTurbo(){
    fogo.setVisible(true);
}

function semTurbo(){
    fogo.setVisible(false);
}
