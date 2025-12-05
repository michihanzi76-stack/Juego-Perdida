// CASA P1
class Trabajo extends Phaser.Scene {  
    constructor() {  
        super({ 
            key: "Trabajo"
        });  
        this.durmiendo = false;  
        this.pausado = false;
        this.cocinando = false;
        this.comiendo = false;
        //this.llamando = false;

        this.mostrandoLlamada = false;
        this.mostrandoDialogo = false;
    }

    init() {
    }

    preload() {  
        this.load.path = "./assets/";
    
        this.load.image("yoshi", "yoshi.png", { frameWidth: 15, frameHeight: 36 });
        this.load.image("chica", "chica.png");
        this.load.image("fondo_trabajo", "fondo_trabajo.png");
        //this.load.image("fondo_menu", base + "fondo_menu.png");
        this.load.image("piso", "piso.png");

        this.load.audio("sonido3", "sonidos/sonido3.mp3");
        this.load.image("Ticket_Bus", "Ticket_Bus.png");
        this.load.image("Lista_Bus", "Lista_Bus.png");
        //this.load.image("mapa", base + "mapa.png");
        //this.load.image("comedor", base + "comedor.png");
        this.load.image("Fderecha", "Fderecha.png");
        this.load.image("Fizquierda", "Fizquierda.png");
        this.load.image("Farriba", "Farriba.png");
        this.load.image("Fabajo", "Fabajo.png");

        this.load.audio("Oficina","sonidos/Oficina.mp3");

        
    }  

