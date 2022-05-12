# Pasos para crear esta application

## Abrir y cerrar elemento FORM
- Crear una CLASS para nuestra app
- Agararse a varios elementos en el DOM
- Crear una function para los eventListeners
- Ejecutar la function desde el constructor
- En la function añadir un evento click eventListener a body
- Pasar el evento a otra function que manejara clicks sobre el FORM
- En ella crear variable y devolver boolean si el formulario contain el evento.target
- Usar la variable con boolean en el condicional para ejecutar otras dos functiones que manejan DOM para abrir o cerrar el FORM formulario.
- Añadir evenListener a formulario on submit (dentro de la function de los eventos)
- Dentro del evento usar event.preventDefault() para evitar la recarga de la pagina por defecto
- Recoger contenido escrito por el usuario con .value en unas variables
- Ver si el usuario ha escrito algo. En caso true llamar function que añade una nota nueva pasando un objeto con contenido de la nota como argumento
- Copiamos el objeto que entra y añadimos el color y el ID dinamico
- Si no hay entrtadas en array que contenga las notas, return ID: 1. Si hay notas, buscamo la ultima entrada en el array y su ID y lo aumentamos por +1. Asi garantizamos que no hay ID repetidos
- Reasignamos nuestro array, con todas las notas ya existente tilizando spread operator y añadiendo la nueva nota al final
- Llamar la function para mostrar la nota en el DOM 
- Averiguar si hay notas. Mostrar o ocultar placeholder dependiendo de que si hay o no las notas en el array
