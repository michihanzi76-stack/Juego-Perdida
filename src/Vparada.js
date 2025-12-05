// Interrogatorios
class Vparada extends Phaser.Scene {  
    constructor() {  
        super({ 
            key: "Vparada"
        });  
        this.durmiendo = false;  
        this.pausado = false;
        this.cocinando = false;
        
    }

    init() {
    }
  
    preload() {  
        const base = "assets/";

        this.load.image("Parada", base + "Parada.png");
        this.load.image("piso", base + "piso.png");

        this.load.audio("Autopista", base + "sonidos/Autopista.mp3");
    
        
    }  
  
    create() {

        //Sonido
         this.musica = this.sound.add("Autopista", { volume: 0.1, loop: false });
         this.musica.play();
        
        const { width, height } = this.scale;  
  
        const fondo = this.add.image(width / 2, height / 2, "Parada");  
        //fondo.setScale(Math.max(width / fondo.width, height / fondo.height)).setScrollFactor(0);
        this.fondo = this.add.tileSprite(width/2, height/1.6, width, height, "Parada");
        fondo.setScale(Math.max(width /2, height /2)).setScrollFactor(2);

         this.physics.world.setBounds(0, 0, width, height);

        const sueloAltura = 20;  
        this.suelo = this.physics.add.staticImage(width / 2, height - sueloAltura / 2, "piso")
            .setDisplaySize(width, sueloAltura).refreshBody();  
  
        this.cama = this.physics.add.staticImage(500, height - sueloAltura - 100, "Fabajo")
            .setScale(0.7).refreshBody();
            
        this.cocina = this.physics.add.staticImage(970, height - sueloAltura - 100, "Fderecha")
            .setScale(0.7).refreshBody();
  
        this.yoshi = this.physics.add.sprite(width / 2, height - sueloAltura - 95, "yoshi", 0)
            .setCollideWorldBounds(true)  
            .setScale(.37);  
        this.yoshi.body.setSize(200, 450);  
  
        this.yoshiDormido = this.add.image(this.yoshi.x, this.yoshi.y, "dormir").setVisible(false);
        this.yoshiCocina = this.add.image(this.yoshi.x, this.yoshi.y, "cocinar").setVisible(false);

        //Animacion

        this.tweens.add({
            targets:this.cama,
            y: 500,
            yoyo: true,
            duration: 3000,
            repeat: -1,
            ease: "Sine.easeInOut"
        });

        this.tweens.add({
            targets:this.cocina,
            y: 500,
            yoyo: true,
            duration: 3000,
            repeat: -1,
            ease: "Sine.easeInOut"
        });
  
        this.physics.add.collider(this.yoshi, this.suelo);  
        //this.physics.add.collider(this.yoshi, this.cama);  
        //this.physics.add.collider(this.yoshi, this.mueble);  
        //this.physics.add.collider(this.mueble, this.suelo);  
  
        /* this.anims.create({  
            key: "caminar",  
            frames: this.anims.generateFrameNumbers("yoshi", { start: 0, end: 6 }),  
            frameRate: 8,  
            repeat: -1  
        });  */
  
        // Nuevos controles corregidos (los dinámicos)  
        const controlesGuardados = this.registry.get("controles");  
        const c = controlesGuardados || {  
            izquierda: Phaser.Input.Keyboard.KeyCodes.A,  
            derecha: Phaser.Input.Keyboard.KeyCodes.D,  
            arriba: Phaser.Input.Keyboard.KeyCodes.W,  
            abajo: Phaser.Input.Keyboard.KeyCodes.S,  
            saltar: Phaser.Input.Keyboard.KeyCodes.SPACE,  
            interactuar: Phaser.Input.Keyboard.KeyCodes.F,  
            pausa: Phaser.Input.Keyboard.KeyCodes.ESC  
        };  
  
        this.keys = {  
            izquierda: this.input.keyboard.addKey(c.izquierda),  
            derecha: this.input.keyboard.addKey(c.derecha),  
            arriba: this.input.keyboard.addKey(c.arriba),  
            abajo: this.input.keyboard.addKey(c.abajo),  
            saltar: this.input.keyboard.addKey(c.saltar),  
            interactuar: this.input.keyboard.addKey(c.interactuar),  
            pausa: this.input.keyboard.addKey(c.pausa)  
        };  
  
        this.keys.pausa.on('down', () => {  
            if (!this.pausado) this.pausarJuego();  
            else this.reanudarJuego();  
        });  
  

        // Menú de pausa  
        this.menuPausa = this.add.container(0, 0).setDepth(2000).setVisible(false);  
        const panel = this.add.rectangle(width / 2, height / 2, 200, 150, 0x000000, 0.7);  
        const textoReanudar = this.add.text(width / 2, height / 2 - 30, "Reanudar", { font: "20px Arial", fill: "#ffffff" })  
            .setOrigin(0.5).setInteractive();  
        const textoSalir = this.add.text(width / 2, height / 2 + 30, "Salir al menú", { font: "20px Arial", fill: "#ffffff" })  
            .setOrigin(0.5).setInteractive();  
  
        textoReanudar.on("pointerdown", () => this.reanudarJuego());  
        textoSalir.on("pointerdown", () => this.scene.start("Menu"));  
        this.menuPausa.add([panel, textoReanudar, textoSalir]);  
  
        //Efecto cinematográfico de seguir al personaje
        this.cameras.main.setBounds(0, 0, width, height);
        this.cameras.main.setZoom(1);
        this.cameras.main.centerOn(0, height / 2);

        // Cámara hace paneo hacia el personaje y zoom suave
        this.cameras.main.pan(this.yoshi.x, this.yoshi.y, 2000, 'Sine.easeInOut', true);
        this.cameras.main.zoomTo(1.4, 2000);

        // Luego sigue al jugador de manera fluida
        this.time.delayedCall(2000, () => {
            this.cameras.main.startFollow(this.yoshi, true, 0.05, 0.05);
            this.cameras.main.setZoom(1.4);
        });

    }  
  
