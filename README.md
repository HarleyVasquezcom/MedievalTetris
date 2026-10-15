# 👑 Tetris Medieval: Las 1000 Eras del Reino

Un videojuego de rompecabezas clásico estilizado con una atmósfera histórico-fantasiosa medieval. A lo largo de **1,000 niveles dinámicos**, el jugador deberá construir murallas estables mientras sobrevive a mecánicas climatológicas, militares, políticas y mágicas de la época.

---

## 🏰 Estructura de Progresión (Las 5 Eras)

El juego cuenta con una curva de velocidad logarítmica calculada a **60 FPS** distribuida en 5 grandes periodos históricos:

1. **🌾 Era I: La Aldea de Paja (Niveles 1-200) — Muy Fácil:** Caída pausada. Introduce la mecánica del *Impuesto del Rey* que destruye o confisca filas de forma aleatoria.
2. **🪵 Era II: El Feudo de Madera (Niveles 201-400) — Fácil:** Aparición de escombros fijos e inamovibles en la base que simulan carretas destruidas por el invierno.
3. **🧱 Era III: La Fortaleza de Piedra (Niveles 401-600) — Medio:** *Asedio de Catapultas*. Rocas ardientes caen desde el cielo destruyendo la parte superior de la muralla.
4. **⛪ Era IV: La Gran Inquisición (Niveles 601-800) — Difícil:** Alquimia activa. Las piezas transmutan y cambian de forma aleatoriamente durante su descenso.
5. **🌋 Era V: El Inframundo y el Dragón (Niveles 801-1000) — Muy Difícil:** Velocidad instantánea (20G / Master Mode). Las piezas se vuelven invisibles antes de tocar el suelo.

---

## 🛠️ Arquitectura del Software (POO)

El proyecto está diseñado bajo una arquitectura modular desacoplada basada en componentes independientes para garantizar un alto rendimiento:

*   `/src/engine/`: Contiene el núcleo lógico, la matriz del tablero (`board.py`), los tetrominos temáticos y las físicas de colisión avanzada (*Wall Kicks*).
*   `/src/audio/`: Gestiona el mezclador interactivo por capas (*Stems*). Altera los instrumentos (Laúdes, Órganos Gregorianos, Guitarras) y aumenta un 15% el tempo en situaciones de peligro inminente.
*   `/src/ui/`: Subsistema gráfico implementado sobre **Pygame** encargado de renderizar marcos de piedra labrada, gárgolas mecánicas y los menús del pergamino de guardado.

---

## ⚙️ Requisitos de Instalación

Asegúrate de tener instalado Python 3.10 o superior y la librería de desarrollo multimedia Pygame:

```bash
# 1. Clonar el repositorio real de la corona
git clone https://github.com
cd tetris_medieval

# 2. Crear e iniciar el entorno virtual del reino
python -m venv venv
source venv/bin/activate  # En Linux/macOS
# venv\Scripts\activate   # En Windows

# 3. Instalar las dependencias de software
pip install pygame
```

## 🎮 Cómo Jugar

Ejecuta el archivo principal para desplegar las ventanas del juego:
```bash
python main.py
```

*   **Flechas Izquierda / Derecha:** Mover los bloques por la muralla.
*   **Flecha Arriba:** Rotar pieza (Integra algoritmos inteligentes de corrección contra muros).
*   **Flecha Abajo:** Caída suave (Suma +1 de oro por fila).
*   **Espacio:** Caída de Trebuchet (Caída instantánea, suma +2 de oro por fila).
*   **Tecla C:** Guardar pieza en el pergamino de reserva.
