var url = "../Modelo/crud.php"; // URL del archivo PHP que maneja las operaciones CRUD

function escapeAttr(value) {
  return String(value ?? '')
    .replace(/&/g, '&amp;')
    .replace(/"/g, '&quot;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

//Coockies para evitar entrar mediante url
function getCookie(name) {
  let cookieArr = document.cookie.split(";");
  for (let i = 0; i < cookieArr.length; i++) {
    let cookiePair = cookieArr[i].split("=");
    if (name == cookiePair[0].trim()) {
      return decodeURIComponent(cookiePair[1]);
    }
  }
  return null;
}

var currentUser = getCookie('currentUser');
console.log('Usuario actual:', currentUser);

if (!currentUser) {
  // Redirigir al login si no hay usuario actual
  window.location.href = '../index.html';
} else if (currentUser !== 'admin') {
  // Si el usuario no es admin, ocultar las vistas de Usuarios y Logs
  document.querySelector('a[href="adminGrua.php"]').style.display = 'none';
  document.querySelector('a[href="logs.php"]').style.display = 'none';
  document.querySelector('a[href="retiradas.php"]').style.display = 'none';
}

function logout() {
  fetch('../Controlador/logout.php', { method: 'POST' }).finally(() => {
    document.cookie = "currentUser=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    localStorage.removeItem('currentUser');
    window.location.href = '../index.html';
  });
}

//hasta aqui 
// URL del archivo PHP que maneja las operaciones de logs
var urlLogs = "../Modelo/logs.php";
// Función para registrar acciones de los usuarios
function logAction(currentUser, action) {
  if (!currentUser) {
    console.error('Error: No hay usuario actual');
    return;
  }

  axios.post(urlLogs, {
    opcion: 3, // Opción para insertar un nuevo log
    username: currentUser,
    action: action
  }).then(response => {
    console.log('Respuesta completa del servidor:', response);
    if (response.data && response.data.status === 'success') {
      console.log('Log de acción guardado correctamente:', response.data.message);
    } else {
      console.error('Error al guardar el log de acción:', response.data ? response.data.message : 'Respuesta inesperada del servidor');
    }
  }).catch(error => {
    console.error('Error al guardar el log de acción:', error);
    if (error.response) {
      // El servidor respondió con un código de estado fuera del rango 2xx
      console.error('Respuesta del servidor:', error.response.data);
      console.error('Estado HTTP:', error.response.status);
      console.error('Cabeceras:', error.response.headers);
    } else if (error.request) {
      // No se recibió respuesta del servidor
      console.error('No se recibió respuesta del servidor:', error.request);
    } else {
      // Error al configurar la solicitud
      console.error('Error al configurar la solicitud:', error.message);
    }
    console.error('Configuración de la solicitud:', error.config);
  });
}

var appVehiculos = new Vue({
  el: "#appVehiculos", // Elemento HTML donde se monta la instancia de Vue
  data: {
    vehiculos: [], // Array para almacenar los registros de vehículos
    id: "", // Campo para el ID del vehículo
    fechaentrada: "", // Campo para la fecha de entrada del vehículo
    fechasalida: "", // Campo para la fecha de salida del vehículo
    lugar: "", // Campo para el lugar del vehículo
    direccion: "", // Campo para la direccion del vehículo
    agente: "", // Campo para el agente del vehículo
    matricula: "", // Campo para la matrícula del vehículo
    marca: "", // Campo para la marca del vehículo
    modelo: "", // Campo para el modelo del vehículo
    color: "", // Campo para el color del vehículo
    motivo: "", // Campo para el motivo del vehículo
    tipovehiculo: "", // Campo para el tipo de vehículo
    grua: "", // Campo para la grúa del vehículo
    estado: "" // Campo para el estado del vehículo
  },
  methods: {
    // Método para el boton de alta (crear un nuevo registro)
    btnAlta: async function () {
      const currentDate = new Date(new Date().getTime() - new Date().getTimezoneOffset() * 60000).toISOString().slice(0, 16); // Obtener la fecha y hora actual en formato adecuado para el input datetime-local
      const { value: formValues, isDismissed } = await Swal.fire({
        title: 'Nuevo registro',
        html:
          '<div class="row"><label class="col-sm-3 col-form-label">ID</label><div class="col-sm-9"><input id="id" type="text" class="form-control"></div></div>' +
          '<div class="row"><label class="col-sm-3 col-form-label">Fecha Entrada</label><div class="col-sm-9"><input id="fechaentrada" type="datetime-local" class="form-control" value="' + currentDate + '" readonly></div></div>' +
          '<div class="row"><label class="col-sm-3 col-form-label">Lugar</label><div class="col-sm-9"><input id="lugar" type="text" class="form-control"></div></div>' +
          '<div class="row"><label class="col-sm-3 col-form-label">Direccion</label><div class="col-sm-9"><input id="direccion" type="text" class="form-control"></div></div>' +
          '<div class="row"><label class="col-sm-3 col-form-label">Agente</label><div class="col-sm-9"><input id="agente" type="text" class="form-control"></div></div>' +
          '<div class="row"><label class="col-sm-3 col-form-label">Matrícula</label><div class="col-sm-9"><input id="matricula" type="text" class="form-control"></div></div>' +
          '<div class="row"><label class="col-sm-3 col-form-label">Marca</label><div class="col-sm-9"><input id="marca" type="text" class="form-control"></div></div>' +
          '<div class="row"><label class="col-sm-3 col-form-label">Modelo</label><div class="col-sm-9"><input id="modelo" type="text" class="form-control"></div></div>' +
          '<div class="row"><label class="col-sm-3 col-form-label">Color</label><div class="col-sm-9"><input id="color" type="text" class="form-control"></div></div>' +
          '<div class="row"><label class="col-sm-3 col-form-label">Motivo</label><div class="col-sm-9"><input id="motivo" type="text" class="form-control"></div></div>' +
          '<div class="row"><label class="col-sm-3 col-form-label">Tipo Vehículo</label><div class="col-sm-9"><select id="tipovehiculo" class="form-control"><option value="Motocicleta, aperos, motocarros y similares">Motocicleta, aperos, motocarros y similares</option><option value="Turismo hasta 12 cv o Remolques hasta 750 kg">Turismo hasta 12 cv o Remolques hasta 750 kg</option><option value="Turismos más de 12 cv o Remolques más de 750 kg">Turismos más de 12 cv o Remolques más de 750 kg</option><option value="Vehículos especiales">Vehículos especiales</option><option value="Vehículos de cortesía">Vehículos de cortesía</option><option value="Chatarra">Chatarra</option></select></div></div>' +
          '<div class="row"><label class="col-sm-3 col-form-label">Grua</label><div class="col-sm-9"><select id="grua" class="form-control"><option value="Grua H01">Grua H01</option><option value="Grua H02">Grua H02</option><option value="Grua H03">Grua H03</option></select></div></div>' +
          '<div class="row"><label class="col-sm-3 col-form-label">Estado</label><div class="col-sm-9"><select id="estado" class="form-control"><option value="En depósito">En depósito</option><option value="Liquidado">Liquidado</option></select></div></div>',
        focusConfirm: false,
        showCancelButton: true,
        confirmButtonText: 'Guardar',
        confirmButtonColor: '#1cc88a',
        cancelButtonColor: '#3085d6',
        preConfirm: () => {
          return [
            this.id = document.getElementById('id').value,
            this.fechaentrada = document.getElementById('fechaentrada').value,
            this.lugar = document.getElementById('lugar').value,
            this.direccion = document.getElementById('direccion').value,
            this.agente = document.getElementById('agente').value,
            this.matricula = document.getElementById('matricula').value,
            this.marca = document.getElementById('marca').value,
            this.modelo = document.getElementById('modelo').value,
            this.color = document.getElementById('color').value,
            this.motivo = document.getElementById('motivo').value,
            this.tipovehiculo = document.getElementById('tipovehiculo').value,
            this.grua = document.getElementById('grua').value,
            this.estado = document.getElementById('estado').value
          ]
        }
      })
      if (isDismissed) {
        return; // Si se cancela, no hacer nada
      }
      if (this.id == "" || this.fechaentrada == "" || this.lugar == "" || this.direccion == "" || this.agente == "" || this.matricula == "" || this.marca == "" || this.modelo == "" || this.color == "" || this.motivo == "" || this.tipovehiculo == "" || this.grua == "" || this.estado == "") {
        Swal.fire({
          icon: 'info',
          title: 'Datos incompletos',
        })
      }
      else {
        this.altaVehiculo();
        logAction(currentUser, 'Ingresar vehículo'); // Registrar la acción
        const Toast = Swal.mixin({
          toast: true,
          position: 'top-end',
          showConfirmButton: false,
          timer: 3000
        });
        Toast.fire({
          icon: 'success',
          title: '¡Vehículo Agregado!'
        })
      }
    },
    // Método para el boton de editar (actualizar un registro existente)
    btnEditar: async function (id, fechaentrada, fechasalida, lugar, direccion, agente, matricula, marca, modelo, color, motivo, tipovehiculo, grua, estado) {
      id = escapeAttr(id);
      fechaentrada = escapeAttr(fechaentrada);
      fechasalida = escapeAttr(fechasalida);
      lugar = escapeAttr(lugar);
      direccion = escapeAttr(direccion);
      agente = escapeAttr(agente);
      matricula = escapeAttr(matricula);
      marca = escapeAttr(marca);
      modelo = escapeAttr(modelo);
      color = escapeAttr(color);
      motivo = escapeAttr(motivo);
      tipovehiculo = escapeAttr(tipovehiculo);
      grua = escapeAttr(grua);
      estado = escapeAttr(estado);
      const currentDate = new Date().toISOString().slice(0, 16); // Obtener la fecha y hora actual en formato adecuado para el input datetime-local
      await Swal.fire({
        title: 'Registro: ' + id,
        html:
          '<div class="form-group">' +
          '<div class="row"><label class="col-sm-3 col-form-label">ID</label><div class="col-sm-9"><input id="id" value="' + id + '" type="text" class="form-control" readonly></div></div>' +
          '<div class="row"><label class="col-sm-3 col-form-label">Fecha Entrada</label><div class="col-sm-9"><input id="fechaentrada" value="' + fechaentrada + '" type="datetime-local" class="form-control" min="' + currentDate + '"></div></div>' +
          '<div class="row"><label class="col-sm-3 col-form-label">Lugar</label><div class="col-sm-9"><input id="lugar" value="' + lugar + '" type="text" class="form-control"></div></div>' +
          '<div class="row"><label class="col-sm-3 col-form-label">Direccion</label><div class="col-sm-9"><input id="direccion" value="' + direccion + '" type="text" class="form-control"></div></div>' +
          '<div class="row"><label class="col-sm-3 col-form-label">Agente</label><div class="col-sm-9"><input id="agente" value="' + agente + '" type="text" class="form-control"></div></div>' +
          '<div class="row"><label class="col-sm-3 col-form-label">Matrícula</label><div class="col-sm-9"><input id="matricula" value="' + matricula + '" type="text" class="form-control"></div></div>' +
          '<div class="row"><label class="col-sm-3 col-form-label">Marca</label><div class="col-sm-9"><input id="marca" value="' + marca + '" type="text" class="form-control"></div></div>' +
          '<div class="row"><label class="col-sm-3 col-form-label">Modelo</label><div class="col-sm-9"><input id="modelo" value="' + modelo + '" type="text" class="form-control"></div></div>' +
          '<div class="row"><label class="col-sm-3 col-form-label">Color</label><div class="col-sm-9"><input id="color" value="' + color + '" type="text" class="form-control"></div></div>' +
          '<div class="row"><label class="col-sm-3 col-form-label">Motivo</label><div class="col-sm-9"><input id="motivo" value="' + motivo + '" type="text" class="form-control"></div></div>' +
          '<div class="row"><label class="col-sm-3 col-form-label">Tipo Vehículo</label><div class="col-sm-9"><select id="tipovehiculo" class="form-control">' +
          '<option value="Motocicleta, aperos, motocarros y similares"' + (tipovehiculo === 'Motocicleta, aperos, motocarros y similares' ? ' selected' : '') + '>Motocicleta, aperos, motocarros y similares</option>' +
          '<option value="Turismo hasta 12 cv o Remolques hasta 750 kg"' + (tipovehiculo === 'Turismo hasta 12 cv o Remolques hasta 750 kg' ? ' selected' : '') + '>Turismo hasta 12 cv o Remolques hasta 750 kg</option>' +
          '<option value="Turismos más de 12 cv o Remolques más de 750 kg"' + (tipovehiculo === 'Turismos más de 12 cv o Remolques más de 750 kg' ? ' selected' : '') + '>Turismos más de 12 cv o Remolques más de 750 kg</option>' +
          '<option value="Vehículos especiales"' + (tipovehiculo === 'Vehículos especiales' ? ' selected' : '') + '>Vehículos especiales</option>' +
          '<option value="Vehículos de cortesía"' + (tipovehiculo === 'Vehículos de cortesía' ? ' selected' : '') + '>Vehículos de cortesía</option>' +
          '<option value="Chatarra"' + (tipovehiculo === 'Chatarra' ? ' selected' : '') + '>Chatarra</option>' +
          '</select></div></div>' +
          '<div class="row"><label class="col-sm-3 col-form-label">Grua</label><div class="col-sm-9"><select id="grua" class="form-control">' +
          '<option value="Grua H01"' + (grua === 'Grua H01' ? ' selected' : '') + '>Grua H01</option>' +
          '<option value="Grua H02"' + (grua === 'Grua H02' ? ' selected' : '') + '>Grua H02</option>' +
          '<option value="Grua H03"' + (grua === 'Grua H03' ? ' selected' : '') + '>Grua H03</option>' +
          '</select></div></div>' +
          '<div class="row"><label class="col-sm-3 col-form-label">Estado</label><div class="col-sm-9"><select id="estado" class="form-control">' +
          '<option value="En depósito"' + (estado === 'En deposito' || estado === 'En depósito' ? ' selected' : '') + '>En depósito</option>' +
          '<option value="Liquidado"' + (estado === 'Liquidado' ? ' selected' : '') + '>Liquidado</option>' +
          '</select></div></div>' +
          '</div>',
        focusConfirm: false,
        showCancelButton: true,
        confirmButtonText: 'Guardar',
        confirmButtonColor: '#1cc88a',
        cancelButtonColor: '#3085d6',
      }).then((result) => {
        if (result.value) {
          const id = document.getElementById('id').value;
          const fechaentrada = document.getElementById('fechaentrada').value;
          const lugar = document.getElementById('lugar').value;
          const direccion = document.getElementById('direccion').value;
          const agente = document.getElementById('agente').value;
          const matricula = document.getElementById('matricula').value;
          const marca = document.getElementById('marca').value;
          const modelo = document.getElementById('modelo').value;
          const color = document.getElementById('color').value;
          const motivo = document.getElementById('motivo').value;
          const tipovehiculo = document.getElementById('tipovehiculo').value;
          const grua = document.getElementById('grua').value;
          const estado = document.getElementById('estado').value;

          this.editarVehiculo(id, fechaentrada, fechasalida, lugar, direccion, agente, matricula, marca, modelo, color, motivo, tipovehiculo, grua, estado);
          logAction(currentUser, 'Editar vehículo'); // Registrar la acción
          Swal.fire({
            icon: 'success',
            title: '¡Actualizado!',
            text: 'El registro ha sido actualizado.'
          });
        }
      });

    },
    // Método para el boton de borrar (eliminar un registro)
    btnBorrar: function (id) {
      Swal.fire({
        title: '¿Está seguro de borrar el registro: ' + id + " ?",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#d33',
        cancelButtonColor: '#3085d6',
        confirmButtonText: 'Borrar'
      }).then((result) => {
        if (result.value) {
          this.borrarVehiculo(id);
          logAction(currentUser, 'Eliminar vehículo');
          //y mostramos un msj sobre la eliminacion  
          Swal.fire(
            '¡Eliminado!',
            'El registro ha sido borrado.',
            'success'
          )
        }
      })
    },
    // Método para ver los detalles de un vehículo
    btnVer: async function (id, fechaentrada, fechasalida, lugar, direccion, agente, matricula, marca, modelo, color, motivo, tipovehiculo, grua, estado) {
      id = escapeAttr(id);
      fechaentrada = escapeAttr(fechaentrada);
      fechasalida = escapeAttr(fechasalida);
      lugar = escapeAttr(lugar);
      direccion = escapeAttr(direccion);
      agente = escapeAttr(agente);
      matricula = escapeAttr(matricula);
      marca = escapeAttr(marca);
      modelo = escapeAttr(modelo);
      color = escapeAttr(color);
      motivo = escapeAttr(motivo);
      tipovehiculo = escapeAttr(tipovehiculo);
      grua = escapeAttr(grua);
      estado = escapeAttr(estado);
      await Swal.fire({
        title: 'Registro: ' + id,
        html:
          '<div class="row"><label class="col-sm-3 col-form-label">Fecha Entrada</label><div class="col-sm-9"><input id="fechaentrada" value="' + fechaentrada + '" type="datetime-local" class="form-control" readonly></div></div>' +
          '<div class="row"><label class="col-sm-3 col-form-label">Lugar</label><div class="col-sm-9"><input id="lugar" value="' + lugar + '" type="text" class="form-control" readonly></div></div>' +
          '<div class="row"><label class="col-sm-3 col-form-label">Direccion</label><div class="col-sm-9"><input id="direccion" value="' + direccion + '" type="text" class="form-control" readonly></div></div>' +
          '<div class="row"><label class="col-sm-3 col-form-label">Agente</label><div class="col-sm-9"><input id="agente" value="' + agente + '" type="text" class="form-control" readonly></div></div>' +
          '<div class="row"><label class="col-sm-3 col-form-label">Matrícula</label><div class="col-sm-9"><input id="matricula" value="' + matricula + '" type="text" class="form-control" readonly></div></div>' +
          '<div class="row"><label class="col-sm-3 col-form-label">Marca</label><div class="col-sm-9"><input id="marca" value="' + marca + '" type="text" class="form-control" readonly></div></div>' +
          '<div class="row"><label class="col-sm-3 col-form-label">Modelo</label><div class="col-sm-9"><input id="modelo" value="' + modelo + '" type="text" class="form-control" readonly></div></div>' +
          '<div class="row"><label class="col-sm-3 col-form-label">Color</label><div class="col-sm-9"><input id="color" value="' + color + '" type="text" class="form-control" readonly></div></div>' +
          '<div class="row"><label class="col-sm-3 col-form-label">Motivo</label><div class="col-sm-9"><input id="motivo" value="' + motivo + '" type="text" class="form-control" readonly></div></div>' +
          '<div class="row"><label class="col-sm-3 col-form-label">Tipo Vehículo</label><div class="col-sm-9"><select id="tipovehiculo" class="form-control" disabled>' +
          '<option value="Motocicleta, aperos, motocarros y similares"' + (tipovehiculo === 'Motocicleta, aperos, motocarros y similares' ? ' selected' : '') + '>Motocicleta, aperos, motocarros y similares</option>' +
          '<option value="Turismo hasta 12 cv o Remolques hasta 750 kg"' + (tipovehiculo === 'Turismo hasta 12 cv o Remolques hasta 750 kg' ? ' selected' : '') + '>Turismo hasta 12 cv o Remolques hasta 750 kg</option>' +
          '<option value="Turismos más de 12 cv o Remolques más de 750 kg"' + (tipovehiculo === 'Turismos más de 12 cv o Remolques más de 750 kg' ? ' selected' : '') + '>Turismos más de 12 cv o Remolques más de 750 kg</option>' +
          '<option value="Vehículos especiales"' + (tipovehiculo === 'Vehículos especiales' ? ' selected' : '') + '>Vehículos especiales</option>' +
          '<option value="Vehículos de cortesía"' + (tipovehiculo === 'Vehículos de cortesía' ? ' selected' : '') + '>Vehículos de cortesía</option>' +
          '<option value="Chatarra"' + (tipovehiculo === 'Chatarra' ? ' selected' : '') + '>Chatarra</option>' +
          '</select></div></div>' +
          '<div class="row"><label class="col-sm-3 col-form-label">Grua</label><div class="col-sm-9"><select id="grua" class="form-control" disabled>' +
          '<option value="Grua H01"' + (grua === 'Grua H01' ? ' selected' : '') + '>Grua H01</option>' +
          '<option value="Grua H02"' + (grua === 'Grua H02' ? ' selected' : '') + '>Grua H02</option>' +
          '<option value="Grua H03"' + (grua === 'Grua H03' ? ' selected' : '') + '>Grua H03</option>' +
          '</select></div></div>' +
          '<div class="row"><label class="col-sm-3 col-form-label">Estado</label><div class="col-sm-9"><select id="estado" class="form-control" disabled>' +
          '<option value="En depósito"' + (estado === 'En deposito' || estado === 'En depósito' ? ' selected' : '') + '>En depósito</option>' +
          '<option value="Liquidado"' + (estado === 'Liquidado' ? ' selected' : '') + '>Liquidado</option>' +
          '</select></div></div>',
        focusConfirm: false,
        showCancelButton: true,
        cancelButtonText: 'Cerrar',
        cancelButtonColor: '#3085d6',
        // confirmButtonText: 'OK',
        // confirmButtonColor: '#1cc88a'
        showConfirmButton: false
      });
      logAction(currentUser, 'Ver vehículo');
    },
    // Método para retirar un vehículo
    btnRetirar: async function (idvehiculos, matricula, agente, tipovehiculo, fechaentrada) {
      if (!tipovehiculo) {
        console.error('Error: tipoVehiculo es undefined');
        return;
      }
      const currentDateTime = new Date(new Date().getTime() - new Date().getTimezoneOffset() * 60000).toISOString().slice(0, 16); // Obtener la fecha y hora actual en formato adecuado para el input datetime-local
      const importeDeposito = this.calcularImporteDeposito(tipovehiculo); // Calcular el importe del depósito
      const importeRetirada = this.calcularImporteRetirada(fechaentrada, tipovehiculo); // Calcular el importe de retirada
      const totalImportes = importeDeposito + importeRetirada; // Calcular el total
      const { value: formValues, isDismissed } = await Swal.fire({
        title: 'Retirar Vehículo',
        html:
          '<div class="row"><label class="col-sm-3 col-form-label">Nombre</label><div class="col-sm-9"><input id="nombre" type="text" class="form-control"></div></div>' +
          '<div class="row"><label class="col-sm-3 col-form-label">NIF</label><div class="col-sm-9"><input id="nif" type="text" class="form-control"></div></div>' +
          '<div class="row"><label class="col-sm-3 col-form-label">Domicilio</label><div class="col-sm-9"><input id="domicilio" type="text" class="form-control"></div></div>' +
          '<div class="row"><label class="col-sm-3 col-form-label">Población</label><div class="col-sm-9"><input id="poblacion" type="text" class="form-control"></div></div>' +
          '<div class="row"><label class="col-sm-3 col-form-label">Provincia</label><div class="col-sm-9"><input id="provincia" type="text" class="form-control"></div></div>' +
          '<div class="row"><label class="col-sm-3 col-form-label">Permiso</label><div class="col-sm-9"><input id="permiso" type="text" class="form-control"></div></div>' +
          '<div class="row"><label class="col-sm-3 col-form-label">Fecha</label><div class="col-sm-9"><input id="fecha" type="datetime-local" class="form-control" value="' + currentDateTime + '" readonly></div></div>' +
          '<div class="row"><label class="col-sm-3 col-form-label">Retirada €</label><div class="col-sm-9"><input id="importeretirada" type="number" class="form-control" value="' + importeRetirada + '" readonly></div></div>' +
          '<div class="row"><label class="col-sm-3 col-form-label">Depósito €</label><div class="col-sm-9"><input id="importedeposito" type="number" class="form-control" value="' + importeDeposito + '" readonly></div></div>' +
          '<div class="row"><label class="col-sm-3 col-form-label">Total €</label><div class="col-sm-9"><input id="total" type="number" class="form-control" value="' + totalImportes + '" readonly></div></div>' +
          '<div class="row"><label class="col-sm-3 col-form-label">Opciones de Pago</label><div class="col-sm-9"><select id="opcionespago" class="form-control"><option value="Metalico">Metalico</option><option value="Tarjeta">Tarjeta</option><option value="Bizum">Bizum</option></select></div></div>',
        focusConfirm: false,
        showCancelButton: true,
        confirmButtonText: 'Guardar',
        confirmButtonColor: '#1cc88a',
        cancelButtonColor: '#3085d6',
        preConfirm: () => {
          return [
            document.getElementById('nombre').value,
            document.getElementById('nif').value,
            document.getElementById('domicilio').value,
            document.getElementById('poblacion').value,
            document.getElementById('provincia').value,
            document.getElementById('permiso').value,
            document.getElementById('fecha').value,
            document.getElementById('importeretirada').value,
            document.getElementById('importedeposito').value,
            document.getElementById('total').value,
            document.getElementById('opcionespago').value
          ]
        }
      });

      if (isDismissed) {
        return; // Si se cancela, no hacer nada
      }

      const [nombre, nif, domicilio, poblacion, provincia, permiso, fecha, importeretirada, importedeposito, total, opcionespago] = formValues;

      if (!nombre || !nif || !domicilio || !poblacion || !provincia || !permiso || !fecha || !importeretirada || !importedeposito || !total || !opcionespago) {
        Swal.fire({
          icon: 'info',
          title: 'Datos incompletos',
        });
        return;
      }

      axios.post(url, {
        opcion: 5, // Opción para insertar una nueva retirada
        idvehiculos: idvehiculos,
        nombre: nombre,
        nif: nif,
        domicilio: domicilio,
        poblacion: poblacion,
        provincia: provincia,
        permiso: permiso,
        fecha: fecha,
        agente: agente,
        importeretirada: importeretirada,
        importedeposito: importedeposito,
        total: total,
        opcionespago: opcionespago
      }).then(response => {
        const Toastt = Swal.mixin({
          toast: true,
          position: 'top-end',
          showConfirmButton: false,
          timer: 3000
        });
        Toastt.fire({
          icon: 'success',
          title: '¡Vehículo retirado!'
        });
        this.btnImprimir({
          idvehiculos: idvehiculos,
          fecha: fecha,
          nif: nif,
          importeretirada: importeretirada,
          importedeposito: importedeposito,
          total: total,
          opcionespago: opcionespago
        });
        this.listarVehiculos();
        logAction(currentUser, 'Retirada');
      }).catch(error => {
        console.error("Error al retirar el vehículo:", error);
      });
    },
    // Método para generar y descargar la factura en PDF
    btnImprimir: function (retirada) {
      const { jsPDF } = window.jspdf;
      const doc = new jsPDF();

      // Add company name and details
      doc.setFontSize(22);
      doc.text('GruasJuan,S.L.', 10, 20);
      doc.setFontSize(12);
      doc.text('Teléfono: 123-456-7890', 140, 20);
      doc.text('Avd.Santa Marta. Nº8', 140, 25);
      doc.text('Email: gruasJuan@empresa.com', 140, 30);

      // Add title
      doc.setFontSize(18);
      doc.text('Factura Simplificada', 10, 50);

      // Add a line under the title
      doc.setLineWidth(0.5);
      doc.line(10, 55, 200, 55);

      // Add content
      doc.setFontSize(12);
      doc.text(`Factura nº: ${retirada.idvehiculos}`, 10, 75);
      doc.text(`Fecha: ${retirada.fecha}`, 10, 85);
      doc.text(`NIF: ${retirada.nif}`, 10, 95);

      // Add a table for the details
      doc.autoTable({
        startY: 100,
        head: [['Descripción', 'Total']],
        body: [
          ['Retirada', `${retirada.importeretirada} €`],
          ['Depósito', `${retirada.importedeposito} €`],
        ],
        theme: 'grid', // Mantiene solo las líneas de la tabla
        styles: {
          lineWidth: 0.1, // Grosor mínimo de las líneas
          lineColor: [0, 0, 0], // Líneas en negro
          fillColor: false, // Desactiva colores de fondo
          textColor: [0, 0, 0], // Texto en negro
        },
        headStyles: {
          fillColor: false, // Sin fondo en el encabezado
          textColor: [0, 0, 0], // Texto en negro
          lineWidth: 0.1, // Línea delgada
          lineColor: [0, 0, 0], // Líneas en negro
        },
        bodyStyles: {
          fillColor: false, // Sin fondo en el cuerpo
          textColor: [0, 0, 0], // Texto en negro
          lineWidth: 0.1, // Línea delgada
          lineColor: [0, 0, 0], // Líneas en negro
        }
      });

      // Add total
      doc.setFontSize(14);
      doc.text(`Total de la retirada: ${retirada.total} €`, 10, doc.autoTable.previous.finalY + 10);
      doc.setFontSize(12);
      doc.text(`Pago mediante: ${retirada.opcionespago} `, 10, doc.autoTable.previous.finalY + 20);

      // Add a footer
      doc.setFontSize(10);
      doc.text('Todos los derechos reservados a GrusJuan,S.L.', 10, 280);

      // Save the PDF
      doc.save(`Factura_${retirada.idvehiculos}.pdf`);
      logAction(currentUser, 'Factura descargada');
    },

    // Método para calcular el importe del depósito basado en el tipo de vehículo
    calcularImporteDeposito: function (tipovehiculo) {
      console.log('Calculando importe para:', tipovehiculo); // Verifica el valor de tipovehiculo

      switch (tipovehiculo) {
        case 'Motocicleta, aperos, motocarros y similares':
          return 25;
        case 'Turismo hasta 12 cv o Remolques hasta 750 kg':
          return 100;
        case 'Turismos más de 12 cv o Remolques más de 750 kg':
          return 130;
        case 'Vehículos especiales':
          return 150;
        case 'Vehículos de cortesía':
        case 'Chatarra':
          return 0;
        default:
          console.warn('Tipo de vehículo no reconocido:', tipovehiculo); // Advertencia si el tipo no es reconocido
          return 50;
      }
    },
    calcularImporteRetirada: function (fechaentrada, tipovehiculo) {
      const tarifas = {
        'Motocicleta, aperos, motocarros y similares': 8,
        'Turismo hasta 12 cv o Remolques hasta 750 kg': 8,
        'Turismos más de 12 cv o Remolques más de 750 kg': 10,
        'Vehículos especiales': 20,
        'Vehículos de cortesía': 15,
        'Chatarra': 5
      };

      const fechaEntrada = new Date(fechaentrada);
      const fechaActual = new Date();
      const horasTranscurridas = Math.floor((fechaActual - fechaEntrada) / (1000 * 60 * 60));

      let importeRetirada = 0;
      if (horasTranscurridas > 24) {
        const horasCobrables = horasTranscurridas - 24;
        importeRetirada = horasCobrables * tarifas[tipovehiculo];
      }

      return importeRetirada;
    },
    // Procedimientos para el CRUD     
    listarVehiculos: function () {
      axios.post(url, { opcion: 4 }).then(response => {
        console.log(response.data); // Verificar la respuesta del servidor
        if (Array.isArray(response.data)) {
          this.vehiculos = response.data;
          this.inicializarDataTable(); // Inicializar DataTables después de cargar los datos
        } else {
          console.error("La respuesta del servidor no es un array:", response.data);
        }
      }).catch(error => {
        console.error("Error al listar los vehículos:", error);
      });
    },
    // Procedimiento CREAR.
    altaVehiculo: function () {
      axios.post(url, {
        opcion: 1,
        id: this.id,
        fechaentrada: this.fechaentrada,
        fechasalida: this.fechasalida,
        lugar: this.lugar,
        direccion: this.direccion,
        agente: this.agente,
        matricula: this.matricula,
        marca: this.marca,
        modelo: this.modelo,
        color: this.color,
        motivo: this.motivo,
        tipovehiculo: this.tipovehiculo,
        grua: this.grua,
        estado: this.estado
      }).then(response => {
        // Mostrar notificacion de éxito
        const Toast = Swal.mixin({
          toast: true,
          position: 'top-end',
          showConfirmButton: false,
          timer: 1500, // Mostrar el mensaje durante 1 segundos
          timerProgressBar: true // Mostrar una barra de progreso
        });
        Toast.fire({
          icon: 'success',
          title: '¡Vehículo Agregado!'
        });

        // Recargar la página después de 1 segundos
        setTimeout(() => {
          window.location.reload();
        }, 1500); // 1 segundos
      }).catch(error => {
        console.error("Error al agregar el vehículo:", error);
      });

      // Resetear los campos después de la insercion
      this.id = "";
      this.fechaentrada = "";
      this.fechasalida = "";
      this.lugar = "";
      this.direccion = "";
      this.agente = "";
      this.matricula = "";
      this.marca = "";
      this.modelo = "";
      this.color = "";
      this.motivo = "";
      this.tipovehiculo = "";
      this.grua = "";
      this.estado = "";
    },
    // Procedimiento EDITAR.
    editarVehiculo: function (id, fechaentrada, fechasalida, lugar, direccion, agente, matricula, marca, modelo, color, motivo, tipovehiculo, grua, estado) {
      axios.post(url, { opcion: 2, id: id, fechaentrada: fechaentrada, fechasalida: fechasalida, lugar: lugar, direccion: direccion, agente: agente, matricula: matricula, marca: marca, modelo: modelo, color: color, motivo: motivo, tipovehiculo: tipovehiculo, grua: grua, estado: estado }).then(response => {
        this.listarVehiculos();
      });
    },
    // Procedimiento BORRAR.
    borrarVehiculo: function (id) {
      axios.post(url, { opcion: 3, id: id }).then(response => {
        this.listarVehiculos();
      });
    },
    inicializarDataTable: function () {
      this.$nextTick(() => {
        $('#vehiculosTable').DataTable().destroy(); // Destruir la instancia existente
        $('#vehiculosTable').DataTable({
          paging: true,
          searching: true,
          ordering: true,
          info: true,
          responsive: true,
          scrollY: '500px', // Altura fija para el scroll vertical
          scrollCollapse: true, // Colapsar espacio vacío
          autoWidth: false, // Desactivar el ajuste automático del ancho de las columnas
          scrollX: false // Desactivar el scroll horizontal
        });
      });
    }
  },
  created: function () {
    this.listarVehiculos(); // Llama al método para listar los vehículos cuando se crea la instancia de Vue
  },
  computed: {
    totalVehiculos() {
      // Filtrar los vehículos que están en depósito y contar la cantidad
      return this.vehiculos.filter(vehiculo => vehiculo.estado === "En deposito" || vehiculo.estado === "En depósito").length;
    }
  }
});
