let canvas = document.getElementById("canvas");
let autoPrinc = document.getElementById("autoJugador");
let fondoX = 0;
let puntuacion = 0;
let tiempo = 0;
let continuar = true;
let puntosMayor = 0;
autoPrinc.style.position = "absolute";
autoPrinc.style.width = "70px";
autoPrinc.style.height = "auto";

let enemigos = [];
let velEnemigos = 3;
let generarCada;

teclado.iniciar();

function moverFondo() {
  fondoX -= 16;
  canvas.style.backgroundPositionX = fondoX + "px";
}

class Enemigo {
  constructor(imagen, x, y, velocidad) {
    this.imagen = imagen;
    this.x = x;
    this.y = y;
    this.velocidad = velocidad;
    this.elemento = document.createElement("img");
    this.elemento.src = imagen;
    this.elemento.style.position = "absolute";
    this.elemento.style.left = this.x + "px";
    this.elemento.style.bottom = this.y + "px";
    document.getElementById("canvas").appendChild(this.elemento);
    this.elemento.style.width = "85px";
    this.elemento.style.height = "auto";
  }

  mover() {
    this.x += this.velocidad;
    this.elemento.style.left = this.x + "px";

    if (this.x > canvas.clientWidth || this.x < -this.elemento.width) {
      this.eliminar();
    }
  }

  eliminar() {
    this.elemento.remove();
    enemigos = enemigos.filter((e) => e !== this);
  }
}

function generarEnemigos() {
  if (continuar) {
    let limSup = 630;
    let carrilInferiorY = getRandomNumber(365, limSup);
    let carrilSuperiorY = getRandomNumber(5, 315);
    enemigos.push(
      new Enemigo(
        "img/CarRight.png",
        0,
        carrilSuperiorY,
        velEnemigos - 0.001 * tiempo
      )
    );

    enemigos.push(
      new Enemigo(
        "img/CarLeft.png",
        canvas.clientWidth,
        carrilInferiorY,
        -velEnemigos
      )
    );
    let carrilInferiorYotro = getRandomNumber(375, limSup);
    if (
      carrilInferiorYotro >= carrilInferiorY - 20 &&
      carrilInferiorYotro <= carrilInferiorY + 20
    ) {
      carrilInferiorYotro += 20;
    }
    enemigos.push(
      new Enemigo(
        "img/CarLeft.png",
        canvas.clientWidth,
        carrilInferiorYotro,
        -velEnemigos
      )
    );
  }
}

