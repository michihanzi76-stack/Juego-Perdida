class Ajustes extends Phaser.Scene {
    constructor() {
        super('Ajustes');
    }

    preload() {
        const base = "assets/";

        this.load.image("Letra(1)", base + "Letra(1).png");
        this.load.image("Letra(2)", base + "Letra(2).png");
        this.load.image("Letra(3)", base + "Letra(3).png");
        this.load.image("Letra(4)", base + "Letra(4).png");
    }

    create() {

        // Fondo oscuro para distinguir la escena
        this.add.rectangle(0, 0, this.game.config.width, this.game.config.height, 0x2c3e50)
            .setOrigin(0);

        // Título
        this.add.text(this.game.config.width / 2, 100, 'CONTROLES', {
            fontSize: '48px',
            fill: '#ecf0f1',
            fontFamily: 'Arial'
        }).setOrigin(0.5);

        
        // SALTAR
        const btnVolumen = this.add.text(380, 250, 'W /  Saltar', {
            fontSize: '24px',
            fill: '#3498db',
            fontFamily: 'Arial'
        }).setOrigin(0.5)
        .setInteractive({ useHandCursor: true })
        .on('pointerdown', () => {
            
        });

        // IZQUIERDA
        const btnControles = this.add.text(380, 320, 'A /  Izquierda', {
            fontSize: '24px',
            fill: '#3498db',
            fontFamily: 'Arial'
        }).setOrigin(0.5)
        .setInteractive({ useHandCursor: true })
        .on('pointerdown', () => {
            
        });

        // DERECHA
        const btnControle = this.add.text(80, 320, 'D /  Derecha', {
            fontSize: '24px',
            fill: '#3498db',
            fontFamily: 'Arial'
        }).setOrigin(0.5)
        .setInteractive({ useHandCursor: true })
        .on('pointerdown', () => {
            
        });

        // ABAJO
        const btnControl = this.add.text(580, 250, 'S /  Interactuar', {
            fontSize: '24px',
            fill: '#3498db',
            fontFamily: 'Arial'
        }).setOrigin(0.5)
        .setInteractive({ useHandCursor: true })
        .on('pointerdown', () => {
            
        });

        // VOLVER
        const btnVolver = this.add.text(this.game.config.width / 2, 550, '← Volver al menú', {
            fontSize: '22px',
            fill: '#e74c3c',
            fontFamily: 'Arial'
        }).setOrigin(0.5)
        .setInteractive({ useHandCursor: true })
        .on('pointerdown', () => {
            // regresamos al Bootloader
            this.scene.start('Bootloader');
        });

        // agregar separadores o efectos visuales (opcional)
        this.add.graphics()
            .lineStyle(2, 0x7f8c8d)
            .strokeRect(200, 200, 600, 200);
    }
}

export default Ajustes;