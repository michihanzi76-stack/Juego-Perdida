
import Ajustes from "./scenes/ajustes.js"; // Recordar ajustes B)
import Bootloader from "./scenes/Bootloader.js";
import Casa1 from "./scenes/Casa1.js";
import Casa_cocina from "./scenes/Casa_cocina.js";
import Casa_comedor from "./scenes/Casa_comedor.js";
import Casa_cuartos from "./scenes/Casa_cuartos.js";
import Casa_escalera from "./scenes/Casa_escalera.js";
import Casa_mama from "./scenes/Casa_mama.js";
import Casa_piso from "./scenes/Casa_piso.js";
import Gasolinera from "./scenes/Gasolinera.js";
import Gasolinera2 from "./scenes/Gasolinera2.js";
import Mapa from "./scenes/Mapa.js";
import Pistas from "./scenes/Pistas.js";
import Policia from "./scenes/Policia.js";
import Policia2 from "./scenes/Policia2.js";
import Policia_into from "./scenes/Policia_into.js";
import Policia_intoD from "./scenes/Policia_intoD.js";
import Policia_intoZ from "./scenes/Policia_intoZ.js";
import Trabajo from "./scenes/Trabajo.js";
import Trabajo2 from "./scenes/Trabajo2.js";
import Trabajo_piso from "./scenes/Trabajo_piso.js";
import Trabajo_piso2 from "./scenes/Trabajo_piso2.js";
import Vecino from "./scenes/Vecino.js";
import Vecino1 from "./scenes/Vecino1.js";
import Vecino2 from "./scenes/Vecino2.js";
import Vecino3 from "./scenes/Vecino3.js";
import Vparada from "./scenes/Vparada.js";

const config = {
    title: "Curso Phaser",
    url: "http://google.es",
    version: "0.0.1",
    type: Phaser.AUTO,

    width: 1000,
    height: 600,
    parent: "contenedor",
    
    physics: { 
        default: 'arcade', 
        arcade: { 
            gravity: { y: 800 }, 
            debug: true 
        } 
    },  

    pixelArt: true,
    backgroundColor: "#000000",

    banner: {
        hidePhaser: true,
        text: "#fff00f",
        background: ["#16a085", "#2ecc71", "#e74c3c", "#000000"]
    },

    // recordar incluir ajustes porque es la nueva escena que metí
    scene: [ Bootloader, Mapa, Casa1, Policia, Trabajo, Casa_cocina, Casa_comedor, Casa_cuartos, Casa_escalera, Casa_mama, Casa_piso, Policia2, Policia_into, Policia_intoD, Policia_intoZ, Trabajo_piso, Trabajo_piso2, Trabajo2, Gasolinera, Gasolinera2, Vparada, Vecino, Vecino1, Vecino2, Vecino3, Pistas, Ajustes]
};

// resto del código (dialogos, mostrarDialogoWeb, etc.)
const game = new Phaser.Game(config);