    update() {

        if (this.pausado) return;  
  
        const speed = 170;  
  
        if (!this.durmiendo) {  
            this.yoshi.setVelocityX(0);  
            let moving = false;  
  
            if (this.keys.izquierda.isDown) {  
                this.yoshi.setVelocityX(-speed);  
                this.yoshi.flipX = true;  
                moving = true;  
            } else if (this.keys.derecha.isDown) {  
                this.yoshi.setVelocityX(speed);  
                this.yoshi.flipX = false;  
                moving = true;  
            }  
  
            if (this.keys.arriba.isDown && this.yoshi.body.blocked.down) {  
                this.yoshi.setVelocityY(-250);  
                moving = true;  
            } 
            
            
            /*
            if (moving) {  
                this.yoshi.anims.play("caminar", true);  
            } else {  
                this.yoshi.anims.stop();  
                this.yoshi.setFrame(0);  
            }  */
        }  
  
        const sobreCama = Phaser.Geom.Intersects.RectangleToRectangle(this.yoshi.getBounds(), this.cama.getBounds());  
        if (sobreCama && Phaser.Input.Keyboard.JustDown(this.keys.abajo) && !this.durmiendo) {  
            this.dormir();  
        }

        const sobrecocina = Phaser.Geom.Intersects.RectangleToRectangle(this.yoshi.getBounds(), this.cocina.getBounds());  
        if (sobrecocina && Phaser.Input.Keyboard.JustDown(this.keys.abajo) && !this.cocinando) {  
            this.cocinar();  
        }  
  

    }  
  
    pausarJuego() {  
        this.pausado = true;  
        this.physics.world.isPaused = true;  
        this.menuPausa.setVisible(true);  
    }  
  
    reanudarJuego() {  
        this.pausado = false;  
        this.physics.world.isPaused = false;  
        this.menuPausa.setVisible(false);  
    }  
  
    dormir() {  
        this.durmiendo = false;  
        this.yoshi.setVisible(true);
        //this.sonido4.play();  
  
        const { width, height } = this.scale;  
        const fade = this.add.rectangle(0, 0, width, height, 0x000000)  
            .setOrigin(0, 0)  
            .setAlpha(0)  
            .setDepth(9999)  
            .setScrollFactor(0);  
  
         
  
        this.tweens.add({  
            targets: fade,  
            alpha: 1,  
            duration: 1500,  
            ease: 'Linear',  
            onComplete: () => { 
                this.musica.pause();
                this.scene.start("Mapa");
                
            }  
        });  
    }
//DERECHA
    cocinar() {  
        this.cocinando = false;  
        this.yoshi.setVisible(true);  

        const { width, height } = this.scale;  
        const fade = this.add.rectangle(0, 0, width, height, 0x000000)  
            .setOrigin(0, 0)  
            .setAlpha(0)  
            .setDepth(9999)  
            .setScrollFactor(0);  

        this.tweens.add({  
            targets: fade,  
            alpha: 1,  
            duration: 1500,  
            ease: 'Linear',  
            onComplete: () => {  
                this.scene.start("Vecino");  
            }  
        });  
    }
  
    
}

export default Vparada;