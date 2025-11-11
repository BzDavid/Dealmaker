class objetoEstatico extends GameObject {
  constructor(JSONdeTextura, xIncial, yIncial, juegoEnElQueEstoy) {
    super(JSONdeTextura, xIncial, yIncial, juegoEnElQueEstoy);
    this.cambiarAnimacion("imagen");
  }

  render(posicionX, posicionY, posicionZ) {
    this.container.x = posicionX;
    this.container.y = posicionY;
    this.container.zIndex = posicionZ;
    this.spritesAnimados["imagen"].scale.set(1);
  }

  tick() {}
}

