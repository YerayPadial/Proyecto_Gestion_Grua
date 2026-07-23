<?php require_once '../Modelo/auth.php'; gruas_require_login(); ?>
<!doctype html>
<html>

<head>
    <link rel="shortcut icon" href="#" />
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no">

    <!-- Bootstrap CSS -->
    <link rel="stylesheet" href="../bootstrap/css/bootstrap.min.css">
    <!-- FontAwesom CSS -->
    <link rel="stylesheet" href="https://use.fontawesome.com/releases/v5.8.1/css/all.css" integrity="sha384-50oBUHEmvpQ+1lW4y57PTFmhCaXp0ML5d60M1M7uH2+nqUivzIebhndOJK28anvf" crossorigin="anonymous">
    <!-- Sweet Alert 2 -->
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/sweetalert2@11.16.1/dist/sweetalert2.min.css">
    <!-- DataTables CSS -->
    <link rel="stylesheet" href="https://cdn.datatables.net/1.11.5/css/jquery.dataTables.min.css">
    <!--CSS custom -->
    <link rel="stylesheet" href="../Styles/main.css">
</head>

<body>
    <!-- Navbar -->
    <nav class="navbar navbar-expand-lg navbar-light bg-light">
        <a class="navbar-brand" href="principal.php">
            <img src="../images/carV.jpg" width="30" height="30" class="d-inline-block align-top" alt="">
            GruasJuan,S.L
        </a>
        <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
            <span class="navbar-toggler-icon"></span>
        </button>
        <div class="collapse navbar-collapse" id="navbarNav">
            <ul class="navbar-nav ml-auto">
                <li class="nav-item">
                    <a class="nav-link" href="retiradas.php">Retiradas</a>
                </li>
                <li class="nav-item">
                    <a class="nav-link" href="adminGrua.php">Usuarios</a>
                </li>
                <li class="nav-item">
                    <a class="nav-link" href="logs.php">Logs</a>
                </li>
                <li class="nav-item">
                    <a class="nav-link" href="#" onclick="logout()">Cerrar Sesión</a>
                </li>
            </ul>
        </div>
    </nav>

    <div id="appVehiculos">
        <div class="container-fluid">
            <div class="row">
                <div class="col">
                    <button @click="btnAlta" class="btn btn-custom" title="Nuevo"><i class="fas fa-plus-circle fa-2x"></i></button>
                </div>
                <div class="col text-right">
                    <h5>Vehículos en deposito: <span class="badge badge-success">{{totalVehiculos}}</span></h5>
                </div>
            </div>
            <div class="row mt-5">
                <div class="col-lg-12">
                    <div class="table-responsive">
                        <table id="vehiculosTable" class="table table-striped">
                            <thead>
                                <tr style="background-color: #000; color: #fff;">
                                    <th>ID</th>
                                    <th>Fecha</th>
                                    <th>Matrícula</th>
                                    <th>Estado</th>
                                    <th>Acciones</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr v-for="(vehiculo, indice) of vehiculos" :key="indice">
                                    <td>{{vehiculo.id}}</td>
                                    <td>{{vehiculo.fechaentrada}}</td>
                                    <td>{{vehiculo.matricula}}</td>
                                    <td :class="{'estado-en-deposito': vehiculo.estado === 'En deposito' || vehiculo.estado === 'En depósito', 'estado-liquidado': vehiculo.estado === 'Liquidado'}">{{vehiculo.estado}}</td>
                                    <td>
                                        <div class="btn-group" role="group">
                                            <button class="btn btn-info mr-3" title="Ver" @click="btnVer(vehiculo.id, vehiculo.fechaentrada, vehiculo.fechasalida, vehiculo.lugar, vehiculo.direccion, vehiculo.agente, vehiculo.matricula, vehiculo.marca, vehiculo.modelo, vehiculo.color, vehiculo.motivo, vehiculo.tipovehiculo, vehiculo.grua, vehiculo.estado)"><i class="fas fa-eye"></i></button>
                                            <button class="btn btn-secondary mr-3" title="Editar" @click="btnEditar(vehiculo.id, vehiculo.fechaentrada, vehiculo.fechasalida, vehiculo.lugar, vehiculo.direccion, vehiculo.agente, vehiculo.matricula, vehiculo.marca, vehiculo.modelo, vehiculo.color, vehiculo.motivo, vehiculo.tipovehiculo, vehiculo.grua, vehiculo.estado)"><i class="fas fa-pencil-alt"></i></button>
                                            <button class="btn btn-danger mr-3" title="Eliminar" @click="btnBorrar(vehiculo.id)"><i class="fas fa-trash-alt"></i></button>
                                            <button v-if="vehiculo.estado === 'En deposito' || vehiculo.estado === 'En depósito'" class="btn btn-warning" title="Retirar" @click="btnRetirar(vehiculo.id, vehiculo.matricula, vehiculo.agente, vehiculo.tipovehiculo, vehiculo.fechaentrada)"><i class="fas fa-sign-out-alt"></i></button>
                                        </div>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    </div>
    <!-- jQuery, Popper.js, Bootstrap JS -->
    <script src="../jquery/jquery-3.3.1.min.js"></script>
    <script src="../popper/popper.min.js"></script>
    <script src="../bootstrap/js/bootstrap.min.js"></script>
    <!--Vue.JS -->
    <script src="https://cdn.jsdelivr.net/npm/vue/dist/vue.js"></script>
    <!--Axios -->
    <script src="https://cdnjs.cloudflare.com/ajax/libs/axios/0.15.2/axios.js"></script>
    <!--Sweet Alert 2 -->
    <script src="https://cdn.jsdelivr.net/npm/sweetalert2@11"></script>
    <!-- DataTables JS -->
    <script src="https://cdn.datatables.net/1.11.5/js/jquery.dataTables.min.js"></script>
    <!--Código custom -->
    <script src="../Controlador/main.js"></script>
    <!-- jsPDF -->
    <script src="https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.3.1/jspdf.umd.min.js"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/jspdf-autotable/3.5.13/jspdf.plugin.autotable.min.js"></script>
</body>

</html>
