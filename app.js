class App {
  constructor() {
    // Agarrarse a varios elementos en el DOM
    this.$formulario = document.querySelector('#form');
    this.$notaTitulo = document.querySelector('#note-title');
    this.$notaTexto = document.querySelector('#note-text');
    this.$notaBotones = document.querySelector('#form-buttons');
    this.$botonEnviar = document.querySelector('#submit-button');

    // Ejecutar estas funciones al cargar la pagina
    this.losEventListeners();
  }

  // Function que contenera todos los event listeners
  losEventListeners() {
    document.body.addEventListener('click', evento => {
      this.manejarClickFormulario(evento);
    })


    this.$formulario.addEventListener('submit', evento => {
      evento.preventDefault()
    })
  }

  manejarClickFormulario(evento) {
    // Everiguar si el click .contains el $formulario
    const esFormulario = this.$formulario.contains(evento.target)

    if (esFormulario) {
      this.abrirFormulario();
    } else {
      this.cerrarFormulario();
    }
  }

  abrirFormulario() {
    this.$formulario.classList.add('form-open')
    this.$notaTitulo.style.display = 'block'
    this.$notaBotones.style.display = 'block'
  }

  cerrarFormulario() {
    this.$formulario.classList.remove('form-open')
    this.$notaTitulo.style.display = 'none'
    this.$notaBotones.style.display = 'none'
  }







}
new App();