    create() { 

         //Sonido
         this.musica = this.sound.add("Oficina", { volume: 0.3, loop: false });
         this.musica.play();
         

        //FONDO
        const { width, height } = this.scale;  

        const fondo = this.add.image(width / 2, height / 2, "fondo_trabajo");
        this.fondo = this.add.tileSprite(width/2, height/1.55, width, height, "fondo_trabajo");
        fondo.setScale(Math.max(width /2, height /2)).setScrollFactor(2);

        this.physics.world.setBounds(0, 0, width, height);

        //sonidos
        this.sonidoClick = this.sound.add("sonido3", { volume: 0.8 });
        // Música de fondo
        /*this.musica = this.sound.add("sonido_fondo", { volume: 0.4, loop: true });
        this.musica.play();*/


        const sueloAltura = 20;  
        this.suelo = this.physics.add.staticImage(width / 2, height - sueloAltura / 2, "piso")  
            .setDisplaySize(width, sueloAltura).refreshBody();  

        this.cama = this.physics.add.staticImage(80, height - sueloAltura - 100, "Farriba")  
            .setScale(0.7).refreshBody();
        
        this.cocina = this.physics.add.staticImage(970, height - sueloAltura - 100, "Fderecha")  
            .setScale(0.7).refreshBody();
        
         this.comedor = this.physics.add.staticImage(480, height - sueloAltura - 100, "Fabajo")  
            .setScale(0.7).refreshBody();
        
        this.llamada = this.physics.add.staticImage(720, height - sueloAltura - 180, "chica")  
            .setScale(0.35).refreshBody();
        
        this.yoshi = this.physics.add.sprite(width / 2, height - sueloAltura - 95, "yoshi", 0)
            .setOrigin(0.5).setInteractive()
            .setCollideWorldBounds(true)  
            .setScale(.42);  
        this.yoshi.body.setSize(200, 450);

        //Animacion

        this.tweens.add({
            targets:this.cocina,
            y: 500,
            yoyo: true,
            duration: 3000,
            repeat: -1,
            ease: "Sine.easeInOut"
        });

        this.tweens.add({
            targets:this.cama,
            y: 500,
            yoyo: true,
            duration: 3000,
            repeat: -1,
            ease: "Sine.easeInOut"
        });

        this.tweens.add({
            targets:this.comedor,
            y: 500,
            yoyo: true,
            duration: 3000,
            repeat: -1,
            ease: "Sine.easeInOut"
        });


        this.yoshiDormido = this.add.image(this.yoshi.x, this.yoshi.y, "dormir").setVisible(false);
        this.yoshiCocina = this.add.image(this.yoshi.x, this.yoshi.y, "cocinar").setVisible(false);
        this.yoshiLlamada = this.add.image(this.yoshi.x, this.yoshi.y, "llamar").setVisible(false);
        this.yoshiComedor = this.add.image(this.yoshi.x, this.yoshi.y, "comer").setVisible(false);  
  
        this.physics.add.collider(this.yoshi, this.suelo);  
        //this.physics.add.collider(this.yoshi, this.cama);
        //this.physics.add.collider(this.yoshi, this.cocina);
        //this.physics.add.collider(this.yoshi, this.llamada);

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

        //Pausa
        this.menuPausa = this.add.container(0, 0).setDepth(2000).setVisible(false);
        const panel = this.add.rectangle(width / 2, height / 1.5, 220, 150, 0x000000, 0.7);  
        const textoReanudar = this.add.text(width / 2, height / 1.5 - 30, "Continuar", { font: "20px Arial", fill: "#ffffff" })  
            .setOrigin(0.5).setInteractive();  
        const textoSalir = this.add.text(width / 2, height / 1.5 + 30, "Salir a Menú", { font: "20px Arial", fill: "#ffffff" })  
            .setOrigin(0.5).setInteractive();

        textoReanudar.on("pointerdown", () => this.reanudarJuego());
        textoSalir.on("pointerdown", () => this.scene.start("Bootloader"));
        this.menuPausa.add([panel, textoReanudar, textoSalir]);

        //la cámara
        this.cameras.main.setBounds(0, 0, width, height);
        this.cameras.main.setZoom(1);
        this.cameras.main.centerOn(0, height / 2);
        this.cameras.main.pan(this.yoshi.x, this.yoshi.y, 2000, 'Sine.easeInOut', true);
        this.cameras.main.zoomTo(1.4, 2000);
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
        const textoNota = this.add.text(width / 2, height / 3.2 - 40, "Buenas noches, ¿Tiene cita agendada?", {
            fontSize: '24px',
            fill: '#ffffff',
            fontFamily: 'Arial',
            align: 'center'
        }).setOrigin(0.5).setScrollFactor(0);

        //Respuesta (1a)
        this.botonReproducir = this.add.text(width / 2 - 120, height / 3.5 + 20, "No, no vengo a eso...", {
            fontSize: '18px',
            fill: '#ffffff',
            fontFamily: 'Arial'
        }).setOrigin(0.5).setInteractive().setScrollFactor(0);
        //Respuest (2a)
        this.botonQuedarse = this.add.text(width / 2 + 170, height / 3.5 + 20, "Ehh...trabajo aquí", {
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
               const textoNota = this.add.text(width / 2, height / 3.5 - 40, "Entonces agenda una cita... niña",{
                fontSize: '24px',
                fill: '#ffffff',
                fontFamily: 'Arial',
                align: 'center',
            }).setOrigin(0.5).setScrollFactor(0);
            //(1b)
            this.botonReproducir = this.add.text(width / 2 - 200, height / 3.5 + 20, "No vengo a eso señorita", {
                fontSize: '18px',
                fill: '#ffffff',
                fontFamily: 'Arial'
            }).setOrigin(0.5).setInteractive().setScrollFactor(0);
            //(2b)
            this.botonQuedarse = this.add.text(width / 2 + 170, height / 3.5 + 20, "¿Niña?, mi madre trabaja aquí", {
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
                const textoNota = this.add.text(width / 2, height / 3.5 - 40, "¡Ohh ya veo!...¿Eres nueva aquí no?", {
                    fontSize: '24px',
                    fill: '#ffffff',
                    fontFamily: 'Arial',
                    align: 'center'
                }).setOrigin(0.5).setScrollFactor(0);
                //Respuesta (1c)
                this.botonReproducir = this.add.text(width / 2 - 170, height / 3.5 + 20, "Si, eso... Ando un poco perdida", {
                    fontSize: '18px',
                    fill: '#ffffff',
                    fontFamily: 'Arial'
                }).setOrigin(0.5).setInteractive().setScrollFactor(0);
                //(2c)
                this.botonQuedarse = this.add.text(width / 2 + 120, height / 3.5 + 20, "No...Ocurrió un incidente", {
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
                    const textoNota = this.add.text(width / 2, height / 3.5 - 40, "No te preocupes, te doy acceso", {
                        fontSize: '24px',
                        fill: '#ffffff',
                        fontFamily: 'Arial',
                        align: 'center'
                    }).setOrigin(0.5).setScrollFactor(0);
                    //Respuesta(1d)
                    this.botonReproducir = this.add.text(width / 2 - 80, height / 3.5 + 20, "Siguiente", {
                        fontSize: '18px',
                        fill: '#ffffff',
                        fontFamily: 'Arial'
                    }).setOrigin(0.5).setInteractive().setScrollFactor(0);
                    //(2d)
                    this.botonQuedarse = this.add.text(width / 2 + 80, height / 3.5 + 20, "Colgar", {
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
                    const textoNota = this.add.text(width / 2, height / 3.5 - 40, "No te preocupes, te doy acceso", {
                        fontSize: '24px',
                        fill: '#ffffff',
                        fontFamily: 'Arial',
                        align: 'center'
                    }).setOrigin(0.5).setScrollFactor(0);
                    //Respuesta(1d)
                    this.botonReproducir = this.add.text(width / 2 - 80, height / 3.5 + 20, "Siguiente", {
                        fontSize: '18px',
                        fill: '#ffffff',
                        fontFamily: 'Arial'
                    }).setOrigin(0.5).setInteractive().setScrollFactor(0);
                    //(2d)
                    this.botonQuedarse = this.add.text(width / 2 + 80, height / 3.5 + 20, "Colgar", {
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
                const textoNota = this.add.text(width / 2, height / 3.5 - 40, "¡Ah!, disculpame...¿Y ella es?", {
                    fontSize: '24px',
                    fill: '#ffffff',
                    fontFamily: 'Arial',
                    align: 'center'
                }).setOrigin(0.5).setScrollFactor(0);
                //Respuesta (1c)
                this.botonReproducir = this.add.text(width / 2 - 80, height / 3.5 + 20, "Siguiente", {
                    fontSize: '18px',
                    fill: '#ffffff',
                    fontFamily: 'Arial'
                }).setOrigin(0.5).setInteractive().setScrollFactor(0);
                //(2c)
                this.botonQuedarse = this.add.text(width / 2 + 80, height / 3.5 + 20, "Colgar", {
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
                    const textoNota = this.add.text(width / 2, height / 3.5 - 40, "No te preocupes, te doy acceso", {
                        fontSize: '24px',
                        fill: '#ffffff',
                        fontFamily: 'Arial',
                        align: 'center'
                    }).setOrigin(0.5).setScrollFactor(0);
                            
                    //Respuesta(1d)
                    this.botonReproducir = this.add.text(width / 2 - 80, height / 3.5 + 20, "Siguiente", {
                        fontSize: '18px',
                        fill: '#ffffff',
                        fontFamily: 'Arial'
                    }).setOrigin(0.5).setInteractive().setScrollFactor(0);
                            
                    //(2d)
                    this.botonQuedarse = this.add.text(width / 2 + 80, height / 3.5 + 20, "Colgar", {
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
                    const textoNota = this.add.text(width / 2, height / 3.5 - 40, "No te preocupes, te doy acceso", {
                        fontSize: '24px',
                        fill: '#ffffff',
                        fontFamily: 'Arial',
                        align: 'center'
                    }).setOrigin(0.5).setScrollFactor(0);
                            
                    //Respuesta(1d)
                    this.botonReproducir = this.add.text(width / 2 - 80, height / 3.5 + 20, "Siguiente", {
                        fontSize: '18px',
                        fill: '#ffffff',
                        fontFamily: 'Arial'
                    }).setOrigin(0.5).setInteractive().setScrollFactor(0);
                            
                    //(2d)
                    this.botonQuedarse = this.add.text(width / 2 + 80, height / 3.5 + 20, "Colgar", {
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
               const textoNota = this.add.text(width / 2, height / 3.5 - 40, "Entonces agenda una cita... niña",{
                fontSize: '24px',
                fill: '#ffffff',
                fontFamily: 'Arial',
                align: 'center',
            }).setOrigin(0.5).setScrollFactor(0);
            //(1b)
            this.botonReproducir = this.add.text(width / 2 - 200, height / 3.5 + 20, "No vengo a eso señorita", {
                fontSize: '18px',
                fill: '#ffffff',
                fontFamily: 'Arial'
            }).setOrigin(0.5).setInteractive().setScrollFactor(0);
            //(2b)
            this.botonQuedarse = this.add.text(width / 2 + 170, height / 3.5 + 20, "¿Niña?, mi madre trabaja aquí", {
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
                const textoNota = this.add.text(width / 2, height / 3.5 - 40, "¡Ohh ya veo!...¿Eres nueva aquí no?", {
                    fontSize: '24px',
                    fill: '#ffffff',
                    fontFamily: 'Arial',
                    align: 'center'
                }).setOrigin(0.5).setScrollFactor(0);
                //Respuesta (1c)
                this.botonReproducir = this.add.text(width / 2 - 170, height / 3.5 + 20, "Si, eso... Ando un poco perdida", {
                    fontSize: '18px',
                    fill: '#ffffff',
                    fontFamily: 'Arial'
                }).setOrigin(0.5).setInteractive().setScrollFactor(0);
                //(2c)
                this.botonQuedarse = this.add.text(width / 2 + 120, height / 3.5 + 20, "No...Ocurrió un incidente", {
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
                    const textoNota = this.add.text(width / 2, height / 3.5 - 40, "No te preocupes, te doy acceso", {
                        fontSize: '24px',
                        fill: '#ffffff',
                        fontFamily: 'Arial',
                        align: 'center'
                    }).setOrigin(0.5).setScrollFactor(0);
                    //Respuesta(1d)
                    this.botonReproducir = this.add.text(width / 2 - 80, height / 3.5 + 20, "Siguiente", {
                        fontSize: '18px',
                        fill: '#ffffff',
                        fontFamily: 'Arial'
                    }).setOrigin(0.5).setInteractive().setScrollFactor(0);
                    //(2d)
                    this.botonQuedarse = this.add.text(width / 2 + 80, height / 3.5 + 20, "Colgar", {
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
                    const textoNota = this.add.text(width / 2, height / 3.5 - 40, "No te preocupes, te doy acceso", {
                        fontSize: '24px',
                        fill: '#ffffff',
                        fontFamily: 'Arial',
                        align: 'center'
                    }).setOrigin(0.5).setScrollFactor(0);
                    //Respuesta(1d)
                    this.botonReproducir = this.add.text(width / 2 - 80, height / 3.5 + 20, "Siguiente", {
                        fontSize: '18px',
                        fill: '#ffffff',
                        fontFamily: 'Arial'
                    }).setOrigin(0.5).setInteractive().setScrollFactor(0);
                    //(2d)
                    this.botonQuedarse = this.add.text(width / 2 + 80, height / 3.5 + 20, "Colgar", {
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
                const textoNota = this.add.text(width / 2, height / 3.5 - 40, "¡Ah!, disculpame...¿Y ella es?", {
                    fontSize: '24px',
                    fill: '#ffffff',
                    fontFamily: 'Arial',
                    align: 'center'
                }).setOrigin(0.5).setScrollFactor(0);
                //Respuesta (1c)
                this.botonReproducir = this.add.text(width / 2 - 80, height / 3.5 + 20, "Siguiente", {
                    fontSize: '18px',
                    fill: '#ffffff',
                    fontFamily: 'Arial'
                }).setOrigin(0.5).setInteractive().setScrollFactor(0);
                //(2c)
                this.botonQuedarse = this.add.text(width / 2 + 80, height / 3.5 + 20, "Colgar", {
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
                    const textoNota = this.add.text(width / 2, height / 3.5 - 40, "No te preocupes, te doy acceso", {
                        fontSize: '24px',
                        fill: '#ffffff',
                        fontFamily: 'Arial',
                        align: 'center'
                    }).setOrigin(0.5).setScrollFactor(0);
                            
                    //Respuesta(1d)
                    this.botonReproducir = this.add.text(width / 2 - 80, height / 3.5 + 20, "Siguiente", {
                        fontSize: '18px',
                        fill: '#ffffff',
                        fontFamily: 'Arial'
                    }).setOrigin(0.5).setInteractive().setScrollFactor(0);
                            
                    //(2d)
                    this.botonQuedarse = this.add.text(width / 2 + 80, height / 3.5 + 20, "Colgar", {
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
                    const textoNota = this.add.text(width / 2, height / 3.5 - 40, "No te preocupes, te doy acceso", {
                        fontSize: '24px',
                        fill: '#ffffff',
                        fontFamily: 'Arial',
                        align: 'center'
                    }).setOrigin(0.5).setScrollFactor(0);
                            
                    //Respuesta(1d)
                    this.botonReproducir = this.add.text(width / 2 - 80, height / 3.5 + 20, "Siguiente", {
                        fontSize: '18px',
                        fill: '#ffffff',
                        fontFamily: 'Arial'
                    }).setOrigin(0.5).setInteractive().setScrollFactor(0);
                            
                    //(2d)
                    this.botonQuedarse = this.add.text(width / 2 + 80, height / 3.5 + 20, "Colgar", {
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
        }

        /*if (this.mostrandoDialogo) return;  

        const speed = 170;  
        if (!this.mostrandoDialogo) {  
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
        }*/

        // interacción solo en zona izquierda
        /*const enZonaSalida = this.yoshi.x < 250 && this.yoshi.y > 450;
        if (enZonaSalida && Phaser.Input.Keyboard.JustDown(this.keys.abajo) && !this.mostrandoDialogo && !this.durmiendo && !this.cocinando) {
            this.mostrandoDialogo = true;
            this.dialogoContainer.setVisible(true);
            return; // para evitaer que se activen otras interacciones
        }*/

        const sobrellamada = this.yoshi.x > 640 && this.yoshi.x < 700;
        if (sobrellamada && Phaser.Input.Keyboard.JustDown(this.keys.abajo) && !this.mostrandoLlamada && !this.durmiendo && !this.cocinando) {
            this.mostrandoLlamada = true;
            this.LlamadaContainer.setVisible(true);
            return; // para evitaer que se activen otras interacciones
        }

        const sobrecocina = Phaser.Geom.Intersects.RectangleToRectangle(this.yoshi.getBounds(), this.cocina.getBounds());  
        if (sobrecocina && Phaser.Input.Keyboard.JustDown(this.keys.abajo) && !this.cocinando) {  
            this.cocinar();  
        }  

        const sobreCama = Phaser.Geom.Intersects.RectangleToRectangle(this.yoshi.getBounds(), this.cama.getBounds());  
        if (sobreCama && Phaser.Input.Keyboard.JustDown(this.keys.abajo) && !this.durmiendo) {  
            this.dormir();
            
        }

        const sobreComedor = Phaser.Geom.Intersects.RectangleToRectangle(this.yoshi.getBounds(), this.comedor.getBounds());  
        if (sobreComedor && Phaser.Input.Keyboard.JustDown(this.keys.abajo) && !this.comiendo) {  
            this.comer();  
        } 

       /* const sobrellamada = Phaser.Geom.Intersects.RectangleToRectangle(this.yoshi.getBounds(), this.llamada.getBounds());  
        if (sobrellamada && Phaser.Input.Keyboard.JustDown(this.keys.abajo) && !this.llamando) {  
            this.llamar();  
        }*/
        
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
                this.scene.start("Trabajo_piso");  
            }  
        });  
    }
    
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
                this.scene.start("Trabajo2");  
            }  
        });  
    }

    comer() {  
        this.comiendo = false;  
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
                this.scene.start("Mapa");
                this.musica.pause();
            }  
        });
    }


    /*dialogo() {  
        this.mostrandoDialogo = true;  
        this.yoshi.setVisible(false);  
        this.yoshiDormido.setPosition(this.yoshi.x, this.yoshi.y + 10);  
        this.yoshiDormido.setVisible(true);  

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
                this.scene.start("Escena2");  
            }  
        });  
    }*/

   /* llamar() {  
        this.llamando = false;  
        this.yoshi.setVisible(true);  
        this.yoshiLlamada.setPosition(this.yoshi.x, this.yoshi.y + 10);  
        this.yoshiLlamada.setVisible(true);  

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
                this.scene.start("Escena1A");  
            }  
        });  
    }*/
    

    levantar() {  
        
    }  
}

export default Trabajo;