function getRandomNumber(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function moverAutoJugador() {
  const alturaAuto = autoPrinc.offsetHeight;
  const posicionActualY = parseInt(autoPrinc.style.bottom) || 0;

  if (teclado.teclaPulsada("ArrowLeft") || teclado.teclaPulsada("a")) {
    let nuevaPosicionX = Math.max(0, parseInt(autoPrinc.style.left) - 10);
    autoPrinc.style.left = nuevaPosicionX + "px";
  }
  if (teclado.teclaPulsada("ArrowRight") || teclado.teclaPulsada("d")) {
    let nuevaPosicionX = Math.min(
      canvas.clientWidth - autoPrinc.offsetWidth,
      parseInt(autoPrinc.style.left) + 10
    );
    autoPrinc.style.left = nuevaPosicionX + "px";
  }
  if (teclado.teclaPulsada("ArrowUp") || teclado.teclaPulsada("w")) {
    let nuevaPosicionY = Math.min(
      canvas.clientHeight - alturaAuto,
      posicionActualY + 10
    );
    autoPrinc.style.bottom = nuevaPosicionY + "px";
  }
  if (teclado.teclaPulsada("ArrowDown") || teclado.teclaPulsada("s")) {
    let nuevaPosicionY = Math.max(0, posicionActualY - 10);
    autoPrinc.style.bottom = nuevaPosicionY + "px";
  }
}

function moverEnemigos() {
  enemigos.forEach((enemigo) => {
    enemigo.mover();
  });
}

let interv = 1000;
function loop() {
  if (!continuar) return;
  console.log(velEnemigos);
  moverFondo();
  moverAutoJugador();
  moverEnemigos();
  actualizarPuntuacion();
  enemigos.forEach((enemigo) => {
    if (colision(autoPrinc, enemigo)) {
      continuar = false;
      clearInterval(generarCada);
      autoPrinc.style.left = "50px";
      autoPrinc.style.bottom = "400px";
      generarCada = setInterval(generarEnemigos, 1000);
      mostrarModal();
    }
  });

  tiempo += 1;
  if (velEnemigos < 50) {
    velEnemigos = 3 + 0.015 * tiempo;
  }
  console.log(velEnemigos + " " + tiempo);
  if (velEnemigos >= 10 && velEnemigos < 11) {
    clearInterval(generarCada);
    generarCada = setInterval(generarEnemigos, 550);
  }
  if (velEnemigos >= 20 && velEnemigos <= 21) {
    clearInterval(generarCada);
    generarCada = setInterval(generarEnemigos, 440);
  }
  if (velEnemigos >= 30 && velEnemigos <= 31) {
    clearInterval(generarCada);
    generarCada = setInterval(generarEnemigos, 250);
  }
  if (velEnemigos >= 40 && velEnemigos <= 41) {
    clearInterval(generarCada);
    generarCada = setInterval(generarEnemigos, 100);
  }
  /*
     clearInterval(intervaloGeneracion);
    intervaloGeneracion = setInterval(generarEnemigos, interv);
*/
  requestAnimationFrame(loop);
}

function actualizarPuntuacion() {
  if (continuar) {
    puntuacion += 1;
    document.getElementById("puntuacion").innerText =
      "Puntuación: " + puntuacion;
  }
}

function actualizarMaximo() {
  if (puntuacion > puntosMayor) {
    puntosMayor = puntuacion;
    localStorage.setItem("puntosMayor", puntosMayor); // Guarda en localStorage
  }
  document.getElementById("maximo").innerText =
    "Maximo puntaje: " + puntosMayor;
}
window.onload = function () {
  const guardado = localStorage.getItem("puntosMayor");
  if (guardado !== null) {
    puntosMayor = parseInt(guardado);
  }
  document.getElementById("maximo").innerText =
    "Maximo puntaje: " + puntosMayor;
};

function eliminarTodosEnemigos() {
  enemigos.forEach((enemigo) => {
    if (enemigo.elemento && enemigo.elemento.parentNode) {
      enemigo.elemento.parentNode.removeChild(enemigo.elemento);
    }
  });
  enemigos = [];
}

function colision(a, b) {
  const peque = 10;
  const rectJugador = {
    x: parseInt(autoPrinc.style.left) + peque,
    y: parseInt(autoPrinc.style.bottom) + peque,
    width: autoPrinc.offsetWidth - 2 * peque,
    height: autoPrinc.offsetHeight - 2 * peque,
  };

  const rectEnemigo = {
    x: b.x + peque,
    y: b.y + peque,
    width: b.elemento.offsetWidth - 2 * peque,
    height: b.elemento.offsetHeight - 2 * peque,
  };

  return (
    rectJugador.x < rectEnemigo.x + rectEnemigo.width &&
    rectJugador.x + rectJugador.width > rectEnemigo.x &&
    rectJugador.y < rectEnemigo.y + rectEnemigo.height &&
    rectJugador.y + rectJugador.height > rectEnemigo.y
  );
}

function mostrarModal() {
  const modal = document.getElementById("modal");
  modal.style.display = "flex";
}

document.getElementById("reintentarBtn").addEventListener("click", function () {
  eliminarTodosEnemigos();
  actualizarMaximo();
  puntuacion = 0;
  tiempo = 0;
  velEnemigos = 3;
  /*autoPrinc.style.left = "50px";
  autoPrinc.style.bottom = "400px";*/
  continuar = true;
  document.getElementById("modal").style.display = "none";
  loop();
});

autoPrinc.style.left = "50px";
autoPrinc.style.bottom = "400px";
generarCada = setInterval(generarEnemigos, 1500);
loop();
