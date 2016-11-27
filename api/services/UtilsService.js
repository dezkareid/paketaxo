var Promise = require('bluebird');
var Matrix = require('matrixmath/Matrix');


module.exports = {

	proveedoresByRuta : function (origen, destino) {
		return Rutas.findOne({ origen : origen, destino : destino })
			.then(function (ruta) {
				return Rutaproveedor.find({ ruta : ruta}).populate('proveedor');
			})
			.then(function (rutaproveedores) {
				var proveedores = rutaproveedores.map(function (rutaproveedor) {
					return rutaproveedor.proveedor;
				});
				return Promise.resolve(proveedores);
			});
	},

	productosByName : function (argument) {
		// body...
	},
	//Lista de cajas con su respectivo volumen
	crearLista : function (pedido) {
		var lista = [];
		for (var i = 0; i < pedido.length; i++){
			var cajas = pedido[i].cajas;
			for (var j = 0; j < cajas; j++) {
				lista.push({ nombre: pedido[i].nombre, volumen : pedido[i].volumen });
			}
		}
		return lista;
		
	},
	empaquetar : function (pedido) {

		cajas = UtilsService.crearLista(pedido);
		
		volumenCajas = UtilsService.volumenCajas(cajas);

		contenedores = sails.config.contenedores;

		numContenedores = contenedores.map(function (contenedor) {
			return Math.ceil(volumenCajas / contenedor.volumen)
		});

		articulos = UtilsService.groupByProducto(cajas);


		matrixContenedorProductos = new Matrix(contenedores.length, articulos.length, false).setEmptyData();
		
		var volumenArticulos = articulos.map(function (articulo) {
			return articulo.volumen;
		})

		var matrixArticulos = new Matrix(volumenArticulos.length, 1);

		matrixArticulos.setData(volumenArticulos);

		console.log("matrixArticulos", matrixArticulos.toLogString());
		console.log("matrixContenedorProductos", matrixContenedorProductos.toLogString());

		var newMatrixBest = new Matrix();

		var matrixOperationBest = new Matrix();

		var matrixTransversa;

		var positionBest;

		var costoBest = 100000000;

		var matrixOperation;

		var newMatrix;

		var isTrue = true;

		var indexMenor = -1;
		var menor = -1;
		var isTrue = true;
		var copyMatrixOperation = new Matrix(3,3);
		for (var i = 0; i < numContenedores.length+1; i++) {
			for (var j = 0; j < numContenedores.length+1; j++) {
				for (var k = 0; k < numContenedores.length+1; k++) {
					newMatrix = new Matrix(3,1);
					newMatrix.setData([i,j,k]);

					for (var f1 = 0; f1 < articulos[0].cajas+1; f1++) {
						for (var f2 = 0; f2 < articulos[0].cajas+1; f2++) {
							for (var f3 = 0; f3 < articulos[0].cajas+1; f3++) {
								for (var g1 = 0; g1 < articulos[1].cajas+1; g1++) {
									for (var g2 = 0; g2 < articulos[1].cajas+1; g2++) {
										for (var g3 = 0; g3 < articulos[1].cajas+1; g3++) {
											for (var h1 = 0; h1 < articulos[2].cajas+1; h1++) {
												for (var h2 = 0; h2 < articulos[2].cajas+1; h2++) {
													for (var h3 = 0; h3 < articulos[2].cajas+1; h3++) {
														matrixOperation = new Matrix(3,3);

														matrixOperation.setData([f1,f2,f3,g1,g2,g3,h1,h2,h3]);

														copyMatrixOperation.setData([f1,f2,f3,g1,g2,g3,h1,h2,h3]);

														matrixTransversa = new Matrix();

														matrixTransversa.copy(matrixOperation);
														
														matrixOperation.multiply(matrixArticulos);

														matrixTransversa.transpose();

														matrixTransversa.multiply(newMatrix);

														for (var i2 = 0; i2 < contenedores.length; i2++) {

															matrixOperationArray = matrixOperation.toArray();
															matrixTransversaArray = matrixTransversa.toArray();
															
															if (contenedores[i2].volumen >= matrixOperationArray[i2] && articulos[i2].cajas >= matrixTransversaArray[i2]  ){
																var costos = [[10,3, 5], [200,100, 50], [1000,500, 2500]]
																newMatrixArray = newMatrix.toArray();
																var costosProveedores = [];
																for (var i3 = 0; i3 < costos.length; i3++) {
																	costosProveedores.push(0);
																	for (var i4 = 0; i4 < costos[i3].length; i4++) {
																		costosProveedores[i3] += (costos[i3][i4] + 80) * newMatrixArray[i4]	
																	}	
																}
																
																for (var i5 = 0; i5 < costosProveedores.length; i5++) {
																	if (indexMenor === -1 && !isTrue){
																		menor = costosProveedores[i5];
																		indexMenor = i5;
																	} else{
																		if (menor > costosProveedores[i5]) {
																			menor = costosProveedores[i5];
																			indexMenor = i5;
																			
																		}
																	}
																}

																
																	if (menor < costoBest && menor > -1 && !isTrue) {
																		matrixOperationBest.copy(copyMatrixOperation);
																		costoBest = costosProveedores[indexMenor];
																		positionBest = indexMenor;
																		newMatrixBest.copy(newMatrix);
																		
																	}
																
																	
															} else{
																break;
															}
														}

													}
												}
											}
										}
									}
								}
							}
						}
					}

					isTrue = false;

				}
			}
		}

		console.log("newMatrixBest", newMatrixBest.toLogString());
		console.log("matrixOperationBest", matrixOperationBest.toLogString());
		console.log(costoBest, positionBest);
		
	},

	getMatriz : function (contenedores, productos) {
		var matriz = [[]]
		matriz = contenedores.map(function (contenedor) {
			return productos.map(function (producto) {
				return 0;
			})
		})
		return matriz;
	}, 
	//Lista de producto agrupados y el numero  de cajas que son y el volumen que ocupan en total
	groupByProducto : function (listaCajas) {
		return sails.config.pedido;
	},

	productoEmpaques : function (producto) {
		
	},

	volumenCajas : function (cajas) {
		volumenCajas = 0;

		for (var i = 0; i < cajas.length ; i++) {
			volumenCajas += cajas[i].volumen; 
		}

		return volumenCajas
	}
}