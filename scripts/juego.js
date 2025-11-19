class Juego {
  pixiApp;
  tiendas = {};
  personas = [];
  anchoPantalla = 1280;
  altoPantalla = 720;
  fondo;

  constructor() {
    this.mouse = { posicion: { x: 0, y: 0 } };
    this.inciarPixi();
  }

  //async indica q este metodo es asincrónico, es decir q debe usar "await".
  async inciarPixi() {
    this.pixiApp = new PIXI.Application(); //creamos la aplicacion de pixi y la guardamos en la propiedad pixiApp

    this.renombrarEscenario("El Stage");

    globalThis.__PIXI_APP__ = this.pixiApp; //esto es para que funcione la extension de pixi

    const opcionesDePixi = {
      backgroundColor: "#1099bb",
      width: this.anchoPantalla,
      height: this.altoPantalla,
      antialias: false,
      SCALE_MODE: PIXI.SCALE_MODES.NEAREST,
    };

    //await indica q el codigo se frena hasta que el metodo init de la app de pixi haya terminado, puede tardar 2ms, 400ms.. no lo sabemos :O
    await this.pixiApp.init(opcionesDePixi); //cuando termina se incializa pixi con las opciones definidas anteriormente

    document.body.appendChild(this.pixiApp.canvas); //agregamos el elementos canvas creado por pixi en el documento html

    // const texture = await PIXI.Assets.load("bunny.png"); //cargamos la imagen bunny.png y la guardamos en la variable texture (deprecated, ahora lo tengo como ejemplo nomás)
    this.fondo = await this.crearTexturaDeFondo();
    this.fondo.render(this.anchoPantalla * 0.5, this.altoPantalla, -100);
    this.crear_PersonasCompradoras(100);

    //agregamos el metodo this.gameLoop al ticker.
    //es decir: en cada frame vamos a ejecutar el metodo this.gameLoop
    this.pixiApp.ticker.add(this.gameLoop.bind(this));

    this.ejecutarCodigoDespuesDeIniciarPIXI();
  }

  //Configuraciones de pixi --------
  renombrarEscenario(nuevoNombre) {
    this.pixiApp.stage.name = nuevoNombre;
  }

  async cargarTexturas(stringLocalizacionTextura) {
    const unaTextura = await PIXI.Assets.load(stringLocalizacionTextura);
    return unaTextura;
  }

  crearUnaTienda(JSONdeTextura, xIncial, yIncial, juegoEnElQueEstoy, valorTiempo, valorCalidad, valorDinero) {
    return new Tienda(JSONdeTextura, xIncial, yIncial, juegoEnElQueEstoy, valorTiempo, valorCalidad, valorDinero);
  }

  crearTiendas() {
    this.tiendas["TiendaDelJugador"] = this.crearUnaTienda();
    this.tiendas["TiendaRoja"] = this.crearUnaTienda();
    this.tiendas["TiendaAmarilla"] = this.crearUnaTienda();
    this.tiendas["TiendaVerde"] = this.crearUnaTienda();
  }

  async crearTexturaDeFondo() {
    const textura = await this.cargarTexturas("img/Tiendas/fondo.json");
    const x = 0.5 * this.anchoPantalla;
    const y = 0.5 * this.altoPantalla;
    const juego = this;
    return new objetoEstatico(textura, x, y, juego);
  }

  async crear_PersonasCompradoras(numeroDePersonas) {
    for (let i = 0; i < numeroDePersonas; i++) {
      const nuevaPersona = await this.crearPersonaComprador();
      this.personas.push(nuevaPersona);
      console.log("PersonaComprador creada");
    }
    this.asignarEventosAPersonas();
    console.log("Creadas todas las PersonasCompradoras");
  }

  async crearPersonaComprador() {
    //Crea una instancia de clase que elijamos, el constructor de dicha clase toma como parametros la textura q queremos usar, X, Y y una referencia a la instancia del juego (la que sería this ya que estamos dentro de la clase Juego)
    const importanciaCalidad = randomEntreUnoyDiez();
    const importanciaDinero = randomEntreUnoyDiez();
    const importanciaTiempo = randomEntreUnoyDiez();
    const textura = await this.cargarTexturas(seleccionarColorDelPersonaje(indiceDelElementoMasGrandeDelArray([importanciaCalidad, importanciaDinero, importanciaTiempo])));
    const x = 0.5 * this.anchoPantalla;
    const y = 0.5 * this.altoPantalla;
    const juego = this;
    return new PersonaComprador(textura, x, y, juego, importanciaTiempo, importanciaDinero, importanciaCalidad);;
  }

  ejecutarCodigoDespuesDeIniciarPIXI() {
    this.agregarInteractividadDelMouse();
  }

  //Cierra configuraciones de pixi --------

  asignarEventosAPersonas(){
    this.asignarElMouseComoTargetATodosLasPersonas()
    // this.asignarPerseguidorRandomATodos();
    // this.asignarTargets();
  }

  agregarInteractividadDelMouse() {
    // Escuchar el evento mousemove
    this.pixiApp.canvas.onmousemove = (event) => {
      this.mouse.posicion = { x: event.x, y: event.y };
    };
  }

  gameLoop(time) {
    for (let unaPersona of this.personas) {
      //ejecutamos el metodo tick de persona
      unaPersona.tick();
      unaPersona.render();
    }
    
  }

  getPersonaRandom() {
    return this.personas[Math.floor(this.personas.length * Math.random())];
  }

  asignarTargets() {
    for (let cone of this.personas) {
      cone.asignarTarget(this.getPersonaRandom());
    }
  }

  asignarElMouseComoTargetATodosLasPersonas() {
    for (let personaje of this.personas) {
      personaje.asignarTarget(this.mouse);
    }
  }

  asignarPerseguidorRandomATodos() {
    for (let cone of this.personas) {
      cone.perseguidor = this.getPersonaRandom();
    }
  }
  asignarElMouseComoPerseguidorATodosLasPersonas() {
    for (let cone of this.personas) {
      cone.perseguidor = this.mouse;
    }
  }

  eliminarPersona(indiceDeLaPersona) {
    this.personas.pop(indiceDeLaPersona);
  }
}
