class Pistas extends Phaser.Scene{
    constructor(){
        super({
            key: "Pistas"
        });
    }   
    init() {
    } 
    preload(){
        this.load.path = "./assets/";
        this.load.image("Folder", "fondo_menu.png"); 
        //this.load.image("camino1", "camino1.png"); 
        //this.load.image("camino2", "camino2.png");
        this.load.image("ticket", "Lista_Bus.png");      
        //this.load.image("inicio","inicio.png");
        this.load.image("clip", "Regresar.png");
    
    }
    create() {

    /*const fondo = this.add.image(width / 2, height / 2, "Folder");  
    //fondo.setScale(Math.max(width / fondo.width, height / fondo.height)).setScrollFactor(0);
    this.fondo = this.add.tileSprite(width/2, height/1.6, width, height, "Folder");
    fondo.setScale(Math.max(width /2, height /2)).setScrollFactor(2);*/

    //carga, posicion y scala de imagenes

    //this.load.image("ticket", "Lista_Bus.png"); 

    this.fondoniveles = this.add.image(500, 300,"Folder").setScale(.76);
    //this.camino1 = this.add.image(325, 180,"camino1").setScale(0.70);
    //this.camino2 = this.add.image(430, 180,"camino2").setScale(0.85);
    this.clip = this.add.image(150, 450,"clip").setScale(.5); //casa
    this.clip.setInteractive();

    this.ticket = this.add.image(650, 330,"Lista_Bus").setScale(1); //casa
        this.ticket.setInteractive();

    //this.ticket = this.add.Image(554, 190, "ticket").setScale(1);

    
    //this.inicio = this.add.image(760, 40,"inicio").setScale(1);
    //this.inicio.setInteractive();

    
    //pasar por arriba
    /*this.inicio.on("pointerover", () => {
            this.inicio.setTint(0x0000f);
        });
        this.inicio.on("pointerout", () => {
            this.inicio.clearTint();
        });
    //dar clik
    this.inicio.on("pointerdown", () => {
            this.inicio.setTint(0x90ee90);
        });
        this.inicio.on("pointerup", () => {
            this.inicio.clearTint();
            this.scene.start("Bootloader");
        });*/


    //pasar por arriba
    /*this.botonniveles.on("pointerover", () => {
            this.botonniveles.setTint(0x0000f);
        });
        this.botonniveles.on("pointerout", () => {
            this.botonniveles.clearTint();
        });*/
    //dar clik
    /*this.botonniveles.on("pointerdown", () => {
            this.botonniveles.setTint(0x90ee90);
        });
        this.botonniveles.on("pointerup", () => {
            this.botonniveles.clearTint();
            /*this.scene.launch("Fondonivel1");
            this.scene.launch("Nivel1");
            this.scene.sendToBack("Fondonivel1");
            this.scene.stop("Niveles");
        });*/
    //
    this.clip.on("pointerover", () => {
            this.clip.setTint(0x0000f);
        });
        this.clip.on("pointerout", () => {
            this.clip.clearTint();
        });
    this.clip.on("pointerdown", () => {
            this.clip.setTint(0x90ee90);
        });
        this.clip.on("pointerup", () => {
            this.clip.clearTint();
            this.scene.start("Mapa");
        });


         
         this.tweens.add({
            targets:this.clip, //policia
            y: 385,
            yoyo: true,
            duration: 1000,
            repeat: -1,
            ease: "Sine.easeInOut"
        });
    }
    update(){
    }
}
export default Pistas;