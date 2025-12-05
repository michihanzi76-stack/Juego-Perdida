class Bootloader extends Phaser.Scene{
    constructor(){
        super({
            key: "Bootloader"
        });
    }

    init() {
    }
    preload(){

        this.load.path = "./assets/";
        this.load.image("logo","logo.png");
        this.load.image("yoshi_fondo","yoshi_fondo.png")
        this.load.image("boton","boton.png");
        this.load.image("llave","llave.png");
        this.load.image("signo","signo.png");
        this.load.audio("sonido_fondo","sonidos/sonido_fondo.mp3");

        this.registry.events.on('evento', (dato) => { 
        console.log('Se ha emitido el evento', dato); 
        });
        
    }
    create(){
        console.log("soy create");

        // Música de fondo
        this.musica = this.sound.add("sonido_fondo", { volume: 0.4, loop: true });
        this.musica.play();

        //fondo
        this.yoshif = this.add.image(480, 300, "yoshi_fondo").setScale(.85);

        this.logo = this.add.image(500, 170, "logo").setScale(1);
        this.bandera =false;

        this.boton = this.add.image(760, 170, "boton").setScale(.8);
        this.boton.setInteractive();
        this.llave = this.add.image(725, 425, "llave").setScale(.6);
        this.llave.setInteractive();
        this.signo = this.add.image(725, 510, "signo").setScale(.6);
        this.signo.setInteractive();

        this.data.set('vidas', 3);
        this.data.set('monedas', 5);
        console.log('Datos iniciales:', this.data.list);

        this.data.setValue('vidas', 5);
        console.log('Después de setValue:', this.data.list);

        this.data.list.vidas += 2;
        console.log('Después de incrementar:', this.data.list);

        this.data.remove('monedas');
        console.log('Después de remover monedas:', this.data.list);

        this.data.set('monsters', 3);
        console.log('Búsqueda parcial query("mon"):', this.data.query('mon'));

        this.data.reset();
        console.log('Después de reset:', this.data.list);

//pasar mouse encima

        this.boton.on("pointerover", () => {
            this.boton.setTint(0x0000f);
        });
        this.boton.on("pointerout", () => {
            this.boton.clearTint();
        });
        this.llave.on("pointerover", () => {
            this.llave.setTint(0x0000f);
        });
        this.llave.on("pointerout", () => {
            this.llave.clearTint();
        });
        this.signo.on("pointerover", () => {
            this.signo.setTint(0x0000f);
        });
        this.signo.on("pointerout", () => {
            this.signo.clearTint();
        });

//click

        this.boton.on("pointerdown", () => {
            this.boton.setTint(0x90ee90);
        });
        this.boton.on("pointerup", () => {
            this.boton.clearTint();
            this.scene.start("Casa1");
        });
        this.llave.on("pointerdown", () => {
            this.llave.setTint(0x90ee90);
        });
        this.llave.on("pointerup", () => {
            this.llave.clearTint();
            this.scene.start("Ajustes");
        });
        this.signo.on("pointerdown", () => {
            this.signo.setTint(0x90ee90);
        });
        this.signo.on("pointerup", () => {
            this.signo.clearTint();
        });

//animación yoyo del Titulo

         this.tweens.add({
            targets:this.boton,
            x: 720,
            yoyo: true,
            duration: 900,
            repeat: -1,
            ease: "Sine.easeInOut"
        });

        this.tweens.add({
            targets:this.logo,
            y: 190,
            yoyo: true,
            duration: 2000,
            repeat: -1,
            ease: "Sine.easeInOut"
        });
   
}
    }
    

export default Bootloader;