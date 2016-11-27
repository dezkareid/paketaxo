/**
 * Productos.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */

module.exports = {

  attributes: {
  	nombre : 'string',
  	precio : 'float',
  	peso : 'float',
  	largo : 'float',
  	alto : 'float',
  	ancho : 'float',
  	volumen : 'float',
  	stackeable : 'boolean',
  	rotable : 'boolean',
  	multiploVenta : 'integer'
  }
};

