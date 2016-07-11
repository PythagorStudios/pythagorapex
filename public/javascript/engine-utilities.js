/**
 * Created by finnb on 7/2/16.
 */

var randomInt = function(min, max)
{
    return Math.floor(Math.random() * (max - min + 1)) + min;
};

var loadObj = function(manager, path, callback)
{
    var loader = new THREE.OBJLoader( manager );
    loader.load(path, function ( object ) {

        object.traverse( function ( child ) {

            if ( child instanceof THREE.Mesh ) {

                //child.material.map = texture;

            }

        } );
        callback(object);
    } );
};
