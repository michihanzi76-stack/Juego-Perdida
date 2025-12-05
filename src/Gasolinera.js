//  Policia2
class Gasolinera extends Phaser.Scene {  
    constructor() {  
        super({ 
            key: "Gasolinera"
        });  
        this.durmiendo = false;  
        this.pausado = false;
        this.cocinando = false;
       // this.jalandoMueble = false;

       this.mostrandoLlamada = false;
       this.mostrandoDialogo = false;
       
    }

    init() {
    }
  
    preload() {  
        const base = "assets/";
        
        this.load.image("fondo_oxxo", base + "fondo_oxxo.png");
        this.load.image("gas", base + "gas_chico.png");

        this.load.audio("sonido3", base + "sonidos/sonido3.mp3");
        this.load.audio("Autopista", base + "sonidos/Autopista.mp3");

    }  
  
    create() { 

        //Sonido
         this.musica = this.sound.add("Autopista", { volume: 0.4, loop: false });
         this.musica.play();

        const { width, height } = this.scale;  
  
        /* this.musica = this.sound.add("musica2", { volume: 0.4, loop: true });  
        this.musica.play();  
        this.sonido4 = this.sound.add("sonido4", { volume: 0.8 }); */
  
        const fondo = this.add.image(width / 2, height / 2, "fondo_oxxo");  
        //fondo.setScale(Math.max(width / fondo.width, height / fondo.height)).setScrollFactor(0);
        this.fondo = this.add.tileSprite(width/2, height/1.6, width, height, "fondo_oxxo");
        fondo.setScale(Math.max(width /2, height /2)).setScrollFactor(2);

         this.physics.world.setBounds(0, 0, width, height);

        const sueloAltura = 20;  
        this.suelo = this.physics.add.staticImage(width / 2, height - sueloAltura / 2, "piso")  
            .setDisplaySize(width, sueloAltura).refreshBody();
  
        this.cama = this.physics.add.staticImage(100, height - sueloAltura - 80, "Farriba")  
            .setScale(0.7).refreshBody();
        
        this.comedor = this.physics.add.staticImage(495, height - sueloAltura - 110, "Farriba")  
            .setScale(0.7).refreshBody();

        this.llamada = this.physics.add.staticImage(700, height - sueloAltura - 120, "gas")  
            .setScale(0.09).refreshBody();
  
        this.yoshi = this.physics.add.sprite(100, height - sueloAltura - 95, "yoshi", 0)  
            .setCollideWorldBounds(true)  
            .setScale(.35);  
        this.yoshi.body.setSize(200, 450);  
  
        this.yoshiDormido = this.add.image(this.yoshi.x, this.yoshi.y, "dormir").setVisible(false);
        this.yoshiCocina = this.add.image(this.yoshi.x, this.yoshi.y, "cocinar").setVisible(false);
        this.yoshiComedor = this.add.image(this.yoshi.x, this.yoshi.y, "comer").setVisible(false);

        //sonidos
        this.sonidoClick = this.sound.add("sonido3", { volume: 0.8 });
        this.sonidoAutopista = this.sound.add("Autopista", { volume: 0.8 });

        //Animacion
        this.tweens.add({
            targets:this.cama,
            y: 480,
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

        this.tweens.add({
            targets:this.comedor,
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
        const textoNota = this.add.text(width / 2, height / 3.2 - 50, "Buenass", {
            fontSize: '24px',
            fill: '#ffffff',
            fontFamily: 'Arial',
            align: 'center'
        }).setOrigin(0.5).setScrollFactor(0);

        //Respuesta (1a)
        this.botonReproducir = this.add.text( 420, height / 3.5 + 40, "Perdone...¿usted vió algo sobre el accidente?", {
            fontSize: '18px',
            fill: '#ffffff',
            fontFamily: 'Arial'
        }).setOrigin(0.5).setInteractive().setScrollFactor(0);
        //Respuest (2a)
        this.botonQuedarse = this.add.text( 420, height / 3.5 + 5, "¿Sabe si puedo conseguir los videos de vigilancia de aquí?", {
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
               const textoNota = this.add.text(width / 2, height / 3.5 - 40, "¿A esa hora? estuve ocupado",{
                fontSize: '24px',
                fill: '#ffffff',
                fontFamily: 'Arial',
                align: 'center',
            }).setOrigin(0.5).setScrollFactor(0);
            //(1b)
            this.botonReproducir = this.add.text(width / 2 - 200, height / 3.5 + 20, "¿Ocupado?...¿No estaba solo?", {
                fontSize: '18px',
                fill: '#ffffff',
                fontFamily: 'Arial'
            }).setOrigin(0.5).setInteractive().setScrollFactor(0);
            //(2b)
            this.botonQuedarse = this.add.text(width / 2 + 170, height / 3.5 + 20, "Pero por aqui pasó un camión ¿cierto?", {
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
                const textoNota = this.add.text(width / 2, height / 3.5 - 40, "Le llenaba el gas a una pareja", {
                    fontSize: '24px',
                    fill: '#ffffff',
                    fontFamily: 'Arial',
                    align: 'center'
                }).setOrigin(0.5).setScrollFactor(0);
                //Respuesta (1c)
                this.botonReproducir = this.add.text(width / 2 - 170, height / 3.5 + 20, "¿Una pareja a esa hora?", {
                    fontSize: '18px',
                    fill: '#ffffff',
                    fontFamily: 'Arial'
                }).setOrigin(0.5).setInteractive().setScrollFactor(0);
                //(2c)
                this.botonQuedarse = this.add.text(width / 2 + 120, height / 3.5 + 20, "¿Iban o regresaban?", {
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
                    const textoNota = this.add.text(width / 2, height / 3.5 - 40, "Si, iban tarde a algo...", {
                        fontSize: '24px',
                        fill: '#ffffff',
                        fontFamily: 'Arial',
                        align: 'center'
                    }).setOrigin(0.5).setScrollFactor(0);
                    //Respuesta(1d)
                    this.botonReproducir = this.add.text(width / 2 - 100, height / 3.5 + 20, "Con que tarde...", {
                        fontSize: '18px',
                        fill: '#ffffff',
                        fontFamily: 'Arial'
                    }).setOrigin(0.5).setInteractive().setScrollFactor(0);
                    //(2d)
                    this.botonQuedarse = this.add.text(width / 2 + 100, height / 3.5 + 20, "Pregutaré a los vecinos", {
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
                    const textoNota = this.add.text(width / 2, height / 3.5 - 40, "Salian de aquí, llenaron el tanque...", {
                        fontSize: '24px',
                        fill: '#ffffff',
                        fontFamily: 'Arial',
                        align: 'center'
                    }).setOrigin(0.5).setScrollFactor(0);
                    //Respuesta(1d)
                    this.botonReproducir = this.add.text(width / 2 - 100, height / 3.5 + 20, "Hmm...", {
                        fontSize: '18px',
                        fill: '#ffffff',
                        fontFamily: 'Arial'
                    }).setOrigin(0.5).setInteractive().setScrollFactor(0);
                    //(2d)
                    this.botonQuedarse = this.add.text(width / 2 + 100, height / 3.5 + 20, "Creo me equivoque", {
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
                const textoNota = this.add.text(width / 2, height / 3.5 - 40, "Si, un camion ETN", {
                    fontSize: '24px',
                    fill: '#ffffff',
                    fontFamily: 'Arial',
                    align: 'center'
                }).setOrigin(0.5).setScrollFactor(0);
                //Respuesta (1c)
                this.botonReproducir = this.add.text(width / 2 - 80, height / 3.5 + 20, "¿De viajes cierto?", {
                    fontSize: '18px',
                    fill: '#ffffff',
                    fontFamily: 'Arial'
                }).setOrigin(0.5).setInteractive().setScrollFactor(0);
                //(2c)
                this.botonQuedarse = this.add.text(width / 2 + 80, height / 3.5 + 20, "¿Fue a esa hora?", {
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
                    const textoNota = this.add.text(width / 2, height / 3.5 - 40, "Si, si...el conductor estaba preocupado", {
                        fontSize: '24px',
                        fill: '#ffffff',
                        fontFamily: 'Arial',
                        align: 'center'
                    }).setOrigin(0.5).setScrollFactor(0);
                            
                    //Respuesta(1d)
                    this.botonReproducir = this.add.text(width / 2 - 80, height / 3.5 + 20, "¿El conductor?...", {
                        fontSize: '18px',
                        fill: '#ffffff',
                        fontFamily: 'Arial'
                    }).setOrigin(0.5).setInteractive().setScrollFactor(0);
                            
                    //(2d)
                    this.botonQuedarse = this.add.text(width / 2 + 80, height / 3.5 + 20, "Me lleva...", {
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
                    const textoNota = this.add.text(width / 2, height / 3.5 - 40, "Fue unos minutos antes", {
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
                    this.botonQuedarse = this.add.text(width / 2 + 80, height / 3.5 + 20, "Recorcholis...", {
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
               const textoNota = this.add.text(width / 2, height / 3.5 - 40, "Tendrias que verlo con el supervisor...",{
                fontSize: '24px',
                fill: '#ffffff',
                fontFamily: 'Arial',
                align: 'center',
            }).setOrigin(0.5).setScrollFactor(0);
            //(1b)
            this.botonReproducir = this.add.text(width / 2 - 200, height / 3.5 + 20, "¿Sabe donde encontrarlo?", {
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
                const textoNota = this.add.text(width / 2, height / 3.5 - 40, "Creo que mañana estará", {
                    fontSize: '24px',
                    fill: '#ffffff',
                    fontFamily: 'Arial',
                    align: 'center'
                }).setOrigin(0.5).setScrollFactor(0);
                //Respuesta (1c)
                this.botonReproducir = this.add.text(width / 2 - 170, height / 3.5 + 20, "¿Y cree que me ayudará?", {
                    fontSize: '18px',
                    fill: '#ffffff',
                    fontFamily: 'Arial'
                }).setOrigin(0.5).setInteractive().setScrollFactor(0);
                //(2c)
                this.botonQuedarse = this.add.text(width / 2 + 120, height / 3.5 + 20, "¿Solo con el?", {
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
                    const textoNota = this.add.text(width / 2, height / 3.5 - 40, "Deberia...No hace nada el flojo", {
                        fontSize: '24px',
                        fill: '#ffffff',
                        fontFamily: 'Arial',
                        align: 'center'
                    }).setOrigin(0.5).setScrollFactor(0);
                    //Respuesta(1d)
                    this.botonReproducir = this.add.text(width / 2 - 80, height / 3.5 + 20, "JAJAJA, gracias...", {
                        fontSize: '18px',
                        fill: '#ffffff',
                        fontFamily: 'Arial'
                    }).setOrigin(0.5).setInteractive().setScrollFactor(0);
                    //(2d)
                    this.botonQuedarse = this.add.text(width / 2 + 80, height / 3.5 + 20, "Okey, nos vemos...", {
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
                    const textoNota = this.add.text(width / 2, height / 3.5 - 40, "O tambien puedes preguntarle a la chica en caja...", {
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

        const sobrellamada = this.yoshi.x > 640 && this.yoshi.x < 700;
        if (sobrellamada && Phaser.Input.Keyboard.JustDown(this.keys.abajo) && !this.mostrandoLlamada && !this.durmiendo && !this.cocinando) {
            this.mostrandoLlamada = true;
            this.LlamadaContainer.setVisible(true);
            return; // para evitaer que se activen otras interacciones
        }
  
        const sobreCama = Phaser.Geom.Intersects.RectangleToRectangle(this.yoshi.getBounds(), this.cama.getBounds());  
        if (sobreCama && Phaser.Input.Keyboard.JustDown(this.keys.abajo) && !this.durmiendo) {  
            this.dormir();  
        }

        const sobreComedor = Phaser.Geom.Intersects.RectangleToRectangle(this.yoshi.getBounds(), this.comedor.getBounds());  
        if (sobreComedor && Phaser.Input.Keyboard.JustDown(this.keys.abajo) && !this.comiendo) {  
            this.comer();  
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
  
        if (this.musica && this.musica.isPlaying) this.musica.stop();  
  
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
                this.scene.start("Gasolinera2");
                this.musica.pause();  
            }  
        });
    }
  
    
}

export default Gasolinera;