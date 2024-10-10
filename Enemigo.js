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