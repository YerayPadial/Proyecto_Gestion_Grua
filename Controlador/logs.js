var urlLogs = "../Modelo/logs.php"; // URL del archivo PHP que manejará las operaciones de logs
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
var appLogs = new Vue({
    el: "#appLogs", // Elemento HTML donde se montará la aplicación Vue
    data: {
        logs: [], // Array para almacenar los logs
    },
    methods: {
        // Método para listar los logs
        listarLogs: function () {
            axios.post(urlLogs, { opcion: 1 }).then(response => {
                console.log(response.data); // Verificar la respuesta del servidor
                if (Array.isArray(response.data)) {
                    this.logs = response.data;
                    this.inicializarDataTable(); // Inicializar DataTables después de cargar los datos
                } else {
                    console.error("La respuesta del servidor no es un array:", response.data);
                }
            }).catch(error => {
                console.error("Error al listar los logs:", error);
            });
        },
        // Método para eliminar un log
        btnBorrarLog: function (id) {
            Swal.fire({
                title: '¿Está seguro de borrar el log con ID: ' + id + " ?",
                icon: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#d33',
                cancelButtonColor: '#3085d6',
                confirmButtonText: 'Borrar'
            }).then((result) => {
                if (result.value) {
                    this.borrarLog(id);
                    // Mostrar un mensaje de éxito
                    Swal.fire({
                        icon: 'success',
                        title: '¡Eliminado!',
                        text: 'El log ha sido borrado.',
                        showCancelButton: false,
                        showConfirmButton: false,
                    });
                }
            });
        },
        // Procedimiento para eliminar un log
        borrarLog: function (id) {
            axios.post(urlLogs, { opcion: 2, id: id }).then(response => {
                this.listarLogs(); // Recargar la lista de logs después de eliminar
            });
            // Recargar la página después de 1 segundos
            setTimeout(() => {
                window.location.reload();
            }, 1000); // 1 segundos
        },
        // Inicializar DataTables
        inicializarDataTable: function () {
            this.$nextTick(() => {
                $('#logsTable').DataTable().destroy(); // Destruir la instancia existente
                $('#logsTable').DataTable({
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
        this.listarLogs(); // Llama al método para listar los logs cuando se crea la instancia de Vue
    },
    computed: {
        totalLogs() {
            return this.logs.length;
        }
    }
});
