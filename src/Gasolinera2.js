// Oxxo
class Gasolinera2 extends Phaser.Scene {  
    constructor() {  
        super({ 
            key: "Gasolinera2"
        });  
        this.durmiendo = false;  
        this.pausado = false;
        this.cocinando = false;

        this.mostrandoLlamada = false;
        this.mostrandoDialogo = false;
        
    }

    init() {
    }
  
    preload() {  
        const base = "assets/";

        this.load.image("fondo_oxxo2", base + "fondo_oxxo2.png");
        this.load.image("piso", base + "piso.png");

        this.load.image("oxxo", base + "oxxo_chica.png");
        this.load.audio("sonido3", base + "sonidos/sonido3.mp3");
        this.load.audio("Autopista", base + "sonidos/Autopista.mp3");
        
    }  
  
    create() {

        //Sonido
         this.musica = this.sound.add("Autopista", { volume: 0.1, loop: false });
         this.musica.play();


        const { width, height } = this.scale;  
  
        /* this.musica = this.sound.add("musica2", { volume: 0.4, loop: true });  
        this.musica.play();  
        this.sonido4 = this.sound.add("sonido4", { volume: 0.8 }); */
  
        const fondo = this.add.image(width / 2, height / 1, "fondo_oxxo2");  
        //fondo.setScale(Math.max(width / fondo.width, height / fondo.height)).setScrollFactor(0);
        this.fondo = this.add.tileSprite(width/2, height/1.6, width, height, "fondo_oxxo2");
        fondo.setScale(Math.max(width /2, height /2)).setScrollFactor(2);

         this.physics.world.setBounds(0, 0, width, height);

        const sueloAltura = 20;  
        this.suelo = this.physics.add.staticImage(width / 2, height - sueloAltura / 2, "piso")
            .setDisplaySize(width, sueloAltura).refreshBody();  
  
        /*this.cama = this.physics.add.staticImage(70, height - sueloAltura - 100, "Fizquierda")
            .setScale(0.7).refreshBody();*/
            
        this.cocina = this.physics.add.staticImage(970, height - sueloAltura - 100, "Fderecha")
            .setScale(0.7).refreshBody();

        this.llamada = this.physics.add.staticImage(630, height - sueloAltura - 230, "oxxo")  
            .setScale(0.1).refreshBody();
  
        this.yoshi = this.physics.add.sprite(900, height - sueloAltura - 95, "yoshi", 0)
            .setCollideWorldBounds(true)  
            .setScale(.43);  
        this.yoshi.body.setSize(200, 450);  
  
        //this.yoshiDormido = this.add.image(this.yoshi.x, this.yoshi.y, "dormir").setVisible(false);
        this.yoshiCocina = this.add.image(this.yoshi.x, this.yoshi.y, "cocinar").setVisible(false);
        this.yoshiLlamada = this.add.image(this.yoshi.x, this.yoshi.y, "llamar").setVisible(false);

        //sonidos
        this.sonidoClick = this.sound.add("sonido3", { volume: 0.8 });

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
        this.cameras.main.zoomTo(1.3, 2000);

        // Luego sigue al jugador de manera fluida
        this.time.delayedCall(2000, () => {
            this.cameras.main.startFollow(this.yoshi, true, 0.05, 0.05);
            this.cameras.main.setZoom(1.3);
        });

        //LLAMADA
        this.LlamadaContainer = this.add.container().setVisible(false).setDepth(10000);
        //Cuadro
        const LlamadaFondo = this.add.rectangle(width / 2, height / 3.5, 660, 140, 0x1a1a2e)
            .setOrigin(0.5)
            .setScrollFactor(0);

        //Pregunta "texto"
        const textoNota = this.add.text(width / 2, height / 3.2 - 50, "Holaaa, Buenas noches...", {
            fontSize: '24px',
            fill: '#ffffff',
            fontFamily: 'Arial',
            align: 'center'
        }).setOrigin(0.5).setScrollFactor(0);

        //Respuesta (1a)
        this.botonReproducir = this.add.text( 420, height / 3.5 + 40, "Buenas, disculpe hace poco ocurrio un accidente...", {
            fontSize: '18px',
            fill: '#ffffff',
            fontFamily: 'Arial'
        }).setOrigin(0.5).setInteractive().setScrollFactor(0);
        //Respuest (2a)
        this.botonQuedarse = this.add.text( 420, height / 3.5 + 5, "Holaa, necesito ayuda con mi madre...", {
            fontSize: '18px',
            fill: '#ffffff',
            fontFamily: 'Arial'
        }).setOrigin(0.5).setInteractive().setScrollFactor(0);

        //Guardar
        this.LlamadaContainer.add([LlamadaFondo, textoNota, this.botonReproducir, this.botonQuedarse]);

        //(1a) Primera Opcion (Cita)
        this.botonReproducir.on('pointerdown', () => {
            this.LlamadaContainer.setVisible(true);
            this.mostrandoLlamada = true;
            this.sonidoClick.play();
               //Cuadro
               const LlamadaFondo = this.add.rectangle(width / 2, height / 3.5, 660, 140, 0x1a1a2e)
               .setOrigin(0.5)
               .setScrollFactor(0);
               //Pregunta Nueva
               const textoNota = this.add.text(width / 2, height / 3.5 - 40, "Oh si, ¿Que ocurre con eso?",{
                fontSize: '24px',
                fill: '#ffffff',
                fontFamily: 'Arial',
                align: 'center',
            }).setOrigin(0.5).setScrollFactor(0);
            //(1b)
            this.botonReproducir = this.add.text(width / 2 - 220, height / 3.5 + 20, "¿Alguien entró por esa hora?", {
                fontSize: '18px',
                fill: '#ffffff',
                fontFamily: 'Arial'
            }).setOrigin(0.5).setInteractive().setScrollFactor(0);
            //(2b)
            this.botonQuedarse = this.add.text(width / 2 + 170, height / 3.5 + 20, "¿Sabe el choque como fue?", {
                fontSize: '18px',
                fill: '#ffffff',
                fontFamily: 'Arial'
            }).setOrigin(0.5).setInteractive().setScrollFactor(0);
            
            //Guardar
            this.LlamadaContainer.add([LlamadaFondo, textoNota, this.botonReproducir, this.botonQuedarse]);
            
            //(1b)Primera Opcion (No vengo)
            this.botonReproducir.on('pointerdown', () => {
                this.LlamadaContainer.setVisible(true);
                this.mostrandoLlamada = true;
                //Cuadro
                const LlamadaFondo = this.add.rectangle(width / 2, height / 3.5, 660, 140, 0x1a1a2e)
                .setOrigin(0.5)
                .setScrollFactor(0);
                //Pregunta Nueva
                const textoNota = this.add.text(width / 2, height / 3.5 - 40, "Eeeh, una señora con algo de prisa", {
                    fontSize: '24px',
                    fill: '#ffffff',
                    fontFamily: 'Arial',
                    align: 'center'
                }).setOrigin(0.5).setScrollFactor(0);
                //Respuesta (1c)
                this.botonReproducir = this.add.text(width / 2 - 170, height / 3.5 + 20, "Y ella ¿iba sola?", {
                    fontSize: '18px',
                    fill: '#ffffff',
                    fontFamily: 'Arial'
                }).setOrigin(0.5).setInteractive().setScrollFactor(0);
                //(2c)
                this.botonQuedarse = this.add.text(width / 2 + 120, height / 3.5 + 20, "¿Vio a donde fue despúes?", {
                    fontSize: '18px',
                    fill: '#ffffff',
                    fontFamily: 'Arial'
                }).setOrigin(0.5).setInteractive().setScrollFactor(0);

                //Guardar
                this.LlamadaContainer.add([LlamadaFondo, textoNota, this.botonReproducir, this.botonQuedarse]);
                
                //(1c)Primera Opcion
                this.botonReproducir.on('pointerdown', () => {
                    this.LlamadaContainer.setVisible(true);
                    this.mostrandoLlamada = true;

                    //Cuadro
                    const LlamadaFondo = this.add.rectangle(width / 2, height / 3.5, 660, 140, 0x1a1a2e)
                    .setOrigin(0.5)
                    .setScrollFactor(0);

                    //Pregunta Nueva
                    const textoNota = this.add.text(width / 2, height / 3.5 - 40, "No, la esperaban afuera...", {
                        fontSize: '24px',
                        fill: '#ffffff',
                        fontFamily: 'Arial',
                        align: 'center'
                    }).setOrigin(0.5).setScrollFactor(0);
                    //Respuesta(1d)
                    this.botonReproducir = this.add.text(width / 2 - 100, height / 3.5 + 20, "Hmmm creo que ella no es", {
                        fontSize: '18px',
                        fill: '#ffffff',
                        fontFamily: 'Arial'
                    }).setOrigin(0.5).setInteractive().setScrollFactor(0);
                    //(2d)
                    this.botonQuedarse = this.add.text(width / 2 + 100, height / 3.5 + 20, "Okey, graciass", {
                        fontSize: '18px',
                        fill: '#ffffff',
                        fontFamily: 'Arial'
                    }).setOrigin(0.5).setInteractive().setScrollFactor(0);
                    
                    //Guardar
                    this.LlamadaContainer.add([LlamadaFondo, textoNota, this.botonReproducir, this.botonQuedarse]);
                    
                    //(1d)Primera Opcion
                    this.botonReproducir.on('pointerdown', () => {
                        this.LlamadaContainer.setVisible(false);
                        this.mostrandoLlamada = false;
                        this.sonidoClick.pause();
                        
                    });
                    

                    //(2d)Segunda Opcion
                    this.botonQuedarse.on('pointerdown', () => {
                        this.LlamadaContainer.setVisible(false);
                        this.mostrandoLlamada = false;
                        this.sonidoClick.pause();
                        
                    });
                    
                });

                //(2c)Segunda Opcion
                this.botonQuedarse.on('pointerdown', () => {
                    this.LlamadaContainer.setVisible(true);
                    this.mostrandoLlamada = true;
                    //this.sonidoClick.pause();

                    //Cuadro
                    const LlamadaFondo = this.add.rectangle(width / 2, height / 3.5, 660, 140, 0x1a1a2e)
                    .setOrigin(0.5)
                    .setScrollFactor(0);

                    //Pregunta Nueva
                    const textoNota = this.add.text(width / 2, height / 3.5 - 40, "Me parece es de la casita de aqui... del 32", {
                        fontSize: '24px',
                        fill: '#ffffff',
                        fontFamily: 'Arial',
                        align: 'center'
                    }).setOrigin(0.5).setScrollFactor(0);
                    //Respuesta(1d)
                    this.botonReproducir = this.add.text(width / 2 - 100, height / 3.5 + 20, "Ohh ya, iré a ver", {
                        fontSize: '18px',
                        fill: '#ffffff',
                        fontFamily: 'Arial'
                    }).setOrigin(0.5).setInteractive().setScrollFactor(0);
                    //(2d)
                    this.botonQuedarse = this.add.text(width / 2 + 100, height / 3.5 + 20, "Hmm me equivoqué entonces...", {
                        fontSize: '18px',
                        fill: '#ffffff',
                        fontFamily: 'Arial'
                    }).setOrigin(0.5).setInteractive().setScrollFactor(0);
                    
                    //Guardar
                    this.LlamadaContainer.add([LlamadaFondo, textoNota, this.botonReproducir, this.botonQuedarse]);
                    
                    //(1d)Primera Opcion
                    this.botonReproducir.on('pointerdown', () => {
                        this.LlamadaContainer.setVisible(false);
                        this.mostrandoLlamada = false;
                        this.sonidoClick.pause();
                        
                    });
                    
                    //(2d)Segunda Opcion
                    this.botonQuedarse.on('pointerdown', () => {
                        this.LlamadaContainer.setVisible(false);
                        this.mostrandoLlamada = false;
                        this.sonidoClick.pause();
                        
                    });


                });
                    
                
            });
            
            //(2b)Segunda Opcion (Ruta de salida)
            this.botonQuedarse.on('pointerdown', () => {
                this.LlamadaContainer.setVisible(true);
                this.mostrandoLlamada = true;
                //this.sonidoClick.pause();
                
                //Cuadro
                const LlamadaFondo = this.add.rectangle(width / 2, height / 3.5, 660, 140, 0x1a1a2e)
                .setOrigin(0.5)
                .setScrollFactor(0);
                
                //Pregunta Nueva
                const textoNota = this.add.text(width / 2, height / 3.5 - 40, "Dicen que fue culpa de un boracho...", {
                    fontSize: '24px',
                    fill: '#ffffff',
                    fontFamily: 'Arial',
                    align: 'center'
                }).setOrigin(0.5).setScrollFactor(0);
                //Respuesta (1c)
                this.botonReproducir = this.add.text(width / 2 - 80, height / 3.5 + 20, "¿Sabe si hay video de eso?", {
                    fontSize: '18px',
                    fill: '#ffffff',
                    fontFamily: 'Arial'
                }).setOrigin(0.5).setInteractive().setScrollFactor(0);
                //(2c)
                this.botonQuedarse = this.add.text(width / 2 + 80, height / 3.5 + 20, "¿Quienes dicen eso?", {
                    fontSize: '18px',
                    fill: '#ffffff',
                    fontFamily: 'Arial'
                }).setOrigin(0.5).setInteractive().setScrollFactor(0);
                        
                //Guardar
                this.LlamadaContainer.add([LlamadaFondo, textoNota, this.botonReproducir, this.botonQuedarse]);
                        
                //(1c)Primera Opcion
                this.botonReproducir.on('pointerdown', () => {
                    this.LlamadaContainer.setVisible(true);
                    this.mostrandoLlamada = true;

                    //Cuadro
                    const LlamadaFondo = this.add.rectangle(width / 2, height / 3.5, 660, 140, 0x1a1a2e)
                    .setOrigin(0.5)
                    .setScrollFactor(0);
                            
                    //Pregunta Nueva
                    const textoNota = this.add.text(width / 2, height / 3.5 - 40, "No...disculpa", {
                        fontSize: '24px',
                        fill: '#ffffff',
                        fontFamily: 'Arial',
                        align: 'center'
                    }).setOrigin(0.5).setScrollFactor(0);
                            
                    //Respuesta(1d)
                    this.botonReproducir = this.add.text(width / 2 - 80, height / 3.5 + 20, "Diablos", {
                        fontSize: '18px',
                        fill: '#ffffff',
                        fontFamily: 'Arial'
                    }).setOrigin(0.5).setInteractive().setScrollFactor(0);
                            
                    //(2d)
                    this.botonQuedarse = this.add.text(width / 2 + 80, height / 3.5 + 20, "Hmm, gracias", {
                        fontSize: '18px',
                        fill: '#ffffff',
                        fontFamily: 'Arial'
                    }).setOrigin(0.5).setInteractive().setScrollFactor(0);
                            
                    //Guardar
                    this.LlamadaContainer.add([LlamadaFondo, textoNota, this.botonReproducir, this.botonQuedarse]);
                            
                    //(1d)Primera Opcion
                    this.botonReproducir.on('pointerdown', () => {
                        this.LlamadaContainer.setVisible(false);
                        this.mostrandoLlamada = false;
                        this.sonidoClick.pause();
                    });
                            
                    //(2d)Segunda Opcion
                    this.botonQuedarse.on('pointerdown', () => {
                        this.LlamadaContainer.setVisible(false);
                        this.mostrandoLlamada = false;
                         this.sonidoClick.pause();
                    });
                            
                });
                
                //(2c)Segunda Opcion
                this.botonQuedarse.on('pointerdown', () => {
                    this.LlamadaContainer.setVisible(true);
                    this.mostrandoLlamada = true;
                            
                    //Cuadro
                    const LlamadaFondo = this.add.rectangle(width / 2, height / 3.5, 660, 140, 0x1a1a2e)
                    .setOrigin(0.5)
                    .setScrollFactor(0);
                            
                    //Pregunta Nueva
                    const textoNota = this.add.text(width / 2, height / 3.5 - 40, "Los vecinos del otro lado de la calle...", {
                        fontSize: '24px',
                        fill: '#ffffff',
                        fontFamily: 'Arial',
                        align: 'center'
                    }).setOrigin(0.5).setScrollFactor(0);
                            
                    //Respuesta(1d)
                    this.botonReproducir = this.add.text(width / 2 - 80, height / 3.5 + 20, "Me queda cerca...", {
                        fontSize: '18px',
                        fill: '#ffffff',
                        fontFamily: 'Arial'
                    }).setOrigin(0.5).setInteractive().setScrollFactor(0);
                            
                    //(2d)
                    this.botonQuedarse = this.add.text(width / 2 + 80, height / 3.5 + 20, "Si serán chismosos...", {
                        fontSize: '18px',
                        fill: '#ffffff',
                        fontFamily: 'Arial'
                    }).setOrigin(0.5).setInteractive().setScrollFactor(0);
                            
                    //Guardar
                    this.LlamadaContainer.add([LlamadaFondo, textoNota, this.botonReproducir, this.botonQuedarse]);
                            
                    //(1d)Primera Opcion
                    this.botonReproducir.on('pointerdown', () => {
                        this.LlamadaContainer.setVisible(false);
                        this.mostrandoLlamada = false;
                        this.sonidoClick.pause();
                    });
                            
                    //(2d)Segunda Opcion
                    this.botonQuedarse.on('pointerdown', () => {
                        this.LlamadaContainer.setVisible(false);
                        this.mostrandoLlamada = false;
                        this.sonidoClick.pause();
                    });
                        
                });
                
            });
            
        }); ///////////////////  1  A  //////////

        //(2a) Segunda Opcion
        this.botonQuedarse.on('pointerdown', () => {
            this.LlamadaContainer.setVisible(true);
            this.mostrandoLlamada = true;
            this.sonidoClick.play();
               //Cuadro
               const LlamadaFondo = this.add.rectangle(width / 2, height / 3.5, 660, 140, 0x1a1a2e)
               .setOrigin(0.5)
               .setScrollFactor(0);
               //Pregunta Nueva
               const textoNota = this.add.text(width / 2, height / 3.5 - 40, "Si claro, ¿Como puedo ayudarte?",{
                fontSize: '24px',
                fill: '#ffffff',
                fontFamily: 'Arial',
                align: 'center',
            }).setOrigin(0.5).setScrollFactor(0);
            //(1b)
            this.botonReproducir = this.add.text(width / 2 - 200, height / 3.5 + 20, "Estuvo en el choque de ayer", {
                fontSize: '18px',
                fill: '#ffffff',
                fontFamily: 'Arial'
            }).setOrigin(0.5).setInteractive().setScrollFactor(0);
            //(2b)
            this.botonQuedarse = this.add.text(width / 2 + 170, height / 3.5 + 20, "Vio a alguien por esa hora", {
                fontSize: '18px',
                fill: '#ffffff',
                fontFamily: 'Arial'
            }).setOrigin(0.5).setInteractive().setScrollFactor(0);
            
            //Guardar
            this.LlamadaContainer.add([LlamadaFondo, textoNota, this.botonReproducir, this.botonQuedarse]);
            
            //(1b)Primera Opcion (No vengo)
            this.botonReproducir.on('pointerdown', () => {
                this.LlamadaContainer.setVisible(true);
                this.mostrandoLlamada = true;
                //Cuadro
                const LlamadaFondo = this.add.rectangle(width / 2, height / 3.5, 660, 140, 0x1a1a2e)
                .setOrigin(0.5)
                .setScrollFactor(0);
                //Pregunta Nueva
                const textoNota = this.add.text(width / 2, height / 3.5 - 40, "Escuche sobre eso... pero no vi nada", {
                    fontSize: '24px',
                    fill: '#ffffff',
                    fontFamily: 'Arial',
                    align: 'center'
                }).setOrigin(0.5).setScrollFactor(0);
                //Respuesta (1c)
                this.botonReproducir = this.add.text(width / 2 - 170, height / 3.5 + 20, "¿Y a esa hora pasó algún otro coche?", {
                    fontSize: '18px',
                    fill: '#ffffff',
                    fontFamily: 'Arial'
                }).setOrigin(0.5).setInteractive().setScrollFactor(0);
                //(2c)
                this.botonQuedarse = this.add.text(width / 2 + 120, height / 3.5 + 20, "¿Alguien compró cerca de esa hora?", {
                    fontSize: '18px',
                    fill: '#ffffff',
                    fontFamily: 'Arial'
                }).setOrigin(0.5).setInteractive().setScrollFactor(0);

                //Guardar
                this.LlamadaContainer.add([LlamadaFondo, textoNota, this.botonReproducir, this.botonQuedarse]);
                
                //(1c)Primera Opcion
                this.botonReproducir.on('pointerdown', () => {
                    this.LlamadaContainer.setVisible(true);
                    this.mostrandoLlamada = true;

                    //Cuadro
                    const LlamadaFondo = this.add.rectangle(width / 2, height / 3.5, 660, 140, 0x1a1a2e)
                    .setOrigin(0.5)
                    .setScrollFactor(0);

                    //Pregunta Nueva
                    const textoNota = this.add.text(width / 2, height / 3.5 - 40, "Me parece que fue un coche blanco", {
                        fontSize: '24px',
                        fill: '#ffffff',
                        fontFamily: 'Arial',
                        align: 'center'
                    }).setOrigin(0.5).setScrollFactor(0);
                    //Respuesta(1d)
                    this.botonReproducir = this.add.text(width / 2 - 80, height / 3.5 + 20, "Bien, me sirve eso", {
                        fontSize: '18px',
                        fill: '#ffffff',
                        fontFamily: 'Arial'
                    }).setOrigin(0.5).setInteractive().setScrollFactor(0);
                    //(2d)
                    this.botonQuedarse = this.add.text(width / 2 + 80, height / 3.5 + 20, "Esta bien... ¿Hay Maruchan?", {
                        fontSize: '18px',
                        fill: '#ffffff',
                        fontFamily: 'Arial'
                    }).setOrigin(0.5).setInteractive().setScrollFactor(0);
                    
                    //Guardar
                    this.LlamadaContainer.add([LlamadaFondo, textoNota, this.botonReproducir, this.botonQuedarse]);
                    
                    //(1d)Primera Opcion
                    this.botonReproducir.on('pointerdown', () => {
                        this.LlamadaContainer.setVisible(false);
                        this.mostrandoLlamada = false;
                        this.sonidoClick.pause();
                        
                    });
                    

                    //(2d)Segunda Opcion
                    this.botonQuedarse.on('pointerdown', () => {
                        this.LlamadaContainer.setVisible(false);
                        this.mostrandoLlamada = false;
                        this.sonidoClick.pause();
                        
                    });
                    
                });

                //(2c)Segunda Opcion
                this.botonQuedarse.on('pointerdown', () => {
                    this.LlamadaContainer.setVisible(true);
                    this.mostrandoLlamada = true;
                    //this.sonidoClick.pause();

                    //Cuadro
                    const LlamadaFondo = this.add.rectangle(width / 2, height / 3.5, 660, 140, 0x1a1a2e)
                    .setOrigin(0.5)
                    .setScrollFactor(0);

                    //Pregunta Nueva
                    const textoNota = this.add.text(width / 2, height / 3.5 - 40, "Si, una señora de la otra calle...", {
                        fontSize: '24px',
                        fill: '#ffffff',
                        fontFamily: 'Arial',
                        align: 'center'
                    }).setOrigin(0.5).setScrollFactor(0);
                    //Respuesta(1d)
                    this.botonReproducir = this.add.text(width / 2 - 80, height / 3.5 + 20, "Gracias, preguntaré", {
                        fontSize: '18px',
                        fill: '#ffffff',
                        fontFamily: 'Arial'
                    }).setOrigin(0.5).setInteractive().setScrollFactor(0);
                    //(2d)
                    this.botonQuedarse = this.add.text(width / 2 + 80, height / 3.5 + 20, "Hmmm...", {
                        fontSize: '18px',
                        fill: '#ffffff',
                        fontFamily: 'Arial'
                    }).setOrigin(0.5).setInteractive().setScrollFactor(0);
                    
                    //Guardar
                    this.LlamadaContainer.add([LlamadaFondo, textoNota, this.botonReproducir, this.botonQuedarse]);
                    
                    //(1d)Primera Opcion
                    this.botonReproducir.on('pointerdown', () => {
                        this.LlamadaContainer.setVisible(false);
                        this.mostrandoLlamada = false;
                        this.sonidoClick.pause();
                        
                    });
                    
                    //(2d)Segunda Opcion
                    this.botonQuedarse.on('pointerdown', () => {
                        this.LlamadaContainer.setVisible(false);
                        this.mostrandoLlamada = false;
                        this.sonidoClick.pause();
                        
                    });


                });
                    
                
            });
            
            //(2b)Segunda Opcion (Ruta de salida)
            this.botonQuedarse.on('pointerdown', () => {
                this.LlamadaContainer.setVisible(true);
                this.mostrandoLlamada = true;
                //this.sonidoClick.pause();
                
                //Cuadro
                const LlamadaFondo = this.add.rectangle(width / 2, height / 3.5, 660, 140, 0x1a1a2e)
                .setOrigin(0.5)
                .setScrollFactor(0);
                
                //Pregunta Nueva
                const textoNota = this.add.text(width / 2, height / 3.5 - 40, "Una madre con su hijo...de la otra calle", {
                    fontSize: '24px',
                    fill: '#ffffff',
                    fontFamily: 'Arial',
                    align: 'center'
                }).setOrigin(0.5).setScrollFactor(0);
                //Respuesta (1c)
                this.botonReproducir = this.add.text(width / 2 - 80, height / 3.5 + 20, "¿Vio a alguien más?", {
                    fontSize: '18px',
                    fill: '#ffffff',
                    fontFamily: 'Arial'
                }).setOrigin(0.5).setInteractive().setScrollFactor(0);
                //(2c)
                this.botonQuedarse = this.add.text(width / 2 + 80, height / 3.5 + 20, "¿Eran de aquí?", {
                    fontSize: '18px',
                    fill: '#ffffff',
                    fontFamily: 'Arial'
                }).setOrigin(0.5).setInteractive().setScrollFactor(0);
                        
                //Guardar
                this.LlamadaContainer.add([LlamadaFondo, textoNota, this.botonReproducir, this.botonQuedarse]);
                        
                //(1c)Primera Opcion
                this.botonReproducir.on('pointerdown', () => {
                    this.LlamadaContainer.setVisible(true);
                    this.mostrandoLlamada = true;

                    //Cuadro
                    const LlamadaFondo = this.add.rectangle(width / 2, height / 3.5, 660, 140, 0x1a1a2e)
                    .setOrigin(0.5)
                    .setScrollFactor(0);
                            
                    //Pregunta Nueva
                    const textoNota = this.add.text(width / 2, height / 3.5 - 40, "Hmmm...si, un tipo raro", {
                        fontSize: '24px',
                        fill: '#ffffff',
                        fontFamily: 'Arial',
                        align: 'center'
                    }).setOrigin(0.5).setScrollFactor(0);
                            
                    //Respuesta(1d)
                    this.botonReproducir = this.add.text(width / 2 - 80, height / 3.5 + 20, "No se quien es...", {
                        fontSize: '18px',
                        fill: '#ffffff',
                        fontFamily: 'Arial'
                    }).setOrigin(0.5).setInteractive().setScrollFactor(0);
                            
                    //(2d)
                    this.botonQuedarse = this.add.text(width / 2 + 80, height / 3.5 + 20, "Lo buscaré", {
                        fontSize: '18px',
                        fill: '#ffffff',
                        fontFamily: 'Arial'
                    }).setOrigin(0.5).setInteractive().setScrollFactor(0);
                            
                    //Guardar
                    this.LlamadaContainer.add([LlamadaFondo, textoNota, this.botonReproducir, this.botonQuedarse]);
                            
                    //(1d)Primera Opcion
                    this.botonReproducir.on('pointerdown', () => {
                        this.LlamadaContainer.setVisible(false);
                        this.mostrandoLlamada = false;
                        this.sonidoClick.pause();
                    });
                            
                    //(2d)Segunda Opcion
                    this.botonQuedarse.on('pointerdown', () => {
                        this.LlamadaContainer.setVisible(false);
                        this.mostrandoLlamada = false;
                         this.sonidoClick.pause();
                    });
                            
                });
                
                //(2c)Segunda Opcion
                this.botonQuedarse.on('pointerdown', () => {
                    this.LlamadaContainer.setVisible(true);
                    this.mostrandoLlamada = true;
                            
                    //Cuadro
                    const LlamadaFondo = this.add.rectangle(width / 2, height / 3.5, 660, 140, 0x1a1a2e)
                    .setOrigin(0.5)
                    .setScrollFactor(0);
                            
                    //Pregunta Nueva
                    const textoNota = this.add.text(width / 2, height / 3.5 - 40, "Si, de la otra calle...", {
                        fontSize: '24px',
                        fill: '#ffffff',
                        fontFamily: 'Arial',
                        align: 'center'
                    }).setOrigin(0.5).setScrollFactor(0);
                            
                    //Respuesta(1d)
                    this.botonReproducir = this.add.text(width / 2 - 80, height / 3.5 + 20, "Ohh..graciass", {
                        fontSize: '18px',
                        fill: '#ffffff',
                        fontFamily: 'Arial'
                    }).setOrigin(0.5).setInteractive().setScrollFactor(0);
                            
                    //(2d)
                    this.botonQuedarse = this.add.text(width / 2 + 80, height / 3.5 + 20, "Besosss", {
                        fontSize: '18px',
                        fill: '#ffffff',
                        fontFamily: 'Arial'
                    }).setOrigin(0.5).setInteractive().setScrollFactor(0);
                            
                    //Guardar
                    this.LlamadaContainer.add([LlamadaFondo, textoNota, this.botonReproducir, this.botonQuedarse]);
                            
                    //(1d)Primera Opcion
                    this.botonReproducir.on('pointerdown', () => {
                        this.LlamadaContainer.setVisible(false);
                        this.mostrandoLlamada = false;
                        this.sonidoClick.pause();
                    });
                            
                    //(2d)Segunda Opcion
                    this.botonQuedarse.on('pointerdown', () => {
                        this.LlamadaContainer.setVisible(false);
                        this.mostrandoLlamada = false;
                        this.sonidoClick.pause();
                    });
                        
                });
                
            });
            
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

        const sobrellamada = this.yoshi.x > 640 && this.yoshi.x < 700;
        if (sobrellamada && Phaser.Input.Keyboard.JustDown(this.keys.abajo) && !this.mostrandoLlamada && !this.durmiendo && !this.cocinando) {
            this.mostrandoLlamada = true;
            this.LlamadaContainer.setVisible(true);
            return; // para evitaer que se activen otras interacciones
        }
  
        /*const sobreCama = Phaser.Geom.Intersects.RectangleToRectangle(this.yoshi.getBounds(), this.cama.getBounds());  
        if (sobreCama && Phaser.Input.Keyboard.JustDown(this.keys.abajo) && !this.durmiendo) {  
            this.dormir();  
        }*/

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
  
    /*dormir() {  
        this.durmiendo = false;  
        this.yoshi.setVisible(true);
        //this.sonido4.play();  
  
        const { width, height } = this.scale;  
        const fade = this.add.rectangle(0, 0, width, height, 0x000000)  
            .setOrigin(0, 0)  
            .setAlpha(0)  
            .setDepth(9999)  
            .setScrollFactor(0);  
  
        if (this.musica && this.musica.isPlaying) this.musica.stop();  
  
        this.tweens.add({  
            targets: fade,  
            alpha: 1,  
            duration: 1500,  
            ease: 'Linear',  
            onComplete: () => {  
                this.scene.start("Policia_into");  
            }  
        });  
    }*/

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
                this.scene.start("Gasolinera");
                this.musica.pause();   
            }  
        });  
    }
  
    
}

export default Gasolinera2;