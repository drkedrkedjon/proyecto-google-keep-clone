class App {
  constructor() {
    // Array para guardar las notas
    this.notes = []

    // Agararse a varios elementos en el DOM
    this.$placeholder = document.querySelector('#placeholder')
    this.$form = document.querySelector('#form')
    this.$notes = document.querySelector('#notes')
    this.$noteTitle = document.querySelector('#note-title')
    this.$noteText = document.querySelector('#note-text')
    this.$formButtons = document.querySelector('#form-buttons')

    this.addEventListeners() // Ejecutar la function que activa varios eventListeners
  }

  addEventListeners() {
    // Añadimos a body un evento click
    document.body.addEventListener('click', event => {
      this.handleFormClick(event) // Llamamos segunda function pasandola el evento
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
  }

  handleFormClick(event) {
    const isFormClicked = this.$form.contains(event.target) // Devuelve boolean si el click es encima de form
    // Condicional para abrir o cerrar el formulario completo
    if (isFormClicked) {
      this.openForm()
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

  // Function que añade una nueva nota (objeto)
  addNote(note) {
    // Copiamos el objeto que entra y añadimos el color y el ID dinamico
    const newNote = {
      title: note.title,
      text: note.text,
      color: 'white',
      // Si no hay entrtadas en array que contenga las notas, return ID: 1. Si hay notas, buscamo la ultima entrada en el array y su ID y lo aumentamos por +1. Asi garantizamos que no hay ID repetidos
      id: this.notes.length > 0 ? this.notes[this.notes.length - 1].id + 1 : 1
    }
    // Reasignamos nuestro array, con todas las notas ya existente tilizando spread operator y añadiendo la nueva nota al final
    this.notes = [...this.notes, newNote]
    // Llamar la function para mostrar la nota en el DOM 
    this.displayNotes()
  }

  displayNotes() {
    // Averiguar si hay notas.
    const hasNotes = this.notes.length > 1
    // Mostrar o ocultar placeholder dependiendo de que si hay o no las notas en el array
    this.$placeholder.style.display = hasNotes ? 'none' : 'flex'
    // Insertar en el DOM todas las notas utilizando innerHTML y metodo .map() encima de nuestro array
    this.$notes.innerHTML = this.notes.map(note => `
        <div style="background: ${note.color};" class="note">
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
