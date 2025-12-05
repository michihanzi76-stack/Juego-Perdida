// Interrogatorios
class Vecino1 extends Phaser.Scene {  
    constructor() {  
        super({ 
            key: "Vecino1"
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

        this.load.image("vecino32", base + "vecino32.png");
        this.load.image("piso", base + "piso.png");

        this.load.image("chica", base + "vecina.png");

        this.load.audio("sonido3", base + "sonidos/sonido3.mp3");
        
    }  
  
    create() {  
        const { width, height } = this.scale;  
  
        const fondo = this.add.image(width / 2, height / 2, "vecino32");  
        //fondo.setScale(Math.max(width / fondo.width, height / fondo.height)).setScrollFactor(0);
        this.fondo = this.add.tileSprite(width/2, height/1.6, width, height, "vecino32");
        fondo.setScale(Math.max(width /2, height /2)).setScrollFactor(2);

         this.physics.world.setBounds(0, 0, width, height);

        const sueloAltura = 20;  
        this.suelo = this.physics.add.staticImage(width / 2, height - sueloAltura / 2, "piso")
            .setDisplaySize(width, sueloAltura).refreshBody();  
  
        this.cama = this.physics.add.staticImage(70, height - sueloAltura - 100, "Fizquierda")
            .setScale(0.7).refreshBody();
            
        this.cocina = this.physics.add.staticImage(970, height - sueloAltura - 100, "Fderecha")
            .setScale(0.7).refreshBody();
        
        this.llamada = this.physics.add.staticImage(800, height - sueloAltura - 150, "chica")  
            .setScale(0.30).refreshBody();
  
        this.yoshi = this.physics.add.sprite(width / 2, height - sueloAltura - 95, "yoshi", 0)
            .setCollideWorldBounds(true)  
            .setScale(.37);  
        this.yoshi.body.setSize(200, 450);  
  
        this.yoshiDormido = this.add.image(this.yoshi.x, this.yoshi.y, "dormir").setVisible(false);
        this.yoshiCocina = this.add.image(this.yoshi.x, this.yoshi.y, "cocinar").setVisible(false);

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
        this.cameras.main.zoomTo(1.4, 2000);

        // Luego sigue al jugador de manera fluida
        this.time.delayedCall(2000, () => {
            this.cameras.main.startFollow(this.yoshi, true, 0.05, 0.05);
            this.cameras.main.setZoom(1.4);
        });

        //LLAMADA
        this.LlamadaContainer = this.add.container().setVisible(false).setDepth(10000);
        //Cuadro
        const LlamadaFondo = this.add.rectangle(width / 2, height / 3.5, 660, 140, 0x1a1a2e)
            .setOrigin(0.5)
            .setScrollFactor(0);

        //Pregunta "texto"
        const textoNota = this.add.text(width / 2, height / 3.2 - 50, "Ya es noche niña, ¿Que haces sola a esta hora?", {
            fontSize: '24px',
            fill: '#ffffff',
            fontFamily: 'Arial',
            align: 'center'
        }).setOrigin(0.5).setScrollFactor(0);

        //Respuesta (1a)
        this.botonReproducir = this.add.text( 420, height / 3.5 + 40, "Disculpe...¿usted estuvo aquí durante el accidente?", {
            fontSize: '18px',
            fill: '#ffffff',
            fontFamily: 'Arial'
        }).setOrigin(0.5).setInteractive().setScrollFactor(0);
        //Respuest (2a)
        this.botonQuedarse = this.add.text( 420, height / 3.5 + 5, "Buenas noches, venia a pedirle de su ayuda", {
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
               const textoNota = this.add.text(width / 2, height / 3.5 - 40, "¿A esa hora? Iba de camino al oxxo",{
                fontSize: '24px',
                fill: '#ffffff',
                fontFamily: 'Arial',
                align: 'center',
            }).setOrigin(0.5).setScrollFactor(0);
            //(1b)
            this.botonReproducir = this.add.text(width / 2 - 200, height / 3.5 + 20, "¿Y vio algo?", {
                fontSize: '18px',
                fill: '#ffffff',
                fontFamily: 'Arial'
            }).setOrigin(0.5).setInteractive().setScrollFactor(0);
            //(2b)
            this.botonQuedarse = this.add.text(width / 2 + 170, height / 3.5 + 20, "¿Iba sola?", {
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
                const textoNota = this.add.text(width / 2, height / 3.5 - 40, "Si, el camión iba algo rapido", {
                    fontSize: '24px',
                    fill: '#ffffff',
                    fontFamily: 'Arial',
                    align: 'center'
                }).setOrigin(0.5).setScrollFactor(0);
                //Respuesta (1c)
                this.botonReproducir = this.add.text(width / 2 - 170, height / 3.5 + 20, "¿Vio algun otro coche?", {
                    fontSize: '18px',
                    fill: '#ffffff',
                    fontFamily: 'Arial'
                }).setOrigin(0.5).setInteractive().setScrollFactor(0);
                //(2c)
                this.botonQuedarse = this.add.text(width / 2 + 120, height / 3.5 + 20, "¿Alcanzó a ver el accidente?", {
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
                    const textoNota = this.add.text(width / 2, height / 3.5 - 40, "Si, uno blanco...", {
                        fontSize: '24px',
                        fill: '#ffffff',
                        fontFamily: 'Arial',
                        align: 'center'
                    }).setOrigin(0.5).setScrollFactor(0);
                    //Respuesta(1d)
                    this.botonReproducir = this.add.text(width / 2 - 100, height / 3.5 + 20, "¿Blanco?...", {
                        fontSize: '18px',
                        fill: '#ffffff',
                        fontFamily: 'Arial'
                    }).setOrigin(0.5).setInteractive().setScrollFactor(0);
                    //(2d)
                    this.botonQuedarse = this.add.text(width / 2 + 100, height / 3.5 + 20, "Creí que era de madrugada...", {
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
                    const textoNota = this.add.text(width / 2, height / 3.5 - 40, "Noo, disculpame", {
                        fontSize: '24px',
                        fill: '#ffffff',
                        fontFamily: 'Arial',
                        align: 'center'
                    }).setOrigin(0.5).setScrollFactor(0);
                    //Respuesta(1d)
                    this.botonReproducir = this.add.text(width / 2 - 100, height / 3.5 + 20, "Hmm...graciass...", {
                        fontSize: '18px',
                        fill: '#ffffff',
                        fontFamily: 'Arial'
                    }).setOrigin(0.5).setInteractive().setScrollFactor(0);
                    //(2d)
                    this.botonQuedarse = this.add.text(width / 2 + 100, height / 3.5 + 20, "Ayyy :(", {
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
                const textoNota = this.add.text(width / 2, height / 3.5 - 40, "No, no... iba con mi Nieto...", {
                    fontSize: '24px',
                    fill: '#ffffff',
                    fontFamily: 'Arial',
                    align: 'center'
                }).setOrigin(0.5).setScrollFactor(0);
                //Respuesta (1c)
                this.botonReproducir = this.add.text(width / 2 - 80, height / 3.5 + 20, "¿Iban en carro?", {
                    fontSize: '18px',
                    fill: '#ffffff',
                    fontFamily: 'Arial'
                }).setOrigin(0.5).setInteractive().setScrollFactor(0);
                //(2c)
                this.botonQuedarse = this.add.text(width / 2 + 80, height / 3.5 + 20, "¿Vio algun otro coche?", {
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
                    const textoNota = this.add.text(width / 2, height / 3.5 - 40, "Si, de ahi iriamos a su casa...", {
                        fontSize: '24px',
                        fill: '#ffffff',
                        fontFamily: 'Arial',
                        align: 'center'
                    }).setOrigin(0.5).setScrollFactor(0);
                            
                    //Respuesta(1d)
                    this.botonReproducir = this.add.text(width / 2 - 80, height / 3.5 + 20, "Ohh, ya veo.", {
                        fontSize: '18px',
                        fill: '#ffffff',
                        fontFamily: 'Arial'
                    }).setOrigin(0.5).setInteractive().setScrollFactor(0);
                            
                    //(2d)
                    this.botonQuedarse = this.add.text(width / 2 + 80, height / 3.5 + 20, "Interesante...", {
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
                    const textoNota = this.add.text(width / 2, height / 3.5 - 40, "No, solo otro camión...", {
                        fontSize: '24px',
                        fill: '#ffffff',
                        fontFamily: 'Arial',
                        align: 'center'
                    }).setOrigin(0.5).setScrollFactor(0);
                            
                    //Respuesta(1d)
                    this.botonReproducir = this.add.text(width / 2 - 80, height / 3.5 + 20, "Entonces fue el primero...", {
                        fontSize: '18px',
                        fill: '#ffffff',
                        fontFamily: 'Arial'
                    }).setOrigin(0.5).setInteractive().setScrollFactor(0);
                            
                    //(2d)
                    this.botonQuedarse = this.add.text(width / 2 + 80, height / 3.5 + 20, "Diablos", {
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
               const textoNota = this.add.text(width / 2, height / 3.5 - 40, "Si, dime que necesitas...",{
                fontSize: '24px',
                fill: '#ffffff',
                fontFamily: 'Arial',
                align: 'center',
            }).setOrigin(0.5).setScrollFactor(0);
            //(1b)
            this.botonReproducir = this.add.text(width / 2 - 200, height / 3.5 + 20, "¿Tiene camaras de vigilancia?", {
                fontSize: '18px',
                fill: '#ffffff',
                fontFamily: 'Arial'
            }).setOrigin(0.5).setInteractive().setScrollFactor(0);
            //(2b)
            this.botonQuedarse = this.add.text(width / 2 + 170, height / 3.5 + 20, "¿Hay otra forma?", {
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
                const textoNota = this.add.text(width / 2, height / 3.5 - 40, "Sip, graban las 24hr, ya sabes...mi edad.", {
                    fontSize: '24px',
                    fill: '#ffffff',
                    fontFamily: 'Arial',
                    align: 'center'
                }).setOrigin(0.5).setScrollFactor(0);
                //Respuesta (1c)
                this.botonReproducir = this.add.text(width / 2 - 170, height / 3.5 + 20, "¿Podría darme alguna copia?", {
                    fontSize: '18px',
                    fill: '#ffffff',
                    fontFamily: 'Arial'
                }).setOrigin(0.5).setInteractive().setScrollFactor(0);
                //(2c)
                this.botonQuedarse = this.add.text(width / 2 + 120, height / 3.5 + 20, "¿Grabó el accidente?", {
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
                    const textoNota = this.add.text(width / 2, height / 3.5 - 40, "Hmm no sabria...Lo siento...", {
                        fontSize: '24px',
                        fill: '#ffffff',
                        fontFamily: 'Arial',
                        align: 'center'
                    }).setOrigin(0.5).setScrollFactor(0);
                    //Respuesta(1d)
                    this.botonReproducir = this.add.text(width / 2 - 80, height / 3.5 + 20, "Ushh...", {
                        fontSize: '18px',
                        fill: '#ffffff',
                        fontFamily: 'Arial'
                    }).setOrigin(0.5).setInteractive().setScrollFactor(0);
                    //(2d)
                    this.botonQuedarse = this.add.text(width / 2 + 80, height / 3.5 + 20, "No se preocupe...", {
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
                    const textoNota = this.add.text(width / 2, height / 3.5 - 40, "Uuy, no...solo se ve el camión...", {
                        fontSize: '24px',
                        fill: '#ffffff',
                        fontFamily: 'Arial',
                        align: 'center'
                    }).setOrigin(0.5).setScrollFactor(0);
                    //Respuesta(1d)
                    this.botonReproducir = this.add.text(width / 2 - 80, height / 3.5 + 20, "Esta bien...", {
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
                const textoNota = this.add.text(width / 2, height / 3.5 - 40, "Pregunta en la otra calle, son re chismosos...", {
                    fontSize: '24px',
                    fill: '#ffffff',
                    fontFamily: 'Arial',
                    align: 'center'
                }).setOrigin(0.5).setScrollFactor(0);
                //Respuesta (1c)
                this.botonReproducir = this.add.text(width / 2 - 80, height / 3.5 + 20, "¿A alguen en especifico?", {
                    fontSize: '18px',
                    fill: '#ffffff',
                    fontFamily: 'Arial'
                }).setOrigin(0.5).setInteractive().setScrollFactor(0);
                //(2c)
                this.botonQuedarse = this.add.text(width / 2 + 80, height / 3.5 + 20, "Adivino, a la seño de la 32", {
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
                    const textoNota = this.add.text(width / 2, height / 3.5 - 40, "A la seño de la 32", {
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
                    this.botonQuedarse = this.add.text(width / 2 + 80, height / 3.5 + 20, "La buscaré", {
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
                    this.botonQuedarse = this.add.text(width / 2 + 80, height / 3.5 + 20, "Cuidese", {
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

        const sobrellamada = this.yoshi.x > 750 && this.yoshi.x < 830;
        if (sobrellamada && Phaser.Input.Keyboard.JustDown(this.keys.abajo) && !this.mostrandoLlamada && !this.durmiendo && !this.cocinando) {
            this.mostrandoLlamada = true;
            this.LlamadaContainer.setVisible(true);
            return; // para evitaer que se activen otras interacciones
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
                this.scene.start("Vecino");  
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
                this.scene.start("Vecino2");  
            }  
        });  
    }
  
    
}

export default Vecino1;