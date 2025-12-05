class Mapa extends Phaser.Scene{
    constructor(){
        super({
            key: "Mapa"
        });

        this.hora = this.relojTexto
    }   
    init() {
    } 
    preload(){
        this.load.path = "./assets/";
        this.load.image("mapa", "mapa.png"); 
        //this.load.image("camino1", "camino1.png"); 
        //this.load.image("camino2", "camino2.png");
        this.load.image("botonniveles", "Casa.png");      
        this.load.image("botonniveles2", "Trabajo.png");
        this.load.image("botonniveles3", "Policia.png");
        this.load.image("botonniveles4", "Oxxo.png");

        this.load.image("botonniveles5", "Vecino.png");
        //this.load.image("inicio","inicio.png");

        this.load.audio("Mapa","sonidos/Mapa.mp3");
    }
    create() {


    //Sonido
    this.musica = this.sound.add("Mapa", { volume: 0.4, loop: false });
    this.musica.play();


    //carga, posicion y scala de imagenes
    this.fondoniveles = this.add.image(500, 300,"mapa").setScale(0.85);
    //this.camino1 = this.add.image(325, 180,"camino1").setScale(0.70);
    //this.camino2 = this.add.image(430, 180,"camino2").setScale(0.85);
    this.botonniveles = this.add.image(160, 450,"botonniveles").setScale(.13); //casa
    this.botonniveles.setInteractive();
    this.botonniveles2 = this.add.image(480, 500,"botonniveles2").setScale(.13); //trabajo
    this.botonniveles2.setInteractive();
    this.botonniveles3 = this.add.image(760, 370,"botonniveles3").setScale(.13); //policia
    this.botonniveles3.setInteractive();
    this.botonniveles4 = this.add.image(320, 300,"botonniveles4").setScale(.32); //oxxo
    this.botonniveles4.setInteractive();

    this.botonniveles5 = this.add.image(530, 230,"botonniveles5").setScale(.32); //vecino
    this.botonniveles5.setInteractive();
    //this.inicio = this.add.image(760, 40,"inicio").setScale(1);
    //this.inicio.setInteractive();

    /*// RELOJ
    this.hora = 8;
    this.minuto = 0;
    this.relojTexto = this.add.text(850, 70, "8:00 AM", {
      fontFamily: "'Roboto Condensed', sans-serif",
      fontSize: "40px",
      color: "#ffffff",
      stroke: "#000000",
      strokeThickness: 4
    }).setOrigin(0.5).setScrollFactor(0);

    this.time.addEvent({
      delay: 2000, //2000
      callback: this.avanzarMinuto,
      callbackScope: this,
      loop: true
    });*/



//Casa
    this.botonniveles.on("pointerover", () => {
            this.botonniveles.setTint(0x0000f);
        });
        this.botonniveles.on("pointerout", () => {
            this.botonniveles.clearTint();
        });
    this.botonniveles.on("pointerdown", () => {
            this.botonniveles.setTint(0x90ee90);
        });
        this.botonniveles.on("pointerup", () => {
            this.botonniveles.clearTint();
            this.scene.start("Casa1");
        });

//Trabajo
    this.botonniveles2.on("pointerover", () => {
            this.botonniveles2.setTint(0x0000f);
        });
        this.botonniveles2.on("pointerout", () => {
            this.botonniveles2.clearTint();
        });
    this.botonniveles2.on("pointerdown", () => {
            this.botonniveles2.setTint(0x90ee90);
        });
        this.botonniveles2.on("pointerup", () => {
            this.botonniveles2.clearTint();
            this.scene.start("Trabajo");
        });

//Policia
    this.botonniveles3.on("pointerover", () => {
            this.botonniveles3.setTint(0x0000f);
        });
        this.botonniveles3.on("pointerout", () => {
            this.botonniveles3.clearTint();
        });
    this.botonniveles3.on("pointerdown", () => {
            this.botonniveles3.setTint(0x90ee90);
        });
        this.botonniveles3.on("pointerup", () => {
            this.botonniveles3.clearTint();
            this.scene.start("Policia");
        });

//Oxxo
    this.botonniveles4.on("pointerover", () => {
            this.botonniveles4.setTint(0x0000f);
        });
        this.botonniveles4.on("pointerout", () => {
            this.botonniveles4.clearTint();
        });
    this.botonniveles4.on("pointerdown", () => {
            this.botonniveles4.setTint(0x90ee90);
        });
        this.botonniveles4.on("pointerup", () => {
            this.botonniveles4.clearTint();
            this.scene.start("Gasolinera");
        });

//Vecino
    this.botonniveles5.on("pointerover", () => {
            this.botonniveles5.setTint(0x0000f);
        });
        this.botonniveles5.on("pointerout", () => {
            this.botonniveles5.clearTint();
        });
    this.botonniveles5.on("pointerdown", () => {
            this.botonniveles5.setTint(0x90ee90);
        });
        this.botonniveles5.on("pointerup", () => {
            this.botonniveles5.clearTint();
            this.scene.start("Vparada");
        });

        //Animacion

         this.tweens.add({
            targets:this.botonniveles, //casa
            y:470,
            yoyo: true,
            duration: 1000,
            repeat: -1,
            ease: "Sine.easeInOut"
        });
         this.tweens.add({
            targets:this.botonniveles2, //trabajo
            y: 470,
            yoyo: true,
            duration: 1000,
            repeat: -1,
            ease: "Sine.easeInOut"
        });
         this.tweens.add({
            targets:this.botonniveles3, //policia
            y: 385,
            yoyo: true,
            duration: 1000,
            repeat: -1,
            ease: "Sine.easeInOut"
        });
        this.tweens.add({
            targets:this.botonniveles4, //oxxo
            y: 320,
            yoyo: true,
            duration: 1000,
            repeat: -1,
            ease: "Sine.easeInOut"
        });
        this.tweens.add({
            targets:this.botonniveles5, //vecino
            y: 200,
            yoyo: true,
            duration: 1000,
            repeat: -1,
            ease: "Sine.easeInOut"
        });
    }

    /*//HORA
    avanzarMinuto() {
        this.minuto++;
        if (this.minuto >= 60) {
            this.minuto = 0;
            this.hora++;
            if (this.hora >= 24) //this.hora = 0;
            this.scene.start("Casa1");
        }
        const ampm = this.hora < 12 ? "AM" : "PM";
        let displayHora = this.hora % 12;
        if (displayHora === 0) displayHora = 12;
        const displayMinuto = this.minuto < 10 ? "0" + this.minuto : this.minuto;
        this.relojTexto.setText(`${displayHora}:${displayMinuto} ${ampm}`);
    }*/

    update(){
    }
}
export default Mapa;