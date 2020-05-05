///////////////////////////////////////////////////////////////
// OTRA FORMA CON MÁS VALIDACIONE
///////////////////////////////////////////////////////////////

var express = require('express');
var fileUpload = require('express-fileupload');
var fileSystem = require('fs');

// Middlewares
var authenticationMiddleware = require('../middlewares/autenticacion');

// Schemas
var usuarioSchema = require('../models/usuario');
var productoSchema = require('../models/producto');
var itemSchema = require('../models/item');

var app = express();
app.use(fileUpload());

/**
 * Upload the received image applying the respective validation to the schema type and the id.
 * Internal actions are applied, checking the types and the allowed extensions.
 * User must be logged in.
 * @param  {type/:type_id'} '/
 * @param  {} authenticationMiddleware.verificaToken
 * @param  {} (request
 * @param  {} response
 * @param  {} next
 */
app.put('/:type/:type_id', authenticationMiddleware.verificaToken, (request, response, next) => {
    var resourceType = request.params.type;
    var resourceId = request.params.type_id;

    var availableTypes = ['usuarios', 'items', 'productos'];

    if (availableTypes.indexOf(resourceType) < 0) {
        return response.status(400).json({
            success: false,
            message: 'Formato de archivo no válido',
            errors: { message: 'Formato de archivo no válido' }
        });
    };

    // Only if the resource exits we will continue uploading the image
    findResource(resourceType, resourceId)
        .then(schemaResponse => {

            // Data property has the schema object. It could be items, productos or users
            if (!schemaResponse.data) {
                return response.status(400).json({
                    success: false,
                    message: 'El tipo de recurso no tiene un campo img válido',
                    errors: { message: 'El tipo de recurso no tiene un campo img válido' }
                });
            }

            // Check if the request has files
            if (!request.files) {
                return response.status(400).json({
                    success: false,
                    message: 'Por favor, seleccione un fichero para cargar',
                    errors: { message: 'Por favor, seleccione un fichero para cargar' }
                });
            }

            // Getting the file name and the extension
            var imageFile = request.files.imagen;
            var detachedName = imageFile.name.split('.');
            var fileExtension = detachedName[detachedName.length - 1].trim();

            // Checking the extension
            var allowedExtensions = ['jpg', 'png', 'jpeg'];
            if (allowedExtensions.indexOf(fileExtension) < 0) {
                return response.status(400).json({
                    success: false,
                    message: `Los formatos de archivo permitidos son: ${allowedExtensions.join(', ')}`,
                    errors: { message: `Los formatos de archivo permitidos son: ${allowedExtensions.join(', ')}` }
                });
            }

            // Setting the file information
            var fileName = `${resourceId}-${new Date().getMilliseconds()}.${fileExtension}`;
            var filePath = `uploads/${resourceType}/${fileName}`;

            // Moving the file to its folder
            imageFile.mv(filePath, (error) => {

                if (error) {
                    return response.status(500).json({
                        success: false,
                        message: 'Algo salió mal al mover el archivo a su carpeta',
                        errors: error
                    });
                }

                // Checking previous image
                var oldImage = `uploads/${resourceType}/${schemaResponse.data.img}`;

                if (fileSystem.existsSync(oldImage)) {
                    fileSystem.unlink(oldImage, (error) => {

                        if (error) {
                            return response.status(500).json({
                                success: false,
                                message: 'Algo salió mal al eliminar el archivo anterior',
                                errors: error
                            });
                        }

                    });
                }

                schemaResponse.data.img = fileName;
                var temp=schemaResponse.data;
                schemaResponse.data.save((error, next) => {

                    if (error) {
                        return response.status(500).json({
                            success: false,
                            message: 'Algo salió mal al actualizar el archivo',
                            errors: error
                        });
                    }

                    return response.status(200).json({
                        success: true,
                        message: 'Archivo subido correctamente',
                        schemaResponse:schemaResponse


                    });
                });

            });

        })
        .catch(error => {
            return response.status(400).json({
                success: false,
                message: `La fuente ${resourceType} que desea actualizar no existe con el ID ${resourceId}`,
                errors: { message: error.message }
            });
        });
});

/**
 * Find any resource given the type. It could be medics, items or productos
 * @param  {} resource_type
 * @param  {} resource_id
 */
function findResource(resource_type, resource_id) {
    var resource = {
        data: null,
        message: null
    };

    var schema;

    switch (resource_type.toLowerCase()) {
        case 'usuarios':
            schema = usuarioSchema;
            break;

        case 'items':
            schema = itemSchema;
            break;

        case 'productos':
            schema = productoSchema;
            break;
    }

    return new Promise((resolve, reject) => {
        schema.findById(resource_id, (error, user) => {
            if (error) {
                resource.message = error;
                reject(resource);
            } else {
                resource.message = 'Recurso encontrado';
                resource.data = user;
                resolve(resource);
            }

        });
    });

}

module.exports = app;