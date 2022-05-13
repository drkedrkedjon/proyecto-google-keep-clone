class App {
  constructor() {
    // Array para guardar las notas y variables para manipular datos
    this.notes = []
    this.title = ''
    this.text = ''
    this.id = ''

    // Agararse a varios elementos en el DOM
    this.$placeholder = document.querySelector('#placeholder')
    this.$form = document.querySelector('#form')
    this.$notes = document.querySelector('#notes')
    this.$noteTitle = document.querySelector('#note-title')
    this.$noteText = document.querySelector('#note-text')
    this.$formButtons = document.querySelector('#form-buttons')
    this.$formCloseButton = document.querySelector('#form-close-button')
    this.$modal = document.querySelector(".modal")
    this.$modalTitle = document.querySelector(".modal-title")
    this.$modalText = document.querySelector(".modal-text")
    this.$modalCloseButton = document.querySelector('.modal-close-button')

    this.addEventListeners() // Ejecutar la function que activa varios eventListeners
  }

  addEventListeners() {
    // Añadimos a body un evento click
    document.body.addEventListener('click', event => {
      this.handleFormClick(event) // Llamamos segunda function pasandola el evento
      this.selectNote(event) // Selectionar nota adecuada para presentar el contenido de la misma en el modal
      this.openModal(event) // Ver si hemos hecho click encima de una nota y abrirla en el modal
    })

    // Añadimos a $form un evento submit
    this.$form.addEventListener('submit', event => {
      event.preventDefault()
      // Recoger el valor escrito por usuario
      const title = this.$noteTitle.value; 
      const text = this.$noteText.value;
      // Ver si el usuario ha escrito algo
      const hasNote = title || text
      // Condicional para poner una nueva nota
      if (hasNote) {
        // Llamamos la function padsandole .value(s) como un objeto
        this.addNote({ title, text })
      }
    })

    // Event.listener para el boton de cierre
    this.$formCloseButton.addEventListener('click', event => {
      // Metodo stopPropagation() sirve para controlar evento en el caso de tener dos o mas eventos uno encima de otro, lo que llamam bubleing en inglez... Es como dejar de propagar el evento del elemento inferior, al elemento superior, y evitar de ejecutar el evento en el elemento superior..
      event.stopPropagation();
      this.closeForm()
    })
  }

  handleFormClick(event) {
    const isFormClicked = this.$form.contains(event.target) // Devuelve boolean si el click es encima de form
    
    const title = this.$noteTitle.value; 
    const text = this.$noteText.value;
    const hasNote = title || text

    if (isFormClicked) {
      this.openForm()
    } else if (hasNote) {
      this.addNote({title, text})
    } else {
      this.closeForm()
    }
  }
  // Function que abre el formulario
  openForm() {
    this.$form.classList.add('form-open')
    this.$noteTitle.style.display = 'block'
    this.$formButtons.style.display = 'block'
  }
  // Function que cierra el formulario
  closeForm() {
    this.$form.classList.remove('form-open')
    this.$noteTitle.style.display = 'none'
    this.$formButtons.style.display = 'none'
    this.$noteText.value = ''
    this.$noteTitle.value = ''
  }
  // Function que abre el modal para edicion de notas
  openModal(event) {
    // .closest metodo sirve para selectionar el elemento con classe .note mas cercano al evento target (body). Osea, la nota cual hemos pinchado.
    if (event.target.closest('.note')) {
      this.$modal.classList.toggle('open-modal')
      this.$modalTitle.value = this.title
      this.$modalText.value = this.text
    }
  }

  // Function que añade una nueva nota (objeto)
  addNote({title, text}) {
    // Copiamos el objeto que entra y añadimos el color y el ID dinamico
    const newNote = {
      title,
      text,
      color: 'white',
      // Si no hay entrtadas en array que contenga las notas, return ID: 1. Si hay notas, buscamo la ultima entrada en el array y su ID y lo aumentamos por +1. Asi garantizamos que no hay ID repetidos
      id: this.notes.length > 0 ? this.notes[this.notes.length - 1].id + 1 : 1
    }
    // Reasignamos nuestro array, con todas las notas ya existente tilizando spread operator y añadiendo la nueva nota al final
    this.notes = [...this.notes, newNote]
    // Llamar la function para mostrar la nota en el DOM 
    this.displayNotes()
    this.closeForm()
  }
  // Function que seleciona la nota para presentar su contenido en el modal
  selectNote(event) {
    const $selectedNote = event.target.closest('.note'); // Seleccionar la nota
    if(!$selectedNote) return // Sirve para no provocar error si no hemos pinchado la nota
    const [$noteTitle, $noteText] = $selectedNote.children // Destructurar primeros dos children (div's)
    // Actualisar las variables globales
    this.title = $noteTitle.innerText
    this.text = $noteText.innerText
    this.id = $selectedNote.dataset.id // Con dataset puedemos leer lo que hay en data-id="${note.id} en la etiqueta HTML de la nota sellecionada.
  }

  displayNotes() {
    // Averiguar si hay notas.
    const hasNotes = this.notes.length > 1
    // Mostrar o ocultar placeholder dependiendo de que si hay o no las notas en el array
    this.$placeholder.style.display = hasNotes ? 'none' : 'flex'
    // Insertar en el DOM todas las notas utilizando innerHTML y metodo .map() encima de nuestro array
    this.$notes.innerHTML = this.notes.map(note => `
        <div style="background: ${note.color};" class="note" data-id="${note.id}">
          <div class="${note.title && 'note-title'}">${note.title}</div>
          <div class="note-text">${note.text}</div>
          <div class="toolbar-container">
            <div class="toolbar">
              <img class="toolbar-color" src="keep_48dp.png">
              <img class="toolbar-delete" src="keep_48dp.png">
            </div>
          </div>
        </div>
     `).join(""); // En este casa para quitar coma que aparecio
  }

  // Final de la clase constructora
}
new App()
