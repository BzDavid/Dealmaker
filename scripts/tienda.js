class Tienda extends objetoEstatico {
    valorTiempo;
    valorCalidad;
    valorDinero;

    constructor(JSONdeTextura, xIncial, yIncial, juegoEnElQueEstoy, valorTiempo, valorCalidad, valorDinero) {
        super(JSONdeTextura, xIncial, yIncial, juegoEnElQueEstoy);
        this.valorTiempo = valorTiempo;
        this.valorCalidad = valorCalidad;
        this.valorDinero = valorDinero;
    }


}