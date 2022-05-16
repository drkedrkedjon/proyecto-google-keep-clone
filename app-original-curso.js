class App {
  constructor() {
    // Array para guardar las notas. Si hay notas en LocalStorage cargarlas y si no asignamos un array vacio
    this.notes = JSON.parse(localStorage.getItem('notes')) || []
    // Variables (llaves de objeto) globales
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
    this.$colorTooltip = document.querySelector('#color-tooltip')

    this.render()
    this.addEventListeners() // Ejecutar la function que activa varios eventListeners
  }

  addEventListeners() {
    // Añadimos a body un evento click
    document.body.addEventListener('click', event => {
      this.handleFormClick(event) // Llamamos segunda function pasandola el evento
      this.selectNote(event) // Selectionar nota adecuada para presentar el contenido de la misma en el modal
      this.openModal(event) // Ver si hemos hecho click encima de una nota y abrirla en el modal
      this.deleteNote(event) // Eliminar la nota

    })
    // Añadimos a body un evento mouseover
    document.body.addEventListener('mouseover', event => {
    // Function que abre tooltip para cambiar color de la nota
      this.openTooltip(event)
    })
    // Function que cierra tooltip para cambiar color de la nota
    document.body.addEventListener('mouseout', event => {
      this.closeTooltip(event);  
   });
   // Function que mantiene abierto tooltip con el raton encima. Usamos declaracion para usar this.style en lugar de $colorTooltip.style con => function
   this.$colorTooltip.addEventListener('mouseover', function() {
    this.style.display = 'flex';  
  })
  // Function que cierra tooltip con el raton fuera
  this.$colorTooltip.addEventListener('mouseout', function() {
     this.style.display = 'none'; 
  });
  // Un evento para cambiar el color del fondo
  this.$colorTooltip.addEventListener('click', event => {
    const color = event.target.dataset.color; 
    if (color) {
      this.editNoteColor(color);  
    }
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

    // Event listener para el boton de cierre de modal
    this.$modalCloseButton.addEventListener('click', event => {
      this.closeModal(event)
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
    // Sirve para que no se sigue ejecutando la funcion en el caso de hacer click sobre los botones de color y borrar en la nota
    if (event.target.matches('.toolbar-delete')) return;
    if (event.target.matches('.toolbar-color')) return;
    // .closest metodo sirve para selectionar el elemento con classe .note mas cercano al evento target (body). Osea, la nota cual hemos pinchado.
    if (event.target.closest('.note')) {
      this.$modal.classList.toggle('open-modal')
      this.$modalTitle.value = this.title
      this.$modalText.value = this.text
    }
  }
  // Function que cierra el modal
  closeModal(event) {
    this.editNote()
    this.$modal.classList.toggle('open-modal')
  }
  // Abrir tooltip de los colores
  openTooltip(event) {
    // Para bloquear el evento mouseover de todo menos icono de colores
    if (!event.target.matches('.toolbar-color')) return;
    // Buscamos el ID de la nota
    this.id = event.target.dataset.id;
    // Obtenemos las coordinadas de la ubucacion de nuestro icono de colores en la referencia del borde de la ventana
    const noteCoords = event.target.getBoundingClientRect();
    // A estas coordenadas hay que añadir lo que hemos scroll el documento pa arriba o pa lado
    const horizontal = noteCoords.left + window.scrollX;
    const vertical = noteCoords.top + window.scrollY + 5; // + 5 para bajar tooltip hacia raton
    //  Utilizamos estas coordenadas para colocar en DOM el tooltip usandotransform translate de CSS
    this.$colorTooltip.style.transform = `translate(${horizontal}px, ${vertical}px)`;
    this.$colorTooltip.style.display = 'flex';
  }
  // Cerrar el toolbar de colores
  closeTooltip(event) {
    if (!event.target.matches('.toolbar-color')) return;
    this.$colorTooltip.style.display = 'none'; 
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
    this.render()
    this.closeForm()
  }
  //  La funcion cual edita la nota
  editNote() {
    // Cojer valor entrado por usuario en campos de texto
    const title = this.$modalTitle.value
    const text = this.$modalText.value
    // Hacer un map por el array que contiene todas las notas y actualizar la nota editada
    this.notes = this.notes.map( note => 
      note.id === Number(this.id) ? { ...note, title, text} : note
    )
    // Mostrar nuevamente las notas en el DOM
    this.render()
  }
  // Cambiar el color de nota
  editNoteColor(color) {
    this.notes = this.notes.map(note =>
      note.id === Number(this.id) ? { ...note, color } : note
    );
    this.render();
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
  // Borrar la nota
  deleteNote(event) {
    event.stopPropagation();
    if (!event.target.matches('.toolbar-delete')) return;
    const id = event.target.dataset.id;
    // Devuele con .filter todas las notas menos la que coincida con .note.id de la nota que quieremos borrar
    this.notes = this.notes.filter(note => note.id !== Number(id));
    this.render();
  }

  render() {
    this.saveNotes()
    this.displayNotes()
  }

  saveNotes() {
    localStorage.setItem('notes', JSON.stringify(this.notes))
  }

  // Para mostrart la nota en el DOM
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
              <img class="toolbar-color" data-id=${note.id} src="keep_48dp.png">
              <img class="toolbar-delete" data-id=${note.id} src="keep_48dp.png">
            </div>
          </div>
        </div>
     `).join(""); // En este casa para quitar coma que aparecio
  }

  // Final de la clase constructora
}
new App()
